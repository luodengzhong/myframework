 package com.brc.system.imp.service.impl;
 
 import com.brc.exception.ApplicationException;
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.imp.service.ImpExcelService;
 import com.brc.system.opm.Operator;
 import com.brc.system.share.service.SQLQuery;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.util.ClassHelper;
 import com.brc.util.LogHome;
 import com.brc.util.QueryModel;
 import com.brc.util.SDO;
 import com.brc.util.StringUtil;
 import com.brc.util.ThreadLocalUtil;
 import com.brc.util.excel.reader.ExcelReaderUtil;
 import com.brc.util.excel.reader.IExcelRowReader;
import com.brc.xmlbean.EntityDocument;
 import com.brc.xmlbean.EntityDocument.Entity;
 import java.io.Serializable;
 import java.util.ArrayList;
 import java.util.Date;
 import java.util.HashMap;
 import java.util.Iterator;
 import java.util.List;
 import java.util.Map;
 import javax.sql.DataSource;
 import org.apache.log4j.Logger;
 import org.springframework.jdbc.core.SqlOutParameter;
 import org.springframework.jdbc.core.SqlParameter;
 import org.springframework.jdbc.object.BatchSqlUpdate;
 
 public class ImpExcelServiceImpl
   implements ImpExcelService
 {
   public static final String MODEL_FILE_NAME = "config/domain/com/brc/system/impTempl/expTemplet.xml";
   public static final String SYS_EXP_TEMPLET_ENTITY = "expTemplet";
   public static final String SYS_EXP_TEMPLET_COMP_ENTITY = "expTempletComp";
   public static final String SYS_IMP_EXP_LOG_ENTITY = "impExpLog";
   private ServiceUtil serviceUtil;
 
   public ServiceUtil getServiceUtil()
   {
     return this.serviceUtil;
   }
 
   public void setServiceUtil(ServiceUtil serviceUtil) {
     this.serviceUtil = serviceUtil;
   }
 
   private EntityDocument.Entity getEntity(String name)
   {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/impTempl/expTemplet.xml", name);
   }
 
   public Serializable insert(SDO params)
   {
     return this.serviceUtil.getEntityDao().insert(getEntity("expTemplet"), params.getProperties());
   }
 
   public void update(SDO params)
   {
     this.serviceUtil.getEntityDao().update(getEntity("expTemplet"), params.getProperties(), new String[0]);
   }
 
   public Map<String, Object> load(SDO params)
   {
     return this.serviceUtil.getEntityDao().load(getEntity("expTemplet"), params.getProperties());
   }
 
   public void delete(SDO params)
   {
     this.serviceUtil.getEntityDao().delete(getEntity("expTemplet"), params.getProperties());
   }
 
   public Map<String, Object> slicedQuery(SDO params)
   {
     QueryModel query = this.serviceUtil.getEntityDao().getQueryModel(getEntity("expTemplet"), params.getProperties());
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(query, params);
   }
 
   public Map<String, Object> loadExpTemplet(SDO sdo)
   {
     Map result = this.serviceUtil.getEntityDao().load(getEntity("expTemplet"), sdo.getProperties());
     return result;
   }
 
   public Map<String, Object> loadExpTempletByCode(SDO sdo)
   {
     String code = (String)sdo.getProperty("templetCode", String.class);
     if (!StringUtil.isBlank(code)) {
       String sql = this.serviceUtil.getEntityDao().getSqlByName(getEntity("expTemplet"), "loadByTempletCode");
       return this.serviceUtil.getEntityDao().queryToMap(sql, new Object[] { code });
     }
     return null;
   }
 
   public List<Map<String, Object>> queryExpTempletDetailByTempletId(Long id)
   {
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getEntity("expTempletComp"), "queryTempletCompById");
     List maps = this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[] { id });
     return maps;
   }
 
   public List<Map<String, Object>> queryExpTempletByTempletId(Long id)
   {
     List<Map<String,Object>> maps = queryUseExpTempletDetailByTempletId(id);
     for (Map map : maps) {
       String columnName = (String)ClassHelper.convert(map.get("columnName"), String.class);
       columnName = StringUtil.getHumpName(columnName);
       map.put("columnName", columnName);
     }
     return maps;
   }
 
   public Serializable insertTemplet(SDO params, List<Object> detailData) {
     EntityDocument.Entity en = getEntity("expTemplet");
     this.serviceUtil.getEntityDao().checkUniqueness(en, params.getProperties(), false, new String[] { "templetCode" });
     params.putProperty("sts", "0");
     Number id = (Number)this.serviceUtil.getEntityDao().insert(en, params.getProperties());
     if ((null != detailData) && (detailData.size() > 0)) {
       List details = new ArrayList(detailData.size());
       for (Iterator i$ = detailData.iterator(); i$.hasNext(); ) { Object obj = i$.next();
         Map m = (Map)obj;
         m.put("templetId", id);
         details.add(m);
       }
       this.serviceUtil.getEntityDao().batchInsert(getEntity("expTempletComp"), details);
     }
     return id;
   }
 
   public void deleteTempletDetail(Long[] ids) {
     this.serviceUtil.getEntityDao().deleteByIds(getEntity("expTempletComp"), ids);
   }
 
   public void updateTemplet(SDO params, List<Object> detailData)
   {
     EntityDocument.Entity en = getEntity("expTemplet");
     this.serviceUtil.getEntityDao().checkUniqueness(en, params.getProperties(), true, new String[] { "templetCode" });
     this.serviceUtil.getEntityDao().update(en, params.getProperties(), new String[0]);
     if ((null != detailData) && (detailData.size() > 0)) {
       List updateDetails = new ArrayList(detailData.size());
       List insertDetails = new ArrayList(detailData.size());
       for (Iterator i$ = detailData.iterator(); i$.hasNext(); ) { Object obj = i$.next();
         Map m = (Map)obj;
         if ((null == m.get("templetCompId")) || (StringUtil.isBlank(m.get("templetCompId").toString()))) {
           m.put("templetId", params.getProperty("id"));
           insertDetails.add(m);
         } else {
           updateDetails.add(m);
         }
       }
       if (insertDetails.size() > 0) {
         this.serviceUtil.getEntityDao().batchInsert(getEntity("expTempletComp"), insertDetails);
       }
       if (updateDetails.size() > 0)
         this.serviceUtil.getEntityDao().batchUpdate(getEntity("expTempletComp"), updateDetails, new String[0]);
     }
   }
 
   public void updateTempletStatus(Long[] ids, Integer sts)
   {
     this.serviceUtil.updateById("sys_exp_templet", "sts", "id", ids, sts);
   }
 
   public void updateTempletCompStatus(Long[] ids, Integer sts) {
     this.serviceUtil.updateById("SYS_EXP_TEMPLET_COMP", "sts", "TEMPLET_COMP_ID", ids, sts);
   }
 
   public void updateTempletParentId(Long[] ids, Long parentId) {
     this.serviceUtil.updateById("sys_exp_templet", "PARENT_ID", "id", ids, parentId);
   }
 
   public Long saveImpExcel(Long templetId, Long serialId, Operator operator, String newFileName)
     throws Exception
   {
     Map templet = this.serviceUtil.getEntityDao().loadById(getEntity("expTemplet"), templetId);
     if (templet == null) {
       throw new ApplicationException("未找到对应的模板");
     }
     List templetComps = queryUseExpTempletDetailByTempletId(templetId);
     if ((templetComps == null) || (templetComps.size() == 0)) {
       throw new ApplicationException("未找到对应的模板组成记录");
     }
     Long serial_id = serialId;
     if (serial_id == null) {
       serial_id = this.serviceUtil.getEntityDao().getSequence("seq_imp_temp_table");
     }
 
     StringBuffer ins = new StringBuffer();
     StringBuffer val = new StringBuffer();
     ins.append("insert into ").append(templet.get("tableName"));
 
     ins.append(" (tmp_id,serial_id,status,");
     val.append(" values(SEQ_IMP_TEMP_TABLE.NEXTVAL,?,?,");
     int length = templetComps.size();
     for (int i = 0; i < length; i++) {
       Map templetComp = (Map)templetComps.get(i);
       ins.append(templetComp.get("columnName"));
       val.append("?");
       if (i < length - 1) {
         ins.append(",");
         val.append(",");
       }
     }
     ins.append(")");
     val.append(")");
     LogHome.getLog().info("---执行导入开始---");
     Long start = Long.valueOf(System.currentTimeMillis());
 
     Object[] objs = { serial_id, "0" };
     impExcelDao(newFileName, ins.append(val).toString(), length, objs);
     Long end = Long.valueOf(System.currentTimeMillis());
     LogHome.getLog().info("---执行导入结束，耗时【" + (end.longValue() - start.longValue()) + "毫秒】---");
 
     insertLog(serial_id, templetId);
 
     String procedureName = (String)ClassHelper.convert(templet.get("procedureName"), String.class);
     if (!StringUtil.isBlank(procedureName)) {
       try {
         Object re = null;
         LogHome.getLog().info("---执行存储过程 【  " + procedureName + " 】开始---");
         start = Long.valueOf(System.currentTimeMillis());
         Map map = callImpProcedure(procedureName, serial_id);
         end = Long.valueOf(System.currentTimeMillis());
         LogHome.getLog().info("---执行存储过程 【  " + procedureName + " 】结束，耗时【" + (end.longValue() - start.longValue()) + "毫秒】---");
         re = map.get("returnCode");
         if (re != null) {
           int return_code = Integer.parseInt(re.toString());
           if (return_code != 0)
             throw new ApplicationException("调用存储" + procedureName + "错误:" + map.get("returnMessage"));
         }
       }
       catch (ApplicationException e) {
         throw e;
       } catch (Exception e) {
         throw new ApplicationException("调用存储" + procedureName + "异常:" + e.getMessage());
       }
     }
     return serial_id;
   }
 
   private void impExcelDao(String newFileName, String sql, int count, Object[] objects)
     throws Exception
   {
     BatchInsert batchInsert = new BatchInsert(this.serviceUtil.getEntityDao().getDataSource(), sql);
     batchInsert.setParams(objects);
     batchInsert.setSqlParameter(count);
     ExcelReaderUtil.readExcel(batchInsert, newFileName);
     batchInsert.flush();
   }
 
   private Map<String, Object> callImpProcedure(String procedureName, Long serialId) throws Exception {
     String sql = "{call " + procedureName + "(?, ?, ?)}";
     List declaredParameters = new ArrayList();
     declaredParameters.add(new SqlParameter("serialId", 2));
     declaredParameters.add(new SqlOutParameter("returnCode", 4));
     declaredParameters.add(new SqlOutParameter("returnMessage", 12));
     return this.serviceUtil.getEntityDao().call(sql, declaredParameters, new Object[] { serialId });
   }
 
   public Long getImpMidTableTotle(Long templetId, Long serial_id, String sts)
   {
     Map templet = this.serviceUtil.getEntityDao().loadById(getEntity("expTemplet"), templetId);
     if (templet == null) {
       throw new ApplicationException("未找到对应的模板记录");
     }
     Object table_name = templet.get("tableName");
     String sql = "select count(0) from " + table_name + " where serial_id=? and status=? ";
     return this.serviceUtil.getEntityDao().queryToLong(sql, new Object[] { serial_id, sts });
   }
 
   private void insertLog(Long serial_id, Long templetId)
   {
     String sql = "SELECT t.id FROM sys_imp_exp_log t where t.serial_id=? and t.templ_id=?";
     Long id = this.serviceUtil.getEntityDao().queryToLong(sql, new Object[] { serial_id, templetId });
     if (id == null) {
       Operator operator = (Operator)ThreadLocalUtil.getVariable("operator", Operator.class);
       Map params = new HashMap();
       params.put("serialId", serial_id);
       params.put("templId", templetId);
       params.put("fullId", operator.getFullId());
       params.put("fullName", operator.getFullDisplayName());
       params.put("createdate", new Date(System.currentTimeMillis()));
       this.serviceUtil.getEntityDao().insert(getEntity("impExpLog"), params);
     }
   }
 
   public void saveImpLog(Long serial_id, Long templetId, Operator operator, String uploadFileName, String message, Long e_nur, Long s_nur)
   {
     Map params = new HashMap();
     params.put("templId", templetId);
     params.put("fullId", operator.getFullId());
     params.put("fullName", operator.getFullDisplayName());
     params.put("filename", uploadFileName);
     params.put("message", message);
     params.put("errorNbr", e_nur);
     params.put("successNbr", s_nur);
     if (serial_id == null) {
       this.serviceUtil.getEntityDao().insert(getEntity("impExpLog"), params);
     } else {
       String sql = "SELECT t.id FROM sys_imp_exp_log t where t.serial_id=? and t.templ_id=?";
       Long id = this.serviceUtil.getEntityDao().queryToLong(sql, new Object[] { serial_id, templetId });
       if ((id != null) && (id.compareTo(new Long(0L)) > 0)) {
         params.put("id", id);
         this.serviceUtil.getEntityDao().update(getEntity("impExpLog"), params, new String[0]);
       }
     }
   }
 
   public void deleteTemplet(Long[] ids)
   {
     EntityDocument.Entity en = getEntity("expTemplet");
     String sql = this.serviceUtil.getEntityDao().getSqlByName(en, "getStatus");
     for (Long id : ids) {
       Map map = this.serviceUtil.getEntityDao().queryToMap(sql, new Object[] { id });
       if (null != map) {
         if (((Integer)ClassHelper.convert(map.get("sts"), Integer.class, Integer.valueOf(0))).intValue() != 0) {
           throw new ApplicationException(String.format("%s可能被其他用户修改,不能删除!", new Object[] { map.get("templetName") }));
         }
         Map param = new HashMap(1);
         param.put("templetId", id);
         this.serviceUtil.getEntityDao().deleteByCondition(getEntity("expTempletComp"), param);
         this.serviceUtil.getEntityDao().deleteById(en, id);
       }
     }
   }
 
   public String findTemplExcelHead(Long templetId)
     throws Exception
   {
     List<Map<String,Object>> templetComps = queryUseExpTempletDetailByTempletId(templetId);
     if ((templetComps == null) || (templetComps.size() == 0)) {
       throw new ApplicationException("未找到对应的模板组成记录");
     }
     StringBuffer xmlHeads = new StringBuffer("<tables><table><row>");
     for (Map templetComp : templetComps) {
       xmlHeads.append("<col field='").append(((String)templetComp.get("columnName")).toLowerCase()).append("'>").append(templetComp.get("cellColName")).append("</col>");
     }
 
     xmlHeads.append("</row></table></tables>");
     return xmlHeads.toString();
   }
 
   public List<Map<String, Object>> queryUseExpTempletDetailByTempletId(Long templetId) {
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getEntity("expTempletComp"), "queryUsedColumn");
     List maps = this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[] { templetId });
     return maps;
   }
 
   public Map<String, Object> slicedImpExpLogQuery(SDO params)
   {
     String manageType = (String)params.getProperty("sys_Manage_Type", String.class);
     QueryModel query = this.serviceUtil.getEntityDao().getQueryModel(getEntity("impExpLog"), params.getProperties());
     query.setManageType(manageType);
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(query, params);
   }
 
   public Map<String, Object> slicedResultQuery(SDO sdo)
   {
     Long templetId = (Long)sdo.getProperty("templId", Long.class);
     Map templet = this.serviceUtil.getEntityDao().loadById(getEntity("expTemplet"), templetId);
     if (templet == null) {
       throw new ApplicationException("未找到对应的模板记录");
     }
     List<Map<String,Object>> templetComps = queryUseExpTempletDetailByTempletId(templetId);
     if ((templetComps == null) || (templetComps.size() == 0)) {
       throw new ApplicationException("未找到对应的模板组成记录");
     }
     QueryModel query = new QueryModel(false);
     String status = (String)sdo.getProperty("status", String.class);
     StringBuffer sb = new StringBuffer("select tmp_id,serial_id,");
     for (Map comp : templetComps) {
       sb.append(comp.get("columnName")).append(",");
     }
     sb.append("status,message");
     sb.append(" from ").append(templet.get("tableName")).append(" where ");
     sb.append(" serial_id=:serialId");
     if (!StringUtil.isBlank(status)) {
       sb.append(" and status=:status");
       query.putParam("status", sdo.getProperty("status", String.class));
     }
     query.setSql(sb.toString());
     query.putParam("serialId", sdo.getProperty("serialId", Long.class));
     Map statusMap = new HashMap(3);
     statusMap.put("0", "新增");
     statusMap.put("1", "成功");
     statusMap.put("2", "失败");
     query.putDictionary("status", statusMap);
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(query, sdo);
   }
 
   public void updateImpLog(Long serialId)
   {
     EntityDocument.Entity entity = getEntity("impExpLog");
     String sql = this.serviceUtil.getEntityDao().getSqlByName(entity, "getLogBySerialId");
     Map map = this.serviceUtil.getEntityDao().queryToMap(sql, new Object[] { serialId });
     if ((map == null) || (map.size() == 0)) {
       throw new ApplicationException("未找到对应导入数据信息!");
     }
     Long templetId = (Long)ClassHelper.convert(map.get("templId"), Long.class);
     Map params = new HashMap();
     params.put("id", map.get("id"));
     params.put("serialId", serialId);
     Long e_nur = getImpMidTableTotle(templetId, serialId, "2");
     Long s_nur = getImpMidTableTotle(templetId, serialId, "1");
     params.put("errorNbr", e_nur);
     params.put("successNbr", s_nur);
     try {
       this.serviceUtil.getEntityDao().update(getEntity("impExpLog"), params, new String[0]);
     } catch (Exception e) {
       e.printStackTrace();
       LogHome.getLog(this).error(e);
     }
   }
 
   public void deleteTempData(SDO sdo)
   {
     Long templetId = (Long)sdo.getProperty("templId", Long.class);
     Map templet = this.serviceUtil.getEntityDao().loadById(getEntity("expTemplet"), templetId);
     if (templet == null) {
       throw new ApplicationException("未找到对应的模板记录!");
     }
     Long serialId = (Long)sdo.getProperty("serialId", Long.class);
     if (serialId == null) {
       throw new ApplicationException("序列号不能为空!");
     }
     StringBuffer sb = new StringBuffer("delete from ");
     sb.append(templet.get("tableName")).append(" where ");
     sb.append(" serial_id=?");
     this.serviceUtil.getEntityDao().executeUpdate(sb.toString(), new Object[] { serialId });
   }
 
   class BatchInsert extends BatchSqlUpdate
     implements IExcelRowReader
   {
     private Object[] params;
 
     BatchInsert(DataSource dataSource, String sql)
     {
//       super(sql);
       LogHome.getLog(ImpExcelServiceImpl.class).info(sql);
       setBatchSize(10000);
     }
 
     public void setParams(Object[] params) {
       this.params = params;
     }
 
     public void setSqlParameter(int count) {
       for (int i = 0; i < this.params.length; i++) {
         if ((this.params[i] instanceof Number))
           declareParameter(new SqlParameter(2));
         else {
           declareParameter(new SqlParameter(12));
         }
       }
       for (int i = 0; i < count; i++)
         declareParameter(new SqlParameter(12));
     }
 
     public void getRows(int sheetIndex, int curRow, List<String> rowlist)
     {
       if (curRow == 0) {
         return;
       }
       Object[] dataSets = new Object[this.params.length + rowlist.size()];
       System.arraycopy(this.params, 0, dataSets, 0, this.params.length);
       System.arraycopy(rowlist.toArray(), 0, dataSets, this.params.length, rowlist.size());
       update(dataSets);
     }
   }
 }

