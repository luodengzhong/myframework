 package com.brc.system.opm.action;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.system.opm.service.PermissionFieldService;
 import com.brc.util.SDO;
 import java.io.Serializable;
 import java.util.List;
 import java.util.Map;
 
 public class PermissionFieldAction extends CommonAction
 {
   private static final long serialVersionUID = 1L;
   private PermissionFieldService permissionFieldService;
 
   public void setPermissionFieldService(PermissionFieldService permissionFieldService)
   {
     this.permissionFieldService = permissionFieldService;
   }
 
   protected String getPagePath() {
     return "/system/opm/permissionField/";
   }
 
   public String forwardListPermissionfield()
   {
     return forward("FieldDefine");
   }
 
   public String slicedQueryPermissionfield()
   {
     SDO params = getSDO();
     try {
       Map map = this.permissionFieldService.slicedQueryPermissionfield(params);
       return toResult(map);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String showInsertPermissionfield()
   {
     putAttr("fieldAuthority", "readonly");
     return forward("FieldDefineDetail");
   }
 
   public String insertPermissionfield() {
     SDO params = getSDO();
     try {
       Serializable id = this.permissionFieldService.insertPermissionfield(params);
       return success(id);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String updatePermissionfield() {
     SDO params = getSDO();
     try {
       this.permissionFieldService.updatePermissionfield(params);
     } catch (Exception e) {
       return error(e);
     }
     return success();
   }
 
   public String showUpdatePermissionfield() {
     SDO params = getSDO();
     try {
       Map map = this.permissionFieldService.loadPermissionfield(params);
       return forward("FieldDefineDetail", map);
     } catch (Exception e) {
       return errorPage(e);
     }
   }
 
   public String deletePermissionfield()
   {
     SDO params = getSDO();
     try {
       Long[] ids = params.getLongArray("ids");
       this.permissionFieldService.deletePermissionfield(ids);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String updatePermissionfieldStatus()
   {
     SDO params = getSDO();
     try {
       Integer status = (Integer)params.getProperty("status", Integer.class);
       Long[] ids = params.getLongArray("ids");
       this.permissionFieldService.updatePermissionfieldStatus(ids, status.intValue());
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String updatePermissionfieldParentId()
   {
     SDO params = getSDO();
     try {
       Long parentId = (Long)params.getProperty("parentId", Long.class);
       Long[] ids = params.getLongArray("ids");
       this.permissionFieldService.updatePermissionfieldParentId(ids, parentId);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String showAddPermissionFieldDialog()
   {
     SDO params = getSDO();
     try {
       Long functionId = (Long)params.getProperty("functionId", Long.class);
       List list = this.permissionFieldService.queryFunctionFieldGroup(functionId);
 
       putAttr("functionId", functionId);
       putAttr("functionFieldGroup", list);
       return forward("addPermissionField");
     } catch (Exception e) {
       return errorPage(e);
     }
   }
 
   public String queryFunctionFieldGroup() {
     SDO params = getSDO();
     try {
       Long functionId = (Long)params.getProperty("functionId", Long.class);
       List list = this.permissionFieldService.queryFunctionFieldGroup(functionId);
       return toResult(list);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String insertFunctionFieldGroup() {
     SDO sdo = getSDO();
     try {
       Serializable id = this.permissionFieldService.insertFunctionFieldGroup(sdo);
       return success(id);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String updateFunctionFieldGroup()
   {
     SDO params = getSDO();
     try {
       this.permissionFieldService.updateFunctionFieldGroup(params);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String deleteFunctionFieldGroup() {
     SDO params = getSDO();
     try {
       this.permissionFieldService.deleteFunctionFieldGroup(params);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String slicedQueryFunctionPermissionfield() {
     SDO params = getSDO();
     try {
       Map map = this.permissionFieldService.slicedQueryFunctionPermissionfield(params);
       return toResult(map);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String saveFunctionPermissionfield() {
     SDO params = getSDO();
     try {
       this.permissionFieldService.saveFunctionPermissionfield(params);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String deleteFunctionPermissionfield() {
     SDO params = getSDO();
     try {
       Long[] ids = params.getLongArray("ids");
       this.permissionFieldService.deleteFunctionPermissionfield(ids);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 }

