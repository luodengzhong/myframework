 package com.brc.system.opm.action;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.system.opm.service.AuthorizationService;
 import com.brc.util.SDO;
 import java.util.Map;
 
 public class AuthorizationAction extends CommonAction
 {
   private static final long serialVersionUID = 1L;
   private static final String AUTHORIZATION_PAGE = "Authorization";
   private static final String ORG_ROLE_KIND_AUTHORIZATION_PAGE = "OrgRoleKindAuthorization";
   private AuthorizationService authorizationService;
 
   public void setAuthorizationService(AuthorizationService authorizationService)
   {
     this.authorizationService = authorizationService;
   }
 
   protected String getPagePath()
   {
     return "/system/opm/authorization/";
   }
 
   public String forwardAuthorize() {
     return forward("Authorization");
   }
 
   public String forwardOrgRoleKindAuthorize() {
     return forward("OrgRoleKindAuthorization");
   }
 
   public String insertOrgRoleKindAuthorize() {
     SDO params = getSDO();
     try {
       String orgId = (String)params.getProperty("orgId", String.class);
       Long[] roleKindIds = params.getLongArray("roleKindIds");
       this.authorizationService.insertOrgRoleKindAuthorize(orgId, roleKindIds);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String deleteOrgRoleKindAuthorize() {
     SDO params = getSDO();
     try {
       Long[] ids = params.getLongArray("ids");
       this.authorizationService.deleteOrgRoleKindAuthorize(ids);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String loadOrgRoleKindAuthorizes() {
     SDO params = getSDO();
     try {
       Map data = this.authorizationService.loadOrgRoleKindAuthorizes(params);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String insertAuthorize() {
     SDO params = getSDO();
     try {
       String orgId = (String)params.getProperty("orgId", String.class);
       Long[] roleIds = params.getLongArray("roleIds");
       this.authorizationService.insertAuthorize(orgId, roleIds);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String deleteAuthorize() {
     SDO params = getSDO();
     try {
       Long[] ids = params.getLongArray("ids");
       this.authorizationService.deleteAuthorize(ids);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String loadAuthorizes() {
     SDO params = getSDO();
     try {
       SDO data = this.authorizationService.loadAuthorizes(params);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String slicedQueryAuthorizePermissionsByOrgFullId() {
     SDO params = getSDO();
     try {
       Map data = this.authorizationService.slicedQueryAuthorizePermissionsByOrgFullId(params);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 }

