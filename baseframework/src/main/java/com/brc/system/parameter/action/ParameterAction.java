 package com.brc.system.parameter.action;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.system.parameter.service.ParameterService;
 import com.brc.util.SDO;
 import java.io.Serializable;
 import java.util.List;
 import java.util.Map;
 
 public class ParameterAction extends CommonAction
 {
   private static final long serialVersionUID = 1L;
   private ParameterService parameterService;
 
   public void setParameterService(ParameterService parameterService)
   {
     this.parameterService = parameterService;
   }
 
   protected String getPagePath() {
     return "/system/parameter/";
   }
 
   public String forwardListParameter()
   {
     return forward("ParameterList");
   }
 
   public String slicedQueryParameter()
   {
     SDO params = getSDO();
     try {
       Map map = this.parameterService.slicedQueryParameter(params);
       return toResult(map);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String showInsertParameter()
   {
     return forward("ParameterDetal");
   }
 
   public String insertParameter()
   {
     SDO params = getSDO();
     try {
       Serializable id = this.parameterService.insertParameter(params);
       return success(id);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String updateParameter()
   {
     SDO params = getSDO();
     try {
       this.parameterService.updateParameter(params);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String showUpdateParameter()
   {
     SDO params = getSDO();
     try {
       Map map = this.parameterService.loadParameter(params);
       return forward("ParameterDetal", map);
     } catch (Exception e) {
       return errorPage(e);
     }
   }
 
   public String deleteParameter()
   {
     SDO params = getSDO();
     try {
       Long[] ids = params.getLongArray("ids");
       this.parameterService.deleteParameter(ids);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String moveParameter()
   {
     SDO params = getSDO();
     try {
       Long parentId = (Long)params.getProperty("parentId", Long.class);
       Long[] ids = params.getLongArray("ids");
       this.parameterService.updateParameterParentId(ids, parentId);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String forwardListSerialNumber()
   {
     return forward("SerialNumberList");
   }
 
   public String slicedQuerySerialNumber()
   {
     SDO params = getSDO();
     try {
       Map map = this.parameterService.slicedQuerySerialNumber(params);
       return toResult(map);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String showInsertSerialNumber()
   {
     return forward("SerialNumberDetal");
   }
 
   public String insertSerialNumber()
   {
     SDO params = getSDO();
     try {
       Serializable id = this.parameterService.insertSerialNumber(params);
       return success(id);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String updateSerialNumber()
   {
     SDO params = getSDO();
     try {
       this.parameterService.updateSerialNumber(params);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String showUpdateSerialNumber()
   {
     SDO params = getSDO();
     try {
       Map map = this.parameterService.loadSerialNumber(params);
       return forward("SerialNumberDetal", map);
     } catch (Exception e) {
       return errorPage(e);
     }
   }
 
   public String deleteSerialNumber()
   {
     SDO params = getSDO();
     try {
       Long[] ids = params.getLongArray("ids");
       this.parameterService.deleteSerialNumber(ids);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String moveSerialNumber()
   {
     SDO params = getSDO();
     try {
       Long parentId = (Long)params.getProperty("parentId", Long.class);
       Long[] ids = params.getLongArray("ids");
 
       this.parameterService.updateSerialNumberParentId(ids, parentId);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String syncCacheParameter() {
     try {
       this.parameterService.syncCacheParameter();
       return success("同步缓存已完成。", "");
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String forwardListMessageKind()
   {
     return forward("MessageKind");
   }
 
   public String saveMessageKind()
   {
     SDO params = getSDO();
     try {
       Long id = this.parameterService.saveMessageKind(params);
       return success(id);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String deleteMessageKind()
   {
     SDO params = getSDO();
     try {
       this.parameterService.deleteMessageKind(params);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String slicedQueryMessageKind()
   {
     SDO params = getSDO();
     try {
       Map map = this.parameterService.slicedQueryMessageKind(params);
       return toResult(map);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String showInsertMessageKind()
   {
     return forward("MessageKindDetal");
   }
 
   public String showUpdateMessageKind()
   {
     SDO params = getSDO();
     try {
       Map map = this.parameterService.loadMessageKind(params);
       return forward("MessageKindDetal", map);
     } catch (Exception e) {
       return errorPage(e);
     }
   }
 
   public String updateMessageKindStatus()
   {
     SDO params = getSDO();
     try {
       this.parameterService.updateMessageKindStatus(params);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String queryUserMessageKind()
   {
     SDO params = getSDO();
     try {
       List list = this.parameterService.queryUserMessageKind(params);
       return toResult(list);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String saveUserMessageKind()
   {
     SDO params = getSDO();
     try {
       this.parameterService.saveUserMessageKind(params);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 }

