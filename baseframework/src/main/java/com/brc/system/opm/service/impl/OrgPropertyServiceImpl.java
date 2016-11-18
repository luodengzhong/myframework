 package com.brc.system.opm.service.impl;
 
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.opm.service.OrgPropertyService;
 import com.brc.system.share.service.SQLQuery;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.util.QueryModel;
 import com.brc.util.SDO;
 import com.brc.util.StringUtil;
import com.brc.xmlbean.EntityDocument;
 import com.brc.xmlbean.EntityDocument.Entity;
 import java.util.ArrayList;
 import java.util.HashMap;
 import java.util.Iterator;
 import java.util.List;
 import java.util.Map;
 
 public class OrgPropertyServiceImpl
   implements OrgPropertyService
 {
   private ServiceUtil serviceUtil;
   public static final String MODEL_FILE_NAME = "config/domain/com/brc/system/opm/orgProperty.xml";
   public static final String LI_LAND_ENTITY = "orgProperty";
 
   private EntityDocument.Entity getEntity()
   {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/opm/orgProperty.xml", "orgProperty");
   }
 
   public void setServiceUtil(ServiceUtil serviceUtil) {
     this.serviceUtil = serviceUtil;
   }
 
   private String getOrgNodePropertyKind(String orgNodeKindId)
   {
     String result = "";
     if ("ogn".equals(orgNodeKindId))
       result = "orgProperty";
     else if ("dpt".equals(orgNodeKindId))
       result = "deptProperty";
     else if ("prj".equals(orgNodeKindId))
       result = "projectOrgProperty";
     else {
       throw new IllegalArgumentException("不支持的机构类型。");
     }
     return result;
   }
 
   public Map<String, Object> slicedQueryOrgProperty(SDO sdo)
   {
     String orgId = (String)sdo.getProperty("orgId", String.class);
     if (StringUtil.isBlank(orgId)) {
       sdo.putProperty("orgId", "none");
     }
 
     String orgNodeKindId = (String)sdo.getProperty("orgType", String.class);
     sdo.putProperty("dictCode", getOrgNodePropertyKind(orgNodeKindId));
 
     QueryModel query = this.serviceUtil.getEntityDao().getQueryModelByName(getEntity(), "queryDetailList", sdo.getProperties());
     return this.serviceUtil.getSQLQuery().executeQuery(query, sdo);
   }
 
   public Map<String, Object> queryChildProperties(SDO sdo)
   {
     String orgNodeKindId = sdo.getProperty("orgType").toString();
     sdo.putProperty("dictCode", getOrgNodePropertyKind(orgNodeKindId));
     QueryModel query = this.serviceUtil.getEntityDao().getQueryModelByName(getEntity(), "queryChildProperties", sdo.getProperties());
     return this.serviceUtil.getSQLQuery().executeQuery(query, sdo);
   }
 
   public void batchInsertProperties(SDO sdo)
   {
     String orgId = (String)sdo.getProperty("id");
     if (StringUtil.isBlank(orgId))
     {
       QueryModel query = this.serviceUtil.getEntityDao().getQueryModelByName(getEntity(), "queryOrgId", sdo.getProperties());
       Map idMap = this.serviceUtil.getSQLQuery().executeQuery(query, sdo);
       orgId = (String)((Map)((List)idMap.get("Rows")).get(0)).get("id");
     }
     List detailData = sdo.getList("propertyList");
     if ((!StringUtil.isBlank(orgId)) && (detailData != null)) {
       List list = new ArrayList();
       for (Iterator i$ = detailData.iterator(); i$.hasNext(); ) { Object tmp = i$.next();
         Map tmpMap = (Map)tmp;
         tmpMap.put("orgId", orgId);
         tmpMap.put("propertyKey", tmpMap.get("detailId"));
         list.add(tmpMap);
       }
       Map deleteCondition = new HashMap();
       deleteCondition.put("orgId", orgId);
 
       this.serviceUtil.getEntityDao().deleteByCondition(getEntity(), deleteCondition);
 
       this.serviceUtil.getEntityDao().batchInsert(getEntity(), list);
     }
   }
 
   public void deleteProperty(Long[] ids)
   {
     for (Long id : ids) {
       Map map = new HashMap();
       map.put("orgPropertyId", id);
       this.serviceUtil.getEntityDao().delete(getEntity(), map);
     }
   }
 
   public void deletePropertiesByOrgId(SDO sdo)
   {
     this.serviceUtil.getEntityDao().deleteByCondition(getEntity(), sdo.getProperties());
   }
 }

