package com.brc.system.contact.service;

import com.brc.util.SDO;
import java.io.Serializable;
import java.util.Map;

public abstract interface ContactService
{
  public abstract Map<String, Object> sliceQueryConfiguration(SDO paramSDO);

  public abstract void saveConfiguration(SDO paramSDO);

  public abstract Map<String, Object> queryContactWay(SDO paramSDO);

  public abstract Serializable saveContactWay(SDO paramSDO);

  public abstract Map<String, Object> loadContactByBizCodeAndBizId(String paramString1, String paramString2);

  public abstract Map<String, Object> queryAvailableContactWay(SDO paramSDO);

  public abstract Map<String, Object> loadFirstContactWay(SDO paramSDO);

  public abstract void updateStatus(Integer paramInteger, Long[] paramArrayOfLong);
}

