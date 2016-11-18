 package com.brc.system.share.service.impl;
 
 import com.brc.system.data.JDBCDao;
 import com.brc.system.data.util.BuildSQLUtil;
 import com.brc.system.opm.Operator;
 import com.brc.system.share.easysearch.EasySearchDTO;
 import com.brc.system.share.easysearch.model.QuerySchemeField;
 import com.brc.system.share.service.EasySearchService;
 import com.brc.system.share.service.GetPermission;
 import com.brc.system.share.service.SQLQuery;
 import com.brc.util.ClassHelper;
 import com.brc.util.DateUtil;
 import com.brc.util.QueryModel;
 import com.brc.util.SDO;
 import com.brc.util.Singleton;
 import com.brc.util.StringUtil;
 import com.brc.util.ThreadLocalUtil;
 import java.util.ArrayList;
 import java.util.Date;
 import java.util.HashMap;
 import java.util.Iterator;
 import java.util.List;
 import java.util.Map;
 import java.util.Set;
 
 public class EasySearchServiceImp
   implements EasySearchService
 {
   private JDBCDao jdbcDao;
   private SQLQuery sqlQuery;
   private GetPermission getPermission;
 
   public void setJdbcDao(JDBCDao jdbcDao)
   {
     this.jdbcDao = jdbcDao;
   }
 
   public void setSqlQuery(SQLQuery sqlQuery) {
     this.sqlQuery = sqlQuery;
   }
 
   public void setGetPermission(GetPermission getPermission) {
     this.getPermission = getPermission;
   }
 
   public void search(EasySearchDTO dto, SDO sdo)
     throws Exception
   {
     String sql = dto.reBuildSql();
     Map param = sdo.getProperties();
     String manageType = (String)sdo.getProperty("sys_Manage_Type", String.class);
     if (!StringUtil.isBlank(manageType)) {
       SDO parm = this.getPermission.getPermissionSql(sql, manageType);
       sql = (String)parm.getProperty("sql", String.class);
       if (parm.getProperty("param") != null) {
         param.putAll((Map)parm.getProperty("param", Map.class));
       }
     }
     String pageSql = BuildSQLUtil.getOracleOptimizeSQL(dto.getStart(), dto.getPageSize(), sql);
 
     param.putAll(dto.getQueryParams());
     param.put("currentPersonId", sdo.getOperator().getId());
     param.put("currentOrgId", sdo.getOperator().getOrgId());
     param.put("currentPositionId", sdo.getOperator().getPositionId());
     param.put("currentPersonMemberId", sdo.getOperator().getPersonMemberId());
     param.put("currentDeptId", sdo.getOperator().getDeptId());
     param.put("currentFullId", sdo.getOperator().getFullId());
     ThreadLocalUtil.addVariable("queryModelDictionaryMap", dto.getDictionaryMap());
     List list = this.jdbcDao.queryToMapListByMapParam(pageSql, param);
 
     Integer total = (Integer)this.jdbcDao.queryToObjectByMapParam(BuildSQLUtil.getTotalSql(sql), Integer.class, param);
     dto.setComputeCount(total.intValue());
     dto.setDatas(reBuilderData(dto, list));
   }
 
   private static List<Map<String, String>> reBuilderData(EasySearchDTO dto, List<Map<String, Object>> l)
   {
     List datas = new ArrayList();
     for (Map map : l) {
       Map data = new HashMap();
       for (Iterator iterator = map.keySet().iterator(); iterator.hasNext(); ) {
         String key = (String)iterator.next();
         QuerySchemeField obj = dto.getField(key.toLowerCase());
         if (obj != null) {
           String value = map.get(key) != null ? map.get(key).toString() : "";
           if (!StringUtil.isBlank(value)) {
             if (!StringUtil.isBlank(obj.getDictionary())) {
               String textView = Singleton.getDictionaryDetailText(obj.getDictionary(), value);
               if (textView != null) {
                 data.put(obj.getCode() + "TextView", textView);
               }
             }
             if (obj.getType().equals("number")) {
               value = StringUtil.keepDigit(value, ((Integer)ClassHelper.convert(obj.getMask(), Integer.class)).intValue(), true);
             }
 
             if (obj.getType().equals("date")) {
               value = DateUtil.getDateFormat((Date)ClassHelper.convert(map.get(key), Date.class));
             }
             if (obj.getType().toLowerCase().equals("datetime")) {
               value = DateUtil.getDateFormat(3, (Date)ClassHelper.convert(map.get(key), Date.class));
             }
           }
           data.put(obj.getCode(), value);
         }
       }
       datas.add(data);
     }
     return datas;
   }
 
   public Map<String, Object> comboGridSearch(EasySearchDTO dto, SDO sdo)
   {
     String sql = dto.reBuildSql();
     Map param = sdo.getProperties();
     param.putAll(dto.getQueryParams());
     param.put("currentPersonId", sdo.getOperator().getId());
     param.put("currentOrgId", sdo.getOperator().getOrgId());
     param.put("currentPositionId", sdo.getOperator().getPositionId());
     param.put("currentPersonMemberId", sdo.getOperator().getPersonMemberId());
     param.put("currentDeptId", sdo.getOperator().getDeptId());
     param.put("currentFullId", sdo.getOperator().getFullId());
     QueryModel query = new QueryModel();
     query.setManageType((String)sdo.getProperty("sys_Manage_Type", String.class));
     query.setSql(sql);
     query.setQueryParams(param);
     query.setDictionaryMap(dto.getDictionaryMap());
     Map map = this.sqlQuery.executeSlicedQuery(query, sdo);
     List datas = (List)map.get("Rows");
     map.put("Rows", reBuilderData(dto, datas));
     return map;
   }
 }

