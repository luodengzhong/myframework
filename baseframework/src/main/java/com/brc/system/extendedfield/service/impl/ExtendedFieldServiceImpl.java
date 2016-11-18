 package com.brc.system.extendedfield.service.impl;
 
 import com.brc.exception.ApplicationException;
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.extendedfield.service.ExtendedFieldService;
 import com.brc.system.share.service.SQLQuery;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.system.util.Util;
 import com.brc.util.ClassHelper;
 import com.brc.util.DictUtil;
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
 import net.sf.json.JSONObject;
 
 public class ExtendedFieldServiceImpl
   implements ExtendedFieldService
 {
   public static final String MODEL_FILE_NAME = "config/domain/com/brc/system/cfg/extendedField.xml";
   public static final String ENTITY_SYS_EXTENDED_FIELD = "extendedField";
   public static final String ENTITY_SYS_EXTENDED_FIELD_DEFINE = "extendedFieldDefine";
   public static final String ENTITY_SYS_EXTENDED_FIELD_GROUP = "extendedFieldGroup";
   public static final String ENTITY_SYS_EXTENDED_FIELD_STORAGE = "extendedFieldStorage";
   private ServiceUtil serviceUtil;
 
   public void setServiceUtil(ServiceUtil serviceUtil)
   {
     this.serviceUtil = serviceUtil;
   }
 
   private EntityDocument.Entity getEntity(String name)
   {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/cfg/extendedField.xml", name);
   }
 
   public void insertExtendedFields(SDO params)
   {
     Long groupId = (Long)params.getProperty("groupId", Long.class, Integer.valueOf(-1));
     String defineIds = (String)params.getProperty("defineIds", String.class);
     if (StringUtil.isBlank(defineIds)) {
       throw new ApplicationException("未选择扩展字段!");
     }
 
     int count = this.serviceUtil.getEntityDao().count(getEntity("extendedFieldGroup"), params.getProperties()).intValue();
     if (count == 0) {
       throw new ApplicationException("分组不存在,可能被其他用户删除或修改!");
     }
     String[] ids = defineIds.split(",");
     List dataList = new ArrayList(ids.length);
     String sql = "select count(0) from sys_extended_field t where t.group_id=? and t.define_id=?";
     int total = 0;
     for (String defineId : ids) {
       total = this.serviceUtil.getEntityDao().queryToInt(sql, new Object[] { groupId, defineId });
       if (total == 0) {
         Map data = new HashMap(3);
         data.put("groupId", groupId);
         data.put("defineId", defineId);
         data.put("sequence", Integer.valueOf(-1));
         dataList.add(data);
       }
     }
     if (dataList.size() > 0)
       this.serviceUtil.getEntityDao().batchInsert(getEntity("extendedField"), dataList);
   }
 
   public void updateExtendedFieldSequence(Map<Long, Long> data)
   {
     this.serviceUtil.updateSequence("config/domain/com/brc/system/cfg/extendedField.xml", "extendedField", "EXTENDED_FIELD_ID", data);
   }
 
   public void deleteExtendedField(Long groupId, Long[] ids)
   {
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getEntity("extendedField"), "isUsed");
     Map map = null;
     for (Long id : ids) {
       map = this.serviceUtil.getEntityDao().queryToMap(sql, new Object[] { id, groupId });
       Util.check(map.size() == 0, "字段“%s”已被使用，不能删除！", new Object[] { map.get("fieldCname") });
     }
     this.serviceUtil.getEntityDao().deleteByIds(getEntity("extendedField"), ids);
   }
 
   public Map<String, Object> slicedQueryExtendedField(SDO params)
   {
     QueryModel query = this.serviceUtil.getEntityDao().getQueryModel(getEntity("extendedField"), params.getProperties());
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(query, params);
   }
 
   public List<Map<String, Object>> queryExtendedFieldByGroupId(Long groupId)
   {
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getEntity("extendedField"), "getByGroupId");
     return this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[] { groupId });
   }
 
   public Serializable insertExtendedFieldDefine(SDO params)
   {
     return this.serviceUtil.getEntityDao().insert(getEntity("extendedFieldDefine"), params.getProperties());
   }
 
   public void updateExtendedFieldDefine(SDO params)
   {
     this.serviceUtil.getEntityDao().update(getEntity("extendedFieldDefine"), params.getProperties(), new String[0]);
   }
 
   public void updateExtendedFieldDefineParentId(Long[] ids, Long parentId)
   {
     this.serviceUtil.updateById("sys_extended_field_define", "parent_id", "define_id", ids, parentId);
   }
 
   public Map<String, Object> loadExtendedFieldDefine(SDO params)
   {
     return this.serviceUtil.getEntityDao().load(getEntity("extendedFieldDefine"), params.getProperties());
   }
 
   public void deleteExtendedFieldDefine(Long[] ids)
   {
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getEntity("extendedFieldDefine"), "isUsed");
     Map map = null;
     for (Long id : ids) {
       map = this.serviceUtil.getEntityDao().queryToMap(sql, new Object[] { id });
       Util.check(map.size() == 0, "字段“%s”已被使用，不能删除！", new Object[] { map.get("fieldCname") });
     }
     this.serviceUtil.getEntityDao().deleteByIds(getEntity("extendedFieldDefine"), ids);
   }
 
   public Map<String, Object> slicedQueryExtendedFieldDefine(SDO params)
   {
     QueryModel query = this.serviceUtil.getEntityDao().getQueryModel(getEntity("extendedFieldDefine"), params.getProperties());
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(query, params);
   }
 
   public Serializable insertExtendedFieldGroup(SDO params)
   {
     return this.serviceUtil.getEntityDao().insert(getEntity("extendedFieldGroup"), params.getProperties());
   }
 
   public void updateExtendedFieldGroup(SDO params)
   {
     this.serviceUtil.getEntityDao().update(getEntity("extendedFieldGroup"), params.getProperties(), new String[0]);
   }
 
   public Map<String, Object> loadExtendedFieldGroup(SDO params)
   {
     return this.serviceUtil.getEntityDao().load(getEntity("extendedFieldGroup"), params.getProperties());
   }
 
   public void deleteExtendedFieldGroup(Long[] ids)
   {
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getEntity("extendedFieldGroup"), "isUsed");
     Map map = null;
     for (Long id : ids) {
       map = this.serviceUtil.getEntityDao().queryToMap(sql, new Object[] { id });
       Util.check(map.size() == 0, "分组“%s”已被使用，不能删除！", new Object[] { map.get("name") });
     }
     this.serviceUtil.getEntityDao().deleteByIds(getEntity("extendedFieldGroup"), ids);
   }
 
   public Map<String, Object> slicedQueryExtendedFieldGroup(SDO params)
   {
     QueryModel query = this.serviceUtil.getEntityDao().getQueryModel(getEntity("extendedFieldGroup"), params.getProperties());
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(query, params);
   }
 
   public List<Map<String, Object>> queryGroupByBusinessCode(String businessCode)
   {
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getEntity("extendedFieldGroup"), "queyForView");
     return this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[] { businessCode });
   }
 
   public void updateExtendedFieldGroupParentId(Long[] ids, Long parentId)
   {
     this.serviceUtil.updateById("sys_extended_field_group", "parent_id", "group_id", ids, parentId);
   }
 
   public void updateExtendedFieldGroupSequence(Map<Long, Long> data)
   {
     this.serviceUtil.updateSequence("config/domain/com/brc/system/cfg/extendedField.xml", "extendedFieldGroup", "GROUP_ID", data);
   }
 
   public List<Map<String, Object>> queryExtendedFieldForView(String businessCode, Long bizId)
   {
     List<Map<String,Object>> groups = queryGroupByBusinessCode(businessCode);
     List list = new ArrayList(groups.size());
     for (Map group : groups) {
       Long groupId = (Long)ClassHelper.convert(group.get("groupId"), Long.class);
       Integer cols = (Integer)ClassHelper.convert(group.get("cols"), Integer.class, Integer.valueOf(2));
       group.put("cols", cols);
       List<Map<String,Object>> fields = null;
       if (bizId != null) {
         Map param = new HashMap(3);
         param.put("businessCode", businessCode);
         param.put("bizId", bizId);
         param.put("groupId", groupId);
         String sql = this.serviceUtil.getEntityDao().getSqlByName(getEntity("extendedFieldStorage"), "queyValueForView");
         fields = this.serviceUtil.getEntityDao().queryToMapListByMapParam(sql, param);
       } else {
         fields = queryExtendedFieldByGroupId(groupId);
       }
       if ((null != fields) && (fields.size() > 0)) {
         for (Map map : fields) {
           String type = (String)ClassHelper.convert(map.get("dataSourceKind"), String.class, "0");
           String fieldValue = (String)ClassHelper.convert(map.get("fieldValue"), String.class, "");
           String lookUpValue = (String)ClassHelper.convert(map.get("lookUpValue"), String.class, fieldValue);
           map.put("fieldNameValue", lookUpValue);
           Integer colSpan = (Integer)ClassHelper.convert(map.get("colSpan"), Integer.class, Integer.valueOf(1));
           map.put("colSpan", colSpan);
           Integer newLine = (Integer)ClassHelper.convert(map.get("newLine"), Integer.class, Integer.valueOf(0));
           map.put("newLine", newLine);
           Integer visible = (Integer)ClassHelper.convert(map.get("visible"), Integer.class, Integer.valueOf(1));
           map.put("visible", visible);
           if (type.equals("3")) {
             String dataSource = (String)ClassHelper.convert(map.get("dataSource"), String.class, "");
             if (!StringUtil.isBlank(dataSource)) {
               try {
                 String[] s = dataSource.split("[|]");
                 JSONObject jo = new JSONObject();
                 jo.putAll(DictUtil.getDictionary(s[0], s.length > 1 ? s[1] : null));
                 map.put("dataSource", jo.toString());
               } catch (Exception e) {
                 map.put("dataSource", "");
               }
             }
           }
         }
         group.put("fields", fields);
         list.add(group);
       }
     }
     return list;
   }
 }

