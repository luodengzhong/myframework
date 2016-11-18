 package com.brc.system.opm.action;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.system.opm.service.FunctionService;
 import com.brc.util.SDO;
 import java.util.HashMap;
 import java.util.Map;
 
 public class FunctionAction extends CommonAction
 {
   private static final long serialVersionUID = 1L;
   private static final String BASE_FUNCTION_TYPE_PAGE = "BaseFunctionType";
   private static final String BASE_FUNCTION_TYPE_DETAIL_PAGE = "BaseFunctionTypeDetail";
   private static final String BIZ_FUNCTION_PAGE = "BizFunction";
   private FunctionService functionService;
 
   public void setFunctionService(FunctionService functionService)
   {
     this.functionService = functionService;
   }
 
   protected String getPagePath()
   {
     return "/system/opm/function/";
   }
 
   public String forwardBaseFunctionType() {
     return forward("BaseFunctionType");
   }
 
   public String showInsertBaseFunctionnType() {
     SDO params = getSDO();
 
     Long sequence = this.functionService.getBaseFunctionTypeNextSequence();
     params.putProperty("sequence", sequence);
 
     return forward("BaseFunctionTypeDetail", params);
   }
 
   public String showUpdateBaseFunctionType() {
     SDO params = getSDO();
     try {
       Long id = (Long)params.getProperty("id", Long.class);
       Map obj = this.functionService.loadBaseFunctionType(id);
       return forward("BaseFunctionTypeDetail", obj);
     } catch (Exception e) {
       return errorPage(e);
     }
   }
 
   public String insertBaseFunctionType() {
     SDO params = getSDO();
     try {
       Long id = this.functionService.insertBaseFunctionType(params);
       Map result = new HashMap(1);
       result.put("id", id);
       return success(result);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String updateBaseFunctionType() {
     SDO params = getSDO();
     try {
       this.functionService.updateBaseFunctionType(params);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String deleteBaseFunctionType() {
     SDO params = getSDO();
     try {
       Long[] ids = params.getLongArray("ids");
       this.functionService.deleteBaseFunctionType(ids);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String updateBaseFunctionTypeFolderId() {
     SDO params = getSDO();
     try {
       Long folderId = (Long)params.getProperty("folderId", Long.class);
       Long[] ids = params.getLongArray("ids");
       this.functionService.updateBaseFunctionTypeFolderId(ids, folderId);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String updateBaseFunctionTypeSequence() {
     SDO params = getSDO();
     try {
       Map baseFunctionTypes = params.getLongMap("data");
       this.functionService.updateBaseFunctionTypeSequence(baseFunctionTypes);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String slicedQueryBaseFunctionTypes() {
     SDO params = getSDO();
     try {
       Map data = this.functionService.slicedQueryBaseFunctionTypes(params);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String forwardBizFunction() {
     return forward("BizFunction");
   }
 
   public String saveBizFunction() {
     SDO sdo = getSDO();
     try {
       this.functionService.saveBizFunction(sdo);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String deleteBizFunction() {
     try {
       Long[] ids = getSDO().getLongArray("ids");
       this.functionService.deleteBizFunction(ids);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String slicedQueryBizFunctions() {
     SDO sdo = getSDO();
     try {
       Map data = this.functionService.slicedQueryBizFunctions(sdo);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String saveBizFunctionOwnBase() {
     SDO sdo = getSDO();
     try {
       Long bizFunctionId = (Long)sdo.getProperty("bizFunctionId", Long.class);
       Long[] baseFunctionTypeIds = getSDO().getLongArray("baseFunctionTypeIds");
 
       this.functionService.saveBizFunctionOwnBase(bizFunctionId, baseFunctionTypeIds);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String deleteBizFunctionOwnBase() {
     try {
       Long[] ids = getSDO().getLongArray("ids");
       this.functionService.deleteBizFunctionOwnBase(ids);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String slicedQueryBizFunctionOwnBases() {
     SDO sdo = getSDO();
     try {
       Map data = this.functionService.slicedQueryBizFunctionOwnBases(sdo);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 }

