package com.phongdnh.se121.services.file;

import com.phongdnh.se121.constants.MinIOConstant;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ImgproxyService {
  private final String IMGPROXY_BASE_URL;
  private final byte[] IMGPROXY_KEY;
  private final byte[] IMGPROXY_SALT;

  public ImgproxyService(
      @Value("${imgproxy.base-url}") String imgproxyBaseUrl,
      @Value("${imgproxy.key}") String imgproxyKey,
      @Value("${imgproxy.salt}") String imgproxySalt) {
    this.IMGPROXY_BASE_URL = imgproxyBaseUrl;
    this.IMGPROXY_KEY = hexToBytes(imgproxyKey);
    this.IMGPROXY_SALT = hexToBytes(imgproxySalt);
  }

  /**
   * Tạo URL Imgproxy đã ký.
   *
   * @param bucketName Tên bucket trên MinIO
   * @param objectKey Tên file ảnh trên MinIO (ví dụ: "folder/image.jpg")
   * @param processingOptions Các tùy chọn xử lý ảnh (ví dụ: "rs:fill:300:400/g:sm")
   * @return URL hoàn chỉnh để dùng trong thẻ <img>
   */
  public String generateUrl(String objectKey, String options) {
    final boolean hasProcessing = options != null && !options.isBlank();

    // 1. source URL (S3 – ĐÚNG CHUẨN)
    String sourceUrl = "s3://" + MinIOConstant.MINIO_MAIN_BUCKET + "/" + objectKey;

    // 2. base64url encode source
    String encodedSource =
        Base64.getUrlEncoder()
            .withoutPadding()
            .encodeToString(sourceUrl.getBytes(StandardCharsets.UTF_8));

    // 3. build path theo spec mới
    final String path;
    if (hasProcessing) {
      String processing = normalize(options);
      path = "/" + processing + "/" + encodedSource;
    } else {
      String defaultProcessing = "rs:fill:0:0";
      path = "/" + defaultProcessing + "/" + encodedSource;
    }

    // 4. ký HMAC
    String signature = sign(path);

    // 5. full URL
    return IMGPROXY_BASE_URL + "/" + signature + path;
  }

  /** Tạo chữ ký HMAC-SHA256. */
  private String sign(String path) {
    try {
      // Chuỗi cần ký = salt + path
      byte[] pathBytes = path.getBytes(StandardCharsets.UTF_8);
      byte[] dataToSign = new byte[IMGPROXY_SALT.length + pathBytes.length];
      System.arraycopy(IMGPROXY_SALT, 0, dataToSign, 0, IMGPROXY_SALT.length);
      System.arraycopy(pathBytes, 0, dataToSign, IMGPROXY_SALT.length, pathBytes.length);

      Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
      SecretKeySpec secret_key = new SecretKeySpec(IMGPROXY_KEY, "HmacSHA256");
      sha256_HMAC.init(secret_key);

      byte[] signatureBytes = sha256_HMAC.doFinal(dataToSign);

      // Mã hóa chữ ký bằng Base64 URL-safe
      return Base64.getUrlEncoder().withoutPadding().encodeToString(signatureBytes);
    } catch (Exception e) {
      throw new ApiException(ErrorCode.DOWNLOAD_FAILED, "Failed to sign imgproxy URL");
    }
  }

  /** Chuyển chuỗi Hex thành mảng byte. */
  private byte[] hexToBytes(String hex) {
    int len = hex.length();
    byte[] data = new byte[len / 2];
    for (int i = 0; i < len; i += 2) {
      data[i / 2] =
          (byte)
              ((Character.digit(hex.charAt(i), 16) << 4) + Character.digit(hex.charAt(i + 1), 16));
    }
    return data;
  }

  private String normalize(String opts) {
    return opts.replaceAll("^/+", "").replaceAll("/+$", "");
  }
}
