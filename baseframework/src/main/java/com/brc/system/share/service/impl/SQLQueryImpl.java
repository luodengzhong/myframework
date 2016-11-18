 package com.brc.system.share.service.impl;
 
 import com.brc.exception.ApplicationException;
 import com.brc.exception.ExportExcelException;
 import com.brc.exception.SQLParseException;
 import com.brc.license.License;
 import com.brc.license.LicenseUtil;
 import com.brc.system.data.JDBCDao;
 import com.brc.system.data.util.BuildSQLUtil;
 import com.brc.system.share.service.GetPermission;
 import com.brc.system.share.service.SQLQuery;
 import com.brc.system.util.Util;
 import com.brc.util.ClassHelper;
 import com.brc.util.QueryModel;
 import com.brc.util.SDO;
 import com.brc.util.Singleton;
 import com.brc.util.StringUtil;
 import com.brc.util.ThreadLocalUtil;
 import com.brc.util.excel.ExportExcel;
 import com.brc.util.excel.export.XSSFExport;
 import java.io.File;
 import java.util.HashMap;
 import java.util.List;
 import java.util.Map;
 import org.dom4j.Element;
 
 public class SQLQueryImpl
   implements SQLQuery
 {
   private JDBCDao jdbcDao;
   private GetPermission getPermission;
   private int LICENSE_INDEX = 0;
 
   public void setJdbcDao(JDBCDao jdbcDao) {
     this.jdbcDao = jdbcDao;
   }
 
   public void setGetPermission(GetPermission getPermission) {
     this.getPermission = getPermission;
   }
 
   private void checkLicense() {
     License license = LicenseUtil.LICENSE;
     Util.check(!license.isExpired(), "License已过期。");
     this.LICENSE_INDEX += 1;
     if (this.LICENSE_INDEX % 300 == 0) {
       String sql = "select count(*) from user_tables";
       int tableCount = this.jdbcDao.queryToInt(sql, new Object[0]);
       Util.check(tableCount < license.getTableCount(), "用户表超过最大限制。");
       Util.check(license.getVersion() == 3, "您使用的是测试版。");
     }
     if (this.LICENSE_INDEX == 1000000)
       this.LICENSE_INDEX = 0;
   }
 
   public Map<String, Object> executeSlicedQuery(QueryModel queryModel, SDO params)
   {
     Integer pageSize = (Integer)params.getProperty("pagesize", Integer.class);
     pageSize = Integer.valueOf(pageSize != null ? pageSize.intValue() : 20);
     Integer pageIndex = (Integer)params.getProperty("page", Integer.class);
     pageIndex = Integer.valueOf(pageIndex != null ? pageIndex.intValue() : 1);
     String export = (String)params.getProperty("exportType", String.class);
     if ((export != null) && (export.equals("all"))) {
       pageSize = Integer.valueOf(-1);
     }
     else if (0 >= pageSize.intValue()) {
       pageIndex = Integer.valueOf(1);
     }
 
     queryModel.setExportType(export);
     queryModel.setPageIndex(pageIndex.intValue());
     queryModel.setPageSize(pageSize.intValue());
     queryModel.setTotalFields((String)params.getProperty("totalFields", String.class));
     queryModel.setSortFieldName((String)params.getProperty("sortname", String.class));
     queryModel.setSortOrder((String)params.getProperty("sortorder", String.class));
     queryModel.setExportExcelType((String)params.getProperty("exportExcelType", String.class));
     Map result = null;
     try {
       ThreadLocalUtil.addVariable("queryModelDictionaryMap", queryModel.getDictionaryMap());
       if (StringUtil.isBlank(export)) {
         result = internalExecuteSlicedQuery(queryModel);
         result.put("page", pageIndex);
       } else {
         parseExportHead(queryModel, params);
 
         result = exportExecuteQuery(queryModel);
       }
     } catch (Exception e) {
       throw new SQLParseException(e);
     } finally {
       ThreadLocalUtil.removeVariable("queryModelDictionaryMap");
     }
     return result;
   }
 
   public Map<String, Object> executeQuery(QueryModel queryModel, SDO params)
   {
     queryModel.setTotalFields((String)params.getProperty("totalFields", String.class));
     queryModel.setSortFieldName((String)params.getProperty("sortname", String.class));
     queryModel.setSortOrder((String)params.getProperty("sortorder", String.class));
     Map result = null;
     try {
       ThreadLocalUtil.addVariable("queryModelDictionaryMap", queryModel.getDictionaryMap());
       result = internalExecuteQuery(queryModel);
     } catch (Exception e) {
       throw new SQLParseException(e);
     } finally {
       ThreadLocalUtil.removeVariable("queryModelDictionaryMap");
     }
     return result;
   }
 
   public Map<String, Object> executeQuery(QueryModel queryModel, String orderby, String order)
   {
     queryModel.setSortFieldName(orderby);
     queryModel.setSortOrder(order);
     Map result = null;
     try {
       ThreadLocalUtil.addVariable("queryModelDictionaryMap", queryModel.getDictionaryMap());
       result = internalExecuteQuery(queryModel);
     } catch (Exception e) {
       throw new SQLParseException(e);
     } finally {
       ThreadLocalUtil.removeVariable("queryModelDictionaryMap");
     }
     return result;
   }
 
   private void parseExportHead(QueryModel obj, SDO sdo)
   {
     if (!StringUtil.isBlank(obj.getXmlFilePath())) return;
     if (!StringUtil.isBlank(obj.getXmlHeads())) return;
     String head = (String)sdo.getProperty("exportHead", String.class);
     if (!StringUtil.isBlank(head))
       obj.setXmlHeads(head);
   }
 
   private Map<String, Object> exportExcel(Map<String, Object> datas, QueryModel obj)
     throws Exception
   {
     return ExportExcel.doExport(datas, obj.getXmlHeads(), obj.getXmlFilePath(), obj.getExportExcelType());
   }
 
   private String getQuerySql(QueryModel queryModel)
   {
     StringBuffer sb = new StringBuffer();
     if (!StringUtil.isBlank(queryModel.getManageType())) {
       SDO sdo = null;
       if (queryModel.isTreeQuery())
         sdo = this.getPermission.getTreePermissionSql(queryModel.getSql(), queryModel.getManageType());
       else {
         sdo = this.getPermission.getPermissionSql(queryModel.getSql(), queryModel.getManageType());
       }
       sb.append((String)sdo.getProperty("sql", String.class));
       queryModel.putAll((Map)sdo.getProperty("param", Map.class));
     } else {
       sb.append("select * from (").append(queryModel.getSql()).append(")");
       sb.append(" where 1=1 ");
     }
     String sort = StringUtil.getUnderscoreName(queryModel.getSortFieldName());
     String defaultOrderBy = queryModel.getDefaultOrderBy();
 
     if (!StringUtil.isBlank(sort))
     {
       sb.append(" order by ");
       if (!StringUtil.isBlank(defaultOrderBy)) {
         sb.append(defaultOrderBy).append(",");
       }
       sb.append(sort);
       String sortOrder = queryModel.getSortOrder();
       if ((!StringUtil.isBlank(sortOrder)) && 
         (!sortOrder.equals("true"))) {
         sb.append(" ").append(queryModel.getSortOrder());
       }
 
     }
     else if (!StringUtil.isBlank(defaultOrderBy)) {
       sb.append(" order by ").append(defaultOrderBy);
     }
 
     return sb.toString();
   }
 
   private Map<String, Object> internalExecuteSlicedQuery(QueryModel queryModel)
   {
     String sql = getQuerySql(queryModel);
     Map map = new HashMap();
     int count = getTotal(sql, queryModel.getQueryParams());
     map.put("Total", Integer.valueOf(count));
     List datas = queryListForPaging(sql, queryModel.getQueryParams(), queryModel.getStart(), queryModel.getPageSize());
     map.put("Rows", datas);
     if ((queryModel.getTotalFields() != null) && (!queryModel.getTotalFields().equals(""))) {
       Map totals = queryTotalByFields(sql, queryModel.getTotalFields(), queryModel.getQueryParams());
       if (totals != null) {
         map.put("totalFields", totals);
       }
     }
     return map;
   }
 
   private Map<String, Object> internalExecuteQuery(QueryModel queryModel)
   {
     String sql = getQuerySql(queryModel);
     Map result = new HashMap(2);
     List data = this.jdbcDao.queryToMapListByMapParam(sql, queryModel.getQueryParams());
     result.put("Rows", data);
     result.put("Total", Integer.valueOf(data.size()));
     if ((queryModel.getTotalFields() != null) && (!queryModel.getTotalFields().equals(""))) {
       Map totals = queryTotalByFields(sql, queryModel.getTotalFields(), queryModel.getQueryParams());
       if (totals != null) {
         result.put("totalFields", totals);
       }
     }
     return result;
   }
 
   public Map<String, Object> exportExecuteQuery(QueryModel queryModel)
   {
     String sql = getQuerySql(queryModel);
     int count = getTotal(sql, queryModel.getQueryParams());
     String export = queryModel.getExportType();
     int exportExcelCount = ((Integer)ClassHelper.convert(Singleton.getParameter("exportExcelCount", String.class), Integer.class, Integer.valueOf(10000))).intValue();
     if ((null != export) && (!export.equals("")) && 
       (count > exportExcelCount)) {
       throw new ApplicationException("导出数据量太大,请适当调整查询条件!");
     }
 
     Map result = new HashMap(1);
     if ((queryModel.getTotalFields() != null) && (!queryModel.getTotalFields().equals(""))) {
       Map totals = queryTotalByFields(sql, queryModel.getTotalFields(), queryModel.getQueryParams());
       if (totals != null) {
         result.put("totalFields", totals);
       }
     }
     Map m = new HashMap(1);
     try {
       XSSFExport exporter = new XSSFExport();
       Element headRoot = ExportExcel.readXml(queryModel.getXmlHeads(), queryModel.getXmlFilePath());
       exporter.setHeadRoot(headRoot);
       exporter.setDatas(result);
       String s = exporter.expExcel(sql, queryModel.getQueryParams(), this.jdbcDao);
       File file = new File(s);
       if (file.exists())
         m.put("file", file.getName());
       else
         throw new ExportExcelException("文件生成失败!");
     }
     catch (Exception e) {
       e.printStackTrace();
       throw new ExportExcelException(e);
     }
     return m;
   }
 
   public int getTotal(String tableName, String fieldName, Object fieldValue)
   {
     String sql = String.format("select count(0) from %s where %s=?", new Object[] { tableName, fieldName });
     return this.jdbcDao.queryToInt(sql, new Object[] { fieldValue });
   }
 
   public int getTotal(String sql, Map<String, Object> param)
   {
     String totalSql = BuildSQLUtil.getTotalSql(sql);
     return ((Integer)this.jdbcDao.queryToObjectByMapParam(totalSql, Integer.class, param)).intValue();
   }
 
   public List<Map<String, Object>> queryListForPaging(String sql, Map<String, Object> param, int firstResult, int rows)
   {
     int startPos = 0;
     int size = -1;
     if (rows > 0) {
       startPos = firstResult;
       size = rows;
     }
     String pageSql = BuildSQLUtil.getOracleOptimizeSQL(startPos, size, sql);
     return this.jdbcDao.queryToMapListByMapParam(pageSql, param);
   }
 
   public Map<String, Object> queryTotalByFields(String sql, String totalFields, Map<String, Object> param)
   {
     String totalSql = BuildSQLUtil.getTotleFieldsSql(sql, totalFields);
     if (StringUtil.isBlank(totalSql)) {
       return null;
     }
     return this.jdbcDao.queryToMapByMapParam(totalSql, param);
   }
 }

