 package com.brc.util;
 
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.opm.Operator;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.system.util.CommonUtil;
import com.brc.xmlbean.EntityDocument;
 import com.brc.xmlbean.EntityDocument.Entity;
 import java.io.Serializable;
 import java.util.ArrayList;
 import java.util.Iterator;
 import java.util.List;
 import java.util.Map;
 
 public class DataUtil
 {
   public static void getDetails(SDO bizData, String masterFieldName, Serializable masterFieldValue, List<Map<String, Object>> inserted, List<Map<String, Object>> updated)
   {
     List details = bizData.getList("detailData");
     Iterator i$;
     if ((details != null) && (details.size() > 0))
       for (i$ = details.iterator(); i$.hasNext(); ) { Object item = i$.next();
 
         Map m = (Map)item;
         if ((m.get(masterFieldName) == null) || (StringUtil.isBlank(m.get(masterFieldName).toString()))) {
           m.put(masterFieldName, masterFieldValue);
           inserted.add(m);
         } else {
           updated.add(m);
         }
       }
   }
 
   public static void getInsertedAndUpdated(List<Object> data, String masterFieldName, Serializable masterFieldValue, List<Map<String, Object>> inserted, List<Map<String, Object>> updated)
   {
     Iterator i$;
     if ((data != null) && (data.size() > 0))
       for (i$ = data.iterator(); i$.hasNext(); ) { Object item = i$.next();
 
         Map m = (Map)item;
         if ((m.get(masterFieldName) == null) || (StringUtil.isBlank(m.get(masterFieldName).toString()))) {
           m.put(masterFieldName, masterFieldValue);
           inserted.add(m);
         } else {
           updated.add(m);
         }
       }
   }
 
   public static void insertList(ServiceUtil serviceUtil, List<Object> data, String masterFieldName, Serializable masterFieldValue, EntityDocument.Entity entity)
   {
     List inserted = new ArrayList();
     List updated = new ArrayList();
     getInsertedAndUpdated(data, masterFieldName, masterFieldValue, inserted, updated);
 
     if (inserted.size() > 0) {
       serviceUtil.getEntityDao().batchInsert(entity, inserted);
     }
     if (updated.size() > 0)
       serviceUtil.getEntityDao().batchUpdate(entity, updated, new String[0]);
   }
 
   public static void insertAndUpdateList(ServiceUtil serviceUtil, SDO bizData, String masterFieldName, Serializable masterFieldValue, EntityDocument.Entity entity)
   {
     List details = bizData.getList("detailData");
     List inserted = new ArrayList();
     List updated = new ArrayList();
     getInsertedAndUpdated(details, masterFieldName, masterFieldValue, inserted, updated);
     if (inserted.size() > 0) {
       serviceUtil.getEntityDao().batchInsert(entity, inserted);
     }
     if (updated.size() > 0)
       serviceUtil.getEntityDao().batchUpdate(entity, updated, new String[0]);
   }
 
   public static void getSingleTableData(List<Object> data, String keyFieldName, List<Map<String, Object>> inserted, List<Map<String, Object>> updated)
   {
     Iterator i$;
     if ((data != null) && (data.size() > 0))
       for (i$ = data.iterator(); i$.hasNext(); ) { Object item = i$.next();
 
         Map m = (Map)item;
         if (m.get(keyFieldName) == null)
           inserted.add(m);
         else
           updated.add(m);
       }
   }
 
   public static void saveSingleTable(ServiceUtil serviceUtil, SDO bizData, String keyFieldName, EntityDocument.Entity entity)
   {
     List details = bizData.getList("data");
     List inserted = new ArrayList();
     List updated = new ArrayList();
     getSingleTableData(details, keyFieldName, inserted, updated);
     if (inserted.size() > 0) {
       serviceUtil.getEntityDao().batchInsert(entity, inserted);
     }
     if (updated.size() > 0)
       serviceUtil.getEntityDao().batchUpdate(entity, updated, new String[0]);
   }
 
   public static void setCreatorInfoParams(SDO params)
   {
     Operator opr = params.getOperator();
 
     params.putProperty("createTime", CommonUtil.getCurrentDateTime());
     params.putProperty("creatorId", opr.getPersonMemberId());
     params.putProperty("creatorName", opr.getPersonMemberName());
   }
 
   public static void setLastUpdaterInfoParams(SDO params) {
     Operator opr = params.getOperator();
 
     params.putProperty("lastUpdateTime", CommonUtil.getCurrentDateTime());
     params.putProperty("lastUpdaterId", opr.getPersonMemberId());
     params.putProperty("lastUpdaterName", opr.getPersonMemberName());
   }
 }

