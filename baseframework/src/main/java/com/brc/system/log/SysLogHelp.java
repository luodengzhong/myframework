 package com.brc.system.log;
 
 import com.brc.system.log.service.SysLogService;
 import com.brc.system.opm.Operator;
 import com.brc.util.ClassHelper;
 import com.brc.util.ThreadLocalUtil;
 import java.util.List;
 import java.util.regex.Matcher;
 import java.util.regex.Pattern;
 import org.aspectj.lang.JoinPoint;
 import org.aspectj.lang.Signature;
 
 public class SysLogHelp
 {
   private SysLogService sysLogService;
   private List<String> excludes;
 
   public void setSysLogService(SysLogService sysLogService)
   {
     this.sysLogService = sysLogService;
   }
 
   public void setExcludes(List<String> excludes) {
     this.excludes = excludes;
   }
 
   private boolean isLogged(String methodName)
   {
     if ((this.excludes == null) || (this.excludes.size() == 0)) {
       return true;
     }
 
     Pattern p = null;
     Matcher m = null;
     for (String exclude : this.excludes) {
       p = Pattern.compile(exclude, 2);
       m = p.matcher(methodName);
       boolean result = m.find();
       if (result) {
         return false;
       }
     }
     return true;
   }
 
   public void doThrowing(JoinPoint jp, Throwable ex)
   {
     String className = jp.getTarget().getClass().getName();
     String methodName = jp.getSignature().getName();
 
     if (ClassHelper.isInterface(jp.getTarget().getClass(), SysLogService.class)) {
       return;
     }
 
     if (!isLogged(className + "." + methodName)) {
       return;
     }
     Object[] params = jp.getArgs();
     StringBuffer paramToString = new StringBuffer();
     if (params != null) {
       for (Object obj : params) {
         if (obj != null)
           paramToString.append(obj.toString()).append("\r\n");
         else {
           paramToString.append("null").append("\r\n");
         }
       }
     }
     StringBuffer errorMessage = new StringBuffer();
     errorMessage.append(ex.getMessage()).append("\r\n");
     StackTraceElement[] messages = ex.getStackTrace();
     for (StackTraceElement message : messages) {
       errorMessage.append(message.toString()).append("\r\n");
     }
     Operator operator = (Operator)ThreadLocalUtil.getVariable("operator", Operator.class);
     this.sysLogService.doInsertErrorLog(operator, className, methodName, paramToString.toString(), errorMessage.toString());
   }
 }

