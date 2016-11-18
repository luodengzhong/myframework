package com.brc.system.opm.action;

import com.brc.client.action.base.CommonAction;
import com.brc.client.session.SessionCache;
import com.brc.system.log.service.SysLogService;
import com.brc.system.opm.LoginStatus;
import com.brc.system.opm.Operator;
import com.brc.system.opm.Person;
import com.brc.system.opm.service.AuthenticationService;
import com.brc.util.ClassHelper;
import com.brc.util.EncryptUrlPara;
import com.brc.util.LogHome;
import com.brc.util.SDO;
import com.brc.util.Singleton;
import com.brc.util.SpringBeanFactory;
import com.brc.util.StringUtil;
import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

public class AuthenticationAction extends CommonAction {
	private static final long serialVersionUID = 1L;
	private AuthenticationService authenticationService;
	private SysLogService sysLogService;

	public void setSysLogService(SysLogService sysLogService) {
		this.sysLogService = sysLogService;
	}

	public void setAuthenticationService(AuthenticationService authenticationService) {
		this.authenticationService = authenticationService;
	}

	public String loadPersonFunPermissions() {
		try {
			SDO params = getSDO();
			Operator operator = params.getOperator();
			Long parentId = (Long) params.getProperty("parentId", Long.class);
			List rows = this.authenticationService.loadPersonFunPermissions(operator.getId(), parentId);
			return toResult(rows);
		} catch (Exception e) {
			e.printStackTrace();
			return error(e.getMessage());
		}
	}

	public String switchOperator() {
		SDO params = getSDO();
		try {
			String psmId = (String) params.getProperty("psmId", String.class);

			Operator operator = this.authenticationService.getOperatorByPsmIdOrFullId(psmId);

			operator.setIp(getRequestIP());
			getSession().put("sessionOperatorAttribute", operator);

			HttpServletRequest request = getRequest();
			Cookie[] cookies = request.getCookies();
			Cookie userInfoCookie = null;
			if (cookies != null) {
				for (Cookie cookie : cookies) {
					if (cookie.getName().equals("brc_user_info")) {
						userInfoCookie = cookie;
					}
				}
			}
			if (userInfoCookie == null) {
				userInfoCookie = new Cookie("brc_user_info", request.getSession().getId());
			}
			getResponse().addCookie(userInfoCookie);

			SessionCache sessionCache = (SessionCache) SpringBeanFactory
					.getBean(getRequest().getSession().getServletContext(), "sessionCache");
			sessionCache.setOperator(userInfoCookie.getValue(), operator);
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

	private void writeLoginLog(Map<String, Object> data) {
		LoginStatus loginStatus = LoginStatus
				.fromNumber(((Integer) ClassHelper.convert(data.get("status"), Integer.class)).intValue());
		if (loginStatus == LoginStatus.SUCCESS) {
			Map personData = (Map) data.get("data");
			String id = (String) ClassHelper.convert(personData.get("personId"), String.class);
			String code = (String) ClassHelper.convert(personData.get("personCode"), String.class);
			String name = (String) ClassHelper.convert(personData.get("personName"), String.class);
			String mainOrgId = (String) ClassHelper.convert(personData.get("orgId"), String.class);
			String mainOrgFullId = (String) ClassHelper.convert(personData.get("fullId"), String.class);
			String mainOrgFullName = (String) ClassHelper.convert(personData.get("fullName"), String.class);
			String mainOrgFullCode = (String) ClassHelper.convert(personData.get("fullCode"), String.class);
			String loginName = (String) ClassHelper.convert(personData.get("loginName"), String.class);

			Person person = new Person(id, name, code, loginName, mainOrgId, mainOrgFullId, mainOrgFullName,
					mainOrgFullCode);
			Operator operator = new Operator(person, new Date());
			operator.setIp(getRequestIP());
			this.authenticationService.setOperatorOrgInfo(operator, mainOrgId);
			getSession().put("sessionOperatorAttribute", operator);

			HttpServletRequest request = getRequest();
			Cookie[] cookies = request.getCookies();
			Cookie userInfoCookie = null;
			if (cookies != null) {
				for (Cookie cookie : cookies) {
					if (cookie.getName().equals("brc_user_info")) {
						userInfoCookie = cookie;
					}
				}
			}
			if (userInfoCookie == null) {
				userInfoCookie = new Cookie("brc_user_info", request.getSession().getId());
			}
			getResponse().addCookie(userInfoCookie);
			SessionCache sessionCache = (SessionCache) SpringBeanFactory
					.getBean(getRequest().getSession().getServletContext(), "sessionCache");
			sessionCache.setOperator(userInfoCookie.getValue(), operator);

			this.sysLogService.doInsertLoginLog(operator);
		}
	}

	public String login() {
		try {
			SDO params = getSDO();
			String userName = (String) params.getProperty("userName", String.class);
			String password = (String) params.getProperty("password", String.class);
			Map data = this.authenticationService.login(userName, password);
			writeLoginLog(data);
			return toResult(data);
		} catch (Exception e) {
			return error(e);
		}
	}

	public String logout() throws Exception {
		return super.execute();
	}

	public String authenticationManageType() throws Exception {
		SDO sdo = getSDO();
		try {
			boolean flag = this.authenticationService.authenticationManageType(sdo);
			return toResult(Boolean.valueOf(flag));
		} catch (Exception e) {
			e.printStackTrace();
			LogHome.getLog(this).error(e);
			return error(e.getMessage());
		}
	}

	public String authenticationPersonalPassword() throws Exception {
		SDO sdo = getSDO();
		try {
			this.authenticationService.authenticationPersonalPassword(sdo);
			return toResult(null);
		} catch (Exception e) {
			e.printStackTrace();
			LogHome.getLog(this).error(e);
			return error(e.getMessage());
		}
	}

//	public String checkPersonalPasswordTimeLimit() throws Exception {
//		String flag = "ok";
//		Operator op = getOperator();
//		Long passwordTimeLimit = op.getPersonalPasswordTimeLimit();
//		if (passwordTimeLimit == null) {
//			flag = "no";
//		} else {
//			Long time = Long.valueOf(System.currentTimeMillis());
//			if (passwordTimeLimit.longValue() < time.longValue()) {
//				flag = "no";
//			} else {
//				Integer parameterTimeLimit = (Integer) Singleton.getParameter("personalPasswordTimeLimit",
//						Integer.class);
//				parameterTimeLimit = Integer.valueOf(parameterTimeLimit == null ? 5 : parameterTimeLimit.intValue());
//
//				time = Long.valueOf(time.longValue() + parameterTimeLimit.intValue() * 60 * 1000);
//				op.setPersonalPasswordTimeLimit(passwordTimeLimit);
//			}
//		}
//		return toResult(flag);
//	}
}
