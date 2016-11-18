 package com.brc.system.opm.service.impl;
 
 import com.brc.exception.ApplicationException;
 import com.brc.model.fn.impl.OrgFun;
 import com.brc.system.ValidStatus;
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.opm.Operator;
 import com.brc.system.opm.OpmUtil;
 import com.brc.system.opm.domain.BizManagement;
 import com.brc.system.opm.domain.BizManagementType;
 import com.brc.system.opm.domain.Org;
 import com.brc.system.opm.service.ManagementService;
 import com.brc.system.opm.service.OrgService;
 import com.brc.system.share.service.GetPermission;
 import com.brc.system.share.service.SQLQuery;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.system.util.CommonUtil;
 import com.brc.system.util.NameCodeUniqueValidator;
 import com.brc.system.util.Util;
 import com.brc.util.ClassHelper;
 import com.brc.util.LogHome;
 import com.brc.util.QueryModel;
 import com.brc.util.SDO;
 import com.brc.util.ThreadLocalUtil;
import com.brc.xmlbean.EntityDocument;
 import com.brc.xmlbean.EntityDocument.Entity;
 import java.io.Serializable;
 import java.util.ArrayList;
 import java.util.Date;
 import java.util.HashMap;
 import java.util.List;
 import java.util.Map;
 import me.chanjar.weixin.cp.api.WxCpService;
 import org.apache.log4j.Logger;
 
 public class ManagementServiceImpl
   implements ManagementService
 {
   private static Logger LOGGER = LogHome.getLog(ManagementServiceImpl.class);
   private ServiceUtil serviceUtil;
   private OrgService orgService;
   private GetPermission getPermission;
   private OrgFun orgFun;
   private static String STATISTICAL_ANALYSIS_TAG_ID = "1";
 
   private static String BIZ_MANAGEMENT_TYPE_STATISTICS = "statistics";
   private WxCpService wxCpService;
 
   public void setOrgService(OrgService orgService)
   {
     this.orgService = orgService;
   }
 
   public void setServiceUtil(ServiceUtil serviceUtil)
   {
     this.serviceUtil = serviceUtil;
   }
 
   public void setGetPermission(GetPermission getPermission) {
     this.getPermission = getPermission;
   }
 
   public void setOrgFun(OrgFun orgFun) {
     this.orgFun = orgFun;
   }
 
   public void setWxCpService(WxCpService wxCpService) {
     this.wxCpService = wxCpService;
   }
 
   private EntityDocument.Entity getBaseManagementTypeEntity() {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/opm/management.xml", "baseManagementType");
   }
 
   private void checkBaseManagementTypeConstraints(SDO params)
   {
     NameCodeUniqueValidator.newInstance(getBaseManagementTypeEntity(), params, "id", "checkBaseManagementTypeExistSql").validate();
   }
 
   public Long insertBaseManagementType(SDO params)
   {
     checkBaseManagementTypeConstraints(params);
     return (Long)this.serviceUtil.getEntityDao().insert(getBaseManagementTypeEntity(), params.getProperties());
   }
 
   public void updateBaseManagementType(SDO params)
   {
     checkBaseManagementTypeConstraints(params);
     this.serviceUtil.getEntityDao().update(getBaseManagementTypeEntity(), params.getProperties(), new String[0]);
   }
 
   public void deleteBaseManagementType(Long[] ids)
   {
     this.serviceUtil.getEntityDao().deleteByIds(getBaseManagementTypeEntity(), (Serializable[])ids);
   }
 
   public Long getBaseManagementTypeNextSequence()
   {
     return this.serviceUtil.getNextSequence("config/domain/com/brc/system/opm/management.xml", "baseManagementType");
   }
 
   public void updateBaseManagementTypeSequence(Map<Long, Long> params)
   {
     this.serviceUtil.updateSequence("config/domain/com/brc/system/opm/management.xml", "baseManagementType", params);
   }
 
   public void updateBaseManagementTypeFolderId(Long[] ids, Long folderId)
   {
     this.serviceUtil.updateById("SA_OPBASEMANAGEMENTTYPE", "FOLDER_ID", "ID", ids, folderId);
   }
 
   public Map<String, Object> loadBaseManagementType(Long id)
   {
     return this.serviceUtil.getEntityDao().loadById(getBaseManagementTypeEntity(), id);
   }
 
   public Map<String, Object> slicedQueryBaseManagements(SDO params)
   {
     QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModel(getBaseManagementTypeEntity(), params.getProperties());
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(queryModel, params);
   }
 
   private void checkBizManagementTypeConstraints(SDO params)
   {
     Long parentId = (Long)params.getProperty("parentId", Long.class);
     NameCodeUniqueValidator.newInstance(getBizManagementTypeEntity(), params, "id", "checkBizManagementTypeExistSql", "parent_Id", parentId).validate();
   }
 
   private EntityDocument.Entity getBizManagementTypeEntity() {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/opm/management.xml", "bizManagementType");
   }
 
   private String[] buildFullIdAndName(Long parentId, Long id, String name) {
     String[] result = new String[2];
     Map parentData = loadBizManagementType(parentId);
     Util.check(parentData.size() > 0, "没有找到父节点。");
 
     String parentFullId = (String)ClassHelper.convert(parentData.get("fullId"), String.class);
     String parentFullName = (String)ClassHelper.convert(parentData.get("fullName"), String.class);
 
     result[0] = CommonUtil.createFileFullName(parentFullId == null ? "" : parentFullId, id.toString(), "");
     result[1] = CommonUtil.createFileFullName(parentFullName == null ? "" : parentFullName, name, "");
     return result;
   }
 
   public Long insertBizManagementType(SDO params)
   {
     checkBizManagementTypeConstraints(params);
 
     Long id = this.serviceUtil.getEntityDao().getSequence("SEQ_ID");
     Long parentId = (Long)params.getProperty("parentId", Long.class);
     String name = (String)params.getProperty("name", String.class);
 
     String[] fullInfo = buildFullIdAndName(parentId, id, name);
 
     params.putProperty("fullId", fullInfo[0]);
     params.putProperty("fullName", fullInfo[1]);
     return (Long)this.serviceUtil.getEntityDao().insert(getBizManagementTypeEntity(), params.getProperties());
   }
 
   public void updateBizManagementType(SDO params)
   {
     checkBizManagementTypeConstraints(params);
     this.serviceUtil.getEntityDao().update(getBizManagementTypeEntity(), params.getProperties(), new String[0]);
   }
 
   public void deleteBizManagementType(Long[] ids)
   {
     String referenceByBizManagementSql = this.serviceUtil.getEntityDao().getSqlByName(getBizManagementTypeEntity(), "referenceByBizManagementSql");
     String selectChildrenCountSql = this.serviceUtil.getEntityDao().getSqlByName(getBizManagementTypeEntity(), "selectChildrenCountSql");
 
     for (Long id : ids)
     {
       int count = this.serviceUtil.getEntityDao().queryToInt(selectChildrenCountSql, new Object[] { id });
       if (count > 0) {
         BizManagementType bizManagementType = loadBizManagementTypeObject(id);
         throw new ApplicationException(String.format("业务权限类别”%s(%s)“下已建立子节点，不能删除。", new Object[] { bizManagementType.getName(), bizManagementType.getCode() }));
       }
 
       count = this.serviceUtil.getEntityDao().queryToInt(referenceByBizManagementSql, new Object[] { id });
       if (count > 0) {
         BizManagementType bizManagementType = loadBizManagementTypeObject(id);
         throw new ApplicationException(String.format("业务权限类别“%s(%s)”已被使用，不能删除。", new Object[] { bizManagementType.getName(), bizManagementType.getCode() }));
       }
     }
     this.serviceUtil.getEntityDao().deleteByIds(getBizManagementTypeEntity(), (Serializable[])ids);
   }
 
   public Long getBizManagementTypeNextSequence(Long parentId)
   {
     return this.serviceUtil.getNextSequence("config/domain/com/brc/system/opm/management.xml", "bizManagementType", "parent_id", parentId);
   }
 
   public void updateBizManagementTypeSequence(Map<Long, Long> params)
   {
     this.serviceUtil.updateSequence("config/domain/com/brc/system/opm/management.xml", "bizManagementType", params);
   }
 
   public void moveBizManagementType(Long[] ids, Long parentId)
   {
     BizManagementType parentBizManagementType = loadBizManagementTypeObject(parentId);
 
     String moveSql = this.serviceUtil.getEntityDao().getSqlByName(getBizManagementTypeEntity(), "moveSql");
 
     for (Long id : ids) {
       BizManagementType bizManagementType = loadBizManagementTypeObject(id);
       Util.check(bizManagementType != null, String.format("没有找到%d对应的业务管理权限类别。", new Object[] { id }));
 
       String fullId = CommonUtil.createFileFullName(parentBizManagementType.getFullId() == null ? "" : parentBizManagementType.getFullId(), id.toString(), "");
 
       String fullName = CommonUtil.createFileFullName(parentBizManagementType.getFullName() == null ? "" : parentBizManagementType.getFullName(), bizManagementType.getName(), "");
 
       this.serviceUtil.getEntityDao().executeUpdate(moveSql, new Object[] { parentId, fullId, fullName, id });
     }
   }
 
   public Map<String, Object> loadBizManagementType(Long id)
   {
     return this.serviceUtil.getEntityDao().loadById(getBizManagementTypeEntity(), id);
   }
 
   public BizManagementType loadBizManagementTypeObject(Long id)
   {
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getBizManagementTypeEntity(), "selectObjectSql");
     return (BizManagementType)this.serviceUtil.getEntityDao().queryToObject(sql, BizManagementType.class, new Object[] { id });
   }
 
   public Map<String, Object> queryBizManagementTypes(SDO params)
   {
     QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModel(getBizManagementTypeEntity(), params.getProperties());
     Map data = this.serviceUtil.getSQLQuery().executeQuery(queryModel, params);
     return data;
   }
 
   public Map<String, Object> slicedQueryBizManagementTypes(SDO params)
   {
     QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModel(getBizManagementTypeEntity(), params.getProperties());
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(queryModel, params);
   }
 
   private EntityDocument.Entity getBizManagementEntity() {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/opm/management.xml", "bizManagement");
   }
 
   private BizManagementType checkInsertBizManagementConstraints(Long manageTypeId)
   {
     BizManagementType bizManagementType = loadBizManagementTypeObject(manageTypeId);
     Util.check(bizManagementType != null, "无效的业务管理权限类型 ”%s“", new Object[] { manageTypeId });
     return bizManagementType;
   }
 
   public void insertBizManagementByOrg(Long manageTypeId, String[] orgIds, String managedOrgId)
   {
     Org org = null;
     Org manageOrg = null;
 
     checkInsertBizManagementConstraints(manageTypeId);
 
     manageOrg = this.orgService.loadOrgObject(managedOrgId);
     Util.check(manageOrg != null, "无效的组织 ”%s“", new Object[] { managedOrgId });
 
     String checkAllocateByOrgSql = this.serviceUtil.getEntityDao().getSqlByName(getBizManagementEntity(), "checkAllocateByOrgSql");
     List data = new ArrayList(orgIds.length);
 
     Operator opr = (Operator)ThreadLocalUtil.getVariable("operator", Operator.class);
 
     for (String item : orgIds) {
       org = this.orgService.loadOrgObject(item);
 
       Util.check(org != null, "无效的组织 ”%s“", new Object[] { item });
 
       int count = this.serviceUtil.getEntityDao().queryToInt(checkAllocateByOrgSql, new Object[] { org.getId(), manageTypeId, manageOrg.getId() });
       if (count <= 0)
       {
         Map params = new HashMap();
         params.put("id", Integer.valueOf(0));
         params.put("kindId", Integer.valueOf(2));
         params.put("orgId", org.getId());
         params.put("orgName", org.getName());
         params.put("orgFullId", org.getFullId());
         params.put("orgFullName", org.getFullName());
         params.put("manageTypeId", manageTypeId);
         params.put("manageOrgId", manageOrg.getId());
         params.put("manageOrgName", manageOrg.getName());
         params.put("manageOrgFullId", manageOrg.getFullId());
         params.put("manageOrgFullName", manageOrg.getFullName());
 
         params.put("creatorFullId", opr.getFullId());
         params.put("creatorFullName", opr.getFullName());
         params.put("createDate", new Date());
 
         params.put("version", Integer.valueOf(1));
 
         data.add(params);
       }
     }
     if (data.size() > 0) {
       this.serviceUtil.getEntityDao().batchInsert(getBizManagementEntity(), data);
 
       this.getPermission.removeCacheByKind("ManagementType");
     }
   }
 
   private Map<String, Object> buildBizManagementParams(Org manager, Long manageTypeId, Org subordination) {
     Map params = new HashMap();
     params.put("id", Integer.valueOf(0));
     params.put("kindId", Integer.valueOf(2));
     params.put("orgId", manager.getId());
     params.put("orgName", manager.getName());
     params.put("orgFullId", manager.getFullId());
     params.put("orgFullName", manager.getFullName());
     params.put("manageTypeId", manageTypeId);
     params.put("manageOrgId", subordination.getId());
     params.put("manageOrgName", subordination.getName());
     params.put("manageOrgFullId", subordination.getFullId());
     params.put("manageOrgFullName", subordination.getFullName());
 
     OpmUtil.fillCreatorInfo(params);
 
     return params;
   }
 
   private void synTagAddUsers(String[] managerIds)
   {
     StringBuilder sb = new StringBuilder();
     sb.append("select distinct p.login_name");
     sb.append("  from sa_oporg pt, sa_oporg c, sa_opperson p");
     sb.append(" where pt.id = ?");
     sb.append("   and c.full_id like pt.full_id || '%'");
     sb.append("   and c.org_kind_id = 'psm'");
     sb.append("   and pt.status = 1");
     sb.append("   and c.status = 1");
     sb.append("   and c.person_id = p.id");
     sb.append("   and p.status = 1");
     sb.append("   and p.is_operator = 1");
     sb.append("   and nvl(p.is_hidden, 0) = 0");
 
     for (String id : managerIds) {
       List userIds = this.serviceUtil.getEntityDao().queryToList(sb.toString(), String.class, new Object[] { id });
       try {
         this.wxCpService.tagAddUsers(STATISTICAL_ANALYSIS_TAG_ID, userIds, null);
       } catch (Exception e) {
         LOGGER.error(e.getMessage(), e);
       }
     }
   }
 
   public void allocateManagers(String subordinationId, Long manageTypeId, String[] managerIds)
   {
     BizManagementType bizManagementType = checkInsertBizManagementConstraints(manageTypeId);
     Org subordination = this.orgService.loadOrgObject(subordinationId);
     Util.check(subordination != null, "无效的组织 “%s”。", new Object[] { subordinationId });
 
     String checkAllocateByOrgSql = this.serviceUtil.getEntityDao().getSqlByName(getBizManagementEntity(), "checkAllocateByOrgSql");
     List data = new ArrayList(managerIds.length);
 
     for (String managerId : managerIds) {
       Org manager = this.orgService.loadOrgObject(managerId);
       Util.check(manager != null, "无效的组织 “%s”。", new Object[] { managerId });
       int count = this.serviceUtil.getEntityDao().queryToInt(checkAllocateByOrgSql, new Object[] { manager.getId(), manageTypeId, subordination.getId() });
       if (count <= 0)
       {
         Map params = buildBizManagementParams(manager, manageTypeId, subordination);
         data.add(params);
       }
     }
     if (data.size() > 0) {
       this.serviceUtil.getEntityDao().batchInsert(getBizManagementEntity(), data);
       this.getPermission.removeCacheByKind("ManagementType");
 
       if (BIZ_MANAGEMENT_TYPE_STATISTICS.equalsIgnoreCase(bizManagementType.getCode()))
         synTagAddUsers(managerIds);
     }
   }
 
   public void allocateSubordinations(String managerId, Long manageTypeId, String[] subordinationIds)
   {
     BizManagementType bizManagementType = checkInsertBizManagementConstraints(manageTypeId);
     Org manager = this.orgService.loadOrgObject(managerId);
     Util.check(manager != null, "无效的组织 ”%s“", new Object[] { managerId });
 
     String checkAllocateByOrgSql = this.serviceUtil.getEntityDao().getSqlByName(getBizManagementEntity(), "checkAllocateByOrgSql");
     List data = new ArrayList(subordinationIds.length);
 
     for (String subordinationId : subordinationIds) {
       Org subordination = this.orgService.loadOrgObject(subordinationId);
       Util.check(subordination != null, "无效的组织 ”%s“", new Object[] { subordinationId });
       int count = this.serviceUtil.getEntityDao().queryToInt(checkAllocateByOrgSql, new Object[] { manager.getId(), manageTypeId, subordination.getId() });
       if (count <= 0)
       {
         Map params = buildBizManagementParams(manager, manageTypeId, subordination);
         data.add(params);
       }
     }
     if (data.size() > 0) {
       this.serviceUtil.getEntityDao().batchInsert(getBizManagementEntity(), data);
       this.getPermission.removeCacheByKind("ManagementType");
 
       if (BIZ_MANAGEMENT_TYPE_STATISTICS.equalsIgnoreCase(bizManagementType.getCode()))
         synTagAddUsers(new String[] { managerId });
     }
   }
 
   public void insertDelegationBizManagement(Long manageTypeId, String[] orgIds, String manageOrgId)
   {
     Org org = null;
     Org manageOrg = null;
 
     checkInsertBizManagementConstraints(manageTypeId);
 
     manageOrg = this.orgService.loadOrgObject(manageOrgId);
     Util.check(manageOrg != null, "无效的组织 ”%s“", new Object[] { manageOrgId });
 
     String deleteByOrgAndManageTypeId = this.serviceUtil.getEntityDao().getSqlByName(getBizManagementEntity(), "deleteByOrgAndManageTypeId");
 
     this.serviceUtil.getEntityDao().executeUpdate(deleteByOrgAndManageTypeId, new Object[] { manageOrgId, manageTypeId });
 
     List data = new ArrayList(orgIds.length);
 
     Operator opr = (Operator)ThreadLocalUtil.getVariable("operator", Operator.class);
 
     for (String item : orgIds) {
       org = this.orgService.loadOrgObject(item);
 
       Util.check(org != null, "无效的组织 ”%s“", new Object[] { item });
 
       Map params = new HashMap();
       params.put("id", Integer.valueOf(0));
       params.put("kindId", Integer.valueOf(2));
       params.put("orgId", org.getId());
       params.put("orgName", org.getName());
       params.put("orgFullId", org.getFullId());
       params.put("orgFullName", org.getFullName());
       params.put("manageTypeId", manageTypeId);
       params.put("manageOrgId", manageOrg.getId());
       params.put("manageOrgName", manageOrg.getName());
       params.put("manageOrgFullId", manageOrg.getFullId());
       params.put("manageOrgFullName", manageOrg.getFullName());
 
       params.put("creatorFullId", opr.getFullId());
       params.put("creatorFullName", opr.getFullName());
       params.put("createDate", new Date());
 
       params.put("version", Integer.valueOf(1));
 
       data.add(params);
     }
     if (data.size() > 0) {
       this.serviceUtil.getEntityDao().batchInsert(getBizManagementEntity(), data);
 
       this.getPermission.removeCacheByKind("ManagementType");
     }
   }
 
   public Map<String, Object> slicedQueryBizManagements(SDO params)
   {
     String typeId = (String)params.getProperty("typeId", String.class, "manager");
     QueryModel queryModel;
     if ("manager".equalsIgnoreCase(typeId))
       queryModel = this.serviceUtil.getEntityDao().getQueryModel(getBizManagementEntity(), params.getProperties());
     else {
       queryModel = this.serviceUtil.getEntityDao().getQueryModelByName(getBizManagementEntity(), "selectSubordination", params.getProperties());
     }
 
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(queryModel, params);
   }
 
   public Map<String, Object> slicedQueryBizManagementsByManageOrgId(SDO params)
   {
     String orgId = (String)params.getProperty("orgId", String.class);
 
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getBizManagementEntity(), "selectBizManagementOrg");
 
     if (!"@".equals(orgId)) {
       Org org = this.orgService.loadOrgObject(orgId);
       Util.check(org != null, String.format("无效的组织ID“%s”", new Object[] { orgId }));
       if (this.orgFun.isHQ(orgId).booleanValue())
         params.putProperty("organKindId", "1,3");
       else {
         params.putProperty("organKindId", "2,3");
       }
     }
     params.putProperty("pagesize", Integer.valueOf(10000));
 
     QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModelByName(getBizManagementEntity(), "selectDelegationBizManagement", params.getProperties());
 
     Map result = this.serviceUtil.getSQLQuery().executeSlicedQuery(queryModel, params);
 
     List<Map<String,Object>> data = (List)result.get("Rows");
 
     for (Map item : data) {
       String managerNames = "";
       if (((Integer)ClassHelper.convert(item.get("nodeKindId"), Integer.class, Integer.valueOf(1))).intValue() == 2) {
         List<Map<String,Object>> managers = this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[] { orgId, item.get("id") });
         item.put("managers", managers);
 
         for (Map manager : managers) {
           String managerName = (String)ClassHelper.convert(manager.get("name"), String.class);
           Integer orgStatus = (Integer)ClassHelper.convert(manager.get("status"), Integer.class);
           if (orgStatus.intValue() == ValidStatus.ENABLED.getId())
             managerNames = new StringBuilder().append(managerNames).append(String.format("%s;", new Object[] { managerName })).toString();
           else {
             managerNames = new StringBuilder().append(managerNames).append(String.format("<font style=\"color:Tomato;font-size:13px;\">%s<font/>", new Object[] { managerName })).toString();
           }
         }
         item.put("managerNames", managerNames);
       }
     }
 
     return result;
   }
 
   public Map<String, Object> slicedQueryOrgAllocatedBizManagementTypeForManager(SDO params)
   {
     QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModelByName(getBizManagementTypeEntity(), "selectOrgAllocatedBizManagementTypeForManager", params.getProperties());
 
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(queryModel, params);
   }
 
   public Map<String, Object> slicedQueryOrgAllocatedBizManagementTypeForSubordination(SDO params)
   {
     QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModelByName(getBizManagementTypeEntity(), "selectOrgAllocatedBizManagementTypeForSubordination", params.getProperties());
 
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(queryModel, params);
   }
 
   public Map<String, Object> slicedQueryBizManagementForManager(SDO params)
   {
     QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModelByName(getBizManagementEntity(), "selectBizManagementForManager", params.getProperties());
 
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(queryModel, params);
   }
 
   public Map<String, Object> slicedQueryBizManagementForSubordination(SDO params)
   {
     QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModelByName(getBizManagementEntity(), "selectBizManagementForSubordination", params.getProperties());
 
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(queryModel, params);
   }
 
   private void synTagRemoveUsers(Long[] ids)
   {
     StringBuilder sb = new StringBuilder();
     sb.append("select p.login_name");
     sb.append("  from sa_opbizmanagement pt, sa_opbizmanagementtype bt,sa_oporg c, sa_opperson p");
     sb.append(" where pt.id = ?");
     sb.append(" and pt.manage_type_id = bt.id");
     sb.append("   and bt.code = ?");
     sb.append("   and c.full_id like pt.org_full_id || '%'");
     sb.append("   and c.org_kind_id = 'psm'");
     sb.append("   and c.person_id = p.id");
 
     for (Long id : ids) {
       List userIds = this.serviceUtil.getEntityDao().queryToList(sb.toString(), String.class, new Object[] { id, BIZ_MANAGEMENT_TYPE_STATISTICS });
       if (userIds.size() > 0)
         try {
           this.wxCpService.tagRemoveUsers(STATISTICAL_ANALYSIS_TAG_ID, userIds);
         } catch (Exception e) {
           LOGGER.error(e.getMessage(), e);
         }
     }
   }
 
   public void deleteBizManagement(Long[] ids)
   {
     synTagRemoveUsers(ids);
 
     this.serviceUtil.getEntityDao().deleteByIds(getBizManagementEntity(), ids);
 
     this.getPermission.removeCacheByKind("ManagementType");
   }
 
   public void romovePermissionCache()
   {
     this.getPermission.removeCache();
   }
 
   public void quoteBizManagement(String sourceOrgId, String destOrgId)
   {
     Operator operator = (Operator)ThreadLocalUtil.getVariable("operator", Operator.class);
     if (operator == null) {
       throw new ApplicationException("没法找到人员环境信息。");
     }
 
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getBizManagementEntity(), "selectBizManagementByOrgId");
     List<BizManagement> sourceBizManagements = this.serviceUtil.getEntityDao().queryToList(sql, BizManagement.class, new Object[] { sourceOrgId });
     List<BizManagement> destBizManagements = this.serviceUtil.getEntityDao().queryToList(sql, BizManagement.class, new Object[] { destOrgId });
     List data = new ArrayList(sourceBizManagements.size());
 
     Org org = this.orgService.loadOrgObject(destOrgId);
     Util.check(org != null, "无效的组织标识“%s”！", new Object[] { destOrgId });
 
     for (BizManagement sourceBizManagement : sourceBizManagements) {
       boolean allocated = false;
       for (BizManagement destBizManagement : destBizManagements) {
         if ((sourceBizManagement.getManageTypeId().equals(destBizManagement.getManageTypeId())) && (sourceBizManagement.getManageOrgId().equalsIgnoreCase(destBizManagement.getManageOrgId())))
         {
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
 
         item.put("manageTypeId", sourceBizManagement.getManageTypeId());
 
         item.put("manageOrgId", sourceBizManagement.getManageOrgId());
         item.put("manageOrgName", sourceBizManagement.getManageOrgName());
         item.put("manageOrgFullId", sourceBizManagement.getManageOrgFullId());
         item.put("manageOrgFullName", sourceBizManagement.getManageOrgFullName());
 
         item.put("creatorFullId", operator.getFullId());
         item.put("creatorFullName", operator.getFullName());
         item.put("createDate", CommonUtil.getCurrentDateTime());
 
         item.put("kindId", sourceBizManagement.getKindId());
 
         data.add(item);
       }
     }
 
     if (data.size() > 0)
       this.serviceUtil.getEntityDao().batchInsert(getBizManagementEntity(), data);
   }
 }

