 package com.brc.system.log.action;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.system.log.service.SysLogService;
 import com.brc.util.LogHome;
 import com.brc.util.SDO;
 import java.util.Map;
 import org.apache.log4j.Logger;
 
 public class SysLogAction extends CommonAction
 {
   private static final long serialVersionUID = 1L;
   private SysLogService sysLogService;
 
   public void setSysLogService(SysLogService sysLogService)
   {
     this.sysLogService = sysLogService;
   }
 
   protected String getPagePath() {
     return "/system/log/";
   }
 
   public String forwardLoginList()
   {
     return forward("LoginLogList");
   }
 
   public String forwardErrorList()
   {
     return forward("ErrorLogList");
   }
 
   public String forwardOperationList()
   {
     return forward("OperationLogList");
   }
 
   public String slicedQuery()
   {
     SDO sdo = getSDO();
     try {
       Map map = this.sysLogService.slicedQuery(sdo);
       return toResult(map);
     } catch (Exception e) {
       e.printStackTrace();
       LogHome.getLog(this).error(e);
       return error(e.getMessage());
     }
   }
 
   public String showUpdate()
   {
     SDO sdo = getSDO();
     try {
       Map map = this.sysLogService.load(sdo);
       return forward("LogDetail", map);
     } catch (Exception e) {
       e.printStackTrace();
       LogHome.getLog(this).error(e);
       return errorPage(e.getMessage());
     }
   }
 
   public String delete()
   {
     SDO sdo = getSDO();
     try {
       this.sysLogService.delete(sdo);
     } catch (Exception e) {
       e.printStackTrace();
       LogHome.getLog(this).error(e);
       return error(e.getMessage());
     }
     return success();
   }
 }

