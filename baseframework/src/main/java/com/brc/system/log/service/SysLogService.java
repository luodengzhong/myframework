package com.brc.system.log.service;

import com.brc.system.opm.Operator;
import com.brc.system.token.domain.UserTokenInfo;
import com.brc.util.SDO;
import java.util.Map;

public abstract interface SysLogService
{
  public abstract Map<String, Object> load(SDO paramSDO);

  public abstract void delete(SDO paramSDO);

  public abstract Map<String, Object> slicedQuery(SDO paramSDO);

  public abstract void doInsertLoginLog(Operator paramOperator);

  public abstract void doInsertFunctionLog(Operator paramOperator, String paramString);

  public abstract void doInsertOperationLog(Operator paramOperator, String paramString1, String paramString2, String paramString3, Long paramLong);

  public abstract void doInsertErrorLog(Operator paramOperator, String paramString1, String paramString2, String paramString3, String paramString4);

  public abstract void doInsertPMAppLoginLog(UserTokenInfo paramUserTokenInfo);

  public abstract void doInsertPMAppOperationLog(UserTokenInfo paramUserTokenInfo, String paramString1, String paramString2, String paramString3, Long paramLong);
}

