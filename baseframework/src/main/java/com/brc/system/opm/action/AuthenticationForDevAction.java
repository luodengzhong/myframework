 package com.brc.system.opm.action;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.client.session.SessionCache;
 import com.brc.system.log.service.SysLogService;
 import com.brc.system.opm.LoginStatus;
 import com.brc.system.opm.Operator;
 import com.brc.system.opm.Person;
 import com.brc.system.opm.service.AuthenticationForDevService;
 import com.brc.util.ClassHelper;
 import com.brc.util.SDO;
 import com.brc.util.SpringBeanFactory;
 import java.util.Date;
 import java.util.Map;
 import javax.servlet.http.Cookie;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import javax.servlet.http.HttpSession;
 
 public class AuthenticationForDevAction extends CommonAction
 {
   private static final long serialVersionUID = 4045252266291424496L;
   private AuthenticationForDevService authenticationService;
   private SysLogService sysLogService;
 
   public void setAuthenticationService(AuthenticationForDevService authenticationService)
   {
     this.authenticationService = authenticationService;
   }
 
   public void setSysLogService(SysLogService sysLogService) {
     this.sysLogService = sysLogService;
   }
 
   public String login() {
     try {
       SDO params = getSDO();
       String userName = (String)params.getProperty("userName", String.class);
       String password = (String)params.getProperty("password", String.class);
       Map data = this.authenticationService.login(userName, password);
       writeLoginLog(data);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   private void writeLoginLog(Map<String, Object> data) {
     LoginStatus loginStatus = LoginStatus.fromNumber(((Integer)ClassHelper.convert(data.get("status"), Integer.class)).intValue());
     if (loginStatus == LoginStatus.SUCCESS)
     {
       Map personData = (Map)data.get("data");
       String id = (String)ClassHelper.convert(personData.get("personId"), String.class);
       String code = (String)ClassHelper.convert(personData.get("personCode"), String.class);
       String name = (String)ClassHelper.convert(personData.get("personName"), String.class);
       String mainOrgId = (String)ClassHelper.convert(personData.get("orgId"), String.class);
       String mainOrgFullId = (String)ClassHelper.convert(personData.get("fullId"), String.class);
       String mainOrgFullName = (String)ClassHelper.convert(personData.get("fullName"), String.class);
       String mainOrgFullCode = (String)ClassHelper.convert(personData.get("fullCode"), String.class);
       String loginName = (String)ClassHelper.convert(personData.get("loginName"), String.class);
 
       Person person = new Person(id, name, code, loginName, mainOrgId, mainOrgFullId, mainOrgFullName, mainOrgFullCode);
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
             break;
           }
         }
       }
       if (userInfoCookie == null) {
         userInfoCookie = new Cookie("brc_user_info", request.getSession().getId());
       }
       getResponse().addCookie(userInfoCookie);
       SessionCache sessionCache = (SessionCache)SpringBeanFactory.getBean(getRequest().getSession().getServletContext(), "sessionCache");
       sessionCache.setOperator(userInfoCookie.getValue(), operator);
 
       this.sysLogService.doInsertLoginLog(operator);
     }
   }
 }

