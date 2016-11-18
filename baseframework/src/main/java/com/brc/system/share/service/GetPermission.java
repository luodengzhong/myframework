package com.brc.system.share.service;

import com.brc.system.opm.Operator;
import com.brc.system.opm.OrgUnit;
import com.brc.util.SDO;
import java.util.List;
import java.util.Map;

public abstract interface GetPermission
{
  public abstract List<OrgUnit> getPermissionOrgUnit(String paramString1, List<String> paramList, String paramString2);

  public abstract List<OrgUnit> getPermissionOrgUnit(String paramString);

  public abstract void removeCache();

  public abstract void removeCacheByKind(String paramString);

  public abstract SDO getPermissionSql(String paramString1, String paramString2);

  public abstract SDO getPermissionSql(String paramString1, String paramString2, String paramString3);

  public abstract SDO getTreePermissionSql(String paramString1, String paramString2);

  public abstract List<Map<String, Object>> getOperatorPermissionFieldByFunction(String paramString, Operator paramOperator, boolean paramBoolean);

  public abstract List<Map<String, Object>> queryAuthorityByProcUnitHandlerId(String paramString);

  public abstract boolean authenticationManageType(String paramString1, String paramString2);
}

