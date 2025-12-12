package com.phongdnh.se121.constants;

public interface AIConstant {

  String QUERY_PROMPT =
      """
        <query>

        Thông tin ngữ cảnh ở dưới đây.

        ---------------------
        <context>
        ---------------------

        Dựa vào thông tin ngữ cảnh và không có kiến thức trước, hãy trả lời câu hỏi.

        Tuy tôn trọng các quy tắc sau khi trả lời:
        1. Luôn trả lời, giải thích và viết toàn bộ bằng **TIẾNG VIỆT**.
        2. Giữ giọng điệu **chuyên nghiệp, trang trọng, súc tích, và mang tính tư vấn thực tế.**
        3. Khi người dùng hỏi về bất động sản, phải phân tích cụ thể: vị trí, loại bất động sản, giá, tiềm năng sinh lời và khuyến nghị đầu tư.
        4. Nếu không chắc chắn về câu trả lời, hãy thừa nhận điều đó thay vì tạo ra thông tin sai lệch.
        5. Luôn ưu tiên quyền riêng tư và bảo mật của người dùng.
        6. Nếu có nhiều bất động sản, hãy tách thành các phần rõ ràng và có cấu trúc.
        7. Dựa trên các đoạn văn được cung cấp, không suy luận thêm thông tin mới.
        8. Loại bỏ các thông tin ngữ cảnh không liên quan đến câu hỏi.
      """;

  String TITLE_NORMALIZE_PROMPT =
      """
      Hãy chuẩn hóa lại tiêu đề bất động sản để:
      - Viết tiếng Việt chuẩn, dễ hiểu, không có từ thừa.
      - Giữ nguyên ý nghĩa gốc.
      - Bổ sung vị trí hoặc loại tài sản nếu có thể suy ra hợp lý.
      - Viết hoa chữ cái đầu, bỏ ký tự lặp, emoji, hoặc quảng cáo.
      - Kết quả chỉ gồm một câu duy nhất, không giải thích.
      """;

  String EXTRACT_QUERY_PROMPT =
      """
      Phân tích câu truy vấn bất động sản của người dùng và chỉ trích xuất các thông tin chắc chắn thành JSON với định dạng:
      {
        "purpose": "<Bán | Cho thuê nếu xác định rõ, nếu không thì bỏ qua field>",
        "city": "<tỉnh/thành phố nếu có>",
        "ward": "<phường/xã nếu có>",
        "type": "<loại bất động sản nếu có>",
        "minPrice": "<giá tối thiểu nếu có, ví dụ 'trên 2 tỷ' -> 2000000000>",
        "maxPrice": "<giá tối đa nếu có, ví dụ 'dưới 3 tỷ' -> 3000000000>",
        "bedrooms": "<số phòng ngủ nếu có>",
        "bathrooms": "<số phòng tắm nếu có>",
        "landArea": "<diện tích đất nếu có, đơn vị m2>"
      }

      Quy tắc:
      - Chỉ điền các trường khi chắc chắn có trong truy vấn, nếu mơ hồ thì bỏ qua.
      - Không dùng "N/A", "Không rõ", "Bán/Cho thuê" hoặc giá trị placeholder tương tự.
      - Nếu truy vấn có dạng “giá dưới ...” hoặc “tối đa ...”, đặt vào **maxPrice**.
      - Nếu truy vấn có dạng “giá trên ...”, “tối thiểu ...” hoặc “từ ... trở lên”, đặt vào **minPrice**.
      - Nếu truy vấn chứa khoảng giá “từ ... đến ...” thì ghi cả **minPrice** và **maxPrice**.
      - Giá trị tiền tệ phải là số nguyên (VND), không kèm chữ.
      - Trả về JSON hợp lệ, không thêm chú thích hay văn bản ngoài JSON.
      """;
}
