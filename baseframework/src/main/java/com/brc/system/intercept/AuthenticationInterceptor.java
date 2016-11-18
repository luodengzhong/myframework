package com.brc.system.intercept;

import java.util.Date;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;

import com.brc.client.session.SessionCache;
import com.brc.exception.ApplicationException;
import com.brc.system.opm.LoginStatus;
import com.brc.system.opm.Operator;
import com.brc.system.opm.Person;
import com.brc.system.opm.service.AuthenticationService;
import com.brc.util.ClassHelper;
import com.brc.util.EncryptUrlPara;
import com.brc.util.LogHome;
import com.brc.util.Singleton;
import com.brc.util.SpringBeanFactory;
import com.brc.util.StringUtil;
import com.brc.util.ThreadLocalUtil;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;

import net.sf.json.JSONObject;

public class AuthenticationInterceptor extends AbstractInterceptor {
	private static final long serialVersionUID = 1L;

	public String intercept(ActionInvocation invocation) throws Exception {
		ActionContext ctx = invocation.getInvocationContext();
		HttpServletRequest request = ServletActionContext.getRequest();
		Map map = ctx.getSession();

		if (isAppJob(request)) {
			try {
				Operator op = getTokenOperator();
				map.put("sessionOperatorAttribute", op);
			} catch (Exception e) {
				JSONObject jo = new JSONObject();
				jo.put("status", "2");
				jo.put("message", e.getMessage());
				HttpServletResponse response = ServletActionContext.getResponse();
				response.setContentType("text/html; charset=UTF-8");
				response.setCharacterEncoding("utf-8");
				response.getWriter().write(jo.toString());
				response.getWriter().flush();
				response.getWriter().close();
				return "none";
			}
		}

		if (isRtxAuth(request))
			try {
				Operator op = getRtxAuthOperator();
				if (op == null) {
					throw new ApplicationException("null");
				}
				map.put("sessionOperatorAttribute", op);
			} catch (Exception e) {
				ctx.put("tip", "登陆错误，请重新登陆！");
				return "LoginPage";
			}
		else if (isOpen(request)) {
			try {
				Operator op = getEncryptUrlOperator();
				if (op == null) {
					throw new ApplicationException("null");
				}
				map.put("sessionOperatorAttribute", op);
			} catch (Exception e) {
				ctx.put("tip", "登陆错误，请重新登陆！");
				return "LoginPage";
			}
		}
		Operator operator = (Operator) map.get("sessionOperatorAttribute");

		getOperatorByCache(request);

		if (operator == null)
			operator = getOperatorByCache(request);
		boolean isAjax;
		if (null == operator) {
			isAjax = isAjaxRequest(request);
			if (isAjax) {
				JSONObject jo = new JSONObject();
				boolean isLoad = isLoad(request);
				if (isLoad) {
					ctx.put("tip", "登陆超时，请重新登陆！");
					return "ErrorPage";
				}
				jo.put("status", "2");
				jo.put("isAuth", "1");
				jo.put("message", "登陆超时，请重新登陆！");
				ctx.put("mes", jo.toString());
				return "BlankPage";
			}

			ctx.put("tip", "登陆超时，请重新登陆！");
			return "LoginPage";
		}

		map.put("sessionOperatorAttribute", operator);
		ThreadLocalUtil.addVariable("operator", operator);
		try {
			return invocation.invoke();
		} catch (Exception e) {
			LogHome.getLog(this).error(e.getMessage(), e);
			isAjax = isAjaxRequest(request);
			JSONObject jo;
			if (isAjax) {
				jo = new JSONObject();
				boolean isLoad = isLoad(request);
				String str;
				if (isLoad) {
					ctx.put("tip", e.getMessage());
					return "ErrorPage";
				}
				jo.put("status", "2");
				jo.put("message", e.getMessage());
				ctx.put("mes", jo.toString());
				return "BlankPage";
			}

			ctx.put("tip", e.getMessage());
			return "ErrorPage";
		} finally {
			ThreadLocalUtil.removeVariableMap();
		}
	}

	private boolean isAjaxRequest(HttpServletRequest request) {
		String header = request.getHeader("X-Requested-With");
		if ((header != null) && ("XMLHttpRequest".equals(header)))
			return true;

		return false;
	}

	private boolean isLoad(HttpServletRequest request) {
		String currentURL = request.getRequestURI();
		return currentURL.indexOf(".load") > 0;
	}

	private boolean isAppJob(HttpServletRequest request) {
		String currentURL = request.getRequestURI();
		boolean flag = currentURL.indexOf(".appJob") > 0;
		if (!flag) {
			flag = currentURL.indexOf(".webApp") > 0;
		}
		if (!flag) {
			String convertForPhone = request.getParameter("convertForPhone");
			if ((convertForPhone != null) && (convertForPhone.equals("true"))) {
				String token = request.getParameter("token");
				if (!StringUtil.isBlank(token)) {
					flag = true;
				}
			}
		}
		return flag;
	}

	private boolean isOpen(HttpServletRequest request) {
		String isClientViewSecurity = request.getParameter("clientViewSecurity");
		String isRtx = (String) ClassHelper.convert(request.getParameter("RtxAuth"), String.class, "false");

		if (isRtx.equals("true")) {
			return false;
		}
		if (isRtx.equals("false")) {
			return false;
		}
		if (StringUtil.isBlank(isClientViewSecurity)) {
			return false;
		}
		if (isClientViewSecurity.equals("true")) {
			String referer = request.getHeader("REFERER");
			if (StringUtil.isBlank(referer)) {
				return false;
			}

			String serverUrl = (String) Singleton.getParameter("SYS.SERVER.URL", String.class);
			if (referer.startsWith(serverUrl)) {
				return true;
			}
		}
		return false;
	}

	private boolean isRtxAuth(HttpServletRequest request) {
		String isRtx = (String) ClassHelper.convert(request.getParameter("isRtxAuth"), String.class, "false");
		if (isRtx.equals("true")) {
			return true;
		}
		return false;
	}

	private Operator getEncryptUrlOperator() {
		String loginName = ServletActionContext.getRequest().getParameter("loginName");
		if (StringUtil.isBlank(loginName))
			return null;
		try {
			loginName = StringUtil.asciiToString(loginName);

			loginName = EncryptUrlPara.decrypt("encrypturlparakeyxx", loginName);
			return getOperatorOrgInfo(loginName);
		} catch (Exception e) {
		}
		return null;
	}

	private Operator getRtxAuthOperator() {
		String user = ServletActionContext.getRequest().getParameter("username");
		String sign = ServletActionContext.getRequest().getParameter("sign");
		if ((StringUtil.isBlank(user)) || (StringUtil.isBlank(sign))) {
			return null;
		}
		try {
			return getOperatorOrgInfo(user);
		} catch (Exception e) {
			return null;
		}
	}

	private Operator getOperatorOrgInfo(String loginName) {
		AuthenticationService authenticationService = (AuthenticationService) SpringBeanFactory.getBean(
				ServletActionContext.getRequest().getSession().getServletContext(), "authenticationService",
				AuthenticationService.class);

		if (null == authenticationService) {
			return null;
		}
		try {
			Map data = authenticationService.ssoLogin(loginName);
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
				Person person = new Person(id, name, code, loginName, mainOrgId, mainOrgFullId, mainOrgFullName,
						mainOrgFullCode);
				Operator operator = new Operator(person, new Date());
				operator.setIp("");
				authenticationService.setOperatorOrgInfo(operator, mainOrgId);
				return operator;
			}
		} catch (Exception e) {
			return null;
		}
		return null;
	}

	private Operator getTokenOperator() {
		/*
		 * 340 TokenManager tm =
		 * (TokenManager)SpringBeanFactory.getBean(ServletActionContext.
		 * getServletContext(), "tokenManager", TokenManager.class); 341 String
		 * token = ServletActionContext.getRequest().getParameter("token"); 342
		 * if (StringUtil.isBlank(token)) { 343 throw new ApplicationException(
		 * "token 不存在。"); }
		 * 
		 * 347 Operator op = null; 348 if (tm.isTokenFromWeb(token)) { 349 op =
		 * (Operator)tm.getCache(token); } 351 if (null == op) { 352 throw new
		 * ApplicationException("用户信息不存在。"); } 354 return op;
		 */
		return null;
	}

	private Operator getOperatorByCache(HttpServletRequest request) {
		SessionCache sc = (SessionCache) SpringBeanFactory.getBean(ServletActionContext.getServletContext(),
				"sessionCache", SessionCache.class);
		Cookie[] cookies = request.getCookies();
		if (cookies == null) {
			return null;
		}

		String brcUserInfo = null;
		for (Cookie cookie : cookies) {
			if (cookie.getName().equals("brc_user_info")) {
				brcUserInfo = cookie.getValue();
				break;
			}
		}
		if (StringUtil.isBlank(brcUserInfo)) {
			return null;
		}
		return sc.getOperator(brcUserInfo);
	}
}
