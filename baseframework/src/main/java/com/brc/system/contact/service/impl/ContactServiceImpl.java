 package com.brc.system.contact.service.impl;
 
 import com.brc.system.contact.service.ContactService;
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.share.service.SQLQuery;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.util.QueryModel;
 import com.brc.util.SDO;
 import com.brc.util.StringUtil;
import com.brc.xmlbean.EntityDocument;
 import com.brc.xmlbean.EntityDocument.Entity;
 import java.io.Serializable;
 import java.util.ArrayList;
 import java.util.HashMap;
 import java.util.Iterator;
 import java.util.List;
 import java.util.Map;
 
 public class ContactServiceImpl
   implements ContactService
 {
   public static final String MODEL_FILE_NAME = "config/domain/com/brc/system/contact/contact.xml";
   public static final String CONTACT = "contact";
   public static final String CONTACT_WAY = "contactWay";
   public static final String CONTACT_CONFIGURATION = "contactConfiguration";
   private ServiceUtil serviceUtil;
 
   private EntityDocument.Entity getContactEntity()
   {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/contact/contact.xml", "contact");
   }
 
   private EntityDocument.Entity getContactWayEntity() {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/contact/contact.xml", "contactWay");
   }
 
   private EntityDocument.Entity getContactConfigurationEntity() {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/contact/contact.xml", "contactConfiguration");
   }
 
   public void setServiceUtil(ServiceUtil serviceUtil) {
     this.serviceUtil = serviceUtil;
   }
 
   public Map<String, Object> sliceQueryConfiguration(SDO sdo)
   {
     QueryModel query = this.serviceUtil.getEntityDao().getQueryModel(getContactConfigurationEntity(), sdo.getProperties());
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(query, sdo);
   }
 
   public void saveConfiguration(SDO sdo)
   {
     if (sdo.getProperty("deletedData") != null) {
       List<Map<String,Object>> deletedList = convertToListMap(sdo.getList("deletedData"));
       for (Map stringObjectMap : deletedList) {
         if (stringObjectMap.get("contactConfigurationId") != null) {
           this.serviceUtil.getEntityDao().deleteById(getContactConfigurationEntity(), stringObjectMap.get("contactConfigurationId").toString());
         }
       }
     }
 
     if (sdo.getProperty("updatedData") != null) {
       List updatedList = convertToListMap(sdo.getList("updatedData"));
 
       List insertList = getInsertList(updatedList);
       List updateList = getUpdateList(updatedList);
 
       if (insertList.size() > 0) {
         this.serviceUtil.getEntityDao().batchInsert(getContactConfigurationEntity(), insertList);
       }
       if (updateList.size() > 0)
         this.serviceUtil.getEntityDao().batchUpdate(getContactConfigurationEntity(), updateList, new String[0]);
     }
   }
 
   private List<Map<String, Object>> getUpdateList(List<Map<String, Object>> updatedList)
   {
     List newList = new ArrayList();
     for (Map stringObjectMap : updatedList) {
       if (stringObjectMap.get("contactConfigurationId") != null) {
         newList.add(stringObjectMap);
       }
     }
     return newList;
   }
 
   private List<Map<String, Object>> getInsertList(List<Map<String, Object>> dataList) {
     List newList = new ArrayList();
     for (Map stringObjectMap : dataList) {
       if (stringObjectMap.get("contactConfigurationId") == null) {
         newList.add(stringObjectMap);
       }
     }
     return newList;
   }
 
   private List<Map<String, Object>> convertToListMap(List<Object> objList) {
     List result = new ArrayList();
     for (Iterator i$ = objList.iterator(); i$.hasNext(); ) { Object object = i$.next();
       result.add((Map)object);
     }
     return result;
   }
 
   public Map<String, Object> queryContactWay(SDO sdo)
   {
     String contactId = (String)sdo.getProperty("contactId");
     if (StringUtil.isBlank(contactId)) {
       List data = this.serviceUtil.getEntityDao().queryBySqlName(getContactWayEntity(), "queryNoContact", sdo.getProperties());
       Map map = new HashMap();
       map.put("Rows", data);
       return map;
     }
     QueryModel query = this.serviceUtil.getEntityDao().getQueryModel(getContactWayEntity(), sdo.getProperties());
     return this.serviceUtil.getSQLQuery().executeQuery(query, sdo);
   }
 
   public Serializable saveContactWay(SDO sdo)
   {
     String contactId = (String)sdo.getProperty("contactId");
     if (StringUtil.isBlank(contactId)) {
       assertContactNotExist(sdo);
 
       contactId = this.serviceUtil.getEntityDao().insert(getContactEntity(), sdo.getProperties()).toString();
       sdo.putProperty("contactId", contactId);
     }
     else {
       this.serviceUtil.getEntityDao().update(getContactEntity(), sdo.getProperties(), new String[0]);
     }
 
     Map deleteCondition = new HashMap();
     deleteCondition.put("contactId", contactId);
 
     this.serviceUtil.getEntityDao().deleteByCondition(getContactWayEntity(), deleteCondition);
 
     if (sdo.getProperty("contactWayList") != null) {
       List<Map<String,Object>> wayList = convertToListMap(sdo.getList("contactWayList"));
       if (wayList.size() > 0) {
         for (Map map : wayList) {
           map.put("contactId", contactId);
         }
         this.serviceUtil.getEntityDao().batchInsert(getContactWayEntity(), wayList);
       }
     }
 
     return contactId;
   }
 
   public Map<String, Object> loadContactByBizCodeAndBizId(String bizCode, String bizId)
   {
     Map params = new HashMap();
     params.put("bizCode", bizCode);
     params.put("bizId", bizId);
     SDO sdo = new SDO(params);
 
     QueryModel query = this.serviceUtil.getEntityDao().getQueryModel(getContactEntity(), sdo.getProperties());
     List result = (List)this.serviceUtil.getSQLQuery().executeQuery(query, sdo).get("Rows");
     if ((result != null) && (result.size() > 0)) {
       return (Map)result.get(0);
     }
     return new HashMap();
   }
 
   public Map<String, Object> queryAvailableContactWay(SDO sdo)
   {
     QueryModel query = this.serviceUtil.getEntityDao().getQueryModel(getContactConfigurationEntity(), sdo.getProperties());
     return this.serviceUtil.getSQLQuery().executeQuery(query, sdo);
   }
 
   public Map<String, Object> loadFirstContactWay(SDO sdo)
   {
     String bizCode = (String)sdo.getProperty("bizCode", String.class);
     String bizId = (String)sdo.getProperty("bizId", String.class);
     if ((StringUtil.isBlank(bizCode)) || (StringUtil.isBlank(bizId))) {
       return new HashMap();
     }
 
     QueryModel query = this.serviceUtil.getEntityDao().getQueryModelByName(getContactWayEntity(), "queryContactWayByBizCodeAndBizId", sdo.getProperties());
     List result = (List)this.serviceUtil.getSQLQuery().executeQuery(query, sdo).get("Rows");
     if ((result != null) && (result.size() > 0)) {
       return (Map)result.get(0);
     }
     return new HashMap();
   }
 
   public void updateStatus(Integer status, Long[] ids)
   {
     this.serviceUtil.updateById("SYS_CONTACT_CONFIGURATION", "STATUS", "CONTACT_CONFIGURATION_ID", ids, status);
   }
 
   private void assertContactNotExist(SDO sdo) {
     Map queryMap = new HashMap();
     queryMap.put("bizCode", sdo.getProperty("bizCode"));
     queryMap.put("bizId", sdo.getProperty("bizId"));
 
     QueryModel query = this.serviceUtil.getEntityDao().getQueryModel(getContactEntity(), queryMap);
     List contactList = (List)this.serviceUtil.getSQLQuery().executeQuery(query, new SDO(queryMap)).get("Rows");
     if ((contactList != null) && (contactList.size() > 0))
       throw new IllegalArgumentException("联系方式已经存在，请不要重复保存！");
   }
 }

