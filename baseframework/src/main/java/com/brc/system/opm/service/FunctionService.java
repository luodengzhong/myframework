package com.brc.system.opm.service;

import com.brc.system.opm.domain.BaseFunctionType;
import com.brc.system.opm.domain.BizFunction;
import com.brc.util.SDO;
import java.util.Map;

public abstract interface FunctionService
{
  public static final String MODEL_FILE_NAME = "config/domain/com/brc/system/opm/function.xml";
  public static final String BASE_FUNCTION_TYPE_ENTITY_NAME = "baseFunctionType";
  public static final String BIZ_FUNCTION_ENTITY_NAME = "bizFunction";
  public static final String BIZ_FUNCTION_OWN_BASE_ENTITY_NAME = "bizFunctionOwnBase";

  public abstract Long insertBaseFunctionType(SDO paramSDO);

  public abstract void updateBaseFunctionType(SDO paramSDO);

  public abstract void deleteBaseFunctionType(Long[] paramArrayOfLong);

  public abstract Long getBaseFunctionTypeNextSequence();

  public abstract void updateBaseFunctionTypeSequence(Map<Long, Long> paramMap);

  public abstract void updateBaseFunctionTypeFolderId(Long[] paramArrayOfLong, Long paramLong);

  public abstract Map<String, Object> loadBaseFunctionType(Long paramLong);

  public abstract BaseFunctionType loadBaseFunctionTypeObject(Long paramLong);

  public abstract Map<String, Object> slicedQueryBaseFunctionTypes(SDO paramSDO);

  public abstract void saveBizFunction(SDO paramSDO);

  public abstract void deleteBizFunction(Long[] paramArrayOfLong);

  public abstract BizFunction loadBizFunction(Long paramLong);

  public abstract Map<String, Object> slicedQueryBizFunctions(SDO paramSDO);

  public abstract void saveBizFunctionOwnBase(Long paramLong, Long[] paramArrayOfLong);

  public abstract void deleteBizFunctionOwnBase(Long[] paramArrayOfLong);

  public abstract Map<String, Object> slicedQueryBizFunctionOwnBases(SDO paramSDO);

  public abstract Map<String, Object> queryAuthorisedBaseFunctionType(String paramString);
}

