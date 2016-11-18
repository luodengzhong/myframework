package com.brc.system.imp.service;

import com.brc.system.opm.Operator;
import com.brc.util.SDO;
import java.io.Serializable;
import java.util.List;
import java.util.Map;

public abstract interface ImpExcelService
{
  public static final String NEW = "0";
  public static final String SUCC = "1";
  public static final String ERR = "2";
  public static final String REPEAT = "3";

  public abstract Serializable insert(SDO paramSDO);

  public abstract void update(SDO paramSDO);

  public abstract Map<String, Object> load(SDO paramSDO);

  public abstract Map<String, Object> slicedImpExpLogQuery(SDO paramSDO);

  public abstract void delete(SDO paramSDO);

  public abstract void deleteTemplet(Long[] paramArrayOfLong);

  public abstract Map<String, Object> slicedQuery(SDO paramSDO);

  public abstract Map<String, Object> loadExpTemplet(SDO paramSDO);

  public abstract Map<String, Object> loadExpTempletByCode(SDO paramSDO);

  public abstract List<Map<String, Object>> queryExpTempletDetailByTempletId(Long paramLong);

  public abstract List<Map<String, Object>> queryExpTempletByTempletId(Long paramLong);

  public abstract Serializable insertTemplet(SDO paramSDO, List<Object> paramList);

  public abstract void deleteTempletDetail(Long[] paramArrayOfLong);

  public abstract void updateTemplet(SDO paramSDO, List<Object> paramList);

  public abstract void updateTempletStatus(Long[] paramArrayOfLong, Integer paramInteger);

  public abstract void updateTempletParentId(Long[] paramArrayOfLong, Long paramLong);

  public abstract String findTemplExcelHead(Long paramLong)
    throws Exception;

  public abstract Long saveImpExcel(Long paramLong1, Long paramLong2, Operator paramOperator, String paramString)
    throws Exception;

  public abstract Long getImpMidTableTotle(Long paramLong1, Long paramLong2, String paramString);

  public abstract void saveImpLog(Long paramLong1, Long paramLong2, Operator paramOperator, String paramString1, String paramString2, Long paramLong3, Long paramLong4);

  public abstract Map<String, Object> slicedResultQuery(SDO paramSDO);

  public abstract void updateImpLog(Long paramLong);

  public abstract void updateTempletCompStatus(Long[] paramArrayOfLong, Integer paramInteger);

  public abstract List<Map<String, Object>> queryUseExpTempletDetailByTempletId(Long paramLong);

  public abstract void deleteTempData(SDO paramSDO);
}

