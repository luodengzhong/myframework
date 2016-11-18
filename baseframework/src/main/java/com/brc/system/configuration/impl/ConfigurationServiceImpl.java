 package com.brc.system.configuration.impl;
 
 import com.brc.exception.ApplicationException;
 import com.brc.system.configuration.CommonTreeKind;
 import com.brc.system.configuration.ConfigurationService;
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.opm.Operator;
 import com.brc.system.share.service.SQLQuery;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.system.util.CommonUtil;
 import com.brc.system.util.NameCodeUniqueValidator;
 import com.brc.system.util.Util;
 import com.brc.util.ClassHelper;
 import com.brc.util.DataUtil;
 import com.brc.util.QueryModel;
 import com.brc.util.SDO;
import com.brc.xmlbean.EntityDocument;
 import com.brc.xmlbean.EntityDocument.Entity;
 import java.io.Serializable;
 import java.util.ArrayList;
 import java.util.Iterator;
 import java.util.List;
 import java.util.Map;
 
 public class ConfigurationServiceImpl
   implements ConfigurationService
 {
   private ServiceUtil serviceUtil;
 
   private EntityDocument.Entity getCommonTreeEntity()
   {
     return this.serviceUtil.getEntity("config/domain/com/brc/configuration/configuration.xml", "commonTree");
   }
 
   private EntityDocument.Entity getCommonHandlerEntity(String name) {
     return this.serviceUtil.getEntity("/config/domain/com/brc/configuration/common.xml", name);
   }
 
   public void setServiceUtil(ServiceUtil serviceUtil) {
     this.serviceUtil = serviceUtil;
   }
 
   private void checkCommonTreeConstraints(SDO params) {
     Long parentId = (Long)params.getProperty("parentId", Long.class);
     NameCodeUniqueValidator.newInstance(getCommonTreeEntity(), params, "id", "checkCommonTreeExistSql", "parent_id", parentId).validate();
   }
 
   private String[] buildFullIdAndName(Long parentId, Long id, String name) {
     String[] result = new String[2];
     Map parentData = loadCommonTreeNode(parentId).getProperties();
     Util.check(parentData.size() > 0, "没有找到父节点。");
 
     String parentFullId = (String)ClassHelper.convert(parentData.get("fullId"), String.class);
     String parentFullName = (String)ClassHelper.convert(parentData.get("fullName"), String.class);
 
     result[0] = CommonUtil.createFileFullName(parentFullId == null ? "" : parentFullId, id.toString(), "");
     result[1] = CommonUtil.createFileFullName(parentFullName == null ? "" : parentFullName, name, "");
     return result;
   }
 
   private void fillFullInfo(SDO params, String operationKind)
   {
     Long id;
     if ("insert".equalsIgnoreCase(operationKind))
       id = this.serviceUtil.getEntityDao().getSequence("SEQ_ID");
     else {
       id = (Long)params.getProperty("id", Long.class);
     }
     Long parentId = (Long)params.getProperty("parentId", Long.class);
     String name = (String)params.getProperty("name", String.class);
 
     String[] fullInfo = buildFullIdAndName(parentId, id, name);
     params.putProperty("fullId", fullInfo[0]);
     params.putProperty("fullName", fullInfo[1]);
   }
 
   public Long insertCommonTree(SDO params)
   {
     checkCommonTreeConstraints(params);
     fillFullInfo(params, "insert");
     return (Long)this.serviceUtil.getEntityDao().insert(getCommonTreeEntity(), params.getProperties());
   }
 
   public void updateCommonTree(SDO params)
   {
     checkCommonTreeConstraints(params);
     fillFullInfo(params, "update");
     this.serviceUtil.getEntityDao().update(getCommonTreeEntity(), params.getProperties(), new String[0]);
   }
 
   public void deleteCommonTree(Long id, Integer kindId)
   {
     String sql = "select count(0) from sys_commontree t  where t.parent_id=?";
     int count = this.serviceUtil.getEntityDao().queryToInt(sql, new Object[] { id });
     if (count > 0) {
       throw new ApplicationException("该节点存在子节点不能删除！");
     }
     String[] tabInfo = CommonTreeKind.getBusinessTableInfo(kindId);
     if (tabInfo == null) {
       throw new ApplicationException("不能识别树结构类型！");
     }
     count = this.serviceUtil.getSQLQuery().getTotal(tabInfo[0], tabInfo[1], id);
     if (count > 0) {
       throw new ApplicationException("存在业务数据不能删除！");
     }
     this.serviceUtil.getEntityDao().deleteById(getCommonTreeEntity(), id);
   }
 
   public Long getCommonTreeNextSequence(Long parentId)
   {
     return this.serviceUtil.getNextSequence("config/domain/com/brc/configuration/configuration.xml", "commonTree", "Parent_Id", parentId);
   }
 
   public void updateCommonTreeSequence(Map<Long, Long> params)
   {
     this.serviceUtil.updateSequence("config/domain/com/brc/configuration/configuration.xml", "commonTree", params);
   }
 
   public SDO loadCommonTreeNode(Long id)
   {
     SDO sdo = new SDO();
     sdo.setProperties(this.serviceUtil.getEntityDao().loadById(getCommonTreeEntity(), id));
     return sdo;
   }
 
   public SDO loadCommonTrees(SDO params)
   {
     QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModel(getCommonTreeEntity(), params.getProperties());
     Map map = this.serviceUtil.getSQLQuery().executeQuery(queryModel, params);
     SDO sdo = new SDO();
     sdo.setProperties(map);
     return sdo;
   }
 
   public SDO loadSlicedCommonTrees(SDO params)
   {
     QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModel(getCommonTreeEntity(), params.getProperties());
     Map map = this.serviceUtil.getSQLQuery().executeSlicedQuery(queryModel, params);
     SDO sdo = new SDO();
     sdo.setProperties(map);
     return sdo;
   }
 
   public void saveUserProcessTemplate(SDO params)
   {
     Long groupId = (Long)params.getProperty("handlerGroupId", Long.class);
     if (groupId == null)
       groupId = (Long)this.serviceUtil.getEntityDao().insert(getCommonHandlerEntity("commonHandlerGroup"), params.getProperties());
     else {
       this.serviceUtil.getEntityDao().update(getCommonHandlerEntity("commonHandlerGroup"), params.getProperties(), new String[0]);
     }
     params.putProperty("handlerGroupId", groupId);
     saveUserProcessTemplateDetail(params);
   }
 
   public List<Map<String, Object>> queryUserProcessTemplate(SDO params) {
     String personId = params.getOperator().getId();
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getCommonHandlerEntity("commonHandlerGroup"), "getCommonHandlerGroup");
     List<Map<String,Object>> groups = this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[] { personId });
 
     String detailSql = this.serviceUtil.getEntityDao().getSqlByName(getCommonHandlerEntity("commonHandler"), "queryUserProcessByBizId");
     for (Map m : groups) {
       Long groupId = (Long)ClassHelper.convert(m.get("handlerGroupId"), Long.class);
       List details = this.serviceUtil.getEntityDao().queryToListMap(detailSql, new Object[] { groupId });
       m.put("details", details);
     }
     return groups;
   }
 
   public void saveUserProcessTemplateDetail(SDO params) {
     List details = params.getList("detailData");
     if ((details == null) || (details.size() == 0)) {
       return;
     }
     Long handlerGroupId = (Long)params.getProperty("handlerGroupId", Long.class);
 
     deleteHandlerByBizId(handlerGroupId);
     List inserted = new ArrayList(details.size());
     for (Iterator i$ = details.iterator(); i$.hasNext(); ) { Object item = i$.next();
 
       Map m = (Map)item;
       m.put("bizId", handlerGroupId);
       inserted.add(m);
     }
     if (inserted.size() > 0)
       this.serviceUtil.getEntityDao().batchInsert(getCommonHandlerEntity("commonHandler"), inserted);
   }
 
   public void deleteUserProcessTemplate(SDO params)
   {
     Long handlerGroupId = (Long)params.getProperty("handlerGroupId", Long.class);
     deleteHandlerByBizId(handlerGroupId);
     this.serviceUtil.getEntityDao().deleteById(getCommonHandlerEntity("commonHandlerGroup"), handlerGroupId);
   }
 
   public List<Map<String, Object>> queryHandlerOrgByBizId(Long bizId)
   {
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getCommonHandlerEntity("commonHandler"), "getHandlerOrgByBizId");
     return this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[] { bizId });
   }
 
   public List<Map<String, Object>> getHandlerByBizIdAndKindId(Long bizId, String kindId)
   {
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getCommonHandlerEntity("commonHandler"), "getHandlerByBizIdAndKindId");
     return this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[] { bizId, kindId });
   }
 
   public List<Map<String, Object>> queryHandlerPersonsByKindIdObGroupId(Serializable bizId, String kindId)
   {
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getCommonHandlerEntity("commonHandler"), "queryHandlerPersonsByKindIdObGroupId");
     return this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[] { bizId, kindId });
   }
 
   public void deleteHandlerByBizId(Serializable bizId)
   {
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getCommonHandlerEntity("commonHandler"), "deleteByBizId");
     this.serviceUtil.getEntityDao().executeUpdate(sql, new Object[] { bizId });
   }
 
   public void deleteHandlerByHandlerId(List<Object[]> dataSet)
   {
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getCommonHandlerEntity("commonHandler"), "deleteByHandlerId");
     this.serviceUtil.getEntityDao().batchUpdate(sql, dataSet);
   }
 
   public void deleteHandlerByHandlerId(Long[] ids) {
     if ((ids == null) || (ids.length == 0)) return;
     List dataSet = new ArrayList(ids.length);
     for (Long id : ids) {
       dataSet.add(new Object[] { id });
     }
     deleteHandlerByHandlerId(dataSet);
   }
 
   public void insertHandlerByDataSet(List<Map<String, Object>> dataSet)
   {
     if ((dataSet != null) && (dataSet.size() > 0))
       this.serviceUtil.getEntityDao().batchInsert(getCommonHandlerEntity("commonHandler"), dataSet);
   }
 
   public void updateHandlerByDataSet(List<Map<String, Object>> dataSet)
   {
     if ((dataSet != null) && (dataSet.size() > 0))
       this.serviceUtil.getEntityDao().batchUpdate(getCommonHandlerEntity("commonHandler"), dataSet, new String[0]);
   }
 
   public void saveHandlerByBizIdAndData(List<Object> details, Serializable bizId)
   {
     List inserted = new ArrayList();
     List updated = new ArrayList();
     DataUtil.getInsertedAndUpdated(details, "bizId", bizId, inserted, updated);
     EntityDocument.Entity entity = getCommonHandlerEntity("commonHandler");
     if (inserted.size() > 0) {
       this.serviceUtil.getEntityDao().batchInsert(entity, inserted);
     }
     if (updated.size() > 0)
       this.serviceUtil.getEntityDao().batchUpdate(entity, updated, new String[0]);
   }
 
   public List<Map<String, Object>> queryHandlerPersonsByBizIdAndKindId(Serializable bizId, String kindId)
   {
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getCommonHandlerEntity("commonHandler"), "getPersonByBizIdAndKindId");
     return this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[] { bizId, kindId });
   }
 
   public QueryModel getQueryCommonHandlerModel(SDO params) {
     QueryModel query = this.serviceUtil.getEntityDao().getQueryModel(getCommonHandlerEntity("commonHandler"), params.getProperties());
     return query;
   }
 }

