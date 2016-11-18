package com.brc.system.opm.service;

import com.brc.util.SDO;
import java.util.Map;

public abstract interface OrgTemplateService
{
  public abstract void insertOrgTemplate(Long paramLong, Long[] paramArrayOfLong);

  public abstract void deleteOrgTemplate(Long[] paramArrayOfLong);

  public abstract void updateOrgTemplateSequence(Map<Long, Long> paramMap);

  public abstract Map<String, Object> queryOrgTemplates(SDO paramSDO);

  public abstract Map<String, Object> slicedQueryOrgTemplates(SDO paramSDO);
}

