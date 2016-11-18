 package com.brc.util;
 
 import java.io.PrintStream;
 import java.sql.Timestamp;
 import java.text.DateFormat;
 import java.text.ParseException;
 import java.text.SimpleDateFormat;
 import java.util.Calendar;
 import java.util.GregorianCalendar;
 
 public class DateUtil
 {
   private static SimpleDateFormat getSimpleDateFormat(int type)
   {
     SimpleDateFormat df = null;
     switch (type) {
     case 1:
       df = new SimpleDateFormat("yyyy-MM-dd");
       break;
     case 2:
       df = new SimpleDateFormat("MM/dd/yy");
       break;
     case 3:
       df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
       break;
     case 4:
       df = new SimpleDateFormat("MM/dd/yyyy");
       break;
     case 5:
       df = new SimpleDateFormat("yyyyMMddHHmmssS");
       break;
     case 6:
       df = new SimpleDateFormat("yyyy/MM/dd");
       break;
     case 7:
       df = new SimpleDateFormat("yyyy年MM月dd日HH时mm分");
       break;
     case 8:
       df = new SimpleDateFormat("yyyy年MM月dd日");
       break;
     case 9:
       df = new SimpleDateFormat("yyyy-MM-dd HH:mm");
       break;
     case 10:
       df = new SimpleDateFormat("HH:mm");
       break;
     default:
       df = new SimpleDateFormat("yyyy-MM-dd");
     }
 
     return df;
   }
 
   public static java.sql.Date getDate()
   {
     Calendar oneCalendar = Calendar.getInstance();
     return getDate(oneCalendar.get(1), oneCalendar.get(2) + 1, oneCalendar.get(5));
   }
 
   public static Timestamp getTimestamp() {
     return new Timestamp(System.currentTimeMillis());
   }
 
   public static java.sql.Date getDate(java.util.Date date) {
     Calendar oneCalendar = Calendar.getInstance();
     oneCalendar.setTime(date);
     return getDate(oneCalendar.get(1), oneCalendar.get(2) + 1, oneCalendar.get(5));
   }
 
   public static java.util.Date trunc(java.util.Date value) {
     SimpleDateFormat df = getSimpleDateFormat(1);
     String dateStr = df.format(value);
     try {
       return df.parse(dateStr); } catch (ParseException e) {
     }
     return null;
   }
 
   public static int getCalendarInt(java.util.Date date, int type)
   {
     Calendar oneCalendar = Calendar.getInstance();
     oneCalendar.setTime(date);
     return oneCalendar.get(type);
   }
 
   public static Timestamp getDateTime()
   {
     Timestamp t = new Timestamp(System.currentTimeMillis());
     return t;
   }
 
   public static java.sql.Date getDate(int yyyy, int MM, int dd)
   {
     if (!verityDate(yyyy, MM, dd)) {
       throw new IllegalArgumentException("This is illegimate date!");
     }
 
     Calendar oneCalendar = Calendar.getInstance();
     oneCalendar.clear();
     oneCalendar.set(yyyy, MM - 1, dd);
     return new java.sql.Date(oneCalendar.getTime().getTime());
   }
 
   public static boolean verityDate(int yyyy, int MM, int dd)
   {
     boolean flag = false;
 
     if ((MM >= 0) && (MM <= 12) && (dd >= 1) && (dd <= 31)) {
       if ((MM == 4) || (MM == 6) || (MM == 9) || (MM == 11)) {
         if (dd <= 30)
           flag = true;
       }
       else if (MM == 2) {
         if (((yyyy % 100 != 0) && (yyyy % 4 == 0)) || (yyyy % 400 == 0)) {
           if (dd <= 29)
             flag = true;
         }
         else if (dd <= 28) {
           flag = true;
         }
       }
       else {
         flag = true;
       }
     }
 
     return flag;
   }
 
   public static int getIntervalDay(java.util.Date startDate, java.util.Date endDate)
   {
     long startdate = startDate.getTime();
     long enddate = endDate.getTime();
     long interval = enddate - startdate;
     long intervalday = interval / 86400000L;
     return new Long(intervalday).intValue();
   }
 
   public static int getIntervalWeeks(java.util.Date startDate, java.util.Date endDate)
   {
     int weeks = 0;
     Calendar beginCalendar = Calendar.getInstance();
     beginCalendar.setTime(startDate);
     Calendar endCalendar = Calendar.getInstance();
     endCalendar.setTime(endDate);
     while (beginCalendar.before(endCalendar))
     {
       if ((beginCalendar.get(1) == endCalendar.get(1)) && (beginCalendar.get(2) == endCalendar.get(2)) && (beginCalendar.get(8) == endCalendar.get(8)))
       {
         break;
       }
       beginCalendar.add(6, 7);
       weeks++;
     }
 
     return weeks;
   }
 
   public static int getIntervalMonth(java.util.Date startDate, java.util.Date endDate)
   {
     if (endDate == null) {
       endDate = new java.util.Date();
     }
     Calendar dayBegin = Calendar.getInstance();
     dayBegin.setTime(startDate);
     Calendar dayEnd = Calendar.getInstance();
     dayEnd.setTime(endDate);
     if (dayEnd.equals(dayBegin)) return 0;
     if (dayBegin.after(dayEnd)) {
       Calendar temp = dayBegin;
       dayBegin = dayEnd;
       dayEnd = temp;
     }
 
     int result = dayEnd.get(2) + dayEnd.get(1) * 12 - dayBegin.get(2) - dayBegin.get(1) * 12;
 
     Calendar lastDayInEndMonth = Calendar.getInstance();
     lastDayInEndMonth.set(dayEnd.get(1), dayEnd.get(2), 1);
     lastDayInEndMonth.add(2, 1);
     lastDayInEndMonth.add(5, -1);
 
     if ((lastDayInEndMonth.get(5) == dayEnd.get(5)) && (dayBegin.get(5) == 1)) {
       result++;
     }
 
     if ((dayEnd.get(5) + 1 < dayBegin.get(5)) && (lastDayInEndMonth.get(5) != dayEnd.get(5))) {
       result--;
     }
     return result;
   }
 
   public static java.sql.Date getStepDay(java.util.Date date, int step)
   {
     Calendar calendar = Calendar.getInstance();
     calendar.setTime(date);
     calendar.add(6, step);
     return new java.sql.Date(calendar.getTime().getTime());
   }
 
   public static java.sql.Date getStepWeek(java.sql.Date date, int step)
   {
     Calendar calendar = Calendar.getInstance();
     calendar.setTime(date);
     calendar.add(3, step);
     return new java.sql.Date(calendar.getTime().getTime());
   }
 
   public static java.sql.Date getLastMonth()
   {
     Calendar oneCalendar = Calendar.getInstance();
     oneCalendar.set(oneCalendar.get(1), oneCalendar.get(2) - 1, 1);
     return new java.sql.Date(oneCalendar.getTime().getTime());
   }
 
   public static java.sql.Date getLastDayOfMonth(java.util.Date date)
   {
     Calendar calendar = Calendar.getInstance();
     calendar.setTime(date);
     calendar.add(2, 1);
     calendar.set(5, 1);
     calendar.add(5, -1);
     return new java.sql.Date(calendar.getTime().getTime());
   }
 
   public static java.sql.Date getLastMonthDay()
   {
     Calendar oneCalendar = Calendar.getInstance();
     oneCalendar.set(oneCalendar.get(1), oneCalendar.get(2), 1);
     int year = oneCalendar.get(1);
     int month = oneCalendar.get(2);
     Calendar oneCalendar1 = Calendar.getInstance();
     String lastday = getLastDays(new Integer(year).toString(), new Integer(month).toString());
     java.sql.Date lastdate = getDate(oneCalendar1.get(1), oneCalendar1.get(2), new Integer(lastday).intValue());
     return lastdate;
   }
 
   public static java.sql.Date getMonthFirstDay()
   {
     Calendar oneCalendar = Calendar.getInstance();
     oneCalendar.set(oneCalendar.get(1), oneCalendar.get(2), 1);
     return new java.sql.Date(oneCalendar.getTime().getTime());
   }
 
   public static java.sql.Date getMonthFirstDay(java.util.Date date)
   {
     Calendar oneCalendar = Calendar.getInstance();
     oneCalendar.setTime(date);
     oneCalendar.set(oneCalendar.get(1), oneCalendar.get(2), 1);
     return new java.sql.Date(oneCalendar.getTime().getTime());
   }
 
   public static java.sql.Date getYearFirstDay(java.util.Date date)
   {
     Calendar oneCalendar = Calendar.getInstance();
     oneCalendar.setTime(date);
     oneCalendar.set(oneCalendar.get(1), 0, 1);
     return new java.sql.Date(oneCalendar.getTime().getTime());
   }
 
   public static java.sql.Date getMonth15Day(java.util.Date date)
   {
     Calendar oneCalendar = Calendar.getInstance();
     oneCalendar.setTime(date);
     oneCalendar.set(oneCalendar.get(1), oneCalendar.get(2), 15);
     return new java.sql.Date(oneCalendar.getTime().getTime());
   }
 
   public static java.sql.Date getMonthLastDay(java.util.Date date)
   {
     Calendar oneCalendar = Calendar.getInstance();
     oneCalendar.setTime(date);
     oneCalendar.set(oneCalendar.get(1), oneCalendar.get(2), 1);
     oneCalendar.add(2, 1);
     oneCalendar.add(6, -1);
     return new java.sql.Date(oneCalendar.getTime().getTime());
   }
 
   public static java.sql.Date getMonthLastDay()
   {
     Calendar oneCalendar = Calendar.getInstance();
     oneCalendar.set(oneCalendar.get(1), oneCalendar.get(2), 1);
     oneCalendar.add(2, 1);
     oneCalendar.add(6, -1);
     return new java.sql.Date(oneCalendar.getTime().getTime());
   }
 
   public static java.sql.Date getStepMonth(java.util.Date date, int intBetween)
   {
     Calendar calo = Calendar.getInstance();
     calo.setTime(date);
     calo.add(2, intBetween);
     return new java.sql.Date(calo.getTime().getTime());
   }
 
   public static java.sql.Date getStepYear(java.util.Date date, int intBetween)
   {
     Calendar calo = Calendar.getInstance();
     calo.setTime(date);
     calo.add(1, intBetween);
     return new java.sql.Date(calo.getTime().getTime());
   }
 
   public static java.sql.Date getStepMinute(java.util.Date date, int intBetween) {
     Calendar calo = Calendar.getInstance();
     calo.setTime(date);
     calo.add(12, intBetween);
     return new java.sql.Date(calo.getTime().getTime());
   }
 
   public static String getDateStr(java.sql.Date date) {
     DateFormat format = DateFormat.getDateInstance();
     String dateStr = format.format(date);
     return dateStr;
   }
 
   public static String getDateFormat(java.util.Date date) {
     if (date == null) {
       return "";
     }
     SimpleDateFormat df = getSimpleDateFormat(1);
     String dateStr = df.format(date);
     return dateStr;
   }
 
   public static String getDateFormat(java.util.Date date, String fmt) {
     SimpleDateFormat df = new SimpleDateFormat(fmt);
     String dateStr = df.format(date);
     return dateStr;
   }
 
   public static java.util.Date getDateParse(int type, String str) throws Exception {
     if ((str == null) || (str.equals(""))) return null;
     java.util.Date date = new java.util.Date();
     SimpleDateFormat df = getSimpleDateFormat(type);
     date = df.parse(str);
     return date;
   }
 
   public static java.util.Date getDateParse(String str) {
     if ((str == null) || (str.equals(""))) return null;
     for (int type = 9; type > 0; type--) {
       if (isDate(type, str))
         try {
           return getDateParse(type, str);
         }
         catch (Exception e)
         {
         }
     }
     return null;
   }
 
   public static String getDateFormat(int type, java.util.Date date) {
     if (date == null) return "";
     SimpleDateFormat df = getSimpleDateFormat(type);
     String dateStr = df.format(date);
     return dateStr;
   }
 
   public static boolean isDate(int type, String str)
   {
     if ((str == null) || (str.equals(""))) return false; try
     {
       SimpleDateFormat df = getSimpleDateFormat(type);
       df.format(df.parse(str));
     } catch (Exception e) {
       return false;
     }
     return true;
   }
 
   public static boolean validDate(String str)
   {
     if ((str == null) || (str.equals(""))) return false;
 
     if ((isDate(1, str)) || (isDate(6, str)) || (isDate(7, str)) || (isDate(8, str))) {
       return true;
     }
     return false;
   }
 
   public static String validDateAndModify(String str)
   {
     if ((str == null) || (str.equals(""))) return null;
 
     if (isDate(1, str))
     {
       return str;
     }if (isDate(6, str))
     {
       return str.replaceAll("/", "-");
     }
     return null;
   }
 
   public static String getDateFormat(String format, java.util.Date date) {
     if (date == null) return "";
     SimpleDateFormat dateFormat = new SimpleDateFormat(format);
     return dateFormat.format(date);
   }
 
   public static String getLastDays(String yy, String mm)
   {
     String day = "30";
     int YY = 0;
     int MM = 0;
     boolean leapYear = false;
 
     YY = new Integer(yy).intValue();
     MM = new Integer(mm).intValue();
     if ((YY < 1900) || (YY > 2200)) {
       return day;
     }
 
     if ((YY % 4 != 0) && (YY % 100 != 0))
       leapYear = false;
     else {
       leapYear = true;
     }
     if (MM == 2) {
       if (leapYear) {
         return "29";
       }
       return "28";
     }
 
     if ((MM == 1) || (MM == 3) || (MM == 5) || (MM == 7) || (MM == 8) || (MM == 10) || (MM == 12) || (MM == 0)) {
       return "31";
     }
 
     if ((MM == 4) || (MM == 6) || (MM == 9) || (MM == 11)) {
       return day;
     }
     return day;
   }
 
   public static boolean IsLeapYear(int year)
   {
     if (year % 100 == 0)
     {
       return year % 400 == 0;
     }
     return year % 4 == 0;
   }
 
   public static String getCurrentYear()
   {
     return getCurrentTime(4);
   }
 
   public static String getCurrentTime(int length)
   {
     Timestamp ts = new Timestamp(System.currentTimeMillis());
     if (length > ts.toString().length()) {
       length = ts.toString().length();
     }
     String currentTime = ts.toString().substring(0, length);
     return currentTime;
   }
 
   public static String getCurrentMonth()
   {
     return getCurrentTime(7).substring(5, 7);
   }
 
   public static String getWeekOfDate(java.util.Date dt)
   {
     String[] weekDays = { "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六" };
     Calendar cal = Calendar.getInstance();
     cal.setTime(dt);
     int w = cal.get(7) - 1;
     if (w < 0) w = 0;
     DateFormat df = new SimpleDateFormat("yyyy年MM月dd日");
     String datestr = df.format(dt);
     return datestr + " " + weekDays[w];
   }
 
   public static String getTodayHms() {
     java.util.Date date = new java.util.Date();
     String dayStr = getSimpleDateFormat(3).format(date);
     return dayStr;
   }
 
   public static int getWeekOfYear(java.util.Date date)
   {
     Calendar c = new GregorianCalendar();
     c.setFirstDayOfWeek(2);
     c.setMinimalDaysInFirstWeek(7);
     c.setTime(date);
 
     return c.get(3);
   }
 
   public static int getMaxWeekNumOfYear(int year)
   {
     Calendar c = new GregorianCalendar();
     c.set(year, 11, 31, 23, 59, 59);
 
     return getWeekOfYear(c.getTime());
   }
 
   public static java.util.Date getFirstDayOfWeek(int year, int week)
   {
     Calendar c = new GregorianCalendar();
     c.set(1, year);
     c.set(2, 0);
     c.set(5, 1);
 
     Calendar cal = (GregorianCalendar)c.clone();
     cal.add(5, week * 7);
 
     return getFirstDayOfWeek(cal.getTime());
   }
 
   public static java.util.Date getLastDayOfWeek(int year, int week)
   {
     Calendar c = new GregorianCalendar();
     c.set(1, year);
     c.set(2, 0);
     c.set(5, 1);
 
     Calendar cal = (GregorianCalendar)c.clone();
     cal.add(5, week * 7);
 
     return getLastDayOfWeek(cal.getTime());
   }
 
   public static java.util.Date getFirstDayOfWeek(java.util.Date date)
   {
     Calendar c = new GregorianCalendar();
     c.setFirstDayOfWeek(2);
     c.setTime(date);
     c.set(7, c.getFirstDayOfWeek());
     return c.getTime();
   }
 
   public static java.util.Date getLastDayOfWeek(java.util.Date date)
   {
     Calendar c = new GregorianCalendar();
     c.setFirstDayOfWeek(2);
     c.setTime(date);
     c.set(7, c.getFirstDayOfWeek() + 6);
     return c.getTime();
   }
 
   public static java.util.Date getFirstDayOfNextMonth(java.util.Date date)
   {
     Calendar c = Calendar.getInstance();
     c.setTime(date);
     c.set(c.get(1), c.get(2) + 1, 1);
     return c.getTime();
   }
 
   public static Object processDate(Object value)
   {
     if (value == null) return "";
     if ((value instanceof Timestamp))
       return getSimpleDateFormat(3).format(new java.util.Date(((Timestamp)value).getTime()));
     if ((value instanceof java.sql.Date))
       return getSimpleDateFormat(1).format(new java.util.Date(((java.sql.Date)value).getTime()));
     if ((value instanceof java.util.Date))
     {
       return getSimpleDateFormat(3).format(value);
     }
     return value.toString();
   }
 
   public static int getAge(java.util.Date birthday)
   {
     Calendar birthdays = Calendar.getInstance();
     birthdays.setTime(birthday);
     Calendar today = new GregorianCalendar();
     int age = today.get(1) - birthdays.get(1);
     birthdays.add(1, age);
     if (today.before(birthdays)) {
       age--;
     }
     return age;
   }
 
   public static boolean checkDay(java.util.Date birthday)
   {
     Calendar birthdays = Calendar.getInstance();
     birthdays.setTime(birthday);
     Calendar today = Calendar.getInstance();
     String b = birthdays.get(2) + "" + birthdays.get(5);
     String t = today.get(2) + "" + today.get(5);
     return Integer.parseInt(b) <= Integer.parseInt(t);
   }
 
   public static java.util.Date getLastDayOfQuarter(java.util.Date date)
   {
     Calendar cDay = Calendar.getInstance();
     cDay.setTime(date);
     cDay.set(5, 1);
     int curMonth = cDay.get(2);
     if ((curMonth >= 0) && (curMonth <= 2)) {
       cDay.set(2, 2);
     }
     if ((curMonth >= 3) && (curMonth <= 5)) {
       cDay.set(2, 5);
     }
     if ((curMonth >= 6) && (curMonth <= 8)) {
       cDay.set(2, 8);
     }
     if ((curMonth >= 9) && (curMonth <= 11)) {
       cDay.set(2, 11);
     }
     curMonth = cDay.get(2);
     cDay.set(2, curMonth + 1);
     cDay.set(5, 1);
     cDay.add(6, -1);
     return cDay.getTime();
   }
 
   public static void main(String[] args) {
     java.util.Date d1 = new java.util.Date();
     try {
       d1 = getSimpleDateFormat(1).parse("2012-11-01");
     } catch (ParseException e) {
       e.printStackTrace();
     }
     java.util.Date d2 = new java.util.Date();
     try {
       d2 = getSimpleDateFormat(3).parse("2013-04-11 09:10:11");
     } catch (ParseException e) {
       e.printStackTrace();
     }
     System.out.println(getDateFormat(getLastDayOfQuarter(d1)));
     System.out.println(getDateFormat(getLastDayOfQuarter(d2)));
     System.out.println(getDateFormat(getLastDayOfQuarter(new java.util.Date())));
     System.out.println(getDateFormat(getStepMonth(d1, 1)));
   }
 }

