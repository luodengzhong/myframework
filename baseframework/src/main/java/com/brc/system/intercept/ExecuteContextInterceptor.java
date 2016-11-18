package com.brc.system.intercept;

import com.brc.system.log.service.SysLogService;
import com.brc.system.opm.Operator;
import com.brc.system.share.service.GetPermission;
import com.brc.util.ClassHelper;
import com.brc.util.JSONParseConfig;
import com.brc.util.LogHome;
import com.brc.util.SDO;
import com.brc.util.StringUtil;
import com.brc.util.ThreadLocalUtil;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.servlet.http.HttpServletRequest;
import net.sf.json.JSONObject;
import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;

public class ExecuteContextInterceptor extends AbstractInterceptor {
	private static final long serialVersionUID = 1L;
	private GetPermission getPermission;
	private SysLogService sysLogService;
	private List<String> includes;

	public void setGetPermission(GetPermission getPermission) {
		this.getPermission = getPermission;
	}

	public void setSysLogService(SysLogService sysLogService) {
		this.sysLogService = sysLogService;
	}

	public List<String> getIncludes() {
		return this.includes;
	}

	public void setIncludes(List<String> includes) {
		this.includes = includes;
	}

	private void handlePermission(Collection<Map<String, Object>> permissions, ActionContext ctx, String functionCode) {
		if ((permissions != null) && (permissions.size() > 0)) {
			ctx.getSession().put("PermissionInterceptorSet", permissions);
			Map noaccessField = new HashMap(permissions.size());
			Map noaccessDetail = new HashMap(permissions.size());
			String codeName = "";
			String fieldAuthority = "";
			String fieldType = "";
			for (Map m : permissions) {
				codeName = (String) ClassHelper.convert(m.get("fieldCode"), String.class);
				fieldAuthority = (String) ClassHelper.convert(m.get("fieldAuthority"), String.class, "");
				fieldType = (String) ClassHelper.convert(m.get("fieldType"), String.class, "");

				if ((!StringUtil.isBlank(codeName)) && (fieldAuthority.equals("noaccess"))) {
					if (fieldType.equals("0"))
						noaccessField.put(codeName, "1");
					else if (fieldType.equals("1")) {
						noaccessDetail.put(codeName, "1");
					}
				}
			}
			if (noaccessField.size() > 0) {
				ThreadLocalUtil.addVariable("noaccessField", noaccessField);
			}
			if (noaccessDetail.size() > 0) {
				if ((!StringUtil.isBlank(functionCode)) && ((functionCode.equals("HRArchivesMaintain"))
						|| (functionCode.equals("hrPersonOwnInfo")) || (functionCode.equals("HREmployeeModifEntry")))) {
					ctx.getSession().put("HRArchivesMaintaiNoaccessDetail", noaccessDetail);
				}
			}

			ThreadLocalUtil.addVariable("permissions", permissions);
		}
	}

	public String intercept(ActionInvocation invocation) throws Exception {
		ActionContext ctx = invocation.getInvocationContext();
		HttpServletRequest request = ServletActionContext.getRequest();
		Operator operator = (Operator) ctx.getSession().get("sessionOperatorAttribute");
		String func = null;
		if (!isAjaxRequest(request)) {
			String functionId = request.getParameter("functionId");
			String functionCode = request.getParameter("functionCode");
			if (!StringUtil.isBlank(functionId))
				func = functionId;
			else if (!StringUtil.isBlank(functionCode)) {
				func = functionCode;
			}

			if (!StringUtil.isBlank(func))
				try {
					List permissions = this.getPermission.getOperatorPermissionFieldByFunction(func, operator,
							!StringUtil.isBlank(functionId));
					handlePermission(permissions, ctx, functionCode);
				} catch (Exception e) {
					LogHome.getLog(this).error(e);
					ctx.put("tip", e.getMessage());
					return "ErrorPage";
				}
		}
		Collection permissions;
		if (isJobRequest(request)) {
			try {
				String procUnitHandlerId = request.getParameter("procUnitHandlerId");
				if (!StringUtil.isBlank(procUnitHandlerId)) {
					permissions = this.getPermission.queryAuthorityByProcUnitHandlerId(procUnitHandlerId);
					handlePermission(permissions, ctx, null);
				}
			} catch (Exception e) {
				e.printStackTrace();
				LogHome.getLog(this).error(e);
				ctx.put("tip", e.getMessage());
				return "ErrorPage";
			}
		}
		Long b = Long.valueOf(System.currentTimeMillis());
		try {
			return invocation.invoke();
		} catch (Exception e) {
			e.printStackTrace();
			LogHome.getLog(this).error(e);
			ctx.put("tip", e.getMessage());
			return "ErrorPage";
		} finally {
			ThreadLocalUtil.removeVariableMap();

			saveLog(operator, request.getRequestURI(), func, b);
		}
	}

	private boolean isJobRequest(HttpServletRequest request) {
		String currentURL = request.getRequestURI();
		return currentURL.indexOf(".job") > 0;
	}

	private boolean isAjaxRequest(HttpServletRequest request) {
		String currentURL = request.getRequestURI();
		return currentURL.indexOf(".ajax") > 0;
	}

	private void saveLog(Operator operator, String currentURL, String func, Long begin) {
		if (!isLogged(currentURL))
			return;
		try {
			Map map = ActionContext.getContext().getParameters();
			SDO sdo = new SDO(true);
			Iterator it = map.keySet().iterator();
			while (it.hasNext()) {
				String key = (String) it.next();
				String[] values = (String[]) map.get(key);
				if ((values != null) && (values.length > 0)) {
					if (values.length == 1)
						sdo.putProperty(key, StringUtil.decode(values[0]));
					else {
						sdo.putProperty(key, values);
					}
				}
			}
			String params = JSONObject.fromObject(sdo.getProperties(), JSONParseConfig.jc).toString();
			this.sysLogService.doInsertOperationLog(operator, currentURL, params, func, begin);
		} catch (Exception e) {
			LogHome.getLog(this).error(e);
		}
	}

	private boolean isLogged(String currentURL) {
		if ((this.includes == null) || (this.includes.size() == 0)) {
			return false;
		}

		Pattern p = null;
		Matcher m = null;
		for (String include : this.includes) {
			p = Pattern.compile(include, 2);
			m = p.matcher(currentURL);
			boolean result = m.find();
			if (result) {
				return true;
			}
		}
		return false;
	}
}
