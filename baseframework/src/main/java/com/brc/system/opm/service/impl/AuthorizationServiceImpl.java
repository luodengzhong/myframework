 package com.brc.system.opm.service.impl;
 
 import com.brc.exception.ApplicationException;
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.opm.OpmUtil;
 import com.brc.system.opm.domain.Authorize;
 import com.brc.system.opm.domain.Org;
 import com.brc.system.opm.service.AuthorizationService;
 import com.brc.system.opm.service.OrgService;
 import com.brc.system.share.service.GetPermission;
 import com.brc.system.share.service.SQLQuery;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.system.util.Util;
 import com.brc.util.QueryModel;
 import com.brc.util.SDO;
import com.brc.xmlbean.EntityDocument;
 import com.brc.xmlbean.EntityDocument.Entity;
 import java.util.ArrayList;
 import java.util.HashMap;
 import java.util.List;
 import java.util.Map;
 
 public class AuthorizationServiceImpl
   implements AuthorizationService
 {
   private ServiceUtil serviceUtil;
   private OrgService orgService;
   private GetPermission getPermission;
   private static final String MODEL_FILE_NAME = "config/domain/com/brc/system/opm/authorization.xml";
   private static final String AUTHORIZE_ENTITY_NAME = "authorize";
   private static final String ORG_ROLE_AUTHORIZE_ENTITY_NAME = "orgRoleAuthorize";
   private static final String AUTHORIZE_ID_FIELD = "id";
   private static final String AUTHORIZE_ORG_ID_FIELD = "orgId";
   private static final String AUTHORIZE_ORG_NAME_FIELD = "orgName";
   private static final String AUTHORIZE_ORG_FULL_ID_FIELD = "orgFullId";
   private static final String AUTHORIZE_ORG_FULL_NAME_FIELD = "orgFullName";
   private static final String AUTHORIZE_ROLE_ID_FIELD = "roleId";
   private static final String AUTHORIZE_VERSION_FIELD = "version";
 
   public void setServiceUtil(ServiceUtil serviceUtil)
   {
     this.serviceUtil = serviceUtil;
   }
 
   public void setOrgService(OrgService orgService) {
     this.orgService = orgService;
   }
 
   public void setGetPermission(GetPermission getPermission) {
     this.getPermission = getPermission;
   }
 
   private EntityDocument.Entity getAuthorizeEntiy() {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/opm/authorization.xml", "authorize");
   }
 
   private EntityDocument.Entity getOrgRoleAuthorizeEntiy() {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/opm/authorization.xml", "orgRoleAuthorize");
   }
 
   public void insertOrgRoleKindAuthorize(String orgId, Long[] roleKindIds)
   {
     Org org = this.orgService.loadOrgObject(orgId);
     Util.check(org != null, "无效的组织标识“%s”！", new Object[] { orgId });
 
     String countSql = this.serviceUtil.getEntityDao().getSqlByName(getOrgRoleAuthorizeEntiy(), "countByOrgIdAndRoleId");
 
     List params = new ArrayList(roleKindIds.length);
 
     for (Long roleKindId : roleKindIds) {
       int count = this.serviceUtil.getEntityDao().queryToInt(countSql, new Object[] { orgId, roleKindId });
       if (count == 0) {
         Map map = new HashMap(2);
         map.put("orgId", orgId);
         map.put("roleKindId", roleKindId);
         params.add(map);
       }
     }
     if (params.size() > 0)
       this.serviceUtil.getEntityDao().batchInsert(getOrgRoleAuthorizeEntiy(), params);
   }
 
   public void deleteOrgRoleKindAuthorize(Long[] ids)
   {
     if (ids.length == 0) {
       throw new ApplicationException("您没有选择要删除的数据。");
     }
     this.serviceUtil.getEntityDao().deleteByIds(getOrgRoleAuthorizeEntiy(), ids);
   }
 
   public Map<String, Object> loadOrgRoleKindAuthorizes(SDO params)
   {
     QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModel(getOrgRoleAuthorizeEntiy(), params.getProperties());
     return this.serviceUtil.getSQLQuery().executeQuery(queryModel, params);
   }
 
   public void insertAuthorize(String orgId, Long[] roleIds)
   {
     Org org = this.orgService.loadOrgObject(orgId);
     Util.check(org != null, "无效的组织标识“%s”。", new Object[] { orgId });
 
     String countSql = this.serviceUtil.getEntityDao().getSqlByName(getAuthorizeEntiy(), "countByOrgIdAndRoleId");
 
     List params = new ArrayList(roleIds.length);
     for (Long roleId : roleIds) {
       int count = this.serviceUtil.getEntityDao().queryToInt(countSql, new Object[] { orgId, roleId });
       if (count == 0) {
         Map map = new HashMap(8);
         map.put("id", Integer.valueOf(0));
         map.put("orgId", orgId);
         map.put("orgName", org.getName());
         map.put("roleId", roleId);
         map.put("orgFullId", org.getFullId());
         map.put("orgFullName", org.getFullName());
         map.put("version", Integer.valueOf(1));
         OpmUtil.fillCreatorInfo(map);
         params.add(map);
       }
     }
     if (params.size() > 0) {
       this.serviceUtil.getEntityDao().batchInsert(getAuthorizeEntiy(), params);
     }
 
     this.getPermission.removeCacheByKind("PermissionFieldByFunction");
   }
 
   public void deleteAuthorize(Long[] ids)
   {
     if (ids.length == 0) {
       throw new ApplicationException("您没有选择要删除的数据。");
     }
     this.serviceUtil.getEntityDao().deleteByIds(getAuthorizeEntiy(), ids);
 
     this.getPermission.removeCacheByKind("PermissionFieldByFunction");
   }
 
   public SDO loadAuthorizes(SDO params)
   {
     QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModel(getAuthorizeEntiy(), params.getProperties());
     Map map = this.serviceUtil.getSQLQuery().executeQuery(queryModel, params);
     SDO sdo = new SDO();
     sdo.setProperties(map);
     return sdo;
   }
 
   public Map<String, Object> slicedQueryAuthorizePermissionsByOrgFullId(SDO params)
   {
     params.changKeyName("orgFullId", "orgPermissionFullId");
     QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModelByName(getAuthorizeEntiy(), "selectAuthorizePermission", params.getProperties());
     Map data = this.serviceUtil.getSQLQuery().executeSlicedQuery(queryModel, params);
     return data;
   }
 
   public void quoteAuthorize(String sourceOrgId, String destOrgId)
   {
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getAuthorizeEntiy(), "selectAuthorizeByOrgId");
     List<Authorize> sourceAuthorizes = this.serviceUtil.getEntityDao().queryToList(sql, Authorize.class, new Object[] { sourceOrgId });
     List<Authorize> destAuthorizes = this.serviceUtil.getEntityDao().queryToList(sql, Authorize.class, new Object[] { destOrgId });
     List data = new ArrayList(sourceAuthorizes.size());
 
     Org org = this.orgService.loadOrgObject(destOrgId);
     Util.check(org != null, "无效的组织标识“%s”！", new Object[] { destOrgId });
 
     for (Authorize sourceAuthorize : sourceAuthorizes) {
       boolean allocated = false;
       for (Authorize destAuthorize : destAuthorizes) {
         if (sourceAuthorize.getRoleId().equals(destAuthorize.getRoleId())) {
           allocated = true;
           break;
         }
       }
       if (!allocated) {
         Map item = new HashMap();
 
         item.put("orgId", org.getId());
         item.put("orgName", org.getName());
         item.put("orgFullId", org.getFullId());
         item.put("orgFullName", org.getFullName());
 
         item.put("roleId", sourceAuthorize.getRoleId());
 
         data.add(item);
       }
     }
     if (data.size() > 0)
       this.serviceUtil.getEntityDao().batchInsert(getAuthorizeEntiy(), data);
   }
 }

