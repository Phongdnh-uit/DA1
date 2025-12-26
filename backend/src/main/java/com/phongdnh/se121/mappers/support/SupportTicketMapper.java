package com.phongdnh.se121.mappers.support;

import com.phongdnh.se121.dtos.general.FileResponse;
import com.phongdnh.se121.dtos.support.AdminSupportResponse;
import com.phongdnh.se121.dtos.support.ProcessSupportRequest;
import com.phongdnh.se121.dtos.support.SummarySupportResponse;
import com.phongdnh.se121.dtos.support.SupportRequest;
import com.phongdnh.se121.dtos.support.SupportResponse;
import com.phongdnh.se121.entities.support.SupportAttachment;
import com.phongdnh.se121.entities.support.SupportTicket;
import com.phongdnh.se121.enums.general.FilePurpose;
import com.phongdnh.se121.mappers.general.FileMapper;
import java.util.List;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class SupportTicketMapper {

  @Autowired protected FileMapper fileMapper;

  public abstract SupportTicket requestToEntity(SupportRequest request);

  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  public abstract void partialUpdate(
      ProcessSupportRequest request, @MappingTarget SupportTicket entity);

  @Mapping(target = "attachments", source = "attachments", qualifiedByName = "mapAttachments")
  public abstract AdminSupportResponse entityToAdminResponse(SupportTicket entity);

  @Mapping(target = "attachments", source = "attachments", qualifiedByName = "mapAttachments")
  public abstract SupportResponse entityToClientResponse(SupportTicket entity);

  public abstract SummarySupportResponse entityToSummary(SupportTicket entity);

  @Named("mapAttachments")
  protected List<FileResponse> mapAttachments(List<SupportAttachment> files) {
    if (files == null) {
      return null;
    }
    return files.stream()
        .map(SupportAttachment::getFile)
        .filter(file -> file.getPurpose() == FilePurpose.SUPPORT_TICKET_ATTACHMENT)
        .map(this.fileMapper::entityToResponse)
        .toList();
  }
}
