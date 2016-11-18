package com.brc.system.opm.service;

import com.brc.util.SDO;
import java.util.List;
import java.util.Map;

public abstract interface PermissionCheckService
{
  public static final String PROCESS_DEFINITION_FILE = "config/bpm/system/opm/permissionCheckProc.bpmn";
  public static final String PROCESS_DEFINITION_KEY = "permissionCheckProc";
  public static final String OPM_PERMISSION_CHECK_ENTITY = "permissionCheck";

  public abstract Map<String, Object> load(Long paramLong);

  public abstract void delete(Long[] paramArrayOfLong);

  public abstract Map<String, Object> slicedQuery(SDO paramSDO);

  public abstract List<Map<String, Object>> queryHandler(Long paramLong);
}

