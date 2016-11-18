 package com.brc.model.fn.impl;
 
 import com.brc.model.fn.AbstractDaoFunction;
 import com.brc.system.util.CommonUtil;
 import com.brc.util.ClassHelper;
 import com.brc.util.DateUtil;
 import com.brc.util.StringUtil;
 import java.sql.Time;
 import java.sql.Timestamp;
 import java.util.Map;
 
 public class CommonFun extends AbstractDaoFunction
 {
   public Map<String, Object> decodeMap(String value)
   {
     return CommonUtil.decodeMap(value);
   }
 
   public String encodeMap(Map<String, Object> map)
   {
     return CommonUtil.encodeMap(map);
   }
 
   public String GUID()
   {
     return CommonUtil.createGUID();
   }
 
   public Timestamp currentDateTime()
   {
     return CommonUtil.getCurrentDateTime();
   }
 
   public java.sql.Date currentDate()
   {
     return CommonUtil.getCurrentDate();
   }
 
   public Time currentTime()
   {
     return CommonUtil.getCurrentTime();
   }
 
   public int year(java.util.Date date)
   {
     return CommonUtil.getYear(date);
   }
 
   public int month(java.util.Date date)
   {
     return CommonUtil.getMonth(date);
   }
 
   public static int day(java.util.Date date)
   {
     return CommonUtil.getDay(date);
   }
 
   public int hour(java.util.Date date)
   {
     return CommonUtil.getHour(date);
   }
 
   public int minute(java.util.Date date)
   {
     return CommonUtil.getMinute(date);
   }
 
   public java.sql.Date firstDateOfYear(java.util.Date date)
   {
     return CommonUtil.getFirstDateOfYear(date);
   }
 
   public static java.sql.Date lastDateOfYear(java.util.Date date)
   {
     return CommonUtil.getLastDateOfYear(date);
   }
 
   public int dayOfWeek(java.util.Date date)
   {
     return CommonUtil.getDayOfWeek(date);
   }
 
   public String chineseLetter(String name)
   {
     return StringUtil.getFirstLetter(name);
   }
 
   public int getIntervalMonth(Object start, Object end)
   {
     java.util.Date startDate = (java.util.Date)ClassHelper.convert(start, java.util.Date.class);
     java.util.Date endDate = (java.util.Date)ClassHelper.convert(end, java.util.Date.class);
     if ((startDate == null) || (endDate == null)) {
       return 0;
     }
     return DateUtil.getIntervalMonth(startDate, endDate);
   }
 }

