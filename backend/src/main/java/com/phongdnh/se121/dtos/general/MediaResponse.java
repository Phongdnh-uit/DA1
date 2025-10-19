package com.phongdnh.se121.dtos.general;

import com.phongdnh.se121.entities.BaseEntity;
import com.phongdnh.se121.enums.general.MediaPurpose;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MediaResponse extends BaseEntity {
    private String publicId;
    private String secureUrl;
    private Integer width;
    private Integer height;
    private String resourceType;
    private String format;
    private MediaPurpose purpose;
    private Integer bytes;
}
