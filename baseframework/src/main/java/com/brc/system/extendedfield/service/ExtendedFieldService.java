package com.brc.system.extendedfield.service;

import com.brc.util.SDO;
import java.io.Serializable;
import java.util.List;
import java.util.Map;

public abstract interface ExtendedFieldService
{
  public abstract void insertExtendedFields(SDO paramSDO);

  public abstract void updateExtendedFieldSequence(Map<Long, Long> paramMap);

  public abstract void deleteExtendedField(Long paramLong, Long[] paramArrayOfLong);

  public abstract List<Map<String, Object>> queryExtendedFieldByGroupId(Long paramLong);

  public abstract Map<String, Object> slicedQueryExtendedField(SDO paramSDO);

  public abstract Serializable insertExtendedFieldDefine(SDO paramSDO);

  public abstract void updateExtendedFieldDefine(SDO paramSDO);

  public abstract void updateExtendedFieldDefineParentId(Long[] paramArrayOfLong, Long paramLong);

  public abstract Map<String, Object> loadExtendedFieldDefine(SDO paramSDO);

  public abstract void deleteExtendedFieldDefine(Long[] paramArrayOfLong);

  public abstract Map<String, Object> slicedQueryExtendedFieldDefine(SDO paramSDO);

  public abstract Serializable insertExtendedFieldGroup(SDO paramSDO);

  public abstract void updateExtendedFieldGroup(SDO paramSDO);

  public abstract Map<String, Object> loadExtendedFieldGroup(SDO paramSDO);

  public abstract void deleteExtendedFieldGroup(Long[] paramArrayOfLong);

  public abstract Map<String, Object> slicedQueryExtendedFieldGroup(SDO paramSDO);

  public abstract void updateExtendedFieldGroupParentId(Long[] paramArrayOfLong, Long paramLong);

  public abstract void updateExtendedFieldGroupSequence(Map<Long, Long> paramMap);

  public abstract List<Map<String, Object>> queryGroupByBusinessCode(String paramString);

  public abstract List<Map<String, Object>> queryExtendedFieldForView(String paramString, Long paramLong);
}

