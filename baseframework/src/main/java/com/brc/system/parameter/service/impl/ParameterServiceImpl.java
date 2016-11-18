 package com.brc.system.parameter.service.impl;
 
 import com.brc.exception.ApplicationException;
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.opm.Operator;
 import com.brc.system.parameter.service.ParameterService;
 import com.brc.system.share.service.SQLQuery;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.util.LogHome;
 import com.brc.util.QueryModel;
 import com.brc.util.SDO;
 import com.brc.util.Singleton;
import com.brc.xmlbean.EntityDocument;
 import com.brc.xmlbean.EntityDocument.Entity;
 import java.io.Serializable;
 import java.util.ArrayList;
 import java.util.HashMap;
 import java.util.Iterator;
 import java.util.List;
 import java.util.Map;
 import org.apache.log4j.Logger;
 
 public class ParameterServiceImpl
   implements ParameterService
 {
   public static final String MODEL_FILE_NAME = "config/domain/com/brc/system/cfg/parameter.xml";
   public static final String SYS_PARAMETER_ENTITY = "parameter";
   public static final String SYS_SERIAL_NUMBER_ENTITY = "serialNumber";
   public static final String SYS_MESSAGE_KIND_ENTITY = "messageKind";
   public static final String SYS_USER_MESSAGE_ENTITY = "userMessageSetup";
   private ServiceUtil serviceUtil;
 
   public void setServiceUtil(ServiceUtil serviceUtil)
   {
     this.serviceUtil = serviceUtil;
   }
 
   private EntityDocument.Entity getEntity(String name)
   {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/cfg/parameter.xml", name);
   }
 
   public Serializable insertParameter(SDO params)
   {
     EntityDocument.Entity en = getEntity("parameter");
     this.serviceUtil.getEntityDao().checkUniqueness(en, params.getProperties(), false, new String[] { "code" });
     return this.serviceUtil.getEntityDao().insert(en, params.getProperties());
   }
 
   public void updateParameter(SDO params)
   {
     EntityDocument.Entity en = getEntity("parameter");
     this.serviceUtil.getEntityDao().checkUniqueness(en, params.getProperties(), true, new String[] { "code" });
     this.serviceUtil.getEntityDao().update(en, params.getProperties(), new String[0]);
   }
 
   public Map<String, Object> loadParameter(SDO params)
   {
     return this.serviceUtil.getEntityDao().load(getEntity("parameter"), params.getProperties());
   }
 
   public List<Map<String, Object>> queryAllParameter()
   {
     return this.serviceUtil.getEntityDao().queryBySqlName(getEntity("parameter"), "plugInLoad", null);
   }
 
   public void deleteParameter(Long[] ids)
   {
     this.serviceUtil.getEntityDao().deleteByIds(getEntity("parameter"), ids);
   }
 
   public void updateParameterParentId(Long[] ids, Long parentId)
   {
     this.serviceUtil.updateById("sys_parameter", "parent_id", "id", ids, parentId);
   }
 
   public Map<String, Object> slicedQueryParameter(SDO params)
   {
     QueryModel query = this.serviceUtil.getEntityDao().getQueryModel(getEntity("parameter"), params.getProperties());
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(query, params);
   }
 
   public Serializable insertSerialNumber(SDO params)
   {
     EntityDocument.Entity en = getEntity("serialNumber");
     this.serviceUtil.getEntityDao().checkUniqueness(en, params.getProperties(), false, new String[] { "code" });
     return this.serviceUtil.getEntityDao().insert(en, params.getProperties());
   }
 
   public void updateSerialNumber(SDO params)
   {
     EntityDocument.Entity en = getEntity("serialNumber");
     this.serviceUtil.getEntityDao().checkUniqueness(en, params.getProperties(), true, new String[] { "code" });
     this.serviceUtil.getEntityDao().update(en, params.getProperties(), new String[0]);
   }
 
   public Map<String, Object> loadSerialNumber(SDO params)
   {
     return this.serviceUtil.getEntityDao().load(getEntity("serialNumber"), params.getProperties());
   }
 
   public Map<String, Object> loadSerialNumberByCode(String code)
   {
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getEntity("serialNumber"), "getByCode");
     return this.serviceUtil.getEntityDao().queryToMap(sql, new Object[] { code });
   }
 
   public void deleteSerialNumber(Long[] ids)
   {
     this.serviceUtil.getEntityDao().deleteByIds(getEntity("serialNumber"), ids);
   }
 
   public Map<String, Object> slicedQuerySerialNumber(SDO params)
   {
     QueryModel query = this.serviceUtil.getEntityDao().getQueryModel(getEntity("serialNumber"), params.getProperties());
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(query, params);
   }
 
   public void updateSerialNumberParentId(Long[] ids, Long parentId)
   {
     this.serviceUtil.updateById("sys_serial_number", "parent_id", "id", ids, parentId);
   }
 
   public void updateSerialNumberValue(Long id, Long value) {
     this.serviceUtil.getEntityDao().executeUpdateBySqlName(getEntity("serialNumber"), "updateValue", new Object[] { value, id });
   }
 
   public List<Map<String, Object>> queryAllSerialNumber()
   {
     return this.serviceUtil.getEntityDao().queryBySqlName(getEntity("serialNumber"), "plugInLoad", null);
   }
 
   public void syncCacheParameter()
   {
     List<Map<String,Object>> parameterList = null;
     try {
       parameterList = queryAllParameter();
     } catch (Exception exception) {
       LogHome.getLog(this).error("加载系统参数：", exception);
       exception.printStackTrace();
       throw new ApplicationException(exception);
     }
     Singleton.removeParameter();
     for (Map map : parameterList)
       Singleton.setParameter((String)map.get("code"), (String)map.get("value"));
   }
 
   public Long saveMessageKind(SDO params)
   {
     EntityDocument.Entity en = getEntity("messageKind");
     Long id = (Long)params.getProperty("messageKindId", Long.class);
     if (id == null) {
       this.serviceUtil.getEntityDao().checkUniqueness(en, params.getProperties(), false, new String[] { "code" });
       id = (Long)this.serviceUtil.getEntityDao().insert(en, params.getProperties());
     } else {
       this.serviceUtil.getEntityDao().checkUniqueness(en, params.getProperties(), true, new String[] { "code" });
       this.serviceUtil.getEntityDao().update(en, params.getProperties(), new String[0]);
     }
     return id;
   }
 
   public void deleteMessageKind(SDO params)
   {
     Long[] ids = params.getLongArray("ids");
     this.serviceUtil.getEntityDao().deleteByIds(getEntity("messageKind"), ids);
   }
 
   public Map<String, Object> slicedQueryMessageKind(SDO params)
   {
     QueryModel query = this.serviceUtil.getEntityDao().getQueryModel(getEntity("messageKind"), params.getProperties());
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(query, params);
   }
 
   public Map<String, Object> loadMessageKind(SDO params)
   {
     return this.serviceUtil.getEntityDao().load(getEntity("messageKind"), params.getProperties());
   }
 
   public void updateMessageKindStatus(SDO params)
   {
     Long[] ids = params.getLongArray("ids");
     Integer status = (Integer)params.getProperty("status", Integer.class);
     this.serviceUtil.updateById("SYS_MESSAGE_KIND", "status", "MESSAGE_KIND_ID", ids, status);
   }
 
   public List<Map<String, Object>> queryUserMessageKind(SDO params)
   {
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getEntity("userMessageSetup"), "queryUserMessageKind");
     return this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[] { params.getOperator().getId() });
   }
 
   public void saveUserMessageKind(SDO params)
   {
     List datas = params.getList("detailData");
     String personId = params.getOperator().getId();
     List insertData = new ArrayList(datas.size());
     String sql = "delete from sys_user_message_setup t where t.message_kind_code=? and t.person_id=?";
     List delData = new ArrayList(datas.size());
     for (Iterator i$ = datas.iterator(); i$.hasNext(); ) { Object data = i$.next();
       Map m = (Map)data;
       insertData.add(m);
       delData.add(new Object[] { m.get("messageKindCode"), personId });
     }
 
     this.serviceUtil.getEntityDao().batchUpdate(sql, delData);
 
     this.serviceUtil.getEntityDao().batchInsert(getEntity("userMessageSetup"), insertData);
   }
 
   public Map<String, String> getEnabledMessageKind()
   {
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getEntity("messageKind"), "getEnabledMessageKind");
     List<Map<String,Object>> list = this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[0]);
     Map map = new HashMap(list.size());
     for (Map m : list) {
       map.put(m.get("code").toString(), m.get("name").toString());
     }
     return map;
   }
 }

