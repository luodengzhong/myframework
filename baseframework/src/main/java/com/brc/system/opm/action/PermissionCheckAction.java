 package com.brc.system.opm.action;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.system.opm.service.PermissionCheckService;
 import com.brc.util.SDO;
 import java.util.List;
 import java.util.Map;
 
 public class PermissionCheckAction extends CommonAction
 {
   private static final long serialVersionUID = 1L;
   private PermissionCheckService permissionCheckService;
 
   public void setPermissionCheckService(PermissionCheckService permissionCheckService)
   {
     this.permissionCheckService = permissionCheckService;
   }
 
   protected String getPagePath() {
     return "system/opm/permission/";
   }
 
   public String forwardList() {
     return forward("PermissionCheckList");
   }
 
   public String forwardPermissionCheckApply() {
     Map map = getDefaultExprValues("config/domain/com/brc/system/opm/permission.xml", "permissionCheck");
     map.put("processDefinitionKey", "permissionCheckProc");
     map.put("procUnitId", "Apply");
     return forward("PermissionCheckBill", map);
   }
 
   public String showUpdate() {
     SDO sdo = getSDO();
     try {
       Long id = (Long)sdo.getProperty("bizId", Long.class);
       Map map = this.permissionCheckService.load(id);
       return forward("PermissionCheckBill", map);
     } catch (Exception e) {
       return errorPage(e);
     }
   }
 
   public String slicedQuery() {
     SDO sdo = getSDO();
     try {
       Map map = this.permissionCheckService.slicedQuery(sdo);
       return toResult(map);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String queryHandler() {
     SDO sdo = getSDO();
     try {
       Long id = (Long)sdo.getProperty("id", Long.class);
       List data = this.permissionCheckService.queryHandler(id);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 }

