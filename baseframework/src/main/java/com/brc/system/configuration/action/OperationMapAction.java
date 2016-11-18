 package com.brc.system.configuration.action;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.system.configuration.OperationMapService;
 import com.brc.util.SDO;
 import java.io.Serializable;
 import java.util.Map;
 
 public class OperationMapAction extends CommonAction
 {
   private static final long serialVersionUID = 1L;
   private OperationMapService operationMapService;
 
   public void setOperationMapService(OperationMapService operationMapService)
   {
     this.operationMapService = operationMapService;
   }
 
   protected String getPagePath() {
     return "/system/operationMap/";
   }
 
   public String forwardList()
   {
     return forward("OperationMapList");
   }
 
   public String slicedQuery()
   {
     SDO sdo = getSDO();
     try {
       Map map = this.operationMapService.slicedQuery(sdo);
       return toResult(map);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String showInsert()
   {
     return forward("OperationMapDetail");
   }
 
   public String save()
   {
     SDO sdo = getSDO();
     try {
       Serializable id = this.operationMapService.save(sdo);
       return success(id);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String showUpdate()
   {
     SDO sdo = getSDO();
     try {
       Map map = this.operationMapService.load(sdo);
       return forward("OperationMapDetail", map);
     } catch (Exception e) {
       return errorPage(e);
     }
   }
 
   public String delete()
   {
     SDO sdo = getSDO();
     try {
       this.operationMapService.delete(sdo);
     } catch (Exception e) {
       return error(e);
     }
     return success();
   }
 
   public String updateStatus()
   {
     SDO sdo = getSDO();
     Integer status = (Integer)sdo.getProperty("status", Integer.class);
     Long[] ids = sdo.getLongArray("ids");
     try {
       this.operationMapService.updateStatus(ids, status.intValue());
     } catch (Exception e) {
       return error(e);
     }
     return success();
   }
 
   public String updateSequence()
   {
     Map data = getSDO().getLongMap("data");
     try {
       this.operationMapService.updateSequence(data);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String updateFolderId()
   {
     SDO sdo = getSDO();
     Long folderId = (Long)sdo.getProperty("folderId", Long.class);
     Long[] ids = sdo.getLongArray("ids");
     try {
       this.operationMapService.updateFolderId(ids, folderId);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String showCharPage() {
     SDO sdo = getSDO();
     try {
       return forward("pilotageChart", sdo);
     } catch (Exception e) {
       return errorPage(e);
     }
   }
 
   public String previewChart() {
     SDO sdo = getSDO();
     try {
       return forward("previewChart", sdo);
     } catch (Exception e) {
       return errorPage(e);
     }
   }
 
   public String showAddButtonPage() {
     return forward("addCharButton");
   }
 
   public String loadChar() {
     SDO sdo = getSDO();
     try {
       String charStr = this.operationMapService.loadChar(sdo);
       return toResult(charStr);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String saveChar() {
     SDO sdo = getSDO();
     try {
       this.operationMapService.saveChar(sdo);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String savePicture()
   {
     Map param = (Map)getSession().get("AttachmentInfo");
     SDO sdo = new SDO(param);
     try {
       this.operationMapService.savePicture(sdo);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     } finally {
       getSession().remove("AttachmentInfo");
     }
     return toResult(param);
   }
 }

