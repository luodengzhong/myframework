package com.brc.system.configuration;

import com.brc.util.SDO;
import java.util.Map;

public abstract interface OperationMapService
{
  public static final String MODEL_FILE_NAME = "config/domain/com/brc/configuration/operationMap.xml";
  public static final String SYS_OPERATION_MAP_ENTITY = "operationMap";

  public abstract Long save(SDO paramSDO);

  public abstract Map<String, Object> load(SDO paramSDO);

  public abstract void delete(SDO paramSDO);

  public abstract Map<String, Object> slicedQuery(SDO paramSDO);

  public abstract void updateStatus(Long[] paramArrayOfLong, int paramInt);

  public abstract void updateSequence(Map<Long, Long> paramMap);

  public abstract void updateFolderId(Long[] paramArrayOfLong, Long paramLong);

  public abstract String loadChar(SDO paramSDO);

  public abstract void saveChar(SDO paramSDO);

  public abstract void savePicture(SDO paramSDO);
}

