 package com.brc.system.data.impl;
 
 import com.brc.exception.ApplicationException;
 import com.brc.exception.EntityExecutorException;
 import com.brc.model.domain.parse.SQLBuilder;
 import com.brc.model.domain.parse.SQLExecutor;
 import com.brc.model.fn.ExpressManager;
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.data.util.BuildSQLUtil;
 import com.brc.util.ClassHelper;
 import com.brc.util.LogHome;
 import com.brc.util.QueryModel;
 import com.brc.util.StringUtil;
import com.brc.xmlbean.EntityDocument;
 import com.brc.xmlbean.EntityDocument.Entity;
 import com.brc.xmlbean.EntityDocument.Entity.Insert;
 import com.brc.xmlbean.EntityDocument.Entity.Update;
import com.brc.xmlbean.IdDocument;
 import com.brc.xmlbean.IdDocument.Id;
import com.brc.xmlbean.PropertyDocument;
 import com.brc.xmlbean.PropertyDocument.Property;
 import com.brc.xmlbean.PropertyDocument.Property.FillKind;
import com.brc.xmlbean.VersionDocument;
 import com.brc.xmlbean.VersionDocument.Version;
 import java.io.Serializable;
 import java.util.ArrayList;
 import java.util.Collection;
 import java.util.HashMap;
 import java.util.Iterator;
 import java.util.List;
 import java.util.Map;
 import org.apache.log4j.Logger;
 
 public class EntitySqlExecutorDaoImpl extends JDBCDaoImpl
   implements EntityParserDao
 {
   private SQLBuilder sqlBuilder;
 
   public void setSqlBuilder(SQLBuilder sqlBuilder)
   {
     this.sqlBuilder = sqlBuilder;
   }
 
   public SQLBuilder getSqlBuilder() {
     return this.sqlBuilder;
   }
 
   private Object evaluateExpr(String expr, String type)
   {
     try
     {
       Object result = ExpressManager.evaluate(expr);
       return ClassHelper.convert(result, type);
     } catch (Exception e) {
       LogHome.getLog(this).error("evaluateExpr:" + expr, e);
       throw new EntityExecutorException("evaluateExpr:" + expr, e);
     }
   }
 
   public Map<String, Object> getDefaultExprValues(EntityDocument.Entity entity)
   {
     Map map = new HashMap();
     for (PropertyDocument.Property property : entity.getPropertyArray()) {
       String defaultExpr = property.getDefaultExpr();
       if (!StringUtil.isBlank(defaultExpr))
       {
         if ((property.getFillKind() == PropertyDocument.Property.FillKind.SHOW) || (property.getFillKind() == PropertyDocument.Property.FillKind.BOTH)) {
           map.put(property.getName(), evaluateExpr(defaultExpr, property.getType()));
         }
       }
     }
     return map;
   }
 
   private Map<String, Serializable> initInsertId(EntityDocument.Entity entity, Map<String, Object> params)
   {
     Map idMap = new HashMap(entity.getIdArray().length);
     Object obj = null;
 
     for (IdDocument.Id id : entity.getIdArray()) {
       obj = params.get(id.getName());
       if ((obj == null) || (obj.toString().equals("")) || (obj.toString().equals("0"))) {
         if (!StringUtil.isBlank(id.getSequence()))
           obj = getSequence(id.getSequence());
         else if (!StringUtil.isBlank(id.getDefaultExpr())) {
           obj = evaluateExpr(id.getDefaultExpr(), id.getType());
         }
       }
       if ((obj == null) || (obj.toString().equals(""))) throw new ApplicationException("pk:" + id.getName() + " is null");
       idMap.put(id.getName(), (Serializable)obj);
     }
     return idMap;
   }
 
   private Map<String, Object> initInsertDefaultExpr(EntityDocument.Entity entity, Map<String, Object> params)
   {
     Map map = new HashMap();
     Object obj = null;
 
     for (PropertyDocument.Property property : entity.getPropertyArray()) {
       obj = params.get(property.getName());
       if ((obj == null) || (obj.toString().equals(""))) {
         String defaultExpr = property.getDefaultExpr();
         if (!StringUtil.isBlank(defaultExpr))
         {
           if ((property.getFillKind() == PropertyDocument.Property.FillKind.INSERT) || (property.getFillKind() == PropertyDocument.Property.FillKind.BOTH) || (property.getFillKind() == PropertyDocument.Property.FillKind.EDITOR))
           {
             map.put(property.getName(), evaluateExpr(defaultExpr, property.getType()));
           }
         }
       }
     }
     return map;
   }
 
   private Map<String, Object> initUpdateDefaultExpr(EntityDocument.Entity entity, Map<String, Object> params)
   {
     Map map = new HashMap();
     Object obj = null;
 
     for (PropertyDocument.Property property : entity.getPropertyArray()) {
       if ((property.getUpdate() == null) || (property.getUpdate() != PropertyDocument.Property.Update.FALSE))
       {
         obj = params.get(property.getName());
         if ((obj == null) || (obj.toString().equals(""))) {
           String defaultExpr = property.getDefaultExpr();
           if (!StringUtil.isBlank(defaultExpr))
           {
             if ((property.getFillKind() == PropertyDocument.Property.FillKind.UPDATE) || (property.getFillKind() == PropertyDocument.Property.FillKind.EDITOR))
               map.put(property.getName(), evaluateExpr(defaultExpr, property.getType()));
           }
         }
       }
     }
     return map;
   }
 
   private Map<String, Object> initVersion(EntityDocument.Entity entity)
   {
     Map map = new HashMap(1);
     VersionDocument.Version version = entity.getVersion();
     if (version != null) {
       Object obj = null;
       String name = version.getName();
       String sequence = version.getSequence();
       String defaultExpr = version.getDefaultExpr();
       String type = version.getType();
       if (!StringUtil.isBlank(defaultExpr)) {
         obj = evaluateExpr(defaultExpr, type);
       } else {
         sequence = StringUtil.isBlank(sequence) ? "SEQ_ID" : sequence;
         obj = getSequence(sequence);
       }
       map.put(name, obj);
     }
     return map;
   }
 
   public Serializable insert(EntityDocument.Entity entity, Map<String, Object> params)
     throws EntityExecutorException
   {
     if ((entity.getInsert() != null) && (entity.getInsert() == EntityDocument.Entity.Insert.FALSE)) {
       throw new EntityExecutorException("实体" + entity.getName() + "不允许新增!");
     }
     if ((params == null) || (params.size() == 0)) {
       throw new EntityExecutorException("参数param为空,无法保存空数据！");
     }
     SQLExecutor executor = this.sqlBuilder.buildInsertSql(entity);
     Map idMap = initInsertId(entity, params);
     params.putAll(idMap);
     params.putAll(initInsertDefaultExpr(entity, params));
     params.putAll(initVersion(entity));
 
     executeUpdate(executor.getExecuteSql(), executor.getParams(params));
 
     if (idMap.size() == 1) {
       return (Serializable)idMap.values().iterator().next();
     }
     return (Serializable)idMap;
   }
 
   public void batchInsert(EntityDocument.Entity entity, List<Map<String, Object>> list)
     throws EntityExecutorException
   {
     if ((entity.getInsert() != null) && (entity.getInsert() == EntityDocument.Entity.Insert.FALSE)) {
       throw new EntityExecutorException("实体" + entity.getName() + "不允许新增!");
     }
     if ((list == null) || (list.size() == 0)) {
       throw new EntityExecutorException("参数list为空,无法保存空数据！");
     }
     SQLExecutor executor = this.sqlBuilder.buildInsertSql(entity);
     List arrays = new ArrayList(list.size());
     for (Map params : list) {
       params.putAll(initInsertId(entity, params));
       params.putAll(initInsertDefaultExpr(entity, params));
       params.putAll(initVersion(entity));
       arrays.add(executor.getParams(params));
     }
     batchUpdate(executor.getExecuteSql(), arrays);
   }
 
   public int update(EntityDocument.Entity entity, Map<String, Object> params, String[] nullProperties)
     throws EntityExecutorException
   {
     if ((entity.getUpdate() != null) && (entity.getUpdate() == EntityDocument.Entity.Update.FALSE)) {
       throw new ApplicationException("实体" + entity.getName() + "不允许编辑!");
     }
     if ((params == null) || (params.size() == 0)) {
       throw new EntityExecutorException("参数param为空,无法保存空数据！");
     }
     params.putAll(initUpdateDefaultExpr(entity, params));
     params.putAll(initVersion(entity));
     SQLExecutor executor = this.sqlBuilder.buildUpdateSql(entity, params.keySet(), nullProperties);
     return executeUpdate(executor.getExecuteSql(), executor.getParams(params));
   }
 
   public void batchUpdate(EntityDocument.Entity entity, List<Map<String, Object>> list, String[] propertys)
     throws EntityExecutorException
   {
     if ((entity.getUpdate() != null) && (entity.getUpdate() == EntityDocument.Entity.Update.FALSE)) {
       throw new ApplicationException("实体" + entity.getName() + "不允许编辑!");
     }
     if ((list == null) || (list.size() == 0)) {
       throw new EntityExecutorException("参数list为空,无法保存空数据！");
     }
     Map tmp = (Map)list.get(0);
     SQLExecutor executor = this.sqlBuilder.buildUpdateSql(entity, tmp.keySet(), propertys);
     List arrays = new ArrayList(list.size());
     for (Map params : list) {
       params.putAll(initUpdateDefaultExpr(entity, params));
       params.putAll(initVersion(entity));
       arrays.add(executor.getParams(params));
     }
     batchUpdate(executor.getExecuteSql(), arrays);
   }
 
   public int updateByCondition(EntityDocument.Entity entity, Map<String, Object> params, Map<String, Object> conditions, String[] propertys)
     throws EntityExecutorException
   {
     if ((entity.getUpdate() != null) && (entity.getUpdate() == EntityDocument.Entity.Update.FALSE)) {
       throw new ApplicationException("实体" + entity.getName() + "不允许编辑!");
     }
     if ((params == null) || (params.size() == 0)) {
       throw new EntityExecutorException("参数param为空,无法保存空数据！");
     }
     params.putAll(initVersion(entity));
     SQLExecutor executor = this.sqlBuilder.buildUpdateSql(entity, params.keySet(), conditions.keySet(), propertys);
     params.putAll(conditions);
     return executeUpdate(executor.getExecuteSql(), executor.getParams(params));
   }
 
   public int delete(EntityDocument.Entity entity, Map<String, Object> params)
     throws EntityExecutorException
   {
     for (IdDocument.Id id : entity.getIdArray()) {
       Object obj = params.get(id.getName());
       if ((obj == null) || (obj.toString().equals(""))) throw new ApplicationException("pk:" + id.getName() + " is null");
     }
     SQLExecutor executor = this.sqlBuilder.buildDeleteSql(entity);
     return executeUpdate(executor.getExecuteSql(), executor.getParams(params));
   }
 
   public int deleteByCondition(EntityDocument.Entity entity, Map<String, Object> params)
     throws EntityExecutorException
   {
     if ((params == null) || (params.size() == 0)) {
       throw new EntityExecutorException("参数param为空！");
     }
     SQLExecutor executor = this.sqlBuilder.buildDeleteSql(entity, params.keySet());
     return executeUpdate(executor.getExecuteSql(), executor.getParams(params));
   }
 
   public int deleteById(EntityDocument.Entity entity, Serializable id)
     throws EntityExecutorException
   {
     Map params = new HashMap(1);
     for (IdDocument.Id ide : entity.getIdArray()) {
       params.put(ide.getName(), id);
     }
 
     return delete(entity, params);
   }
 
   public void deleteByIds(EntityDocument.Entity entity, Serializable[] ids)
     throws EntityExecutorException
   {
     SQLExecutor executor = this.sqlBuilder.buildDeleteSql(entity);
     List dataSet = new ArrayList(ids.length);
     for (Serializable id : ids) {
       dataSet.add(new Object[] { id });
     }
     batchUpdate(executor.getExecuteSql(), dataSet);
   }
 
   public Map<String, Object> load(EntityDocument.Entity entity, Map<String, Object> params)
     throws EntityExecutorException
   {
     SQLExecutor executor = this.sqlBuilder.buildLoadSql(entity);
     return queryToMap(executor.getExecuteSql(), executor.getParams(params));
   }
 
   public Map<String, Object> loadById(EntityDocument.Entity entity, Serializable id)
     throws EntityExecutorException
   {
     Map params = new HashMap(1);
     for (IdDocument.Id ide : entity.getIdArray()) {
       params.put(ide.getName(), id);
     }
 
     return load(entity, params);
   }
 
   public <T> T loadObjectById(EntityDocument.Entity entity, Class<T> cls, Serializable id) throws EntityExecutorException
   {
     SQLExecutor executor = this.sqlBuilder.buildLoadSql(entity);
     return queryToObject(executor.getExecuteSql(), cls, new Object[] { id });
   }
 
   public QueryModel getQueryModel(EntityDocument.Entity entity, Map<String, Object> params)
     throws EntityExecutorException
   {
     SQLExecutor executor = this.sqlBuilder.buildQuerySql(entity, params);
     String manageType = (String)ClassHelper.convert(params.get("sys_Manage_Type"), String.class);
     QueryModel queryModel = new QueryModel();
     if (!StringUtil.isBlank(manageType)) {
       queryModel.setManageType(manageType);
     }
     queryModel.setQueryParams(executor.getParamMap(params));
     queryModel.setSql(executor.getExecuteSql());
     return queryModel;
   }
 
   public List<Map<String, Object>> query(EntityDocument.Entity entity, Map<String, Object> params)
     throws EntityExecutorException
   {
     SQLExecutor executor = this.sqlBuilder.buildQuerySql(entity, params);
     Map map = executor.getParamMap(params);
     return queryToMapListByMapParam(executor.getExecuteSql(), map);
   }
 
   public <T> List<T> query(EntityDocument.Entity entity, Map<String, Object> params, Class<T> cls)
     throws EntityExecutorException
   {
     SQLExecutor executor = this.sqlBuilder.buildQuerySql(entity, params);
     Map map = executor.getParamMap(params);
     return queryToListByMapParam(executor.getExecuteSql(), cls, map);
   }
 
   public Integer count(EntityDocument.Entity entity, Map<String, Object> params)
     throws EntityExecutorException
   {
     SQLExecutor executor = this.sqlBuilder.buildQuerySql(entity, params);
     Map map = executor.getParamMap(params);
     String sql = BuildSQLUtil.getTotalSql(executor.getExecuteSql());
     return (Integer)queryToObjectByMapParam(sql, Integer.class, map);
   }
 
   public List<Map<String, Object>> queryBySqlName(EntityDocument.Entity entity, String sqlName, Map<String, Object> param)
     throws EntityExecutorException
   {
     SQLExecutor executor = this.sqlBuilder.buildSqlByName(entity, sqlName, param);
     Map map = executor.getParamMap(param);
     return queryToMapListByMapParam(executor.getExecuteSql(), map);
   }
 
   public <T> T queryBySqlName(EntityDocument.Entity entity, String sqlName, Class<T> cls, Object[] args)
     throws EntityExecutorException
   {
     return queryToObject(getSqlByName(entity, sqlName), cls, args);
   }
 
   public QueryModel getQueryModelByName(EntityDocument.Entity entity, String sqlName, Map<String, Object> params)
     throws EntityExecutorException
   {
     SQLExecutor executor = this.sqlBuilder.buildSqlByName(entity, sqlName, params);
     String manageType = (String)ClassHelper.convert(params.get("sys_Manage_Type"), String.class);
     QueryModel queryModel = new QueryModel();
     if (!StringUtil.isBlank(manageType)) {
       queryModel.setManageType(manageType);
     }
     queryModel.setQueryParams(executor.getParamMap(params));
     queryModel.setSql(executor.getExecuteSql());
     return queryModel;
   }
 
   public int executeUpdateBySqlName(EntityDocument.Entity entity, String sqlName, Object[] params)
   {
     return executeUpdate(getSqlByName(entity, sqlName), params);
   }
 
   public String getSqlByName(EntityDocument.Entity entity, String sqlName) {
     return this.sqlBuilder.getSqlByName(entity, sqlName);
   }
 
   public void checkUniqueness(EntityDocument.Entity entity, Map<String, Object> params, boolean flag, String[] fields)
   {
     if (fields.length > 0) {
       Map param = new HashMap();
       String tableName = entity.getTable();
       Object value = null;
       PropertyDocument.Property p = null;
       Integer count = Integer.valueOf(0);
       StringBuffer fieldLabels = new StringBuffer();
       StringBuffer sql = new StringBuffer("select count(0) from ").append(tableName).append(" where 1=1");
       if (flag)
       {
         for (IdDocument.Id id : entity.getIdArray()) {
           sql.append(" AND ").append(id.getColumn());
           sql.append(" <> ").append(":").append(id.getName());
           value = params.get(id.getName());
           if ((value == null) || (value.toString().equals(""))) {
             throw new EntityExecutorException(String.format("输入主键%s为空,无法执行校验!", new Object[] { id.getName() }));
           }
           param.put(id.getName(), ClassHelper.convert(value, id.getType()));
         }
       }
       StringBuffer temp = new StringBuffer();
       StringBuffer tempLabels = new StringBuffer();
       for (String field : fields) {
         if (!StringUtil.isBlank(field)) {
           temp.delete(0, temp.length());
           tempLabels.delete(0, tempLabels.length());
           temp.append(sql);
           String[] names = field.split(",");
           for (String name : names) {
             value = params.get(name);
             if ((value != null) && (!value.toString().equals(""))) {
               p = getPropertyByName(entity, name);
               if (p != null) {
                 temp.append(" AND ").append(p.getColumn());
                 temp.append(" = ").append(":").append(p.getName());
                 tempLabels.append(p.getLabel()).append(",");
                 param.put(p.getName(), ClassHelper.convert(value, p.getType()));
               }
             }
           }
           count = (Integer)queryToObjectByMapParam(temp.toString(), Integer.class, param);
           if (count.intValue() > 0)
             fieldLabels.append(tempLabels);
         }
       }
       if (fieldLabels.length() > 0) {
         fieldLabels.delete(fieldLabels.length() - 1, fieldLabels.length());
         throw new EntityExecutorException(String.format("输入数据'%s'重复,无法保存!", new Object[] { fieldLabels.toString() }));
       }
     }
   }
 
   private PropertyDocument.Property getPropertyByName(EntityDocument.Entity entity, String name)
   {
     for (PropertyDocument.Property p : entity.getPropertyArray()) {
       if (p.getName().equals(name)) {
         return p;
       }
     }
     return null;
   }
 }

