package com.brc.system.opm.service;

import com.brc.system.opm.domain.BizManagementType;
import com.brc.util.SDO;
import java.util.Map;

public abstract interface ManagementService
{
  public static final String MODEL_FILE_NAME = "config/domain/com/brc/system/opm/management.xml";
  public static final String BASE_MANAGEMENT_TYPE_ENTITY_NAME = "baseManagementType";
  public static final String BIZ_MANAGEMENT_TYPE_ENTITY_NAME = "bizManagementType";
  public static final String BIZ_MANAGEMENT_ENTITY_NAME = "bizManagement";

  public abstract Long insertBaseManagementType(SDO paramSDO);

  public abstract void updateBaseManagementType(SDO paramSDO);

  public abstract void deleteBaseManagementType(Long[] paramArrayOfLong);

  public abstract Long getBaseManagementTypeNextSequence();

  public abstract void updateBaseManagementTypeSequence(Map<Long, Long> paramMap);

  public abstract void updateBaseManagementTypeFolderId(Long[] paramArrayOfLong, Long paramLong);

  public abstract Map<String, Object> loadBaseManagementType(Long paramLong);

  public abstract Map<String, Object> slicedQueryBaseManagements(SDO paramSDO);

  public abstract Long insertBizManagementType(SDO paramSDO);

  public abstract void updateBizManagementType(SDO paramSDO);

  public abstract void deleteBizManagementType(Long[] paramArrayOfLong);

  public abstract Long getBizManagementTypeNextSequence(Long paramLong);

  public abstract void updateBizManagementTypeSequence(Map<Long, Long> paramMap);

  public abstract void moveBizManagementType(Long[] paramArrayOfLong, Long paramLong);

  public abstract Map<String, Object> loadBizManagementType(Long paramLong);

  public abstract BizManagementType loadBizManagementTypeObject(Long paramLong);

  public abstract Map<String, Object> queryBizManagementTypes(SDO paramSDO);

  public abstract Map<String, Object> slicedQueryBizManagementTypes(SDO paramSDO);

  public abstract void insertBizManagementByOrg(Long paramLong, String[] paramArrayOfString, String paramString);

  public abstract void allocateManagers(String paramString, Long paramLong, String[] paramArrayOfString);

  public abstract void allocateSubordinations(String paramString, Long paramLong, String[] paramArrayOfString);

  public abstract void insertDelegationBizManagement(Long paramLong, String[] paramArrayOfString, String paramString);

  public abstract void deleteBizManagement(Long[] paramArrayOfLong);

  public abstract Map<String, Object> slicedQueryBizManagements(SDO paramSDO);

  public abstract Map<String, Object> slicedQueryBizManagementsByManageOrgId(SDO paramSDO);

  public abstract Map<String, Object> slicedQueryOrgAllocatedBizManagementTypeForManager(SDO paramSDO);

  public abstract Map<String, Object> slicedQueryOrgAllocatedBizManagementTypeForSubordination(SDO paramSDO);

  public abstract Map<String, Object> slicedQueryBizManagementForManager(SDO paramSDO);

  public abstract Map<String, Object> slicedQueryBizManagementForSubordination(SDO paramSDO);

  public abstract void romovePermissionCache();

  public abstract void quoteBizManagement(String paramString1, String paramString2);
}

