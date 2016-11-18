package com.brc.system.opm.service;

import com.brc.util.SDO;
import java.util.Map;

public abstract interface AuthorizationService
{
  public abstract void insertOrgRoleKindAuthorize(String paramString, Long[] paramArrayOfLong);

  public abstract void deleteOrgRoleKindAuthorize(Long[] paramArrayOfLong);

  public abstract Map<String, Object> loadOrgRoleKindAuthorizes(SDO paramSDO);

  public abstract void insertAuthorize(String paramString, Long[] paramArrayOfLong);

  public abstract void deleteAuthorize(Long[] paramArrayOfLong);

  public abstract SDO loadAuthorizes(SDO paramSDO);

  public abstract Map<String, Object> slicedQueryAuthorizePermissionsByOrgFullId(SDO paramSDO);

  public abstract void quoteAuthorize(String paramString1, String paramString2);
}

