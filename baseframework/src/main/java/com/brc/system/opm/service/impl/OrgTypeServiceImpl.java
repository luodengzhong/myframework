 package com.brc.system.opm.service.impl;
 
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.opm.service.OrgTypeService;
 import com.brc.system.share.service.SQLQuery;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.system.util.Util;
 import com.brc.util.ClassHelper;
 import com.brc.util.QueryModel;
 import com.brc.util.SDO;
import com.brc.xmlbean.EntityDocument;
 import com.brc.xmlbean.EntityDocument.Entity;
 import java.util.ArrayList;
 import java.util.List;
 import java.util.Map;
 
 public class OrgTypeServiceImpl
   implements OrgTypeService
 {
   private ServiceUtil serviceUtil;
 
   public void setServiceUtil(ServiceUtil serviceUtil)
   {
     this.serviceUtil = serviceUtil;
   }
 
   private EntityDocument.Entity getOrgTypeEntity() {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/opm/opm.xml", "orgType");
   }
 
   private void checkInputItemNotNull(String code, String name)
   {
     Util.check(Util.isNotEmptyString(code), "编码不能为空！", new Object[0]);
     Util.check(Util.isNotEmptyString(name), "名称不能为空！", new Object[0]);
   }
 
   private void checkOrgTypeExist(Long folderId, Long id, String code, String name)
   {
     String sql = "select code, name from sa_oporgtype where id <> ? and folder_id = ? and (upper(code) = ? or upper(name) = ?) and rownum = 1";
     Map map = this.serviceUtil.getEntityDao().queryToMap(sql, new Object[] { id, folderId, code.toUpperCase(), name.toUpperCase() });
 
     if (map.size() > 0) {
       String dbCode = (String)ClassHelper.convert(map.get("code"), String.class);
       String dbName = (String)ClassHelper.convert(map.get("name"), String.class);
       Util.check(!dbCode.equalsIgnoreCase(code), "编码“%s”重复！", new Object[] { code });
       Util.check(!dbName.equalsIgnoreCase(name), "名称“%s”重复！", new Object[] { name });
     }
   }
 
   private void checkOrgTypeConstraints(SDO sdo)
   {
     Long id = (Long)sdo.getProperty("id", Long.class);
     id = Long.valueOf(id == null ? 0L : id.longValue());
 
     Long folderId = (Long)sdo.getProperty("folderId", Long.class);
     String code = (String)sdo.getProperty("code", String.class);
     String name = (String)sdo.getProperty("name", String.class);
 
     checkInputItemNotNull(code, name);
 
     checkOrgTypeExist(folderId, id, code, name);
   }
 
   public Long insertOrgType(SDO sdo)
   {
     checkOrgTypeConstraints(sdo);
     return (Long)this.serviceUtil.getEntityDao().insert(getOrgTypeEntity(), sdo.getProperties());
   }
 
   public void updateOrgType(SDO sdo)
   {
     checkOrgTypeConstraints(sdo);
     this.serviceUtil.getEntityDao().update(getOrgTypeEntity(), sdo.getProperties(), new String[0]);
   }
 
   public void deleteOrgType(Long[] ids)
   {
     String selectOrgTypeSql = "select code, name from SA_OPOrgType where id = ?";
     String orgTemplateRefSql = "select id from SA_OPOrgTemplate where Type_Id = ? and rownum = 1";
     String orgRefSql = "select name from SA_OPOrg where Type_Id = ? and rownum = 1";
 
     Map refData = null;
     Map orgType = null;
 
     String orgTypeName = null;
 
     for (Long id : ids) {
       orgType = this.serviceUtil.getEntityDao().queryToMap(selectOrgTypeSql, new Object[] { id });
       if (orgType.size() > 0) {
         orgTypeName = orgType.get("name").toString();
 
         refData = this.serviceUtil.getEntityDao().queryToMap(orgTemplateRefSql, new Object[] { id });
         Util.check(refData.size() == 0, "组织模板“%s”已使用，不能删除“%s”。", new Object[] { ClassHelper.convert(refData.get("id"), String.class, ""), orgTypeName });
 
         refData = this.serviceUtil.getEntityDao().queryToMap(orgRefSql, new Object[] { id });
         Util.check(refData.size() == 0, "组织“%s”已使用，不能删除“%s”。", new Object[] { ClassHelper.convert(refData.get("name"), String.class, ""), orgTypeName });
       }
     }
     this.serviceUtil.getEntityDao().deleteByIds(getOrgTypeEntity(), ids);
   }
 
   public void moveOrgType(Long[] ids, Long folderId)
   {
     String sql = "update sa_oporgtype set folder_Id = ?, version = seq_id.nextval where id = ?";
 
     List params = new ArrayList(ids.length);
     for (Long id : ids) {
       params.add(new Object[] { folderId, id });
     }
     this.serviceUtil.getEntityDao().batchUpdate(sql, params);
   }
 
   public Map<String, Object> loadOrgType(Long id)
   {
     return this.serviceUtil.getEntityDao().loadById(getOrgTypeEntity(), id);
   }
 
   public Map<String, Object> slicedQueryOrgTypes(SDO params)
   {
     QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModel(getOrgTypeEntity(), params.getProperties());
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(queryModel, params);
   }
 
   public Long getOrgTypeNextSequence(Long parentId)
   {
     return this.serviceUtil.getNextSequence("config/domain/com/brc/system/opm/opm.xml", "orgType", "Folder_ID", parentId);
   }
 
   public void updateOrgTypeSequence(Map<Long, Long> params)
   {
     this.serviceUtil.updateSequence("config/domain/com/brc/system/opm/opm.xml", "orgType", params);
   }
 }

