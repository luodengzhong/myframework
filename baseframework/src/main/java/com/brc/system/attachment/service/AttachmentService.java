package com.brc.system.attachment.service;

import com.brc.util.SDO;
import java.util.List;
import java.util.Map;

public abstract interface AttachmentService
{
  public static final String MODEL_FILE_NAME = "config/domain/com/brc/system/attachment/attachment.xml";
  public static final String SYS_ATTACHMENT_CONFIG_ENTITY = "attachmentConfig";
  public static final String SYS_ATTACHMENT_CONFIG_DETAIL_ENTITY = "attachmentConfigDetail";
  public static final String SYS_ATTACHMENT_ENTITY = "attachment";

  public abstract Long saveAttachmentConfig(SDO paramSDO);

  public abstract Map<String, Object> loadAttachmentConfig(SDO paramSDO);

  public abstract void deleteAttachmentConfig(SDO paramSDO);

  public abstract Map<String, Object> slicedQueryAttachmentConfig(SDO paramSDO);

  public abstract Map<String, Object> slicedQueryAttachmentConfigDetail(SDO paramSDO);

  public abstract void deleteAttachmentConfigDetail(Long[] paramArrayOfLong);

  public abstract void updateAttachmentConfigFolderId(Long[] paramArrayOfLong, Long paramLong);

  public abstract Map<String, Map<String, Object>> queryConfigByBizCode(String paramString);

  public abstract Long save(Map<String, Object> paramMap);

  public abstract void updateBillCode(Long paramLong, String paramString);

  public abstract List<Map<String, Object>> getAttachmentList(String paramString1, String paramString2);

  public abstract void delete(Long paramLong, String paramString, boolean paramBoolean);

  public abstract void deleteAll(String paramString1, String paramString2, String paramString3, boolean paramBoolean);

  public abstract Map<String, Object> getAttachmentFile(Long paramLong);

  public abstract List<Map<String, Object>> getAttachmentGroupList(String paramString1, String paramString2);

  public abstract void updateClearCache(Long paramLong);

  public abstract void saveAttachmentSort(SDO paramSDO);

  public abstract void saveFTPFileList(SDO paramSDO);

  public abstract void deleteFileByIds(SDO paramSDO);
}

