package com.brc.system.opm.service;

import com.brc.system.opm.Operator;
import com.brc.util.SDO;
import java.io.Serializable;
import java.util.List;
import java.util.Map;

public abstract interface PermissionFieldService
{
  public abstract Serializable insertPermissionfield(SDO paramSDO);

  public abstract void updatePermissionfield(SDO paramSDO);

  public abstract Map<String, Object> loadPermissionfield(SDO paramSDO);

  public abstract void deletePermissionfield(Long[] paramArrayOfLong);

  public abstract Map<String, Object> slicedQueryPermissionfield(SDO paramSDO);

  public abstract void updatePermissionfieldStatus(Long[] paramArrayOfLong, int paramInt);

  public abstract void updatePermissionfieldParentId(Long[] paramArrayOfLong, Long paramLong);

  public abstract List<Map<String, Object>> queryFunctionFieldGroup(Long paramLong);

  public abstract Serializable insertFunctionFieldGroup(SDO paramSDO);

  public abstract void updateFunctionFieldGroup(SDO paramSDO);

  public abstract void deleteFunctionFieldGroup(SDO paramSDO);

  public abstract Map<String, Object> slicedQueryFunctionPermissionfield(SDO paramSDO);

  public abstract void deleteFunctionPermissionfield(Long[] paramArrayOfLong);

  public abstract void saveFunctionPermissionfield(SDO paramSDO);

  public abstract List<Map<String, Object>> getOperatorPermissionFieldByFunction(String paramString, Operator paramOperator, boolean paramBoolean);
}

