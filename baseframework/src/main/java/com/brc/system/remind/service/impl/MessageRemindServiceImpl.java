 package com.brc.system.remind.service.impl;
 
 import com.brc.exception.ApplicationException;
 import com.brc.model.fn.ExpressManager;
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.opm.Operator;
 import com.brc.system.remind.service.MessageRemindService;
 import com.brc.system.share.service.SQLQuery;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.util.ClassHelper;
 import com.brc.util.LogHome;
 import com.brc.util.QueryModel;
 import com.brc.util.SDO;
 import com.brc.util.StringUtil;
import com.brc.xmlbean.EntityDocument;
 import com.brc.xmlbean.EntityDocument.Entity;
 import java.io.Serializable;
 import java.math.BigDecimal;
 import java.util.ArrayList;
 import java.util.HashMap;
 import java.util.List;
 import java.util.Map;
 import org.apache.log4j.Logger;
 
 public class MessageRemindServiceImpl
   implements MessageRemindService
 {
   public static final String MODEL_FILE_NAME = "config/domain/com/brc/system/cfg/messageRemind.xml";
   public static final String SYS_MESSAGE_REMIND_ENTITY = "messageRemind";
   private ServiceUtil serviceUtil;
 
   public void setServiceUtil(ServiceUtil serviceUtil)
   {
     this.serviceUtil = serviceUtil;
   }
 
   private EntityDocument.Entity getEntity(String name)
   {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/cfg/messageRemind.xml", name);
   }
 
   public Long getNextSequence(Long parentId)
   {
     return this.serviceUtil.getNextSequence("config/domain/com/brc/system/cfg/messageRemind.xml", "messageRemind", "PARENT_ID", parentId);
   }
 
   public Serializable insert(SDO params)
   {
     return this.serviceUtil.getEntityDao().insert(getEntity("messageRemind"), params.getProperties());
   }
 
   public void update(SDO params)
   {
     this.serviceUtil.getEntityDao().update(getEntity("messageRemind"), params.getProperties(), new String[0]);
   }
 
   public Map<String, Object> load(SDO params)
   {
     return this.serviceUtil.getEntityDao().load(getEntity("messageRemind"), params.getProperties());
   }
 
   public void delete(Long[] ids)
   {
     this.serviceUtil.getEntityDao().deleteByIds(getEntity("messageRemind"), ids);
   }
 
   public Map<String, Object> slicedQuery(SDO params)
   {
     QueryModel query = this.serviceUtil.getEntityDao().getQueryModel(getEntity("messageRemind"), params.getProperties());
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(query, params);
   }
 
   public void updateStatus(Long[] ids, int status)
   {
     this.serviceUtil.updateById("SYS_MESSAGE_REMIND", "status", "REMIND_ID", ids, Integer.valueOf(status));
   }
 
   public void updateSequence(Map<Long, Long> data)
   {
     this.serviceUtil.updateSequence("config/domain/com/brc/system/cfg/messageRemind.xml", "messageRemind", "REMIND_ID", data);
   }
 
   public void updateParentId(Long[] ids, Long parentId)
   {
     this.serviceUtil.updateById("SYS_MESSAGE_REMIND", "PARENT_ID", "REMIND_ID", ids, parentId);
   }
 
   public List<Object> testParseRemindFun(Long id)
   {
     List list = new ArrayList();
     Map map = this.serviceUtil.getEntityDao().loadById(getEntity("messageRemind"), id);
     Object obj = parseRemindFun(map);
     if (obj != null) {
       if (ClassHelper.isInterface(obj.getClass(), List.class))
         list.addAll((List)obj);
       else {
         list.add(obj);
       }
     }
     return list;
   }
 
   private Object parseRemindFun(Map<String, Object> map)
   {
     String executeFunc = (String)ClassHelper.convert(map.get("executeFunc"), String.class);
     String remindTitle = (String)ClassHelper.convert(map.get("remindTitle"), String.class);
     String remindUrl = (String)ClassHelper.convert(map.get("remindUrl"), String.class);
     String name = (String)ClassHelper.convert(map.get("name"), String.class);
     String code = (String)ClassHelper.convert(map.get("code"), String.class);
     if (StringUtil.isBlank(executeFunc)) {
       return null;
     }
 
     int openKind = ((Integer)ClassHelper.convert(map.get("openKind"), Integer.class)).intValue();
 
     int replaceKind = ((Integer)ClassHelper.convert(map.get("replaceKind"), Integer.class)).intValue();
     if (replaceKind == 0) {
       String[] executeFuncs = executeFunc.split(",");
       List list = new ArrayList(executeFuncs.length);
       for (String fun : executeFuncs)
         try {
           Object value = ExpressManager.evaluate(fun);
           if (ClassHelper.isBaseType(value.getClass()))
             list.add(value);
           else
             throw new ApplicationException("返回结果不是基础数据类型!");
         }
         catch (Exception e) {
           LogHome.getLog(this).error("evaluateExpr:" + fun, e);
           throw new ApplicationException("evaluateExpr:" + fun, e);
         }
       try
       {
         Map result = new HashMap(3);
         String parseRemindTitle = StringUtil.patternParser(remindTitle, list);
         String parseRemindUrl = StringUtil.patternParser(remindUrl, list);
         result.put("remindTitle", parseRemindTitle);
         result.put("remindUrl", parseRemindUrl);
         result.put("openKind", Integer.valueOf(openKind));
         result.put("name", name);
         result.put("code", code);
         return result;
       } catch (Exception e) {
         throw new ApplicationException(e);
       }
     }
     if (replaceKind == 1)
     {
       try {
         Object value = ExpressManager.evaluate(executeFunc);
         if (ClassHelper.isInterface(value.getClass(), Map.class)) {
           Map result = new HashMap(3);
           String parseRemindTitle = StringUtil.patternParser(remindTitle, (Map)value);
           String parseRemindUrl = StringUtil.patternParser(remindUrl, (Map)value);
           result.put("remindTitle", parseRemindTitle);
           result.put("remindUrl", parseRemindUrl);
           result.put("openKind", Integer.valueOf(openKind));
           result.put("name", name);
           result.put("code", code);
           return result;
         }if (ClassHelper.isInterface(value.getClass(), List.class)) {
           List list = (List)value;
           int length = list.size();
           List result = new ArrayList(length);
           for (int i = 0; i < length; i++) {
             Map resultMap = new HashMap(3);
             String parseRemindTitle = StringUtil.patternParser(remindTitle, (Map)list.get(i));
             String parseRemindUrl = StringUtil.patternParser(remindUrl, (Map)list.get(i));
             resultMap.put("remindTitle", parseRemindTitle);
             resultMap.put("remindUrl", parseRemindUrl);
             resultMap.put("openKind", Integer.valueOf(openKind));
             resultMap.put("name", name);
             resultMap.put("code", code);
             result.add(resultMap);
           }
           return result;
         }
       } catch (Exception e) {
         LogHome.getLog(this).error("evaluateExpr:" + executeFunc, e);
         throw new ApplicationException("evaluateExpr:" + executeFunc, e);
       }
     } else if (replaceKind == 2) {
       List list = new ArrayList(1);
       Object value = null;
       try {
         value = ExpressManager.evaluate(executeFunc);
         if (ClassHelper.isBaseType(value.getClass()))
           list.add(value);
         else
           throw new ApplicationException("返回结果不是基础数据类型!");
       }
       catch (Exception e) {
         LogHome.getLog(this).error("evaluateExpr:" + executeFunc, e);
         throw new ApplicationException("evaluateExpr:" + executeFunc, e);
       }
       if ((value != null) && (((BigDecimal)ClassHelper.convert(value, BigDecimal.class)).doubleValue() > 0.0D)) {
         try {
           Map result = new HashMap(3);
           String parseRemindTitle = StringUtil.patternParser(remindTitle, list);
           String parseRemindUrl = StringUtil.patternParser(remindUrl, list);
           result.put("remindTitle", parseRemindTitle);
           result.put("remindUrl", parseRemindUrl);
           result.put("openKind", Integer.valueOf(openKind));
           result.put("name", name);
           result.put("code", code);
           return result;
         } catch (Exception e) {
           throw new ApplicationException(e);
         }
       }
     }
     return null;
   }
 
   public List<Object> queryRemindByPersonId(SDO sdo)
   {
     String personId = sdo.getOperator().getId();
     List list = new ArrayList();
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getEntity("messageRemind"), "queryRemindByPersonId");
     List<Map<String,Object>> reminds = this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[] { personId });
     for (Map map : reminds) {
       Object obj = parseRemindFun(map);
       if (obj != null) {
         if (ClassHelper.isInterface(obj.getClass(), List.class))
           list.addAll((List)obj);
         else {
           list.add(obj);
         }
       }
     }
     return list;
   }
 }

