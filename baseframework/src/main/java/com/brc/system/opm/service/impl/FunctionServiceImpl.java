 package com.brc.system.opm.service.impl;
 
 import com.brc.exception.ApplicationException;
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.opm.domain.BaseFunctionType;
 import com.brc.system.opm.domain.BizFunction;
 import com.brc.system.opm.domain.BizFunctionOwnBase;
 import com.brc.system.opm.domain.Org;
 import com.brc.system.opm.service.FunctionService;
 import com.brc.system.share.service.SQLQuery;
 import com.brc.system.share.service.ServiceUtil;
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
 import java.util.HashMap;
 import java.util.List;
 import java.util.Map;
 
 public class FunctionServiceImpl
   implements FunctionService
 {
   private ServiceUtil serviceUtil;
 
   public void setServiceUtil(ServiceUtil serviceUtil)
   {
     this.serviceUtil = serviceUtil;
   }
 
   private EntityDocument.Entity getBaseFunctionTypeEntity() {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/opm/function.xml", "baseFunctionType");
   }
 
   private void checkBaseFunctionTypeConstraints(SDO sdo)
   {
     NameCodeUniqueValidator nameCodeUniqueValidator = new NameCodeUniqueValidator();
 
     nameCodeUniqueValidator.setEntity(getBaseFunctionTypeEntity());
     nameCodeUniqueValidator.setData(sdo);
     nameCodeUniqueValidator.setKeyFieldName("id");
     nameCodeUniqueValidator.setCheckUniqueSqlName("checkBaseFunctionTypeExistSql");
 
     nameCodeUniqueValidator.validate();
   }
 
   public Long insertBaseFunctionType(SDO params)
   {
     checkBaseFunctionTypeConstraints(params);
     return (Long)this.serviceUtil.getEntityDao().insert(getBaseFunctionTypeEntity(), params.getProperties());
   }
 
   public void updateBaseFunctionType(SDO params)
   {
     checkBaseFunctionTypeConstraints(params);
     this.serviceUtil.getEntityDao().update(getBaseFunctionTypeEntity(), params.getProperties(), new String[0]);
   }
 
   public void deleteBaseFunctionType(Long[] ids)
   {
     if (ids.length == 0) {
       throw new ApplicationException("您没有选择要删除的数据。");
     }
 
     String referencedByBizFunctionSql = this.serviceUtil.getEntityDao().getSqlByName(getBaseFunctionTypeEntity(), "checkBaseFunctionTypeReferencedByBizFunctionSql");
 
     for (Long id : ids) {
       BaseFunctionType baseFunctionType = loadBaseFunctionTypeObject(id);
       Util.check(baseFunctionType != null, "无效的基础职能角标识“%s”！", new Object[] { id });
 
       BizFunction bizFunction = (BizFunction)this.serviceUtil.getEntityDao().queryToObject(referencedByBizFunctionSql, BizFunction.class, new Object[] { id });
       if (bizFunction != null) {
         Util.check(true, String.format("基础职能角色“%s”已被“%s使用，不能删除。”", new Object[] { baseFunctionType.getName(), bizFunction.getName() }));
       }
     }
 
     this.serviceUtil.getEntityDao().deleteByIds(getBaseFunctionTypeEntity(), (Serializable[])ids);
   }
 
   public Long getBaseFunctionTypeNextSequence()
   {
     return this.serviceUtil.getNextSequence("config/domain/com/brc/system/opm/function.xml", "baseFunctionType");
   }
 
   public void updateBaseFunctionTypeSequence(Map<Long, Long> params)
   {
     this.serviceUtil.updateSequence("config/domain/com/brc/system/opm/function.xml", "baseFunctionType", params);
   }
 
   public void updateBaseFunctionTypeFolderId(Long[] ids, Long folderId)
   {
     this.serviceUtil.updateById("SA_OPBASEFUNCTIONTYPE", "FOLDER_ID", "ID", ids, folderId);
   }
 
   public Map<String, Object> loadBaseFunctionType(Long id)
   {
     return this.serviceUtil.getEntityDao().loadById(getBaseFunctionTypeEntity(), id);
   }
 
   public BaseFunctionType loadBaseFunctionTypeObject(Long id)
   {
     String selectBaseFunctionTypeSql = this.serviceUtil.getEntityDao().getSqlByName(getBaseFunctionTypeEntity(), "selectBaseFunctionType");
     return (BaseFunctionType)this.serviceUtil.getEntityDao().queryToObject(selectBaseFunctionTypeSql, BaseFunctionType.class, new Object[] { id });
   }
 
   public Map<String, Object> slicedQueryBaseFunctionTypes(SDO params)
   {
     QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModel(getBaseFunctionTypeEntity(), params.getProperties());
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(queryModel, params);
   }
 
   private EntityDocument.Entity getBizFunctionEntity() {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/opm/function.xml", "bizFunction");
   }
 
   public void saveBizFunction(SDO params)
   {
     List details = params.getList("data");
 
     List inserted = new ArrayList();
     List updated = new ArrayList();
 
     DataUtil.getSingleTableData(details, "id", inserted, updated);
 
     int changedSize = inserted.size() + updated.size();
 
     List<Map<String,Object>> changed = new ArrayList(changedSize);
     changed.addAll(inserted);
     changed.addAll(updated);
 
     List codes = new ArrayList(changedSize);
     List names = new ArrayList(changedSize);
 
     NameCodeUniqueValidator nameCodeUniqueValidator = new NameCodeUniqueValidator();
 
     nameCodeUniqueValidator.setEntity(getBizFunctionEntity());
     nameCodeUniqueValidator.setKeyFieldName("id");
     nameCodeUniqueValidator.setCheckUniqueSqlName("checkBizFunctionExistSql");
 
     for (Map item : changed) {
       String code = (String)ClassHelper.convert(item.get("code"), String.class);
       String name = (String)ClassHelper.convert(item.get("name"), String.class);
 
       if (codes.indexOf(code) == -1)
         codes.add(code);
       else {
         Util.check(true, String.format("编码“%s”重复，不能保存。", new Object[] { code }));
       }
 
       if (names.indexOf(name) == -1)
         names.add(name);
       else {
         Util.check(true, String.format("名称“%s”重复，不能保存。", new Object[] { name }));
       }
 
       SDO sdo = new SDO(item);
       nameCodeUniqueValidator.setData(sdo);
       nameCodeUniqueValidator.validate();
     }
 
     DataUtil.saveSingleTable(this.serviceUtil, params, "id", getBizFunctionEntity());
   }
 
   public BizFunction loadBizFunction(Long id)
   {
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getBizFunctionEntity(), "selectBizFunction");
     return (BizFunction)this.serviceUtil.getEntityDao().queryToObject(sql, BizFunction.class, new Object[] { id });
   }
 
   public void deleteBizFunction(Long[] ids)
   {
     if (ids.length == 0) {
       throw new ApplicationException("您没有选择要删除的数据。");
     }
 
     String referencedByOrgSql = this.serviceUtil.getEntityDao().getSqlByName(getBizFunctionEntity(), "checkBizFunctionReferencedByOrgSql");
     Map deleteParams = new HashMap(1);
     for (Long id : ids) {
       BizFunction bizFunction = loadBizFunction(id);
 
       Org org = (Org)this.serviceUtil.getEntityDao().queryToObject(referencedByOrgSql, Org.class, new Object[] { id });
       if (org != null) {
         Util.check(true, String.format("业务职能角色“%s”已被组织“%s”使用，不能删除。", new Object[] { bizFunction.getName(), org.getName() }));
       }
 
       deleteParams.put("bizFunctionId", id);
       this.serviceUtil.getEntityDao().deleteByCondition(getBizFunctionOwnBaseEntity(), deleteParams);
     }
     this.serviceUtil.getEntityDao().deleteByIds(getBizFunctionEntity(), (Serializable[])ids);
   }
 
   public Map<String, Object> slicedQueryBizFunctions(SDO params)
   {
     QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModel(getBizFunctionEntity(), params.getProperties());
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(queryModel, params);
   }
 
   private EntityDocument.Entity getBizFunctionOwnBaseEntity() {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/opm/function.xml", "bizFunctionOwnBase");
   }
 
   public void saveBizFunctionOwnBase(Long bizFunctionId, Long[] baseFunctionTypeIds)
   {
     List list = new ArrayList(baseFunctionTypeIds.length);
     BizFunctionOwnBase bizFunctionOwnBase = null;
     String selectByBaseFunctionTypeIdSql = this.serviceUtil.getEntityDao().getSqlByName(getBizFunctionOwnBaseEntity(), "selectByBaseFunctionTypeIdSql");
     for (Long baseFunctionTypeId : baseFunctionTypeIds) {
       Map item = new HashMap();
       bizFunctionOwnBase = (BizFunctionOwnBase)this.serviceUtil.getEntityDao().queryToObject(selectByBaseFunctionTypeIdSql, BizFunctionOwnBase.class, new Object[] { bizFunctionId, baseFunctionTypeId });
 
       if (bizFunctionOwnBase == null) {
         item.put("bizFunctionId", bizFunctionId);
         item.put("baseFunctionTypeId", baseFunctionTypeId);
         list.add(item);
       }
     }
 
     if (list.size() > 0)
       this.serviceUtil.getEntityDao().batchInsert(getBizFunctionOwnBaseEntity(), list);
   }
 
   public void deleteBizFunctionOwnBase(Long[] ids)
   {
     this.serviceUtil.getEntityDao().deleteByIds(getBizFunctionOwnBaseEntity(), (Serializable[])ids);
   }
 
   public Map<String, Object> slicedQueryBizFunctionOwnBases(SDO params)
   {
     QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModel(getBizFunctionOwnBaseEntity(), params.getProperties());
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(queryModel, params);
   }
 
   public Map<String, Object> queryAuthorisedBaseFunctionType(String orgId)
   {
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getBaseFunctionTypeEntity(), "selectAuthorisedBaseFunctionType");
 
     List data = this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[0]);
     Map result = new HashMap(1);
     result.put("Rows", data);
     return result;
   }
 }

