package com.brc.system.opm.service;

import com.brc.util.SDO;
import java.util.Map;

public abstract interface OrgTypeService
{
  public static final String ORG_TYPE_ENTITY = "orgType";
  public static final String MODEL_FILE_NAME = "config/domain/com/brc/system/opm/opm.xml";

  public abstract Long insertOrgType(SDO paramSDO);

  public abstract void updateOrgType(SDO paramSDO);

  public abstract void deleteOrgType(Long[] paramArrayOfLong);

  public abstract Long getOrgTypeNextSequence(Long paramLong);

  public abstract void updateOrgTypeSequence(Map<Long, Long> paramMap);

  public abstract void moveOrgType(Long[] paramArrayOfLong, Long paramLong);

  public abstract Map<String, Object> loadOrgType(Long paramLong);

  public abstract Map<String, Object> slicedQueryOrgTypes(SDO paramSDO);
}

