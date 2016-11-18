 package com.brc.system.opm.action;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.system.ValidStatus;
 import com.brc.system.opm.service.OrgTypeService;
 import com.brc.util.SDO;
 import java.util.Map;
 
 public class OrgTypeAction extends CommonAction
 {
   private static final long serialVersionUID = 1L;
   private static final String ORG_TYPE_PAGE = "OrgType";
   private static final String ORG_TYPE_DETAIL_PAGE = "OrgTypeDetail";
   private OrgTypeService orgTypeService;
   private static final String SELECT_ORGTYPE_DIALOG = "SelectOrgTypeDialog";
 
   public void setOrgTypeService(OrgTypeService orgTypeService)
   {
     this.orgTypeService = orgTypeService;
   }
 
   protected String getPagePath()
   {
     return "/system/opm/organization/";
   }
 
   public String execute() throws Exception
   {
     return forward("OrgType");
   }
 
   public String showSelectOrgTypeDialog() {
     return forward("SelectOrgTypeDialog", getSDO().getProperties());
   }
 
   public String showOrgTypeDetail() {
     SDO params = getSDO();
     try {
       Long folderId = (Long)params.getProperty("folderId", Long.class);
       Long nextSequence = this.orgTypeService.getOrgTypeNextSequence(folderId);
       params.putProperty("status", Integer.valueOf(ValidStatus.ENABLED.getId()));
       params.putProperty("sequence", nextSequence);
 
       return forward("OrgTypeDetail", params);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String loadOrgType() {
     SDO params = getSDO();
     try {
       Long id = (Long)params.getProperty("id", Long.class);
       Map data = this.orgTypeService.loadOrgType(id);
       return forward("OrgTypeDetail", data);
     } catch (Exception e) {
       return errorPage(e.getMessage());
     }
   }
 
   public String insertOrgType() {
     SDO params = getSDO();
     try {
       this.orgTypeService.insertOrgType(params);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String updateOrgType() {
     SDO params = getSDO();
     try {
       this.orgTypeService.updateOrgType(params);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String deleteOrgType() {
     try {
       Long[] ids = getSDO().getLongArray("ids");
       this.orgTypeService.deleteOrgType(ids);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String updateOrgTypeSequence() {
     SDO params = getSDO();
     try {
       Map orgTypes = params.getLongMap("data");
       this.orgTypeService.updateOrgTypeSequence(orgTypes);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String moveOrgType() {
     SDO params = getSDO();
     try {
       Long folderId = (Long)params.getProperty("folderId", Long.class);
       Long[] ids = params.getLongArray("ids");
       this.orgTypeService.moveOrgType(ids, folderId);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String slicedQueryOrgTypes() {
     SDO sdo = getSDO();
     try {
       excludeRootCriteria(sdo.getProperties(), "folderId");
       Map data = this.orgTypeService.slicedQueryOrgTypes(sdo);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 }

