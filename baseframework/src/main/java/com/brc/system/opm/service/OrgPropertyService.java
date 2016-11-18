package com.brc.system.opm.service;

import com.brc.util.SDO;
import java.util.Map;

public abstract interface OrgPropertyService
{
  public abstract void batchInsertProperties(SDO paramSDO);

  public abstract void deleteProperty(Long[] paramArrayOfLong);

  public abstract void deletePropertiesByOrgId(SDO paramSDO);

  public abstract Map<String, Object> queryChildProperties(SDO paramSDO);

  public abstract Map<String, Object> slicedQueryOrgProperty(SDO paramSDO);
}

