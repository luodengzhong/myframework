 package com.brc.system.opm.service.impl;
 
 import com.brc.exception.ApplicationException;
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.opm.service.OrgTemplateService;
 import com.brc.system.share.service.SQLQuery;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.system.util.Util;
 import com.brc.util.QueryModel;
 import com.brc.util.SDO;
import com.brc.xmlbean.EntityDocument;
 import com.brc.xmlbean.EntityDocument.Entity;
 import java.util.ArrayList;
 import java.util.HashMap;
 import java.util.List;
 import java.util.Map;
 
 public class OrgTemplateServiceImpl
   implements OrgTemplateService
 {
   private ServiceUtil serviceUtil;
   private int ORG_TEMPLATE_ROOT_ID = 1;
   private static final String ORG_TEMPLATE_ENTITY = "orgTemplate";
   private static final String MODEL_FILE_NAME = "config/domain/com/brc/system/opm/opm.xml";
 
   private EntityDocument.Entity getOrgTemplateEntity()
   {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/opm/opm.xml", "orgTemplate");
   }
 
   public void setServiceUtil(ServiceUtil serviceUtil) {
     this.serviceUtil = serviceUtil;
   }
 
   private void checkOrgTemplateExist(Long parentId, Long[] orgTypeIds) {
     String checkExistSql = "select count(*) from SA_OPOrgTemplate where parent_Id = ? and type_id = ?";
     String selectOrgTypeSql = "select name from sa_oporgtype where id = ?";
     String orgTypeName = null;
     int recordCount = 0;
 
     for (Long orgTypeId : orgTypeIds) {
       recordCount = this.serviceUtil.getEntityDao().queryToInt(checkExistSql, new Object[] { parentId, orgTypeId });
       if (recordCount > 0) {
         orgTypeName = this.serviceUtil.getEntityDao().queryToString(selectOrgTypeSql, new Object[] { orgTypeId });
         throw new ApplicationException("本组织下已存在“" + orgTypeName + "“。");
       }
     }
   }
 
   public void insertOrgTemplate(Long parentId, Long[] orgTypeIds)
   {
     if (orgTypeIds.length == 0) {
       throw new ApplicationException("没有选择组织类别，不能添加。");
     }
     checkOrgTemplateExist(parentId, orgTypeIds);
 
     EntityDocument.Entity entity = this.serviceUtil.getEntity("config/domain/com/brc/system/opm/opm.xml", "orgTemplate");
     Long sequence = this.serviceUtil.getNextSequence("config/domain/com/brc/system/opm/opm.xml", "orgTemplate", "parent_id", parentId);
 
     List params = new ArrayList(orgTypeIds.length);
     for (Long item : orgTypeIds) {
       Map param = new HashMap(3);
       param.put("typeId", item);
       param.put("parentId", parentId);
       Long localLong1 = sequence; Long localLong2 = sequence = Long.valueOf(sequence.longValue() + 1L); param.put("sequence", localLong1);
       params.add(param);
     }
 
     this.serviceUtil.getEntityDao().batchInsert(entity, params);
   }
 
   public void deleteOrgTemplate(Long[] ids)
   {
     String sql = "select count(*) from SA_OPOrgTemplate where parent_id = ?";
     String selectOrgTypeSql = "select b.name from SA_OPOrgTemplate a, SA_OPOrgType b where a.type_id = b.id and a.id = ?";
 
     int childrenCount = 0;
     String orgTypeName = null;
 
     for (Long id : ids) {
       childrenCount = this.serviceUtil.getEntityDao().queryToInt(sql, new Object[] { id });
       if (childrenCount > 0) {
         orgTypeName = this.serviceUtil.getEntityDao().queryToString(selectOrgTypeSql, new Object[] { id });
         Util.check(false, "组织模板“%s”下已有子节点，不能删除。", new Object[] { orgTypeName });
       }
     }
 
     this.serviceUtil.getEntityDao().deleteByIds(getOrgTemplateEntity(), ids);
   }
 
   public void updateOrgTemplateSequence(Map<Long, Long> orgTemplates)
   {
     this.serviceUtil.updateSequence("config/domain/com/brc/system/opm/opm.xml", "orgTemplate", orgTemplates);
   }
 
   public Map<String, Object> queryOrgTemplates(SDO params)
   {
     Long parentId = (Long)params.getProperty("parentId", Long.class);
     parentId = Long.valueOf(parentId == null ? 0L : parentId.longValue());
 
     if (parentId.longValue() == 0L) {
       Map rootOrgTemplate = new HashMap(8);
       String sql = "select count(*) from SA_OPOrgTemplate where parent_id = ?";
       int childrenCount = this.serviceUtil.getEntityDao().queryToInt(sql, new Object[] { Integer.valueOf(this.ORG_TEMPLATE_ROOT_ID) });
 
       rootOrgTemplate.put("id", Integer.valueOf(this.ORG_TEMPLATE_ROOT_ID));
       rootOrgTemplate.put("orgKindId", "root");
       rootOrgTemplate.put("parentId", Integer.valueOf(0));
       rootOrgTemplate.put("code", "JGMB");
       rootOrgTemplate.put("name", "机构模板");
       rootOrgTemplate.put("hasChildren", Integer.valueOf(childrenCount));
       rootOrgTemplate.put("sequence", Integer.valueOf(1));
       rootOrgTemplate.put("isexpand", Integer.valueOf(0));
 
       List data = new ArrayList(1);
       data.add(rootOrgTemplate);
 
       Map rows = new HashMap();
       rows.put("Rows", data);
       return rows;
     }
 
     params.putProperty("sortname", "sequence");
     params.putProperty("sortorder", "asc");
 
     QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModel(getOrgTemplateEntity(), params.getProperties());
     Map data = this.serviceUtil.getSQLQuery().executeQuery(queryModel, params);
 
     return data;
   }
 
   public Map<String, Object> slicedQueryOrgTemplates(SDO params)
   {
     QueryModel query = this.serviceUtil.getEntityDao().getQueryModel(getOrgTemplateEntity(), params.getProperties());
     Map data = this.serviceUtil.getSQLQuery().executeSlicedQuery(query, params);
     return data;
   }
 }

