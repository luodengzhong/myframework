package com.brc.system.opm.service;

import com.brc.system.opm.Operator;
import com.brc.util.SDO;
import java.util.List;
import java.util.Map;

public abstract interface AuthenticationService {
	public abstract void setOperatorOrgInfo(Operator paramOperator, String paramString);

	public abstract Operator createOperator(Map<String, Object> paramMap);

	public abstract Map<String, Object> switchOperator(String paramString);

	public abstract Map<String, Object> login(String paramString1, String paramString2);

	public abstract Operator getOperatorByPsmIdOrFullId(String paramString);

	public abstract Map<String, Object> loginFromErp(String paramString1, String paramString2);

	public abstract Map<String, Object> loginFromErp(String paramString);

	public abstract List<Map<String, Object>> loadPersonFunPermissions(String paramString, Long paramLong);

	public abstract boolean checkPersonFunPermissions(String paramString1, String paramString2);

	public abstract Object[] loadOndutyTime(String paramString);

	public abstract List<Map<String, Object>> loadRole(String paramString);

	public abstract boolean authenticationManageType(SDO paramSDO);


	public abstract void authenticationPersonalPassword(SDO paramSDO);

	public abstract Map<String, Object> ssoLogin(String paramString);
}
