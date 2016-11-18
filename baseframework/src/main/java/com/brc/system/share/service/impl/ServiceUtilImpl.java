 package com.brc.system.share.service.impl;
 
 import com.brc.exception.ApplicationException;
 import com.brc.model.domain.DomainModel;
 import com.brc.model.fn.SerialNumber;
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.opm.Operator;
 import com.brc.system.opm.OpmUtil;
 import com.brc.system.share.service.SQLQuery;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.util.ClassHelper;
 import com.brc.util.FileHelper;
 import com.brc.util.SDO;
 import com.brc.util.StringUtil;
 import com.brc.util.ThreadLocalUtil;
 import com.brc.util.XmlLoadManager;
import com.brc.xmlbean.EntityDocument;
 import com.brc.xmlbean.EntityDocument.Entity;
import com.brc.xmlbean.IdDocument;
 import com.brc.xmlbean.IdDocument.Id;
 import java.io.Serializable;
 import java.sql.Timestamp;
 import java.util.ArrayList;
 import java.util.HashMap;
 import java.util.List;
 import java.util.Map;
 
 public class ServiceUtilImpl
   implements ServiceUtil
 {
   private XmlLoadManager<DomainModel> domainManager;
   private EntityParserDao entityParserDao;
   private SQLQuery sqlQuery;
   private SerialNumber serialNumber;
 
   public void setDomainManager(XmlLoadManager<DomainModel> domainManager)
   {
     this.domainManager = domainManager;
   }
 
   public EntityParserDao getEntityDao() {
     return this.entityParserDao;
   }
 
   public void setEntityParserDao(EntityParserDao entityParserDao) {
     this.entityParserDao = entityParserDao;
   }
 
   public void setSerialNumber(SerialNumber serialNumber) {
     this.serialNumber = serialNumber;
   }
 
   public SQLQuery getSQLQuery() {
     return this.sqlQuery;
   }
 
   public void setSqlQuery(SQLQuery sqlQuery)
   {
     this.sqlQuery = sqlQuery;
   }
 
   public DomainModel getDomainModel(String modelFileName) {
     return (DomainModel)this.domainManager.loadConfigFile(modelFileName);
   }
 
   public EntityDocument.Entity getEntity(String modelFileName, String entityName)
   {
     DomainModel model = getDomainModel(modelFileName);
     return model.getEntity(entityName);
   }
 
   public String getEntityTableName(String modelFileName, String entityName)
   {
     return getEntity(modelFileName, entityName).getTable();
   }
 
   public Long getNextSequence(String modelFileName, String entityName)
   {
     String tableName = getEntityTableName(modelFileName, entityName);
     String selectMaxSequenceSql = String.format("SELECT MAX(sequence) FROM %s ", new Object[] { tableName });
     Long maxSequence = this.entityParserDao.queryToLong(selectMaxSequenceSql, new Object[0]);
     maxSequence = Long.valueOf(maxSequence == null ? 0L : maxSequence.longValue());
     return maxSequence = Long.valueOf(maxSequence.longValue() + 1L);
   }
 
   public Long getNextSequence(String modelFileName, String entityName, String parentFieldName, Long parentId)
   {
     String tableName = getEntityTableName(modelFileName, entityName);
     String selectMaxSequenceSql = String.format("SELECT MAX(sequence) FROM %s WHERE %S = ? ", new Object[] { tableName, parentFieldName });
     Long maxSequence = this.entityParserDao.queryToLong(selectMaxSequenceSql, new Object[] { parentId });
     maxSequence = Long.valueOf(maxSequence == null ? 0L : maxSequence.longValue());
     return maxSequence = Long.valueOf(maxSequence.longValue() + 1L);
   }
 
   public void updateSequence(String modelFileName, String entityName, Map<Long, Long> params)
   {
     String updateSequenceSql = String.format("update %s set sequence = ? where id = ?", new Object[] { getEntityTableName(modelFileName, entityName) });
     List dataSet = new ArrayList();
 
     for (Long key : params.keySet()) {
       dataSet.add(new Object[] { params.get(key), key });
     }
     this.entityParserDao.batchUpdate(updateSequenceSql, dataSet);
   }
 
   public void updateSequence(String modelFileName, String entityName, String idFieldName, Map<Long, Long> params)
   {
     String updateSequenceSql = String.format("update %s set sequence = ? where %s = ?", new Object[] { getEntityTableName(modelFileName, entityName), idFieldName });
     List dataSet = new ArrayList();
 
     for (Long key : params.keySet()) {
       dataSet.add(new Object[] { params.get(key), key });
     }
     this.entityParserDao.batchUpdate(updateSequenceSql, dataSet);
   }
 
   public void updateById(String tableName, String fieldName, String idFieldName, Long[] ids, Object object)
   {
     String updateSql = String.format("update %s set %s = ? where %s = ?", new Object[] { tableName, fieldName, idFieldName });
     List dataSet = new ArrayList(ids.length);
     for (Long id : ids) {
       dataSet.add(new Object[] { object, id });
     }
     this.entityParserDao.batchUpdate(updateSql, dataSet);
   }
 
   public void updateStatusById(String tableName, String idfieldName, Long id, Integer status)
   {
     String updateSql = String.format("update %s set status = ? where %s = ?", new Object[] { tableName, idfieldName });
     this.entityParserDao.executeUpdate(updateSql, new Object[] { status, id });
   }
 
   public String getSerialNumber(String code)
   {
     return this.serialNumber.getSerialNumber(code);
   }
 
   private void saveExtendedField(Map<String, Object> map, boolean isInsert)
   {
     if (map == null) {
       throw new ApplicationException("没有扩展字段数据!");
     }
     String businessCode = (String)ClassHelper.convert(map.get("businessCode"), String.class);
     if (StringUtil.isBlank(businessCode)) {
       throw new ApplicationException("业务编码为空，无法保存扩展字段!");
     }
     Long bizId = (Long)ClassHelper.convert(map.get("bizId"), Long.class);
     if (bizId == null) {
       throw new ApplicationException("业务ID为空，无法保存扩展字段!");
     }
 
     EntityDocument.Entity en = getEntity("config/domain/com/brc/system/cfg/extendedField.xml", "extendedFieldStorage");
     Map values = new HashMap();
 
     List<Map<String,Object>> fields = (List)map.get("fieldList");
     if (fields.size() > 0)
     {
       this.entityParserDao.executeUpdateBySqlName(en, "deleteByBusiness", new Object[] { businessCode, bizId });
       for (Map field : fields) {
         field.put("businessCode", businessCode);
         field.put("bizId", bizId);
         if (values.containsKey(field.get("groupId").toString())) {
           Map v = (Map)values.get(field.get("groupId").toString());
           v.put(field.get("fieldEname").toString(), field.get("fieldValue"));
         } else {
           Map v = new HashMap();
           v.put(field.get("fieldEname").toString(), field.get("fieldValue"));
           values.put(field.get("groupId").toString(), v);
         }
       }
       this.entityParserDao.batchInsert(en, fields);
 
       String sql = this.entityParserDao.getSqlByName(getEntity("config/domain/com/brc/system/cfg/extendedField.xml", "extendedFieldGroup"), "queyForView");
 
       List<Map<String, Object>> groups = this.entityParserDao.queryToListMap(sql, new Object[] { businessCode });
       for (Map group : groups)
         if ((!StringUtil.isBlank(group.get("modelFilePath").toString())) && (!StringUtil.isBlank(group.get("entityName").toString()))) {
           Map v = (Map)values.get(group.get("groupId").toString());
           if ((v != null) && (v.size() > 0)) {
             EntityDocument.Entity groupEntity = getEntity(group.get("modelFilePath").toString(), group.get("entityName").toString());
             Map conditions = new HashMap(1);
             for (IdDocument.Id ide : groupEntity.getIdArray()) {
               conditions.put(ide.getName(), bizId);
             }
 
             if (isInsert) {
               Map params = new HashMap(v.size() + conditions.size());
               params.putAll(v);
               params.putAll(conditions);
               this.entityParserDao.insert(groupEntity, params);
             } else {
               this.entityParserDao.updateByCondition(groupEntity, v, conditions, new String[0]);
             }
           }
         }
     }
   }
 
   public void saveExtendedField(Map<String, Object> map)
   {
     saveExtendedField(map, false);
   }
 
   public void saveExtendedField(SDO sdo) {
     Map map = sdo.getObjectMap("extendedField");
     if ((null != map) && (map.size() > 0))
       saveExtendedField(map);
   }
 
   public void saveExtendedField(SDO sdo, Long bizId)
   {
     Map map = sdo.getObjectMap("extendedField");
     if ((null != map) && (map.size() > 0)) {
       map.put("bizId", bizId);
       saveExtendedField(map);
     }
   }
 
   public void saveExtendedField(Map<String, Object> map, Long bizId) {
     map.put("bizId", bizId);
     saveExtendedField(map);
   }
 
   public void insertExtendedField(SDO sdo, Long bizId) {
     Map map = sdo.getObjectMap("extendedField");
     if ((null != map) && (map.size() > 0)) {
       map.put("bizId", bizId);
       saveExtendedField(map, true);
     }
   }
 
   public void insertExtendedField(Map<String, Object> map, Long bizId) {
     map.put("bizId", bizId);
     saveExtendedField(map, true);
   }
 
   public void updateExtendedFieldValue(String businessCode, Long bizId, String fieldEname, Object fieldValue, Object lookUpValue)
   {
     String sql = this.entityParserDao.getSqlByName(getEntity("config/domain/com/brc/system/cfg/extendedField.xml", "extendedFieldStorage"), "updateFieldValue");
     List dataSet = new ArrayList(1);
     dataSet.add(new Object[] { fieldValue, lookUpValue, businessCode, bizId, fieldEname });
     this.entityParserDao.batchUpdate(sql, dataSet);
   }
 
   public List<Map<String, Object>> queryExtendedFieldByBusiness(String businessCode, String bizId)
   {
     String sql = this.entityParserDao.getSqlByName(getEntity("config/domain/com/brc/system/cfg/extendedField.xml", "extendedFieldStorage"), "queryValueByBusiness");
     return this.entityParserDao.queryToListMap(sql, new Object[] { businessCode, bizId });
   }
 
   public Map<String, Object> queryExtendedFieldToMapByBusiness(String businessCode, String bizId)
   {
     List<Map<String,Object>> list = queryExtendedFieldByBusiness(businessCode, bizId);
     Map map = new HashMap(list.size());
     for (Map m : list) {
       map.put(m.get("fieldEname").toString(), m.get("fieldValue"));
     }
     return map;
   }
 
   public void deleteExtendedField(String businessCode, Long bizId)
   {
     EntityDocument.Entity en = getEntity("config/domain/com/brc/system/cfg/extendedField.xml", "extendedFieldStorage");
 
     this.entityParserDao.executeUpdateBySqlName(en, "deleteByBusiness", new Object[] { businessCode, bizId });
 
     String sql = this.entityParserDao.getSqlByName(getEntity("config/domain/com/brc/system/cfg/extendedField.xml", "extendedFieldGroup"), "queyForView");
 
     List<Map<String,Object>> groups = this.entityParserDao.queryToListMap(sql, new Object[] { businessCode });
     for (Map group : groups)
       if ((!StringUtil.isBlank(group.get("modelFilePath").toString())) && (!StringUtil.isBlank(group.get("entityName").toString()))) {
         EntityDocument.Entity groupEntity = getEntity(group.get("modelFilePath").toString(), group.get("entityName").toString());
         this.entityParserDao.deleteById(groupEntity, bizId);
       }
   }
 
   private String getServiceUtilSql(String sqlName)
   {
     return this.entityParserDao.getSqlByName(getEntity("config/domain/com/brc/configuration/serviceUtil.xml", "serviceUtil"), sqlName);
   }
 
   public List<Map<String, Object>> queryAttachment(String bizCode, Serializable bizId)
   {
     String sql = getServiceUtilSql("loadAttachmentByBizCodeAndBizId");
     return this.entityParserDao.queryToListMap(sql, new Object[] { bizCode.toUpperCase(), bizId });
   }
 
   public List<Map<String, Object>> queryAttachment(String bizCode, String attachmentCode, Serializable bizId)
   {
     String sql = getServiceUtilSql("loadAttachmentByAttachmentCodeAndBizId");
     return this.entityParserDao.queryToListMap(sql, new Object[] { bizCode.toUpperCase(), attachmentCode, bizId });
   }
 
   public void copyAttachment(String fromBizCode, Serializable formBizId, String toBizCode, Serializable toBizId, boolean isCopyFile)
   {
     Operator op = (Operator)ThreadLocalUtil.getVariable("operator", Operator.class);
     List<Map<String,Object>> objs = queryAttachment(fromBizCode, formBizId);
     List datas = new ArrayList(objs.size());
     for (Map obj : objs) {
       obj.put("id", null);
       obj.put("bizCode", toBizCode.toUpperCase());
       obj.put("bizId", toBizId);
       if (isCopyFile) {
         String path = FileHelper.copyFileByCode(obj.get("path").toString(), toBizCode);
         if (StringUtil.isBlank(path)) {
           throw new ApplicationException("复制文件失败!");
         }
         obj.put("path", path);
       }
       if (op != null) {
         obj.put("creatorId", op.getPersonMemberId());
         obj.put("creatorName", op.getPersonMemberName());
       }
       obj.put("createDate", new Timestamp(System.currentTimeMillis()));
       datas.add(obj);
     }
     if (datas.size() > 0)
       this.entityParserDao.batchInsert(getEntity("config/domain/com/brc/system/attachment/attachment.xml", "attachment"), datas);
   }
 
   public Long copyAttachment(Long fileId, String toBizCode, Serializable toBizId, boolean isCopyFile)
   {
     Operator op = (Operator)ThreadLocalUtil.getVariable("operator", Operator.class);
     EntityDocument.Entity en = getEntity("config/domain/com/brc/system/attachment/attachment.xml", "attachment");
     Map obj = this.entityParserDao.loadById(en, fileId);
     if ((obj == null) || (obj.size() == 0)) throw new ApplicationException("文件不存在,可能被其他用户删除或修改！");
     obj.put("id", null);
     obj.put("bizCode", toBizCode.toUpperCase());
     obj.put("bizId", toBizId);
     if (isCopyFile) {
       String path = FileHelper.copyFileByCode(obj.get("path").toString(), toBizCode);
       if (StringUtil.isBlank(path)) {
         throw new ApplicationException("复制文件失败!");
       }
       obj.put("path", path);
     }
     if (op != null) {
       obj.put("creatorId", op.getPersonMemberId());
       obj.put("creatorName", op.getPersonMemberName());
     }
     obj.put("createDate", new Timestamp(System.currentTimeMillis()));
     return (Long)this.entityParserDao.insert(en, obj);
   }
 
   public void deleteAttachment(String bizCode, Serializable bizId)
   {
     String sql = getServiceUtilSql("updateBizCode");
     List<Map<String,Object>> objs = queryAttachment(bizCode, bizId);
     Long id = null;
     String code = bizCode + "_delete";
     for (Map obj : objs) {
       FileHelper.delFile((String)obj.get("path"));
       id = (Long)ClassHelper.convert(obj.get("id"), Long.class);
       this.entityParserDao.executeUpdate(sql, new Object[] { code.toUpperCase(), id });
     }
   }
 
   public boolean checkAttachmentExist(String bizCode, String attachmentCode, Serializable bizId)
   {
     String sql = getServiceUtilSql("countAttachmentByCode");
     int count = this.entityParserDao.queryToInt(sql, new Object[] { bizCode.toUpperCase(), attachmentCode, bizId });
     return count > 0;
   }
 
   public boolean checkAttachmentExist(String bizCode, Serializable bizId)
   {
     String sql = getServiceUtilSql("countAttachment");
     int count = this.entityParserDao.queryToInt(sql, new Object[] { bizCode.toUpperCase(), bizId });
     return count > 0;
   }
 
   public boolean checkAttachmentExist(Serializable bizId)
   {
     String sql = "select count(a.id) from sys_attachment a where a.biz_id=?";
     int count = this.entityParserDao.queryToInt(sql, new Object[] { bizId });
     return count > 0;
   }
 
   public Map<String, Object> getTaskInfoByProcInstId(String procInstId)
   {
     String sql = getServiceUtilSql("queryTaskInfoByProcInstId");
     return this.entityParserDao.queryToMap(sql, new Object[] { procInstId });
   }
 
   public String queryFullIdByPersonMemberId(String personMemberId) {
     Map map = queryFullMapByPersonMemberId(personMemberId);
     String fullId = (String)ClassHelper.convert(map.get("fullId"), String.class);
     return fullId;
   }
 
   public Map<String, Object> queryFullMapByPersonMemberId(String personMemberId) {
     String sql = "select s.full_id,s.full_name from sa_oporg s where s.id=? and s.status=1  and s.org_kind_id='psm'";
     Map map = this.entityParserDao.queryToMap(sql, new Object[] { personMemberId });
     if ((map == null) || (map.size() == 0)) {
       String personId = OpmUtil.getPersonIdFromPersonMemberId(personMemberId);
       map = queryFullMapByPersond(personId);
       if ((map == null) || (map.size() == 0)) {
         throw new ApplicationException(String.format("未找到对应的启用组织[%s]!", new Object[] { personMemberId }));
       }
     }
     return map;
   }
 
   public Map<String, Object> queryFullMapByPersond(String personId) {
     String sql = "select o.* from sa_opperson p, sa_oporg o where o.id = p.id || '@' || p.main_org_id and p.id = ? and o.status=1  and o.org_kind_id='psm'";
     Map map = this.entityParserDao.queryToMap(sql, new Object[] { personId });
     return map;
   }
 
   public String queryFullIdByarchivesId(Long archivesId) {
     Map map = queryFullMapByarchivesId(archivesId);
     String fullId = (String)ClassHelper.convert(map.get("fullId"), String.class);
     if (StringUtil.isBlank(fullId)) {
       throw new ApplicationException(String.format("未找到对应的启用组织[%s]!", new Object[] { archivesId }));
     }
     return fullId;
   }
 
   public Map<String, Object> queryFullMapByarchivesId(Long archivesId)
   {
     StringBuffer sb = new StringBuffer();
     sb.append("select s.id || '@' || s.main_org_id");
     sb.append("  from hr_archives a, sa_opperson s");
     sb.append(" where a.person_id = s.id");
     sb.append("   and a.archives_id = ?");
     sb.append("   and s.status = 1");
     String personMemberId = this.entityParserDao.queryToString(sb.toString(), new Object[] { archivesId });
     if (StringUtil.isBlank(personMemberId)) {
       throw new ApplicationException(String.format("未找到对应的启用组织[%s]!", new Object[] { archivesId }));
     }
     String sql = "select s.full_id,s.full_name from sa_oporg s where s.id=? and s.status=1  and s.org_kind_id='psm'";
     Map map = this.entityParserDao.queryToMap(sql, new Object[] { personMemberId });
     if ((map == null) || (map.size() == 0)) {
       throw new ApplicationException(String.format("未找到对应的启用组织[%s]!", new Object[] { personMemberId }));
     }
     return map;
   }
 
   public void deleteExcelTempData(String bizCode, Long bizId)
   {
     String sql = getServiceUtilSql("getExpTempletByCode");
     Map map = this.entityParserDao.queryToMap(sql, new Object[] { bizCode });
     if ((map == null) || (map.size() == 0)) {
       throw new ApplicationException(String.format("未找到%s对应的数据导入模板!", new Object[] { bizCode }));
     }
     String tableName = (String)ClassHelper.convert(map.get("tableName"), String.class);
     Long templetId = (Long)ClassHelper.convert(map.get("id"), Long.class);
 
     String deleteSql = getServiceUtilSql("deleteExpLogByTemplet");
     int count = this.entityParserDao.executeUpdate(deleteSql, new Object[] { bizId, templetId });
     if (count > 0)
     {
       String deleteTempSql = "delete from %s t where t.serial_id=?";
       this.entityParserDao.executeUpdate(String.format(deleteTempSql, new Object[] { tableName }), new Object[] { bizId });
     }
   }
 
   public void saveSysClobField(Long bizId, String content)
   {
     if (!StringUtil.isBlank(content)) {
       int count = this.entityParserDao.queryToInt("select count(0) from  sys_clob_field where biz_id=?", new Object[] { bizId });
       if (count == 0) {
         this.entityParserDao.executeUpdate("insert into sys_clob_field(clob_field_id, biz_id) values (seq_id.nextval, ?)", new Object[] { bizId });
       }
       String sql = String.format("update %s set %s=? where %s=?", new Object[] { "sys_clob_field", "content", "biz_id" });
       this.entityParserDao.saveClob(sql, content, new Object[] { bizId });
     } else {
       deleteSysClobField(bizId);
     }
   }
 
   public void deleteSysClobField(Long bizId)
   {
     String sql = "delete from sys_clob_field where biz_id=?";
     this.entityParserDao.executeUpdate(sql, new Object[] { bizId });
   }
 
   public String loadSysClobField(Long bizId)
   {
     String content = this.entityParserDao.loadClob("select t.content from sys_clob_field t where t.biz_id=?", new Object[] { bizId });
     content = content == null ? "" : content;
     return content;
   }
 }

