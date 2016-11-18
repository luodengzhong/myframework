 package com.brc.system.opm.service.impl;
 
 import com.brc.exception.ApplicationException;
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.opm.Operator;
 import com.brc.system.opm.service.PermissionFieldService;
 import com.brc.system.share.service.GetPermission;
 import com.brc.system.share.service.SQLQuery;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.util.ClassHelper;
 import com.brc.util.DataUtil;
 import com.brc.util.QueryModel;
 import com.brc.util.SDO;
 import com.brc.util.StringUtil;
import com.brc.xmlbean.EntityDocument;
 import com.brc.xmlbean.EntityDocument.Entity;
 import java.io.Serializable;
 import java.util.ArrayList;
 import java.util.HashMap;
 import java.util.List;
 import java.util.Map;
 
 public class PermissionFieldServiceImpl
   implements PermissionFieldService
 {
   public static final String MODEL_FILE_NAME = "config/domain/com/brc/system/opm/permissionField.xml";
   public static final String SA_PERMISSIONFIELD_ENTITY = "permissionfield";
   public static final String SA_FUNCTION_FIELD_GROUP_ENTITY = "functionFieldGroup";
   public static final String SA_FUNCTION_PERMISSIONFIELD_ENTITY = "functionPermissionField";
   private ServiceUtil serviceUtil;
   private GetPermission getPermission;
 
   public void setServiceUtil(ServiceUtil serviceUtil)
   {
     this.serviceUtil = serviceUtil;
   }
 
   public void setGetPermission(GetPermission getPermission)
   {
     this.getPermission = getPermission;
   }
 
   private EntityDocument.Entity getEntity(String name)
   {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/opm/permissionField.xml", name);
   }
 
   public Serializable insertPermissionfield(SDO params)
   {
     return this.serviceUtil.getEntityDao().insert(getEntity("permissionfield"), params.getProperties());
   }
 
   public void updatePermissionfield(SDO params)
   {
     this.serviceUtil.getEntityDao().update(getEntity("permissionfield"), params.getProperties(), new String[0]);
   }
 
   public Map<String, Object> loadPermissionfield(SDO params)
   {
     return this.serviceUtil.getEntityDao().load(getEntity("permissionfield"), params.getProperties());
   }
 
   public void deletePermissionfield(Long[] ids)
   {
     this.serviceUtil.getEntityDao().deleteByIds(getEntity("permissionfield"), ids);
   }
 
   public Map<String, Object> slicedQueryPermissionfield(SDO params)
   {
     QueryModel query = this.serviceUtil.getEntityDao().getQueryModel(getEntity("permissionfield"), params.getProperties());
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(query, params);
   }
 
   public void updatePermissionfieldStatus(Long[] ids, int status)
   {
     this.serviceUtil.updateById("SA_OPPERMISSIONFIELD", "status", "FIELD_ID", ids, Integer.valueOf(status));
   }
 
   public void updatePermissionfieldParentId(Long[] ids, Long parentId)
   {
     this.serviceUtil.updateById("SA_OPPERMISSIONFIELD", "PARENT_ID", "FIELD_ID", ids, parentId);
   }
 
   public List<Map<String, Object>> queryFunctionFieldGroup(Long functionId)
   {
     Map params = new HashMap(1);
     params.put("functionId", functionId);
     return this.serviceUtil.getEntityDao().query(getEntity("functionFieldGroup"), params);
   }
 
   public Serializable insertFunctionFieldGroup(SDO params)
   {
     return this.serviceUtil.getEntityDao().insert(getEntity("functionFieldGroup"), params.getProperties());
   }
 
   public void updateFunctionFieldGroup(SDO params)
   {
     this.serviceUtil.getEntityDao().update(getEntity("functionFieldGroup"), params.getProperties(), new String[0]);
   }
 
   public void deleteFunctionFieldGroup(SDO sdo)
   {
     Long functionFieldGroupId = (Long)sdo.getProperty("functionFieldGroupId", Long.class);
     this.serviceUtil.getEntityDao().deleteById(getEntity("functionFieldGroup"), functionFieldGroupId);
     Map params = new HashMap(1);
     params.put("functionFieldGroupId", functionFieldGroupId);
     this.serviceUtil.getEntityDao().deleteByCondition(getEntity("functionPermissionField"), params);
 
     this.getPermission.removeCacheByKind("PermissionFieldByFunction");
   }
 
   public Map<String, Object> slicedQueryFunctionPermissionfield(SDO params)
   {
     QueryModel query = this.serviceUtil.getEntityDao().getQueryModel(getEntity("functionPermissionField"), params.getProperties());
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(query, params);
   }
 
   public void deleteFunctionPermissionfield(Long[] ids)
   {
     this.serviceUtil.getEntityDao().deleteByIds(getEntity("functionPermissionField"), ids);
 
     this.getPermission.removeCacheByKind("PermissionFieldByFunction");
   }
 
   public void saveFunctionPermissionfield(SDO sdo)
   {
     Long functionFieldGroupId = (Long)sdo.getProperty("functionFieldGroupId", Long.class);
     if (functionFieldGroupId == null) {
       throw new ApplicationException("请先保存字段分组!");
     }
     List insertedDetails = new ArrayList();
     List updatedDetails = new ArrayList();
     DataUtil.getDetails(sdo, "functionFieldGroupId", functionFieldGroupId, insertedDetails, updatedDetails);
 
     if (insertedDetails.size() > 0) {
       this.serviceUtil.getEntityDao().batchInsert(getEntity("functionPermissionField"), insertedDetails);
     }
     if (updatedDetails.size() > 0) {
       this.serviceUtil.getEntityDao().batchUpdate(getEntity("functionPermissionField"), updatedDetails, new String[0]);
     }
 
     this.getPermission.removeCacheByKind("PermissionFieldByFunction");
   }
 
   public List<Map<String, Object>> getOperatorPermissionFieldByFunction(String function, Operator operator, boolean isId)
   {
     String functionId = function;
     if (!isId) {
       String sql = "select t.id from sa_opfunction t where t.code =?";
       functionId = this.serviceUtil.getEntityDao().queryToString(sql, new Object[] { function });
     }
     if (StringUtil.isBlank(functionId)) {
       throw new ApplicationException("功能ID未找到!");
     }
     String querySql = this.serviceUtil.getEntityDao().getSqlByName(getEntity("functionFieldGroup"), "getOperatorPermissionFieldByFunction");
     List<Map<String,Object>> list = this.serviceUtil.getEntityDao().queryToListMap(querySql, new Object[] { functionId, operator.getId() });
     Map fields = new HashMap(list.size());
 
     for (Map map : list) {
       String fieldCode = (String)ClassHelper.convert(map.get("fieldCode"), String.class);
       String fieldAuthority = (String)ClassHelper.convert(map.get("fieldAuthority"), String.class);
       Map tmp = (Map)fields.get(fieldCode);
       if (tmp == null) {
         fields.put(fieldCode, map);
       } else {
         String tmpFieldAuthority = (String)ClassHelper.convert(tmp.get("fieldAuthority"), String.class);
 
         if (compareAuthority(fieldAuthority, tmpFieldAuthority))
         {
           fields.remove(fieldCode);
           fields.put(fieldCode, map);
         }
       }
     }
     List fieldList = new ArrayList(fields.size());
     fieldList.addAll(fields.values());
     return fieldList;
   }
 
   private boolean compareAuthority(String na, String oa)
   {
     if (na.equals("readwrite")) {
       return true;
     }
     if ((na.equals("readonly")) && (oa.equals("noaccess"))) {
       return true;
     }
     return false;
   }
 }

