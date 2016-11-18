 package com.brc.system.plugIn.impl;
 
 import com.brc.exception.ApplicationException;
 import com.brc.system.dictionary.service.SysDictionaryService;
 import com.brc.system.plugIn.StartPlugIn;
 import com.brc.util.LogHome;
 import org.apache.log4j.Logger;
 
 public class SysDictionaryPlugIn
   implements StartPlugIn
 {
   private SysDictionaryService sysDictionaryService;
 
   public void setSysDictionaryService(SysDictionaryService sysDictionaryService)
   {
     this.sysDictionaryService = sysDictionaryService;
   }
 
   public void init() throws ApplicationException {
     LogHome.getLog(this).info("开始加载系统字典;");
     this.sysDictionaryService.syncCache();
     LogHome.getLog(this).info("系统字典加载完成;");
   }
 }

