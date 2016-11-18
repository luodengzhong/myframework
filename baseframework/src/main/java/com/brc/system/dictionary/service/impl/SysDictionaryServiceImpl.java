 package com.brc.system.dictionary.service.impl;
 
 import com.brc.exception.ApplicationException;
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.dictionary.model.DictionaryModel;
 import com.brc.system.dictionary.service.SysDictionaryService;
 import com.brc.system.share.service.SQLQuery;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.util.ClassHelper;
 import com.brc.util.LogHome;
 import com.brc.util.QueryModel;
 import com.brc.util.SDO;
 import com.brc.util.Singleton;
 import com.brc.util.StringUtil;
import com.brc.xmlbean.EntityDocument;
 import com.brc.xmlbean.EntityDocument.Entity;
 import java.io.Serializable;
 import java.util.ArrayList;
 import java.util.HashMap;
 import java.util.Iterator;
 import java.util.LinkedHashMap;
 import java.util.List;
 import java.util.Map;
 import java.util.Map.Entry;
import java.util.Set;

 import org.apache.log4j.Logger;
 
 public class SysDictionaryServiceImpl
   implements SysDictionaryService
 {
   public static final String MODEL_FILE_NAME = "config/domain/com/brc/system/cfg/sysDictionary.xml";
   public static final String SYS_DICTIONARY_ENTITY = "dictionary";
   public static final String SYS_DICTIONARY_DETAIL_ENTITY = "dictionaryDetail";
   private ServiceUtil serviceUtil;
 
   public void setServiceUtil(ServiceUtil serviceUtil)
   {
     this.serviceUtil = serviceUtil;
   }
 
   private EntityDocument.Entity getEntity(String name)
   {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/cfg/sysDictionary.xml", name);
   }
 
   public Serializable insertDictionary(SDO params, List<Object> detailData)
   {
     EntityDocument.Entity en = getEntity("dictionary");
     this.serviceUtil.getEntityDao().checkUniqueness(en, params.getProperties(), false, new String[] { "code" });
     Number id = (Number)this.serviceUtil.getEntityDao().insert(en, params.getProperties());
     if ((null != detailData) && (detailData.size() > 0)) {
       List details = new ArrayList(detailData.size());
       for (Iterator i$ = detailData.iterator(); i$.hasNext(); ) { Object obj = i$.next();
         Map m = (Map)obj;
         m.put("dictId", id);
         details.add(m);
       }
       this.serviceUtil.getEntityDao().batchInsert(getEntity("dictionaryDetail"), details);
     }
     return id;
   }
 
   public void updateDictionary(SDO params, List<Object> detailData)
   {
     EntityDocument.Entity en = getEntity("dictionary");
     this.serviceUtil.getEntityDao().checkUniqueness(en, params.getProperties(), true, new String[] { "code" });
     this.serviceUtil.getEntityDao().update(en, params.getProperties(), new String[0]);
     if ((null != detailData) && (detailData.size() > 0)) {
       List updateDetails = new ArrayList(detailData.size());
       List insertDetails = new ArrayList(detailData.size());
       for (Iterator i$ = detailData.iterator(); i$.hasNext(); ) { Object obj = i$.next();
         Map m = (Map)obj;
         if ((null == m.get("detailId")) || (StringUtil.isBlank(m.get("detailId").toString()))) {
           m.put("dictId", params.getProperty("dictId"));
           insertDetails.add(m);
         } else {
           updateDetails.add(m);
         }
       }
       if (insertDetails.size() > 0) {
         this.serviceUtil.getEntityDao().batchInsert(getEntity("dictionaryDetail"), insertDetails);
       }
       if (updateDetails.size() > 0)
         this.serviceUtil.getEntityDao().batchUpdate(getEntity("dictionaryDetail"), updateDetails, new String[0]);
     }
   }
 
   public Map<String, Object> loadDictionary(SDO params)
   {
     return this.serviceUtil.getEntityDao().load(getEntity("dictionary"), params.getProperties());
   }
 
   public void deleteDictionary(Long[] ids)
   {
     EntityDocument.Entity en = getEntity("dictionary");
     String sql = this.serviceUtil.getEntityDao().getSqlByName(en, "getStatus");
     for (Long id : ids) {
       Map map = this.serviceUtil.getEntityDao().queryToMap(sql, new Object[] { id });
       if (null != map) {
         if (((Long)ClassHelper.convert(map.get("status"), Long.class, Integer.valueOf(0))).longValue() != 0L) {
           throw new ApplicationException(String.format("%s可能被其他用户修改,不能删除!", new Object[] { map.get("name") }));
         }
         Map param = new HashMap(1);
         param.put("dictId", id);
         this.serviceUtil.getEntityDao().deleteByCondition(getEntity("dictionaryDetail"), param);
         this.serviceUtil.getEntityDao().deleteById(en, id);
       }
     }
   }
 
   public void updateDictionaryParentId(Long[] ids, Long parentId)
   {
     this.serviceUtil.updateById("sys_dictionary", "parent_id", "dict_id", ids, parentId);
   }
 
   public void updateDictionaryStatus(Long[] ids, int status)
   {
     this.serviceUtil.updateById("sys_dictionary", "status", "dict_id", ids, Integer.valueOf(status));
   }
 
   public Map<String, Object> slicedQueryDictionary(SDO params)
   {
     QueryModel query = this.serviceUtil.getEntityDao().getQueryModel(getEntity("dictionary"), params.getProperties());
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(query, params);
   }
 
   public void deleteDictionaryDetail(Long[] ids)
   {
     EntityDocument.Entity en = getEntity("dictionaryDetail");
     String sql = this.serviceUtil.getEntityDao().getSqlByName(en, "getStatus");
     for (Long id : ids) {
       Map map = this.serviceUtil.getEntityDao().queryToMap(sql, new Object[] { id });
       if (null != map) {
         if (((Long)ClassHelper.convert(map.get("status"), Long.class, Integer.valueOf(0))).longValue() != 0L) {
           throw new ApplicationException(String.format("%s可能被其他用户修改,不能删除!", new Object[] { map.get("name") }));
         }
         this.serviceUtil.getEntityDao().deleteById(en, id);
       }
     }
   }
 
   public Map<String, Object> slicedQueryDictionaryDetail(SDO params)
   {
     QueryModel query = this.serviceUtil.getEntityDao().getQueryModel(getEntity("dictionaryDetail"), params.getProperties());
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(query, params);
   }
 
   public void updateDictionaryDetailStatus(Long[] ids, int status)
   {
     this.serviceUtil.updateById("sys_dictionary_detail", "status", "detail_id", ids, Integer.valueOf(status));
   }
 
   public List<DictionaryModel> queryAllDictionary()
   {
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getEntity("dictionary"), "plugInLoad");
     return this.serviceUtil.getEntityDao().queryToList(sql, DictionaryModel.class, new Object[0]);
   }
 
   public void syncCache()
   {
     List<DictionaryModel> list = null;
     try {
       list = queryAllDictionary();
     } catch (Exception exception) {
       LogHome.getLog(this).error("加载系统字典：", exception);
       exception.printStackTrace();
       throw new ApplicationException(exception);
     }
     Singleton.removeDictionary();
     Map codeMap = new HashMap();
 
     if ((list != null) && (list.size() > 0)) {
       for (DictionaryModel model : list) {
         String code = model.getCode();
         if (codeMap.containsKey(code)) {
           Map m = (Map)codeMap.get(code);
           m.put(model.getValue(), model);
         } else {
           Map m = new LinkedHashMap();
           m.put(model.getValue(), model);
           codeMap.put(code, m);
         }
       }
				Set<Entry> set = codeMap.entrySet();
       for (Map.Entry entry : set)
         Singleton.setDictionary((String)entry.getKey(), (HashMap)entry.getValue());
     }
   }
 }

