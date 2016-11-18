 package com.brc.system.share.service.impl;
 
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.system.share.service.WorkTableService;
 import com.brc.system.share.service.model.UserScreen;
 import com.brc.system.share.service.model.UserScreenFunction;
 import com.brc.util.ClassHelper;
 import com.brc.util.StringUtil;
import com.brc.xmlbean.EntityDocument;
 import com.brc.xmlbean.EntityDocument.Entity;
 import java.util.ArrayList;
 import java.util.HashMap;
 import java.util.Iterator;
 import java.util.List;
 import java.util.Map;
 
 public class WorkTableServiceImpl
   implements WorkTableService
 {
   private ServiceUtil serviceUtil;
 
   public void setServiceUtil(ServiceUtil serviceUtil)
   {
     this.serviceUtil = serviceUtil;
   }
 
   private EntityDocument.Entity getEntity(String name)
   {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/cfg/userScreen.xml", name);
   }
 
   public List<UserScreen> getUserScreens(String id)
   {
     Map param = new HashMap(1);
     param.put("personId", id);
     EntityDocument.Entity entity = getEntity("userScreen");
     String sql = this.serviceUtil.getEntityDao().getSqlByName(entity, "getUserScreen");
     List<UserScreen> screens = this.serviceUtil.getEntityDao().queryToList(sql, UserScreen.class, new Object[] { id });
     if ((null != screens) && (screens.size() > 0)) {
       List list = this.serviceUtil.getEntityDao().query(entity, param, UserScreenFunction.class);
       for (Iterator i$ = list.iterator(); i$.hasNext(); ) {
					UserScreenFunction sf = (UserScreenFunction)i$.next();
         for (UserScreen screen : screens)
           if (sf.getScreenId().equals(screen.getId())) {
             screen.addFunction(sf);
             break;
           }
       }
       return screens;
     }
     return null;
   }
 
   public Long saveScreen(String psmId, String id)
   {
     Map param = new HashMap(1);
     param.put("personMemberId", psmId);
     param.put("personId", id);
     return (Long)this.serviceUtil.getEntityDao().insert(getEntity("userScreen"), param);
   }
 
   public void deleteScreen(Long id)
   {
     Map param = new HashMap(1);
     param.put("screenId", id);
     this.serviceUtil.getEntityDao().deleteByCondition(getEntity("userScreenFunction"), param);
     this.serviceUtil.getEntityDao().deleteById(getEntity("userScreen"), id);
   }
 
   public void updateScreen(Long id, String fids)
   {
     Map screen = this.serviceUtil.getEntityDao().loadById(getEntity("userScreen"), id);
     String[] funids = fids.split(",");
     if ((screen != null) && (screen.size() > 0)) {
       Map param = new HashMap(1);
       param.put("screenId", id);
       this.serviceUtil.getEntityDao().deleteByCondition(getEntity("userScreenFunction"), param);
       List details = new ArrayList(funids.length);
       for (int i = 0; i < funids.length; i++) {
         String funid = funids[i];
         if (!StringUtil.isBlank(funid)) {
           Map m = new HashMap(3);
           m.put("screenId", id);
           m.put("functionId", funid);
           m.put("sequence", Integer.valueOf(i));
           details.add(m);
         }
       }
       if (details.size() > 0)
         this.serviceUtil.getEntityDao().batchInsert(getEntity("userScreenFunction"), details);
     }
   }
 
   public List<Map<String, Object>> getFunctionByPersonId(String personId, Long parentId)
   {
     if (parentId.longValue() > 1L) {
       Map param = new HashMap(2);
       param.put("personId", personId);
       param.put("parentId", parentId);
       return this.serviceUtil.getEntityDao().queryBySqlName(getEntity("userScreenFunction"), "leafFunction", param);
     }
     Map param = new HashMap(1);
     param.put("personId", personId);
     param.put("parentId", Integer.valueOf(1));
     return this.serviceUtil.getEntityDao().queryBySqlName(getEntity("userScreenFunction"), "rootFunction", param);
   }
 
   public List<Map<String, Object>> getJobFunctionByPersonId(String personId, Long parentId)
   {
     if (parentId.longValue() > 1L) {
       Map param = new HashMap(2);
       param.put("personId", personId);
       param.put("parentId", parentId);
       return this.serviceUtil.getEntityDao().queryBySqlName(getEntity("userScreenFunction"), "leafFunctionForJob", param);
     }
     Map param = new HashMap(1);
     param.put("personId", personId);
     param.put("parentId", Integer.valueOf(1));
     return this.serviceUtil.getEntityDao().queryBySqlName(getEntity("userScreenFunction"), "rootFunctionForJob", param);
   }
 
   public List<Map<String, Object>> getGroupFunctionByPersonId(String personId, Long parentId)
   {
     EntityDocument.Entity en = getEntity("userScreenFunction");
     Map param = new HashMap(2);
     param.put("personId", personId);
     param.put("parentId", parentId);
     List<Map<String,Object>> list = this.serviceUtil.getEntityDao().queryBySqlName(en, "rootFunction", param);
     for (Map map : list) {
       Long id = (Long)ClassHelper.convert(map.get("functionId"), Long.class);
       Map pa = new HashMap(2);
       pa.put("personId", personId);
       pa.put("parentId", id);
       List childs = this.serviceUtil.getEntityDao().queryBySqlName(en, "leafFunction", param);
       map.put("childs", childs);
     }
     return list;
   }
 
   public List<Map<String, Object>> queryOftenUseFunction(String personId)
   {
     EntityDocument.Entity en = getEntity("userScreenFunction");
     Map param = new HashMap(2);
     param.put("personId", personId);
     List list = this.serviceUtil.getEntityDao().queryBySqlName(en, "queryOftenUseFunction", param);
     return list;
   }
 }

