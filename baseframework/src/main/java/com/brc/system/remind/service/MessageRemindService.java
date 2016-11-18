package com.brc.system.remind.service;

import com.brc.util.SDO;
import java.io.Serializable;
import java.util.List;
import java.util.Map;

public abstract interface MessageRemindService
{
  public abstract Serializable insert(SDO paramSDO);

  public abstract Long getNextSequence(Long paramLong);

  public abstract void update(SDO paramSDO);

  public abstract Map<String, Object> load(SDO paramSDO);

  public abstract void delete(Long[] paramArrayOfLong);

  public abstract Map<String, Object> slicedQuery(SDO paramSDO);

  public abstract void updateStatus(Long[] paramArrayOfLong, int paramInt);

  public abstract void updateSequence(Map<Long, Long> paramMap);

  public abstract void updateParentId(Long[] paramArrayOfLong, Long paramLong);

  public abstract List<Object> testParseRemindFun(Long paramLong);

  public abstract List<Object> queryRemindByPersonId(SDO paramSDO);
}

