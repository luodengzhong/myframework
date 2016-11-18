package com.brc.system.share.service;

import com.brc.model.domain.DomainModel;
import com.brc.system.data.EntityParserDao;
import com.brc.util.SDO;
import com.brc.xmlbean.EntityDocument;
import com.brc.xmlbean.EntityDocument.Entity;
import java.io.Serializable;
import java.util.List;
import java.util.Map;

public abstract interface ServiceUtil
{
  public static final String SERVICE_UTIL_MODEL_FILE_NAME = "config/domain/com/brc/configuration/serviceUtil.xml";
  public static final String SERVICEUTIL = "serviceUtil";
  public static final String EXTENDED_FIELD_MODEL_FILE_NAME = "config/domain/com/brc/system/cfg/extendedField.xml";
  public static final String ENTITY_SYS_EXTENDED_FIELD_GROUP = "extendedFieldGroup";
  public static final String ENTITY_SYS_EXTENDED_FIELD_STORAGE = "extendedFieldStorage";

  public abstract EntityParserDao getEntityDao();

  public abstract SQLQuery getSQLQuery();

  public abstract DomainModel getDomainModel(String paramString);

  public abstract EntityDocument.Entity getEntity(String paramString1, String paramString2);

  public abstract String getEntityTableName(String paramString1, String paramString2);

  public abstract void updateSequence(String paramString1, String paramString2, Map<Long, Long> paramMap);

  public abstract Long getNextSequence(String paramString1, String paramString2);

  public abstract String getSerialNumber(String paramString);

  public abstract Long getNextSequence(String paramString1, String paramString2, String paramString3, Long paramLong);

  public abstract void updateSequence(String paramString1, String paramString2, String paramString3, Map<Long, Long> paramMap);

  public abstract void updateById(String paramString1, String paramString2, String paramString3, Long[] paramArrayOfLong, Object paramObject);

  public abstract void updateStatusById(String paramString1, String paramString2, Long paramLong, Integer paramInteger);

  public abstract void saveExtendedField(Map<String, Object> paramMap);

  public abstract void saveExtendedField(SDO paramSDO);

  public abstract void saveExtendedField(SDO paramSDO, Long paramLong);

  public abstract void saveExtendedField(Map<String, Object> paramMap, Long paramLong);

  public abstract void insertExtendedField(SDO paramSDO, Long paramLong);

  public abstract void insertExtendedField(Map<String, Object> paramMap, Long paramLong);

  public abstract List<Map<String, Object>> queryExtendedFieldByBusiness(String paramString1, String paramString2);

  public abstract Map<String, Object> queryExtendedFieldToMapByBusiness(String paramString1, String paramString2);

  public abstract void updateExtendedFieldValue(String paramString1, Long paramLong, String paramString2, Object paramObject1, Object paramObject2);

  public abstract void deleteExtendedField(String paramString, Long paramLong);

  public abstract List<Map<String, Object>> queryAttachment(String paramString, Serializable paramSerializable);

  public abstract List<Map<String, Object>> queryAttachment(String paramString1, String paramString2, Serializable paramSerializable);

  public abstract void deleteAttachment(String paramString, Serializable paramSerializable);

  public abstract void copyAttachment(String paramString1, Serializable paramSerializable1, String paramString2, Serializable paramSerializable2, boolean paramBoolean);

  public abstract Long copyAttachment(Long paramLong, String paramString, Serializable paramSerializable, boolean paramBoolean);

  public abstract boolean checkAttachmentExist(String paramString1, String paramString2, Serializable paramSerializable);

  public abstract boolean checkAttachmentExist(String paramString, Serializable paramSerializable);

  public abstract boolean checkAttachmentExist(Serializable paramSerializable);

  public abstract Map<String, Object> getTaskInfoByProcInstId(String paramString);

  public abstract String queryFullIdByPersonMemberId(String paramString);

  public abstract Map<String, Object> queryFullMapByPersonMemberId(String paramString);

  public abstract String queryFullIdByarchivesId(Long paramLong);

  public abstract Map<String, Object> queryFullMapByPersond(String paramString);

  public abstract Map<String, Object> queryFullMapByarchivesId(Long paramLong);

  public abstract void deleteExcelTempData(String paramString, Long paramLong);

  public abstract void saveSysClobField(Long paramLong, String paramString);

  public abstract void deleteSysClobField(Long paramLong);

  public abstract String loadSysClobField(Long paramLong);
}

