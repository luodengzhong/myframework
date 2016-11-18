 package com.brc.system.opm.action;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.system.opm.service.ProjectOrgPersonOnPositionService;
 import com.brc.util.SDO;
 import java.util.Map;
 
 public class ProjectOrgPersonOnPositionAction extends CommonAction
 {
   private static final long serialVersionUID = 1L;
   private static final String ON_POSITION = "ProjectOrgPersonOnPosition";
   private ProjectOrgPersonOnPositionService projectOrgPersonOnPositionService;
 
   public void setProjectOrgPersonOnPositionService(ProjectOrgPersonOnPositionService projectOrgPersonOnPositionService)
   {
     this.projectOrgPersonOnPositionService = projectOrgPersonOnPositionService;
   }
 
   protected String getPagePath()
   {
     return "/system/opm/organization/";
   }
 
   public String forwardOnPosition() {
     return forward("ProjectOrgPersonOnPosition");
   }
 
   public String queryOnPosition() {
     SDO params = getSDO();
     try {
       String projectOrgId = (String)params.getProperty("orgId", String.class);
       Map map = this.projectOrgPersonOnPositionService.queryOnPosition(projectOrgId);
       return toResult(map);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String saveOnPosition() {
     SDO params = getSDO();
     try {
       String projectOrgId = (String)params.getProperty("orgId", String.class);
       Long baseFunctionTypeId = (Long)params.getProperty("baseFunctionTypeId", Long.class);
       String[] personIds = params.getStringArray("personIds");
       Map result = this.projectOrgPersonOnPositionService.saveOnPosition(projectOrgId, baseFunctionTypeId, personIds);
       return success(result);
     } catch (Exception e) {
       return error(e);
     }
   }
 }

