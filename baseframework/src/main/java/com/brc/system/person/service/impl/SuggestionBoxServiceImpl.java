 package com.brc.system.person.service.impl;
 
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.opm.Operator;
 import com.brc.system.person.service.SuggestionBoxService;
 import com.brc.system.share.service.SQLQuery;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.util.QueryModel;
 import com.brc.util.SDO;
import com.brc.xmlbean.EntityDocument;
 import com.brc.xmlbean.EntityDocument.Entity;
 import java.io.Serializable;
 import java.sql.Timestamp;
 import java.util.Map;
 
 public class SuggestionBoxServiceImpl
   implements SuggestionBoxService
 {
   public static final String MODEL_FILE_NAME = "config/domain/com/brc/system/cfg/suggestionBox.xml";
   public static final String SYS_SUGGESTION_BOX_ENTITY = "suggestionBox";
   private ServiceUtil serviceUtil;
 
   public void setServiceUtil(ServiceUtil serviceUtil)
   {
     this.serviceUtil = serviceUtil;
   }
 
   private EntityDocument.Entity getEntity(String name)
   {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/cfg/suggestionBox.xml", name);
   }
 
   public Serializable insert(SDO params)
   {
     Operator op = params.getOperator();
     params.putProperty("personId", op.getId());
     params.putProperty("personName", op.getName());
     params.putProperty("createTime", new Timestamp(System.currentTimeMillis()));
     return this.serviceUtil.getEntityDao().insert(getEntity("suggestionBox"), params.getProperties());
   }
 
   public void update(SDO params)
   {
     this.serviceUtil.getEntityDao().update(getEntity("suggestionBox"), params.getProperties(), new String[0]);
   }
 
   public Map<String, Object> load(SDO params)
   {
     return this.serviceUtil.getEntityDao().load(getEntity("suggestionBox"), params.getProperties());
   }
 
   public void delete(SDO params)
   {
     this.serviceUtil.getEntityDao().delete(getEntity("suggestionBox"), params.getProperties());
   }
 
   public Map<String, Object> slicedQuery(SDO params)
   {
     QueryModel query = this.serviceUtil.getEntityDao().getQueryModel(getEntity("suggestionBox"), params.getProperties());
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(query, params);
   }
 }

