package com.brc.system.opm.service;

import com.brc.system.opm.domain.Function;
import com.brc.util.SDO;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public abstract interface PermissionService
{
  public static final String FUNCTION_ENTITY = "function";
  public static final String ROLE_ENTITY_NAME = "role";
  public static final String PARENT_ROLE_ENTITY_NAME = "parentRole";
  public static final String PERMISSION_ENTITY_NAME = "permission";
  public static final String OPREMIND_ENTITY_NAME = "opremind";
  public static final String PERMISSION_QUERY_ENTITY_NAME = "permissionQuery";
  public static final String OFTEN_USE_FUNCTION = "oftenUseFunction";
  public static final String MODEL_FILE_NAME = "config/domain/com/brc/system/opm/permission.xml";

  public abstract Long insertFunction(SDO paramSDO);

  public abstract void updateFunction(SDO paramSDO);

  public abstract void deleteFunction(Long[] paramArrayOfLong);

  public abstract void addOftenUse(Long[] paramArrayOfLong);

  public abstract Map<String, Object> slicedQueryOftenUse(SDO paramSDO);

  public abstract void deleteOftenUse(Long[] paramArrayOfLong);

  public abstract void updateOftenUseSequence(Map<Long, Long> paramMap);

  public abstract Long getFunctionNextSequence(Long paramLong);

  public abstract void updateFunctionSequence(Map<Long, Long> paramMap);

  public abstract void moveFunction(Long[] paramArrayOfLong, Long paramLong);

  public abstract Map<String, Object> loadFunction(Long paramLong);

  public abstract Function loadFunctionObject(Long paramLong);

  public abstract Map<String, Object> queryFunctions(SDO paramSDO);

  public abstract Map<String, Object> slicedQueryFunctions(SDO paramSDO);

  public abstract Long insertRole(SDO paramSDO);

  public abstract void updateRole(SDO paramSDO);

  public abstract void deleteRole(Long[] paramArrayOfLong);

  public abstract Long getRoleNextSequence(Long paramLong);

  public abstract void updateRoleSequence(Map<Long, Long> paramMap);

  public abstract void moveRole(Long[] paramArrayOfLong, Long paramLong)
    throws SQLException;

  public abstract Map<String, Object> getRoleDescendant(Long paramLong, boolean paramBoolean1, boolean paramBoolean2, boolean paramBoolean3);

  public abstract Map<String, Object> getRoleAncestor(Long paramLong, boolean paramBoolean1, boolean paramBoolean2, Boolean paramBoolean);

  public abstract Map<String, Object> loadRole(Long paramLong);

  public abstract Map<String, Object> slicedQueryRoles(SDO paramSDO);

  public abstract Map<String, Object> queryRoleKinds(SDO paramSDO);

  public abstract List<Map<String, Object>> queryFunctionsForAssign(SDO paramSDO);

  public abstract void assignFunPermission(List<Object> paramList, Long paramLong1, Long paramLong2);

  public abstract List<Map<String, Object>> queryPermissionsForAssignByRoleId(SDO paramSDO);

  public abstract void deletePermission(SDO paramSDO);

  public abstract Map<String, Object> queryPermissionsByRoleId(SDO paramSDO);

  public abstract void saveRoleRemind(SDO paramSDO);

  public abstract void deleteRoleRemind(Long[] paramArrayOfLong);

  public abstract List<Map<String, Object>> loadRootFunction();

  public abstract Map<String, Object> queryRolesByFunctionId(Long paramLong);

  public abstract Map<String, Object> queryRolesByOrgFullId(String paramString);

  public abstract Map<String, Object> queryOrgsByFunctionId(Long paramLong1, Long paramLong2, String paramString1, String paramString2);

  public abstract Map<String, Object> queryFunctionsByOrgFullId(Long paramLong1, String paramString1, String paramString2, Long paramLong2, String paramString3);

  public abstract Map<String, Object> queryRoles(SDO paramSDO);

  public abstract Map<String, Object> queryOrgsByRoleId(Long paramLong, String paramString);

  public abstract Map<String, Object> queryFunctionsByRoleId(Long paramLong, String paramString);
}

