 package com.brc.system.opm.action;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.system.opm.service.ManagementService;
 import com.brc.util.SDO;
 import java.util.HashMap;
 import java.util.Map;
 
 public class ManagementAction extends CommonAction
 {
   private static final long serialVersionUID = 1L;
   private static final String BASE_MANAGEMENT_TYPE_PAGE = "BaseManagementType";
   private static final String BASE_MANAGEMENT_TYPE_DETAIL_PAGE = "BaseManagementTypeDetail";
   private static final String BIZ_MANAGEMENT_TYPE_PAGE = "BizManagementType";
   private static final String BIZ_MANAGEMENT_TYPE_DETAIL_PAGE = "BizManagementTypeDetail";
   private static final String BIZ_MANAGEMENT_PAGE = "BizManagement";
   private static final String DELEGATION_BIZ_MANAGEMENT_PAGE = "DelegationBizManagement";
   private static final String SELECT_BIZ_MANAGEMENT_TYPE_DIALOG = "SelectBizManagementType";
   private static final String BIZ_MANAGEMENT_QUERY_PAGE = "BizManagementQuery";
   private ManagementService managementService;
 
   public void setManagementService(ManagementService managementService)
   {
     this.managementService = managementService;
   }
 
   protected String getPagePath()
   {
     return "/system/opm/management/";
   }
 
   public String forwardBaseManagementType() {
     return forward("BaseManagementType");
   }
 
   public String showBaseManagementTypeDetail() {
     SDO params = getSDO();
 
     Long sequence = this.managementService.getBaseManagementTypeNextSequence();
     params.putProperty("sequence", sequence);
 
     return forward("BaseManagementTypeDetail", params);
   }
 
   public String loadBaseManagementType() {
     SDO params = getSDO();
     try
     {
       Long id = (Long)params.getProperty("id", Long.class);
       Map obj = this.managementService.loadBaseManagementType(id);
       return forward("BaseManagementTypeDetail", obj);
     } catch (Exception e) {
       return errorPage(e);
     }
   }
 
   public String insertBaseManagementType() {
     SDO params = getSDO();
     try {
       Long id = this.managementService.insertBaseManagementType(params);
       Map result = new HashMap(1);
       result.put("id", id);
       return success(result);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String updateBaseManagementType() {
     SDO params = getSDO();
     try {
       this.managementService.updateBaseManagementType(params);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String deleteBaseManagementType() {
     SDO params = getSDO();
     try {
       Long[] ids = params.getLongArray("ids");
       this.managementService.deleteBaseManagementType(ids);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String updateBaseManagementTypeFolderId() {
     SDO params = getSDO();
     try {
       Long folderId = (Long)params.getProperty("folderId", Long.class);
       Long[] ids = params.getLongArray("ids");
       this.managementService.updateBaseManagementTypeFolderId(ids, folderId);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String updateBaseManagementTypeSequence() {
     SDO params = getSDO();
     try {
       Map baseManagementTypes = params.getLongMap("data");
       this.managementService.updateBaseManagementTypeSequence(baseManagementTypes);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String slicedQueryBaseManagementTypes() {
     SDO params = getSDO();
     try {
       Map data = this.managementService.slicedQueryBaseManagements(params);
       return toResult(data);
     } catch (Exception e) {
       return error(e.getMessage());
     }
   }
 
   public String forwardBizManagementType() {
     return forward("BizManagementType");
   }
 
   public String showBizManagementTypeDetail() {
     SDO params = getSDO();
     Long parentId = (Long)params.getProperty("parentId", Long.class);
     Long sequence = this.managementService.getBizManagementTypeNextSequence(parentId);
     params.putProperty("sequence", sequence);
     params.putProperty("version", Integer.valueOf(1));
 
     return forward("BizManagementTypeDetail", params);
   }
 
   public String showSelectBizManagementTypeDialog() {
     return forward("SelectBizManagementType", getSDO().getProperties());
   }
 
   public String loadBizManagementType() {
     SDO params = getSDO();
     try {
       Long id = (Long)params.getProperty("id", Long.class);
       Map data = this.managementService.loadBizManagementType(id);
       return forward("BizManagementTypeDetail", data);
     } catch (Exception e) {
       return errorPage(e);
     }
   }
 
   public String insertBizManagementType() {
     SDO params = getSDO();
     try {
       Long id = this.managementService.insertBizManagementType(params);
       Map result = new HashMap(1);
       result.put("id", id);
       return success(result);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String updateBizManagementType() {
     SDO params = getSDO();
     try {
       this.managementService.updateBizManagementType(params);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String deleteBizManagementType() {
     SDO params = getSDO();
     try {
       Long[] ids = params.getLongArray("ids");
       this.managementService.deleteBizManagementType(ids);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String updateBizManagementTypeSequence() {
     SDO params = getSDO();
     try {
       Map bizManagementTypes = params.getLongMap("data");
       this.managementService.updateBizManagementTypeSequence(bizManagementTypes);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String moveBizManagementType() {
     SDO params = getSDO();
     try {
       Long parentId = (Long)params.getProperty("parentId", Long.class);
       Long[] ids = params.getLongArray("ids");
       this.managementService.moveBizManagementType(ids, parentId);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String queryBizManagementTypes() {
     SDO params = getSDO();
     try {
       Map data = this.managementService.queryBizManagementTypes(params);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String slicedQueryBizManagementTypes() {
     SDO params = getSDO();
     try {
       Map data = this.managementService.slicedQueryBizManagementTypes(params);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String forwardBizManagement() {
     return forward("BizManagement");
   }
 
   public String forwardDelegationBizManagement() {
     return forward("DelegationBizManagement");
   }
 
   public String forwardBizManagementQuery() {
     return forward("BizManagementQuery");
   }
 
   public String insertBizManagementByOrg() {
     SDO params = getSDO();
     try {
       Long manageTypeId = (Long)params.getProperty("manageTypeId", Long.class);
       String manageOrgId = (String)params.getProperty("manageOrgId", String.class);
       String[] orgIds = params.getStringArray("orgIds");
 
       this.managementService.insertBizManagementByOrg(manageTypeId, orgIds, manageOrgId);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String allocateManagers() {
     SDO params = getSDO();
     try {
       String subordinationId = (String)params.getProperty("subordinationId", String.class);
       Long manageTypeId = (Long)params.getProperty("manageTypeId", Long.class);
       String[] managerIds = params.getStringArray("managerIds");
       this.managementService.allocateManagers(subordinationId, manageTypeId, managerIds);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String allocateSubordinations() {
     SDO params = getSDO();
     try {
       String managerId = (String)params.getProperty("managerId", String.class);
       Long manageTypeId = (Long)params.getProperty("manageTypeId", Long.class);
       String[] subordinationIds = params.getStringArray("subordinationIds");
       this.managementService.allocateSubordinations(managerId, manageTypeId, subordinationIds);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String insertDelegationBizManagement() {
     SDO params = getSDO();
     try {
       Long manageTypeId = (Long)params.getProperty("manageTypeId", Long.class);
       String manageOrgId = (String)params.getProperty("manageOrgId", String.class);
       String[] orgIds = params.getStringArray("orgIds");
 
       this.managementService.insertDelegationBizManagement(manageTypeId, orgIds, manageOrgId);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String deleteBizManagement()
   {
     SDO params = getSDO();
     try {
       Long[] ids = params.getLongArray("ids");
       this.managementService.deleteBizManagement(ids);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String slicedQueryBizManagements() {
     SDO params = getSDO();
     try {
       Map data = this.managementService.slicedQueryBizManagements(params);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String slicedQueryBizManagementsByManageOrgId() {
     SDO params = getSDO();
     try {
       Map data = this.managementService.slicedQueryBizManagementsByManageOrgId(params);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String slicedQueryOrgAllocatedBizManagementTypeForManager() {
     SDO params = getSDO();
     try {
       Map data = this.managementService.slicedQueryOrgAllocatedBizManagementTypeForManager(params);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String slicedQueryOrgAllocatedBizManagementTypeForSubordination() {
     SDO params = getSDO();
     try {
       Map data = this.managementService.slicedQueryOrgAllocatedBizManagementTypeForSubordination(params);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String slicedQueryBizManagementForManager() {
     SDO params = getSDO();
     try {
       Map data = this.managementService.slicedQueryBizManagementForManager(params);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String slicedQueryBizManagementForSubordination() {
     SDO params = getSDO();
     try {
       Map data = this.managementService.slicedQueryBizManagementForSubordination(params);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String romovePermissionCache() {
     try {
       this.managementService.romovePermissionCache();
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 }

