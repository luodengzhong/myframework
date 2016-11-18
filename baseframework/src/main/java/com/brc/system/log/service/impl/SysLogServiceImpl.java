 package com.brc.system.log.service.impl;
 
 import com.brc.system.data.JDBCDao;
 import com.brc.system.log.service.SysLogService;
 import com.brc.system.opm.Operator;
 import com.brc.system.share.service.impl.SQLQueryImpl;
 import com.brc.system.token.domain.UserTokenInfo;
 import com.brc.util.QueryModel;
 import com.brc.util.SDO;
 import com.brc.util.StringUtil;
 import java.util.Date;
 import java.util.HashMap;
 import java.util.Map;
 
 public class SysLogServiceImpl
   implements SysLogService
 {
   private JDBCDao dao;
   private SQLQueryImpl sqlQuery;
 
   public void setDao(JDBCDao dao)
   {
     this.dao = dao;
     this.sqlQuery = new SQLQueryImpl();
     this.sqlQuery.setJdbcDao(dao);
   }
 
   private void doPMInsert(Map<String, Object> map) {
     StringBuffer sb = new StringBuffer();
     sb.append("insert into sys_pm_log (id,create_time,");
     StringBuffer value = new StringBuffer();
     value.append(" values(SEQ_LOG_ID.Nextval,sysdate,");
     for (String key : map.keySet()) {
       sb.append(StringUtil.getUnderscoreName(key)).append(",");
       value.append(":").append(key).append(",");
     }
     sb.replace(sb.length() - 1, sb.length(), ")");
     value.replace(value.length() - 1, value.length(), ")");
     sb.append(value);
     this.dao.executeUpdateByMapParam(sb.toString(), map);
   }
 
   private void doInsert(Map<String, Object> map) {
     StringBuffer sb = new StringBuffer();
     sb.append("insert into sys_log (id,create_time,");
     StringBuffer value = new StringBuffer();
     value.append(" values(SEQ_LOG_ID.Nextval,sysdate,");
     for (String key : map.keySet()) {
       sb.append(StringUtil.getUnderscoreName(key)).append(",");
       value.append(":").append(key).append(",");
     }
     sb.replace(sb.length() - 1, sb.length(), ")");
     value.replace(value.length() - 1, value.length(), ")");
     sb.append(value);
     this.dao.executeUpdateByMapParam(sb.toString(), map);
   }
 
   private void doInsertClob(String content)
   {
     String sql = "insert into sys_log_clob (content,sys_log_id)values(?,SEQ_LOG_ID.Currval)";
     this.dao.saveClob(sql, content, new Object[0]);
   }
 
   public Map<String, Object> load(SDO params)
   {
     String sql = "select id, type_id, person_id, person_name, class_name, function_name, params, log_level, exception, ip, create_time, end_time, full_id, full_name, begin, end from sys_log where id=?";
     Long id = (Long)params.getProperty("id", Long.class);
     return this.dao.queryToMap(sql, new Object[] { id });
   }
 
   public void delete(SDO params)
   {
     String sql = "delete sys_log where id = ?";
     Long id = (Long)params.getProperty("id", Long.class);
     this.dao.executeUpdate(sql, new Object[] { id });
   }
 
   public Map<String, Object> slicedQuery(SDO params)
   {
     QueryModel query = new QueryModel();
     StringBuffer sb = new StringBuffer();
     sb.append("select t.id,");
     sb.append("       t.type_id,");
     sb.append("       t.person_id,");
     sb.append("       t.person_name,");
     sb.append("       t.class_name,");
     sb.append("       t.function_name,");
     sb.append("       t.params,");
     sb.append("       t.log_level,");
     sb.append("       t.exception,");
     sb.append("       t.ip,");
     sb.append("       t.create_time,");
     sb.append("       t.end_time,");
     sb.append("       t.full_id,");
     sb.append("       t.full_name");
     sb.append("  from sys_log t");
     sb.append(" where 1 = 1");
     String typeId = (String)params.getProperty("typeId", String.class);
     if (!StringUtil.isBlank(typeId)) {
       sb.append(" and t.type_id = :typeId");
       query.putParam("typeId", typeId);
     }
     String fullId = (String)params.getProperty("fullId", String.class);
     if (!StringUtil.isBlank(fullId)) {
       sb.append(" and t.full_id like :fullId");
       query.putLikeParam("fullId", fullId);
     }
     String personName = (String)params.getProperty("personName", String.class);
     if (!StringUtil.isBlank(personName)) {
       sb.append(" and t.person_name like :personName");
       query.putLikeParam("personName", personName);
     }
     String ip = (String)params.getProperty("ip", String.class);
     if (!StringUtil.isBlank(ip)) {
       sb.append(" and t.ip like :ip");
       query.putLikeParam("ip", ip);
     }
     Date createTimeBegin = (Date)params.getProperty("createTimeBegin", Date.class);
     if (createTimeBegin != null) {
       sb.append(" and t.create_time >= :createTimeBegin");
       query.putParam("createTimeBegin", createTimeBegin);
     }
     Date createTimeEnd = (Date)params.getProperty("createTimeEnd", Date.class);
     if (createTimeEnd != null) {
       sb.append(" and t.create_time <= :createTimeEnd");
       query.putParam("createTimeEnd", createTimeEnd);
     }
     String functionName = (String)params.getProperty("functionName", String.class);
     if (!StringUtil.isBlank(functionName)) {
       sb.append(" and t.function_name like :functionName");
       query.putLikeParam("functionName", functionName);
     }
     String className = (String)params.getProperty("className", String.class);
     if (!StringUtil.isBlank(className)) {
       sb.append(" and t.class_name like :className");
       query.putLikeParam("className", className);
     }
     query.setSql(sb.toString());
     query.setManageType("");
     return this.sqlQuery.executeSlicedQuery(query, params);
   }
 
   public void doInsertFunctionLog(Operator operator, String functionId)
   {
     Map map = new HashMap(8);
     map.put("typeId", "function");
     map.put("personId", operator.getId());
     map.put("personName", operator.getName());
     map.put("fullId", operator.getFullId());
     map.put("fullName", operator.getFullName());
     map.put("className", functionId);
     map.put("ip", operator.getIp());
     doInsert(map);
   }
 
   public void doInsertLoginLog(Operator operator)
   {
     Map map = new HashMap(7);
     map.put("typeId", "login");
     map.put("personId", operator.getId());
     map.put("personName", operator.getName());
     map.put("fullId", operator.getFullId());
     map.put("fullName", operator.getFullName());
     map.put("ip", operator.getIp());
     doInsert(map);
   }
 
   public void doInsertOperationLog(Operator operator, String url, String params, String func, Long begin)
   {
     boolean needClob = false;
     String tempParams = params;
     if ((!StringUtil.isBlank(tempParams)) && 
       (tempParams.length() > 1900)) {
       tempParams = tempParams.substring(0, 1900);
       needClob = true;
     }
 
     String tempUrl = url;
     if ((!StringUtil.isBlank(tempUrl)) && 
       (tempUrl.length() > 100)) {
       tempUrl = tempUrl.substring(0, 100);
     }
 
     Map map = new HashMap(10);
     map.put("typeId", "operation");
     map.put("className", tempUrl);
     map.put("params", tempParams);
     map.put("personId", operator.getId());
     map.put("personName", operator.getName());
     map.put("fullId", operator.getFullId());
     map.put("fullName", operator.getFullName());
     map.put("ip", operator.getIp());
     map.put("begin", begin);
     map.put("end", Long.valueOf(System.currentTimeMillis()));
     if (!StringUtil.isBlank(func)) {
       map.put("funId", func);
     }
     doInsert(map);
     if (needClob)
       doInsertClob(params);
   }
 
   public void doInsertErrorLog(Operator operator, String className, String methodName, String params, String errorMessage)
   {
     boolean needClob = false;
     String tempParams = params;
     if ((!StringUtil.isBlank(tempParams)) && 
       (tempParams.length() > 1900)) {
       tempParams = tempParams.substring(0, 1900);
       needClob = true;
     }
 
     String tmpErrorMessage = errorMessage;
     if ((!StringUtil.isBlank(tmpErrorMessage)) && 
       (tmpErrorMessage.length() > 2900)) {
       tmpErrorMessage = tmpErrorMessage.substring(0, 2900);
     }
 
     Map map = new HashMap(11);
     map.put("typeId", "error");
     map.put("className", className);
     map.put("functionName", methodName);
     map.put("params", tempParams);
     map.put("exception", tmpErrorMessage);
     if (operator != null) {
       map.put("personId", operator.getId());
       map.put("personName", operator.getName());
       map.put("fullId", operator.getFullId());
       map.put("fullName", operator.getFullName());
       map.put("ip", operator.getIp());
     }
     doInsert(map);
     if (needClob)
       doInsertClob(params);
   }
 
   public void doInsertPMAppLoginLog(UserTokenInfo userTokenInfo)
   {
     Map map = new HashMap(3);
     map.put("typeId", "login");
     map.put("contactId", userTokenInfo.getContactId());
     map.put("mobile", userTokenInfo.getMobile());
     map.put("ip", userTokenInfo.getIp());
     doPMInsert(map);
   }
 
   public void doInsertPMAppOperationLog(UserTokenInfo userTokenInfo, String url, String params, String func, Long begin)
   {
     boolean isSaveClob = false;
     String tempParams = params;
     if ((!StringUtil.isBlank(tempParams)) && (tempParams.length() > 1900)) {
       tempParams = tempParams.substring(0, 1900);
       isSaveClob = true;
     }
 
     String tempUrl = url;
     if ((!StringUtil.isBlank(tempUrl)) && (tempUrl.length() > 100)) {
       tempUrl = tempUrl.substring(0, 100);
     }
 
     Map map = new HashMap(10);
     map.put("typeId", "operation");
     map.put("contactId", userTokenInfo.getContactId());
     map.put("mobile", userTokenInfo.getMobile());
     map.put("ip", userTokenInfo.getIp());
     map.put("className", tempUrl);
     map.put("params", tempParams);
     map.put("begin", begin);
     map.put("end", Long.valueOf(System.currentTimeMillis()));
     map.put("funId", func);
     doPMInsert(map);
     if (isSaveClob)
       doInsertClob(params);
   }
 }

