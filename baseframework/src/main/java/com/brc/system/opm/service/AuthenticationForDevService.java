package com.brc.system.opm.service;

import com.brc.system.opm.Operator;
import com.brc.util.SDO;
import java.util.List;
import java.util.Map;

public abstract interface AuthenticationForDevService
{
  public abstract Map<String, Object> login(String paramString1, String paramString2);

  public abstract List<Map<String, Object>> loadPersonFunPermissions(String paramString, Long paramLong);

  public abstract List<Map<String, Object>> loadPersonMembers(String paramString);

  public abstract Object[] loadOndutyTime(String paramString);

  public abstract List<Map<String, Object>> loadRole(String paramString);

  public abstract boolean authenticationManageType(SDO paramSDO);

  public abstract void setOperatorOrgInfo(Operator paramOperator, String paramString);
}

