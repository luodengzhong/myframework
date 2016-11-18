 package com.brc.system.person.service.impl;
 
 import com.brc.exception.ApplicationException;
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.data.impl.SQLServerJDBCDaoImpl;
 import com.brc.system.data.util.BuildSQLUtil;
 import com.brc.system.opm.Operator;
 import com.brc.system.person.service.PersonOwnService;
 import com.brc.system.share.service.SQLQuery;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.util.ClassHelper;
 import com.brc.util.DateUtil;
 import com.brc.util.QueryModel;
 import com.brc.util.SDO;
 import com.brc.util.StringUtil;
import com.brc.xmlbean.EntityDocument;
 import com.brc.xmlbean.EntityDocument.Entity;
 import java.io.Serializable;
 import java.sql.Timestamp;
 import java.text.SimpleDateFormat;
 import java.util.ArrayList;
 import java.util.Calendar;
 import java.util.GregorianCalendar;
 import java.util.HashMap;
 import java.util.List;
 import java.util.Map;
 
 public class PersonOwnServiceImpl
   implements PersonOwnService
 {
   private ServiceUtil serviceUtil;
   private Integer pageSize;
   private SQLServerJDBCDaoImpl erpJDBCDao;
 
   public void setPageSize(Integer pageSize)
   {
     this.pageSize = pageSize;
   }
 
   public void setServiceUtil(ServiceUtil serviceUtil) {
     this.serviceUtil = serviceUtil;
   }
 
   public void setErpJDBCDao(SQLServerJDBCDaoImpl erpJDBCDao) {
     this.erpJDBCDao = erpJDBCDao;
   }
 
   private EntityDocument.Entity getEntity(String name)
   {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/cfg/personOwn.xml", name);
   }
 
   private String tranTime(Object obj)
   {
     if (obj == null) return "";
     java.util.Date date = (java.util.Date)ClassHelper.convert(obj, java.util.Date.class);
     String hm = new SimpleDateFormat("HH:mm").format(date);
     Long time = Long.valueOf((System.currentTimeMillis() - date.getTime()) / 1000L);
     if (time.longValue() < 60L)
       return "刚刚";
     if (time.longValue() < 3600L) {
       Long min = Long.valueOf(time.longValue() / 60L);
       return min + "分钟前 " + hm;
     }if (time.longValue() < 86400L) {
       Long min = Long.valueOf(time.longValue() / 3600L);
       return min + "小时前 " + hm;
     }if (time.longValue() < 172800L)
       return "昨天 " + hm;
     if (time.longValue() < 259200L) {
       return "前天 " + hm;
     }
     SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm");
     return df.format(date);
   }
 
   public List<Map<String, Object>> getUsersNotes(String userId)
   {
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getEntity("personNotes"), "queryForView");
     sql = BuildSQLUtil.getOracleOptimizeSQL(0, this.pageSize.intValue(), sql);
     List<Map<String,Object>> list = this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[] { userId });
     for (Map map : list) {
       map.put("timeTitle", tranTime(map.get("createDate")));
     }
     return list;
   }
 
   public Long saveNote(SDO sdo)
   {
     Map param = sdo.getProperties();
     param.put("isused", Integer.valueOf(1));
     param.put("personId", sdo.getOperator().getId());
     param.put("createDate", new Timestamp(System.currentTimeMillis()));
     return (Long)this.serviceUtil.getEntityDao().insert(getEntity("personNotes"), param);
   }
 
   public void updateNote(SDO sdo)
   {
     Map param = sdo.getProperties();
     this.serviceUtil.getEntityDao().update(getEntity("personNotes"), param, new String[0]);
   }
 
   public void deleteNote(Long[] ids)
   {
     this.serviceUtil.getEntityDao().deleteByIds(getEntity("personNotes"), ids);
   }
 
   public void deleteAll(String userId)
   {
     this.serviceUtil.getEntityDao().executeUpdateBySqlName(getEntity("personNotes"), "deleteByPersonId", new Object[] { userId });
   }
 
   public Map<String, Object> slicedQueryPersonNotes(SDO params)
   {
     QueryModel query = this.serviceUtil.getEntityDao().getQueryModel(getEntity("personNotes"), params.getProperties());
     return this.serviceUtil.getSQLQuery().executeSlicedQuery(query, params);
   }
 
   private java.sql.Date getDate(java.util.Date fd)
   {
     Calendar fc = Calendar.getInstance();
     fc.setTime(fd);
     Calendar oneCalendar = Calendar.getInstance();
     oneCalendar.clear();
     oneCalendar.set(fc.get(1), fc.get(2), fc.get(5));
     return new java.sql.Date(oneCalendar.getTime().getTime());
   }
 
   public List<Map<String, Object>> queryCalendar(Operator operator, java.util.Date sdate, java.util.Date edate)
   {
     List list = new ArrayList();
     Map param = new HashMap(6);
     param.put("personId", operator.getId());
     param.put("dptId", operator.getDeptId());
     param.put("ognId", operator.getOrgId());
     param.put("posId", operator.getPositionId());
     param.put("startTime", sdate);
     param.put("endTime", edate);
 
     List<Map<String,Object>> calendars = this.serviceUtil.getEntityDao().queryBySqlName(getEntity("personWorkcalendar"), "queryCalendar", param);
     for (Map map : calendars) {
       Integer isAlldayevent = (Integer)ClassHelper.convert(map.get("isAlldayevent"), Integer.class);
       if (isAlldayevent.intValue() == 0)
         map.put("allDay", Boolean.valueOf(false));
       else {
         map.put("allDay", Boolean.valueOf(true));
       }
       java.util.Date startTime = (java.util.Date)ClassHelper.convert(map.get("startTime"), java.util.Date.class);
       if (startTime != null) {
         map.put("start", DateUtil.getDateFormat(3, startTime));
       }
       java.util.Date endTime = (java.util.Date)ClassHelper.convert(map.get("endTime"), java.util.Date.class);
       if (endTime != null) {
         map.put("end", DateUtil.getDateFormat(3, endTime));
       }
       list.add(map);
     }
 
     java.sql.Date tempDate = getDate(sdate);
     List<Map<String,Object>> rcs = null;
 
     while (tempDate.compareTo(edate) < 1) {
       rcs = queryCalendarForRepeat(operator, tempDate);
       if ((rcs != null) && (rcs.size() > 0)) {
         for (Map obj : rcs) {
           if (checkRepeatcalendarAsFrequency(obj, tempDate)) {
             Long starttimestep = (Long)ClassHelper.convert(obj.get("starTimeStep"), Long.class, new Long(0L));
             Long endtimestep = (Long)ClassHelper.convert(obj.get("endTimeStep"), Long.class, new Long(0L));
             obj.put("editable", Boolean.valueOf(false));
             Integer isalldayevent = (Integer)ClassHelper.convert(obj.get("isAlldayevent"), Integer.class);
             if (isalldayevent.intValue() == 0) {
               obj.put("allDay", Boolean.valueOf(false));
 
               obj.put("start", DateUtil.getDateFormat(3, new java.util.Date(tempDate.getTime() + starttimestep.longValue())));
 
               obj.put("end", DateUtil.getDateFormat(3, new java.util.Date(tempDate.getTime() + endtimestep.longValue())));
             } else {
               obj.put("start", DateUtil.getDateFormat(3, tempDate));
 
               obj.put("end", DateUtil.getDateFormat(3, new java.util.Date(tempDate.getTime() + endtimestep.longValue())));
             }
             list.add(obj);
           }
         }
       }
       tempDate = DateUtil.getStepDay(tempDate, 1);
     }
     return list;
   }
 
   private List<Map<String, Object>> queryCalendarForRepeat(Operator operator, java.util.Date date)
   {
     Calendar c = new GregorianCalendar();
     c.setTime(date);
 
     String day_week = String.valueOf(c.get(7) - 1);
     String day_month = String.valueOf(c.get(5));
 
     day_month = day_month.length() == 1 ? "0" + day_month : day_month;
     String month = String.valueOf(c.get(2) + 1);
     month = month.length() == 1 ? "0" + month : month;
     Map param = new HashMap(6);
     param.put("personId", operator.getId());
     param.put("dptId", operator.getDeptId());
     param.put("ognId", operator.getOrgId());
     param.put("posId", operator.getPositionId());
     param.put("startTime", date);
     param.put("weekvalue", day_week);
     param.put("monthvalue", day_month);
     param.put("yearvalue", month + day_month);
     return this.serviceUtil.getEntityDao().queryBySqlName(getEntity("personWorkcalendar"), "queryCalendarForRepeat", param);
   }
 
   private boolean checkRepeatcalendarAsFrequency(Map<String, Object> obj, java.util.Date date)
   {
     Integer frequency = (Integer)ClassHelper.convert(obj.get("frequency"), Integer.class, Integer.valueOf(1));
     if (frequency.intValue() == 1)
       return true;
     int interval = 0;
 
     Integer repeattype = (Integer)ClassHelper.convert(obj.get("repeatType"), Integer.class, Integer.valueOf(1));
     java.util.Date startTime = (java.util.Date)ClassHelper.convert(obj.get("startTime"), java.util.Date.class);
     if (repeattype.intValue() == 1)
     {
       interval = DateUtil.getIntervalDay(startTime, date);
     } else if (repeattype.intValue() == 2)
     {
       interval = DateUtil.getIntervalWeeks(startTime, date);
     } else if (repeattype.intValue() == 3)
     {
       interval = DateUtil.getIntervalMonth(startTime, date);
     } else if (repeattype.intValue() == 4)
     {
       interval = DateUtil.getCalendarInt(date, 1) - DateUtil.getCalendarInt(startTime, 1);
     }
     if (interval % frequency.intValue() == 0) return true;
     return false;
   }
 
   public Long saveCalendar(SDO sdo)
   {
     Operator operator = sdo.getOperator();
     Map param = sdo.getProperties();
     param.put("personId", operator.getId());
     param.put("dptId", operator.getDeptId());
     param.put("ognId", operator.getOrgId());
     param.put("posId", operator.getPositionId());
     param.put("calendarType", "1");
     param.put("isRepeat", new Long(0L));
     param.put("createBy", operator.getId());
     param.put("createDate", new Timestamp(System.currentTimeMillis()));
     return (Long)this.serviceUtil.getEntityDao().insert(getEntity("personWorkcalendar"), param);
   }
 
   public void updateCalendar(SDO sdo)
   {
     Map obj = this.serviceUtil.getEntityDao().loadById(getEntity("personWorkcalendar"), (Serializable)sdo.getProperty("id", Long.class));
     if ((obj == null) || (obj.size() == 0)) {
       throw new ApplicationException("选择的数据不存在!");
     }
     Map map = new HashMap(4);
     map.put("id", sdo.getProperty("id", Long.class));
     map.put("startTime", sdo.getProperty("startTime"));
     map.put("endTime", sdo.getProperty("endTime"));
     map.put("isAlldayevent", sdo.getProperty("isAlldayevent"));
     this.serviceUtil.getEntityDao().update(getEntity("personWorkcalendar"), map, new String[0]);
   }
 
   public void updateCalendarColor(Long id, String color)
   {
     Map obj = this.serviceUtil.getEntityDao().loadById(getEntity("personWorkcalendar"), id);
     if ((obj == null) || (obj.size() == 0)) {
       throw new ApplicationException("选择的数据不存在!");
     }
     Map map = new HashMap(2);
     map.put("id", id);
     map.put("className", color);
     this.serviceUtil.getEntityDao().update(getEntity("personWorkcalendar"), map, new String[0]);
   }
 
   public void deleteCalendar(Long id)
   {
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getEntity("personWorkcalendar"), "getRepeatIdById");
     Long repeatId = this.serviceUtil.getEntityDao().queryToLong(sql, new Object[] { id });
     this.serviceUtil.getEntityDao().deleteById(getEntity("personWorkcalendar"), id);
     if (repeatId != null) {
       this.serviceUtil.getEntityDao().deleteById(getEntity("repeatCalendar"), repeatId);
       this.serviceUtil.getEntityDao().executeUpdateBySqlName(getEntity("repeatCalendarSchedule"), "deleteByRepeatId", new Object[] { repeatId });
     }
   }
 
   public Map<String, Object> getCalendar(Long id)
   {
     Map map = this.serviceUtil.getEntityDao().loadById(getEntity("personWorkcalendar"), id);
     if ((map == null) || (map.size() == 0)) {
       throw new ApplicationException("选择的数据不存在!");
     }
     Long repeatId = (Long)ClassHelper.convert(map.get("repeatId"), Long.class);
     if (repeatId != null) {
       Map repeat = this.serviceUtil.getEntityDao().loadById(getEntity("repeatCalendar"), repeatId);
       if ((repeat != null) && (repeat.size() > 0)) {
         String sql = this.serviceUtil.getEntityDao().getSqlByName(getEntity("repeatCalendarSchedule"), "queryByRepeatId");
         map.put("repeat", repeat);
         List<Map<String,Object>> schedules = this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[] { repeatId });
         StringBuffer sb = new StringBuffer();
         for (Map m : schedules) {
           sb.append(m.get("validDate")).append(",");
         }
         map.put("schedulesString", sb.toString());
         map.put("repeatStartDate", map.get("startTime"));
         map.put("startDateString", DateUtil.getDateFormat(1, (java.util.Date)ClassHelper.convert(map.get("startTime"), java.util.Date.class)));
         int repeatType = ((Integer)ClassHelper.convert(repeat.get("repeatType"), Integer.class, Integer.valueOf(0))).intValue();
         if ((repeat != null) && (map.get("endTime") != null) && (repeatType == 3)) {
           map.put("endDateString", DateUtil.getDateFormat(1, (java.util.Date)ClassHelper.convert(map.get("endTime"), java.util.Date.class)));
         }
       }
     }
     return map;
   }
 
   public void saveParticularCalendar(SDO sdo)
   {
     Long id = (Long)sdo.getProperty("id", Long.class);
     Long repeatId = null;
     Operator operator = sdo.getOperator();
     Map param = sdo.getProperties();
     param.put("personId", operator.getId());
     param.put("dptId", operator.getDeptId());
     param.put("ognId", operator.getOrgId());
     param.put("posId", operator.getPositionId());
     param.put("createBy", operator.getId());
     param.put("createDate", new Timestamp(System.currentTimeMillis()));
     java.util.Date sd = (java.util.Date)sdo.getProperty("startTime", java.util.Date.class);
     java.util.Date ed = (java.util.Date)sdo.getProperty("endTime", java.util.Date.class);
     Long isRepeat = (Long)sdo.getProperty("isRepeat", Long.class, new Long(0L));
     if (id != null) {
       String sql = this.serviceUtil.getEntityDao().getSqlByName(getEntity("personWorkcalendar"), "getRepeatIdById");
       repeatId = this.serviceUtil.getEntityDao().queryToLong(sql, new Object[] { id });
       if (repeatId != null) {
         this.serviceUtil.getEntityDao().deleteById(getEntity("repeatCalendar"), repeatId);
         this.serviceUtil.getEntityDao().executeUpdateBySqlName(getEntity("repeatCalendarSchedule"), "deleteByRepeatId", new Object[] { repeatId });
       }
     }
     if (isRepeat.intValue() != 0) {
       Integer repeatType = (Integer)sdo.getProperty("repeatType", Integer.class);
       Integer repeatEndType = (Integer)sdo.getProperty("repeatEndType", Integer.class);
       java.util.Date repeatStartDate = (java.util.Date)sdo.getProperty("repeatStartDate", java.util.Date.class);
       Map repeatCalendar = new HashMap(6);
       repeatCalendar.put("repeatType", repeatType);
       repeatCalendar.put("repeatEndType", repeatEndType);
       repeatCalendar.put("starTimeStep", Long.valueOf(sd.getTime() - getDate(sd).getTime()));
       repeatCalendar.put("endTimeStep", Long.valueOf(ed.getTime() - getDate(sd).getTime()));
       repeatCalendar.put("frequency", sdo.getProperty("frequency"));
       repeatCalendar.put("amount", sdo.getProperty("amount"));
       param.put("startTime", repeatStartDate);
 
       if ((repeatEndType == null) || (repeatEndType.intValue() == 1)) {
         param.put("endTime", null);
       } else if (repeatEndType.intValue() == 2) {
         Integer amount = (Integer)sdo.getProperty("amount", Integer.class, Integer.valueOf(0));
         Integer frequency = (Integer)sdo.getProperty("frequency", Integer.class, Integer.valueOf(0));
         if (repeatType.intValue() == 1)
           ed = DateUtil.getStepDay(getDate(repeatStartDate), new Long(amount.intValue() * frequency.intValue()).intValue());
         else if (repeatType.intValue() == 2)
           ed = DateUtil.getStepWeek(getDate(repeatStartDate), new Long(amount.intValue() * frequency.intValue()).intValue());
         else if (repeatType.intValue() == 3)
           ed = DateUtil.getStepMonth(getDate(repeatStartDate), new Long(amount.intValue() * frequency.intValue()).intValue());
         else if (repeatType.intValue() == 4) {
           ed = DateUtil.getStepYear(getDate(repeatStartDate), new Long(amount.intValue() * frequency.intValue()).intValue());
         }
         ed = DateUtil.getStepDay(getDate(ed), -1);
         param.put("endTime", ed);
       } else if (repeatEndType.intValue() == 3) {
         param.put("endTime", sdo.getProperty("repeatEndDate"));
       }
 
       repeatId = (Long)this.serviceUtil.getEntityDao().insert(getEntity("repeatCalendar"), repeatCalendar);
       param.put("repeatId", repeatId);
       String schedules = (String)sdo.getProperty("schedules", String.class);
 
       if (!StringUtil.isBlank(schedules)) {
         String[] ss = schedules.split(",");
         List scheduleList = new ArrayList(ss.length);
         for (int i = 0; i < ss.length; i++)
           if (!ss[i].equals("")) {
             Map m = new HashMap(2);
             m.put("repeatId", repeatId);
             m.put("validDate", ss[i]);
             scheduleList.add(m);
           }
         if (scheduleList.size() > 0) {
           this.serviceUtil.getEntityDao().batchInsert(getEntity("repeatCalendarSchedule"), scheduleList);
         }
       }
     }
     int count = 0;
     if (id != null) {
       String sql = this.serviceUtil.getEntityDao().getSqlByName(getEntity("personWorkcalendar"), "countById");
       count = this.serviceUtil.getEntityDao().queryToInt(sql, new Object[] { id });
     }
     if (count > 0) {
       Object endTtime = param.get("endTime");
       if (endTtime == null)
         this.serviceUtil.getEntityDao().update(getEntity("personWorkcalendar"), param, new String[] { "endTime" });
       else
         this.serviceUtil.getEntityDao().update(getEntity("personWorkcalendar"), param, new String[0]);
     }
     else {
       this.serviceUtil.getEntityDao().insert(getEntity("personWorkcalendar"), param);
     }
   }
 
   public Serializable insertTaskCollect(SDO params)
   {
     EntityDocument.Entity en = getEntity("personTaskCollect");
     String personId = params.getOperator().getId();
     String taskId = (String)params.getProperty("taskId", String.class);
 
     String sql = this.serviceUtil.getEntityDao().getSqlByName(en, "countSql");
     int count = this.serviceUtil.getEntityDao().queryToInt(sql, new Object[] { taskId, personId });
     if (count > 0) {
       return null;
     }
     params.putProperty("personId", personId);
     params.putProperty("createTime", new Timestamp(System.currentTimeMillis()));
     return this.serviceUtil.getEntityDao().insert(en, params.getProperties());
   }
 
   public void deleteTaskCollect(SDO params)
   {
     EntityDocument.Entity en = getEntity("personTaskCollect");
     String sql = this.serviceUtil.getEntityDao().getSqlByName(en, "deleteSql");
     String personId = params.getOperator().getId();
     String taskId = (String)params.getProperty("taskId", String.class);
     this.serviceUtil.getEntityDao().executeUpdate(sql, new Object[] { taskId, personId });
   }
 
   public Serializable insertInfoCollect(SDO params)
   {
     EntityDocument.Entity en = getEntity("personInfoCollect");
     String personId = params.getOperator().getId();
     String infoId = (String)params.getProperty("infoId", String.class);
 
     String sql = this.serviceUtil.getEntityDao().getSqlByName(en, "countSql");
     int count = this.serviceUtil.getEntityDao().queryToInt(sql, new Object[] { infoId, personId });
     if (count > 0) {
       return null;
     }
     params.putProperty("personId", personId);
     params.putProperty("createTime", new Timestamp(System.currentTimeMillis()));
     return this.serviceUtil.getEntityDao().insert(en, params.getProperties());
   }
 
   public void deleteInfoCollect(SDO params)
   {
     EntityDocument.Entity en = getEntity("personInfoCollect");
     String sql = this.serviceUtil.getEntityDao().getSqlByName(en, "deleteSql");
     String personId = params.getOperator().getId();
     String infoId = (String)params.getProperty("infoId", String.class);
     this.serviceUtil.getEntityDao().executeUpdate(sql, new Object[] { infoId, personId });
   }
 
   public Serializable saveQueryScheme(SDO params)
   {
     EntityDocument.Entity en = getEntity("personQueryScheme");
     Long schemeId = (Long)params.getProperty("schemeId", Long.class);
     String personId = params.getOperator().getId();
     String schemeKind = (String)params.getProperty("schemeKind", String.class);
     if (schemeId == null) {
       String sql = this.serviceUtil.getEntityDao().getSqlByName(en, "getCountByPerson");
       int count = this.serviceUtil.getEntityDao().queryToInt(sql, new Object[] { personId, schemeKind });
       if (count > 9) {
         throw new ApplicationException("不能创建更多的方案了,请删除不需要的方案!");
       }
       params.putProperty("personId", personId);
       schemeId = (Long)this.serviceUtil.getEntityDao().insert(en, params.getProperties());
     } else {
       this.serviceUtil.getEntityDao().update(en, params.getProperties(), new String[0]);
     }
     return schemeId;
   }
 
   public Map<String, Object> loadQueryScheme(SDO params)
   {
     return this.serviceUtil.getEntityDao().load(getEntity("personQueryScheme"), params.getProperties());
   }
 
   public List<Map<String, Object>> queryQueryScheme(String personId, String schemeKind)
   {
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getEntity("personQueryScheme"), "queryQueryScheme");
     return this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[] { personId, schemeKind });
   }
 
   public void deleteQueryScheme(Long id)
   {
     this.serviceUtil.getEntityDao().deleteById(getEntity("personQueryScheme"), id);
   }
 
   public void updateErpUserStatus(SDO sdo)
   {
     String userCode = sdo.getOperator().getLoginName();
     EntityDocument.Entity en = getEntity("erpUser");
 
     String sql = this.serviceUtil.getEntityDao().getSqlByName(en, "queryUserKind");
     Map map = this.erpJDBCDao.queryToMap(sql, new Object[] { userCode });
     if ((map == null) || (map.size() == 0)) {
       throw new ApplicationException("明源ERP中未找到您的用户,请联系系统管理员！");
     }
     String userKind = (String)ClassHelper.convert(map.get("userkind"), String.class);
     Integer isDisabeld = (Integer)ClassHelper.convert(map.get("isdisabeld"), Integer.class);
     if (isDisabeld.intValue() == 0) {
       return;
     }
     sql = this.serviceUtil.getEntityDao().getSqlByName(en, "countByUserKind");
     int count = this.erpJDBCDao.queryToInt(sql, new Object[] { userKind });
     String tmp = this.serviceUtil.getEntityDao().getSqlByName(en, userKind);
     int allCount = ((Integer)ClassHelper.convert(tmp, Integer.class)).intValue();
     if (count + 1 < allCount)
     {
       sql = this.serviceUtil.getEntityDao().getSqlByName(en, "updateStatus");
       int i = this.erpJDBCDao.executeUpdate(sql, new Object[] { userCode });
       if (i == 0)
         throw new ApplicationException("明源ERP中未找到您的用户,请联系系统管理员！");
     }
     else {
       throw new ApplicationException("明源ERP用户超过限制,请联系系统管理员！");
     }
   }
 }

