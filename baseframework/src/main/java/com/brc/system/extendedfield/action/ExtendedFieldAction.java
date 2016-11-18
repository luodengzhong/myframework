 package com.brc.system.extendedfield.action;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.system.extendedfield.service.ExtendedFieldService;
 import com.brc.util.SDO;
 import java.io.Serializable;
 import java.util.List;
 import java.util.Map;
 
 public class ExtendedFieldAction extends CommonAction
 {
   private static final long serialVersionUID = 1L;
   private ExtendedFieldService extendedFieldService;
 
   public void setExtendedFieldService(ExtendedFieldService extendedFieldService)
   {
     this.extendedFieldService = extendedFieldService;
   }
 
   protected String getPagePath() {
     return "/system/extendedfield/";
   }
 
   public String slicedQueryExtendedField()
   {
     SDO sdo = getSDO();
     try {
       Map map = this.extendedFieldService.slicedQueryExtendedField(sdo);
       return toResult(map);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
   }
 
   public String insertExtendedField()
   {
     SDO sdo = getSDO();
     try {
       this.extendedFieldService.insertExtendedFields(sdo);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
     return success();
   }
 
   public String updateExtendedFieldSequence()
   {
     Map data = getSDO().getLongMap("data");
     try {
       this.extendedFieldService.updateExtendedFieldSequence(data);
       return success();
     } catch (Exception e) {
       return error(e.getMessage());
     }
   }
 
   public String deleteExtendedField()
   {
     SDO sdo = getSDO();
     Long[] ids = sdo.getLongArray("ids");
     Long groupId = (Long)sdo.getProperty("groupId", Long.class);
     try {
       this.extendedFieldService.deleteExtendedField(groupId, ids);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
     return success();
   }
 
   public String executeExtendedFieldDefine()
   {
     return forward("extendedFieldDefineList");
   }
 
   public String slicedQueryExtendedFieldDefine()
   {
     SDO sdo = getSDO();
     try {
       Map map = this.extendedFieldService.slicedQueryExtendedFieldDefine(sdo);
       return toResult(map);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
   }
 
   public String appendExtendedFieldDefine()
   {
     return forward("extendedFieldDefineEdit");
   }
 
   public String insertExtendedFieldDefine()
   {
     SDO sdo = getSDO();
     try {
       Serializable id = this.extendedFieldService.insertExtendedFieldDefine(sdo);
       return success(id);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
   }
 
   public String updateExtendedFieldDefine()
   {
     SDO sdo = getSDO();
     try {
       this.extendedFieldService.updateExtendedFieldDefine(sdo);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
     return success();
   }
 
   public String loadExtendedFieldDefine()
   {
     SDO sdo = getSDO();
     try {
       Map map = this.extendedFieldService.loadExtendedFieldDefine(sdo);
       return forward("extendedFieldDefineEdit", map);
     } catch (Exception e) {
       e.printStackTrace();
       return errorPage(e.getMessage());
     }
   }
 
   public String deleteExtendedFieldDefine()
   {
     SDO sdo = getSDO();
     Long[] ids = sdo.getLongArray("ids");
     try {
       this.extendedFieldService.deleteExtendedFieldDefine(ids);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
     return success();
   }
 
   public String moveExtendedFieldDefine()
   {
     SDO sdo = getSDO();
     Long parentId = (Long)sdo.getProperty("parentId", Long.class);
     Long[] ids = sdo.getLongArray("ids");
     try {
       this.extendedFieldService.updateExtendedFieldDefineParentId(ids, parentId);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
     return success();
   }
 
   public String executeExtendedFieldGroup()
   {
     return forward("extendedFieldGroupList");
   }
 
   public String slicedQueryExtendedFieldGroup()
   {
     SDO sdo = getSDO();
     try {
       Map map = this.extendedFieldService.slicedQueryExtendedFieldGroup(sdo);
       return toResult(map);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
   }
 
   public String appendExtendedFieldGroup()
   {
     return forward("extendedFieldGroupEdit");
   }
 
   public String insertExtendedFieldGroup()
   {
     SDO sdo = getSDO();
     try {
       Serializable id = this.extendedFieldService.insertExtendedFieldGroup(sdo);
       return success(id);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
   }
 
   public String updateExtendedFieldGroup()
   {
     SDO sdo = getSDO();
     try {
       this.extendedFieldService.updateExtendedFieldGroup(sdo);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
     return success();
   }
 
   public String loadExtendedFieldGroup()
   {
     SDO sdo = getSDO();
     try {
       Map map = this.extendedFieldService.loadExtendedFieldGroup(sdo);
       return forward("extendedFieldGroupEdit", map);
     } catch (Exception e) {
       e.printStackTrace();
       return errorPage(e.getMessage());
     }
   }
 
   public String deleteExtendedFieldGroup()
   {
     SDO sdo = getSDO();
     Long[] ids = sdo.getLongArray("ids");
     try {
       this.extendedFieldService.deleteExtendedFieldGroup(ids);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
     return success();
   }
 
   public String moveExtendedFieldGroup()
   {
     SDO sdo = getSDO();
     Long parentId = (Long)sdo.getProperty("parentId", Long.class);
     Long[] ids = sdo.getLongArray("ids");
     try {
       this.extendedFieldService.updateExtendedFieldGroupParentId(ids, parentId);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
     return success();
   }
 
   public String updateExtendedFieldGroupSequence()
   {
     Map data = getSDO().getLongMap("data");
     try {
       this.extendedFieldService.updateExtendedFieldGroupSequence(data);
       return success();
     } catch (Exception e) {
       return error(e.getMessage());
     }
   }
 
   public String queryExtendedFieldStorage()
   {
     SDO sdo = getSDO();
     String businessCode = (String)sdo.getProperty("businessCode", String.class);
     Long bizId = (Long)sdo.getProperty("bizId", Long.class);
     try {
       List list = this.extendedFieldService.queryExtendedFieldForView(businessCode, bizId);
       return toResult(list);
     } catch (Exception e) {
       return error(e.getMessage());
     }
   }
 }

