 package com.brc.system.opm.service.impl;
 
 import com.brc.system.ValidStatus;
 import com.brc.system.configuration.ConfigurationService;
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.opm.Person;
 import com.brc.system.opm.domain.BaseFunctionType;
 import com.brc.system.opm.domain.Org;
 import com.brc.system.opm.service.FunctionService;
 import com.brc.system.opm.service.OrgService;
 import com.brc.system.opm.service.ProjectOrgPersonOnPositionService;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.system.util.CommonUtil;
 import com.brc.system.util.Util;
 import com.brc.util.ClassHelper;
 import com.brc.util.SDO;
 import java.util.HashMap;
 import java.util.List;
 import java.util.Map;
 import org.jsoup.helper.StringUtil;
 
 public class ProjectOrgPersonOnPositionServiceImpl
   implements ProjectOrgPersonOnPositionService
 {
   private ServiceUtil serviceUtil;
   private OrgService orgService;
   private FunctionService functionService;
   private ConfigurationService configurationService;
 
   public void setServiceUtil(ServiceUtil serviceUtil)
   {
     this.serviceUtil = serviceUtil;
   }
 
   public void setOrgService(OrgService orgService) {
     this.orgService = orgService;
   }
 
   public void setFunctionService(FunctionService functionService) {
     this.functionService = functionService;
   }
 
   public void setConfigurationService(ConfigurationService configurationService) {
     this.configurationService = configurationService;
   }
 
   private void buildOnPositionByBaseFunctionTypeId(String projectOrgId, Long baseFunctionTypeId, Map<String, Object> item) {
     String handlerNames = "";
 
     String sql = "select o.id, o.code, o.name, o.person_id, o.org_kind_id, o.full_id, o.full_name, o.status from sa_oporg o where id in (select parent_id from sa_oporg i where center_id = ? and type_id = ?)";
 
     List<Map<String,Object>> handlers = this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[] { projectOrgId, baseFunctionTypeId });
     for (Map handler : handlers) {
       String handlerName = (String)ClassHelper.convert(handler.get("name"), String.class);
       Integer orgStatus = (Integer)ClassHelper.convert(handler.get("status"), Integer.class);
       if (orgStatus.intValue() == ValidStatus.ENABLED.getId())
         handlerNames = handlerNames + String.format("%s;", new Object[] { handlerName });
       else {
         handlerNames = handlerNames + String.format("<font style=\"color:Tomato;font-size:13px;\">%s;<font/>", new Object[] { handlerName });
       }
     }
     item.put("handlerNames", handlerNames);
     item.put("handlers", handlers);
   }
 
   public Map<String, Object> queryOnPosition(String projectOrgId)
   {
     Util.check(!StringUtil.isBlank(projectOrgId), "参数“projectOrgId”不能为空。");
 
     if ("@".equalsIgnoreCase(projectOrgId)) {
       Map result = new HashMap(0);
       return result;
     }
     Map result = this.functionService.queryAuthorisedBaseFunctionType(projectOrgId);
 
     List<Map<String,Object>> data = (List)result.get("Rows");
 
     for (Map item : data) {
       String nodeKindId = (String)ClassHelper.convert(item.get("nodeKindId"), String.class);
       if ("BaseFunType".equals(nodeKindId)) {
         Long baseFunctionTypeId = (Long)ClassHelper.convert(item.get("id"), Long.class);
         buildOnPositionByBaseFunctionTypeId(projectOrgId, baseFunctionTypeId, item);
       }
     }
 
     return result;
   }
 
   public Map<String, Object> saveOnPosition(String projectOrgId, Long baseFunctionTypeId, String[] personIds)
   {
     Org projectOrg = this.orgService.loadOrgObject(projectOrgId);
     Util.check(projectOrg != null, String.format("未找到项目ID”%s“对应的项目组织。", new Object[] { projectOrgId }));
 
     BaseFunctionType baseFunctionType = this.functionService.loadBaseFunctionTypeObject(baseFunctionTypeId);
     Util.check(baseFunctionType != null, String.format("未找到业务岗位类别ID”%s“对应的业务岗位类别。", new Object[] { baseFunctionTypeId }));
 
     String selectOrgSql = "select * from sa_oporg t where t.center_id = ? and t.type_id = ? and org_kind_id = ?";
     List<Org> orgBaseFunctionTypes = this.serviceUtil.getEntityDao().queryToList(selectOrgSql, Org.class, new Object[] { projectOrgId, baseFunctionTypeId, "fun" });
 
     String selectChildrenCountSql = "select count(*) from sa_oporg t where parent_id = ?";
     String deleteSql = "delete from sa_oporg where id = ?";
     int childrenCount = 0;
 
     for (Org org : orgBaseFunctionTypes) {
       this.serviceUtil.getEntityDao().executeUpdate(deleteSql, new Object[] { org.getId() });
       childrenCount = this.serviceUtil.getEntityDao().queryToInt(selectChildrenCountSql, new Object[] { org.getParentId() });
       if (childrenCount == 0) {
         this.serviceUtil.getEntityDao().executeUpdate(deleteSql, new Object[] { org.getParentId() });
       }
 
     }
 
     Org group = (Org)this.serviceUtil.getEntityDao().queryToObject(selectOrgSql, Org.class, new Object[] { projectOrgId, baseFunctionType.getFolderId(), "grp" });
     String groupId = null;
 
     if (group == null) {
       SDO commonTree = this.configurationService.loadCommonTreeNode(baseFunctionType.getFolderId());
       childrenCount = this.serviceUtil.getEntityDao().queryToInt(selectChildrenCountSql, new Object[] { projectOrgId });
       String sequence = CommonUtil.lpad(3, ++childrenCount);
       SDO params = new SDO();
 
       params.putProperty("parentId", projectOrgId);
       params.putProperty("typeId", baseFunctionType.getFolderId());
       params.putProperty("orgKindId", "grp");
       params.putProperty("code", commonTree.getProperty("code"));
       params.putProperty("name", commonTree.getProperty("name"));
       params.putProperty("sequence", sequence);
       params.putProperty("status", Integer.valueOf(ValidStatus.ENABLED.getId()));
 
       groupId = this.orgService.insertOrg(params);
 
       group = (Org)this.serviceUtil.getEntityDao().queryToObject(selectOrgSql, Org.class, new Object[] { projectOrgId, baseFunctionType.getFolderId(), "grp" });
     } else {
       groupId = group.getId();
     }
 
     selectOrgSql = "select * from sa_oporg t where  t.center_id = ? and  dept_id = ? and person_id = ?";
     String selectPsmOwnBaseFunctionTypeSql = "select * from sa_oporg t where t.center_id = ? and  parent_id = ? and type_id = ?";
 
     for (String personId : personIds) {
       Org psm = (Org)this.serviceUtil.getEntityDao().queryToObject(selectOrgSql, Org.class, new Object[] { projectOrgId, groupId, personId });
       String psmId;
       if (psm == null) {
         Person person = this.orgService.loadPersonObject(personId);
         childrenCount = this.serviceUtil.getEntityDao().queryToInt(selectChildrenCountSql, new Object[] { groupId });
 
         String sequence = CommonUtil.lpad(3, ++childrenCount);
         psmId = this.orgService.InsertPersonMember(personId, person.getCode(), person.getName(), sequence, person.getStatusEnum(), group, ValidStatus.ENABLED, false);
       }
       else {
         psmId = psm.getId();
       }
 
       Org psmOwnBaseFunctionType = (Org)this.serviceUtil.getEntityDao().queryToObject(selectPsmOwnBaseFunctionTypeSql, Org.class, new Object[] { projectOrgId, psmId, baseFunctionTypeId });
 
       if (psmOwnBaseFunctionType == null) {
         childrenCount = this.serviceUtil.getEntityDao().queryToInt(selectChildrenCountSql, new Object[] { psmId });
         String sequence = CommonUtil.lpad(3, ++childrenCount);
         SDO params = new SDO();
         params.putProperty("parentId", psmId);
         params.putProperty("typeId", baseFunctionTypeId);
         params.putProperty("orgKindId", "fun");
         params.putProperty("code", baseFunctionType.getCode());
         params.putProperty("name", baseFunctionType.getName());
         params.putProperty("sequence", sequence);
         params.putProperty("status", Integer.valueOf(ValidStatus.ENABLED.getId()));
 
         this.orgService.insertOrg(params);
       }
     }
     Map item = new HashMap(2);
     buildOnPositionByBaseFunctionTypeId(projectOrgId, baseFunctionTypeId, item);
     return item;
   }
 }

