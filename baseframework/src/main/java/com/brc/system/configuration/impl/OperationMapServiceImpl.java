 package com.brc.system.configuration.impl;
 
 import com.brc.system.configuration.OperationMapService;
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.opm.Operator;
 import com.brc.system.share.service.SQLQuery;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.util.ClassHelper;
 import com.brc.util.FileHelper;
 import com.brc.util.QueryModel;
 import com.brc.util.SDO;
 import com.brc.util.StringUtil;
import com.brc.xmlbean.EntityDocument;
 import com.brc.xmlbean.EntityDocument.Entity;
 import java.util.ArrayList;
 import java.util.HashMap;
 import java.util.List;
 import java.util.Map;
 import net.sf.json.JSONArray;
 import net.sf.json.JSONObject;
 
 public class OperationMapServiceImpl
   implements OperationMapService
 {
   private ServiceUtil serviceUtil;
 
   public void setServiceUtil(ServiceUtil serviceUtil)
   {
     this.serviceUtil = serviceUtil;
   }
 
   private EntityDocument.Entity getEntity(String name)
   {
     return this.serviceUtil.getEntity("config/domain/com/brc/configuration/operationMap.xml", name);
   }
 
   public Long save(SDO params)
   {
     Long operationMapId = (Long)params.getProperty("operationMapId", Long.class);
     EntityDocument.Entity en = getEntity("operationMap");
     if (operationMapId == null) {
       this.serviceUtil.getEntityDao().checkUniqueness(en, params.getProperties(), false, new String[] { "mapCode" });
       operationMapId = (Long)this.serviceUtil.getEntityDao().insert(en, params.getProperties());
     } else {
       this.serviceUtil.getEntityDao().checkUniqueness(en, params.getProperties(), true, new String[] { "mapCode" });
       this.serviceUtil.getEntityDao().update(en, params.getProperties(), new String[0]);
     }
     return operationMapId;
   }
 
   public Map<String, Object> load(SDO params)
   {
     return this.serviceUtil.getEntityDao().load(getEntity("operationMap"), params.getProperties());
   }
 
   public void delete(SDO params)
   {
     EntityDocument.Entity en = getEntity("operationMap");
     String sql = this.serviceUtil.getEntityDao().getSqlByName(en, "checkSql");
     Long[] ids = params.getLongArray("ids");
     for (Long id : ids) {
       int count = this.serviceUtil.getEntityDao().queryToInt(sql, new Object[] { id });
       if (count == 0) {
         this.serviceUtil.getEntityDao().deleteById(en, id);
 
         this.serviceUtil.deleteSysClobField(id);
       }
     }
   }
 
   public Map<String, Object> slicedQuery(SDO params)
   {
     QueryModel query = this.serviceUtil.getEntityDao().getQueryModel(getEntity("operationMap"), params.getProperties());
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(query, params);
   }
 
   public void updateStatus(Long[] ids, int status)
   {
     this.serviceUtil.updateById("SYS_OPERATION_MAP", "status", "OPERATION_MAP_ID", ids, Integer.valueOf(status));
   }
 
   public void updateSequence(Map<Long, Long> data)
   {
     this.serviceUtil.updateSequence("config/domain/com/brc/configuration/operationMap.xml", "operationMap", "OPERATION_MAP_ID", data);
   }
 
   public void updateFolderId(Long[] ids, Long folderId)
   {
     this.serviceUtil.updateById("SYS_OPERATION_MAP", "FOLDER_ID", "OPERATION_MAP_ID", ids, folderId);
   }
 
   public String loadChar(SDO sdo)
   {
     Long operationMapId = (Long)sdo.getProperty("operationMapId", Long.class);
 
     String content = this.serviceUtil.loadSysClobField(operationMapId);
 
     String isCheckPermission = (String)sdo.getProperty("isCheckPermission", String.class, "false");
     if (isCheckPermission.equals("true")) {
       JSONObject jsonObject = JSONObject.fromObject(content);
       JSONArray buttons = jsonObject.getJSONArray("buttons");
       if (buttons != null) {
         String sql = this.serviceUtil.getEntityDao().getSqlByName(getEntity("operationMapFunction"), "checkPermission");
         Map param = new HashMap(2);
         param.put("operationMapId", operationMapId);
         param.put("personId", sdo.getOperator().getId());
         List functionIds = this.serviceUtil.getEntityDao().queryToListByMapParam(sql, String.class, param);
         int l = buttons.size();
         String functionId = "";
         for (int i = 0; i < l; i++) {
           JSONObject button = buttons.getJSONObject(i);
           functionId = (String)ClassHelper.convert(button.get("functionId"), String.class, "");
           if ((!StringUtil.isBlank(functionId)) && 
             (!functionIds.contains(functionId))) {
             button.put("disabled", Boolean.valueOf(true));
           }
         }
 
         content = jsonObject.toString();
       }
     }
     return content;
   }
 
   public void saveChar(SDO sdo)
   {
     Long operationMapId = (Long)sdo.getProperty("operationMapId", Long.class);
     String jsonData = (String)sdo.getProperty("jsonData", String.class);
     JSONObject jsonObject = JSONObject.fromObject(jsonData);
     JSONArray buttons = jsonObject.getJSONArray("buttons");
     EntityDocument.Entity en = getEntity("operationMapFunction");
     String delSql = this.serviceUtil.getEntityDao().getSqlByName(en, "deleteByMapId");
     this.serviceUtil.getEntityDao().executeUpdate(delSql, new Object[] { operationMapId });
 
     if (buttons != null) {
       int l = buttons.size();
       List datas = new ArrayList(l);
       String functionId = "";
       for (int i = 0; i < l; i++) {
         JSONObject button = buttons.getJSONObject(i);
         functionId = (String)ClassHelper.convert(button.get("functionId"), String.class, "");
         if (!StringUtil.isBlank(functionId)) {
           Map m = new HashMap(2);
           m.put("operationMapId", operationMapId);
           m.put("functionId", button.get("functionId"));
           datas.add(m);
         }
       }
       if (datas.size() > 0) {
         this.serviceUtil.getEntityDao().batchInsert(en, datas);
       }
     }
 
     this.serviceUtil.saveSysClobField(operationMapId, jsonData);
   }
 
   public void savePicture(SDO sdo)
   {
     EntityDocument.Entity en = getEntity("operationMap");
     Long operationMapId = (Long)sdo.getProperty("bizId", Long.class);
     String path = "";
     Map map = this.serviceUtil.getEntityDao().loadById(en, operationMapId);
     if ((map != null) && (map.size() > 0)) {
       path = (String)ClassHelper.convert(map.get("path"), String.class);
       if (!StringUtil.isBlank(path)) {
         FileHelper.delFile(path);
       }
       Map param = new HashMap();
       param.put("operationMapId", operationMapId);
       param.put("path", sdo.getProperty("path"));
       this.serviceUtil.getEntityDao().update(en, param, new String[0]);
     }
   }
 }

