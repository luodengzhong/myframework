 package com.brc.system.opm.action;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.system.opm.service.OrgTemplateService;
 import com.brc.util.SDO;
 import java.util.Map;
 
 public class OrgTemplateAction extends CommonAction
 {
   private static final long serialVersionUID = 1L;
   private OrgTemplateService orgTemplateService;
   private static final String ORG_TEMPLATE_PAGE = "OrgTemplate";
   private static final String SELECT_ORG_TEMPLATE_DIALOG_PAGE = "SelectOrgTemplateDialog";
 
   public void setOrgTemplateService(OrgTemplateService orgTypeService)
   {
     this.orgTemplateService = orgTypeService;
   }
 
   protected String getPagePath()
   {
     return "/system/opm/organization/";
   }
 
   public String execute() throws Exception
   {
     return forward("OrgTemplate");
   }
 
   public String showSelectOrgTemplateDialog() {
     return forward("SelectOrgTemplateDialog");
   }
 
   public String insertOrgTemplate() {
     SDO params = getSDO();
     try {
       Long parentId = (Long)params.getProperty("parentId", Long.class);
       Long[] orgTypeIds = params.getLongArray("orgTypeIds");
 
       this.orgTemplateService.insertOrgTemplate(parentId, orgTypeIds);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String deleteOrgTemplate() {
     SDO sdo = getSDO();
     Long[] orgTemplateIds = sdo.getLongArray("ids");
     try {
       this.orgTemplateService.deleteOrgTemplate(orgTemplateIds);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String updateOrgTemplateSequence() {
     Map orgTemplates = getSDO().getLongMap("data");
     try {
       this.orgTemplateService.updateOrgTemplateSequence(orgTemplates);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String queryOrgTemplates() {
     SDO params = getSDO();
     try {
       Map data = this.orgTemplateService.queryOrgTemplates(params);
       return toResult(data);
     } catch (Exception e) {
       return errorPage(e.getMessage());
     }
   }
 
   public String slicedQueryOrgTemplates() {
     SDO params = getSDO();
     try {
       Map data = this.orgTemplateService.slicedQueryOrgTemplates(params);
       return toResult(data);
     } catch (Exception e) {
       return errorPage(e.getMessage());
     }
   }
 }

