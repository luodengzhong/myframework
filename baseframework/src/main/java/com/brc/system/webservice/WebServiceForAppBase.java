 package com.brc.system.webservice;
 
 import com.brc.exception.ApplicationException;
 import com.brc.system.opm.Operator;
 import com.brc.system.token.service.impl.TokenManager;
 import com.brc.util.SDO;
 import com.brc.util.StringUtil;
 import com.brc.util.ThreadLocalUtil;
 
 public class WebServiceForAppBase extends WebServiceBase
 {
   protected TokenManager tokenManager;
 
   public void setTokenManager(TokenManager tokenManager)
   {
     this.tokenManager = tokenManager;
   }
 
   protected SDO getSDO(String params) {
     SDO sdo = new SDO(params);
     String token = (String)sdo.getProperty("token", String.class);
     if (StringUtil.isBlank(token)) {
       throw new ApplicationException("缺少token参数。");
     }
     Operator operator = (Operator)this.tokenManager.getCache(token);
     if (operator == null) {
       throw new ApplicationException("无效的token。");
     }
 
     sdo.setOperator(operator);
     ThreadLocalUtil.addVariable("operator", operator);
 
     return sdo;
   }
 }

