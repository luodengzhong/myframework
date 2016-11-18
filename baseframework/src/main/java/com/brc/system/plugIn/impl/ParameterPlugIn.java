 package com.brc.system.plugIn.impl;
 
 import com.brc.exception.ApplicationException;
 import com.brc.system.parameter.service.ParameterService;
 import com.brc.system.plugIn.StartPlugIn;
 import com.brc.util.LogHome;
 import org.apache.log4j.Logger;
 
 public class ParameterPlugIn
   implements StartPlugIn
 {
   private ParameterService parameterService;
 
   public void setParameterService(ParameterService parameterService)
   {
     this.parameterService = parameterService;
   }
 
   public void init() throws ApplicationException {
     LogHome.getLog(this).info("开始加载系统参数;");
     this.parameterService.syncCacheParameter();
     LogHome.getLog(this).info("系统参数加载完成;");
   }
 }

