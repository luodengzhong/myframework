package com.brc.system.parameter.service;

import com.brc.util.SDO;
import java.io.Serializable;
import java.util.List;
import java.util.Map;

public abstract interface ParameterService
{
  public abstract Serializable insertParameter(SDO paramSDO);

  public abstract void updateParameter(SDO paramSDO);

  public abstract Map<String, Object> loadParameter(SDO paramSDO);

  public abstract List<Map<String, Object>> queryAllParameter();

  public abstract void deleteParameter(Long[] paramArrayOfLong);

  public abstract void updateParameterParentId(Long[] paramArrayOfLong, Long paramLong);

  public abstract Map<String, Object> slicedQueryParameter(SDO paramSDO);

  public abstract Serializable insertSerialNumber(SDO paramSDO);

  public abstract void updateSerialNumber(SDO paramSDO);

  public abstract Map<String, Object> loadSerialNumber(SDO paramSDO);

  public abstract Map<String, Object> loadSerialNumberByCode(String paramString);

  public abstract void deleteSerialNumber(Long[] paramArrayOfLong);

  public abstract Map<String, Object> slicedQuerySerialNumber(SDO paramSDO);

  public abstract void updateSerialNumberParentId(Long[] paramArrayOfLong, Long paramLong);

  public abstract void updateSerialNumberValue(Long paramLong1, Long paramLong2);

  public abstract List<Map<String, Object>> queryAllSerialNumber();

  public abstract void syncCacheParameter();

  public abstract Long saveMessageKind(SDO paramSDO);

  public abstract void deleteMessageKind(SDO paramSDO);

  public abstract Map<String, Object> slicedQueryMessageKind(SDO paramSDO);

  public abstract Map<String, Object> loadMessageKind(SDO paramSDO);

  public abstract void updateMessageKindStatus(SDO paramSDO);

  public abstract List<Map<String, Object>> queryUserMessageKind(SDO paramSDO);

  public abstract void saveUserMessageKind(SDO paramSDO);

  public abstract Map<String, String> getEnabledMessageKind();
}

