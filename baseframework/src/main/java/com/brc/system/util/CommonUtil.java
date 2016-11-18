 package com.brc.system.util;
 
 import com.brc.util.SDO;
 import java.io.PrintStream;
 import java.math.BigDecimal;
 import java.math.RoundingMode;
 import java.sql.Time;
 import java.sql.Timestamp;
 import java.text.DecimalFormat;
 import java.text.ParseException;
 import java.text.SimpleDateFormat;
 import java.util.Calendar;
 import java.util.HashMap;
 import java.util.Map;
 import java.util.UUID;
 import java.util.regex.Matcher;
 import java.util.regex.Pattern;
 import org.apache.log4j.Logger;
 
 public class CommonUtil
 {
   private static final String timePattern = "HH:mm:ss";
   private static final String datePattern = "yyyy-MM-dd";
   private static final String dateTimePattern = "yyyy-MM-dd HH:mm:ss";
   private static final String decimalPattern = "#.##################################";
   public static final int DEFAULT_SCALE = 20;
   private static final Logger logger = Logger.getLogger(CommonUtil.class);
 
   static SimpleDateFormat st = null;
 
   public static Map<String, Object> decodeMap(String value) {
     HashMap result = new HashMap();
     if (Util.isNotEmptyString(value)) {
       String[] valueArray = value.trim().split(";");
       for (String str : valueArray) {
         if (str.contains("=")) {
           String[] subValueArray = str.trim().split("=");
           if (subValueArray.length == 1) result.put(subValueArray[0].trim(), "");
           else {
             result.put(subValueArray[0].trim(), subValueArray[1].trim());
           }
         }
       }
     }
     return result;
   }
 
   public static String encodeMap(Map<String, Object> map) {
     String result = "";
     for (String key : map.keySet()) {
       Object obj = map.get(key);
       String value = "";
       if (obj != null) {
         value = obj + "";
       }
       result = result + key + "=" + value + ";";
     }
     return result;
   }
 
   public static String createGUID()
   {
     return UUID.randomUUID().toString().toUpperCase().replaceAll("-", "");
   }
 
   public static String createFileFullName(String path, String fileName, String fileKind)
   {
     StringBuffer sb = new StringBuffer();
     sb.append(Util.isEmptyString(path) ? "" : path);
     sb.append("/");
     sb.append(Util.isEmptyString(fileName) ? "" : fileName);
     if (Util.isNotEmptyString(fileKind)) sb.append(".").append(fileKind);
     return sb.toString();
   }
 
   public static Timestamp getCurrentDateTime()
   {
     return new Timestamp(new java.util.Date().getTime());
   }
 
   public static java.sql.Date getCurrentDate()
   {
     return java.sql.Date.valueOf(new SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date()));
   }
 
   public static java.util.Date trunc(java.util.Date value) {
     String dateStr = new SimpleDateFormat("yyyy-MM-dd").format(value);
     try {
       return new SimpleDateFormat("yyyy-MM-dd").parse(dateStr); } catch (ParseException e) {
     }
     return null;
   }
 
   public static java.util.Date parseDateTime(String value)
   {
     try {
       return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(value); } catch (ParseException e) {
     }
     return null;
   }
 
   public static void main(String[] args)
   {
     System.out.println(trunc(new java.util.Date()));
   }
 
   public static java.sql.Date getYesterday()
   {
     Calendar calendar = Calendar.getInstance();
 
     calendar.setTime(getCurrentDate());
     calendar.add(5, -1);
 
     return java.sql.Date.valueOf(new SimpleDateFormat("yyyy-MM-dd").format(calendar.getTime()));
   }
 
   public static java.sql.Date getTomorrow()
   {
     Calendar calendar = Calendar.getInstance();
 
     calendar.setTime(getCurrentDate());
     calendar.add(5, 1);
 
     return java.sql.Date.valueOf(new SimpleDateFormat("yyyy-MM-dd").format(calendar.getTime()));
   }
 
   public static Time getCurrentTime()
   {
     return Time.valueOf(new SimpleDateFormat("HH:mm:ss").format(new java.util.Date()));
   }
 
   public static int getYear(java.util.Date date)
   {
     check(date != null, "getYear的参数不能为空。");
     Calendar calendar = Calendar.getInstance();
     calendar.setTime(date);
     return calendar.get(1);
   }
 
   public static int getMonth(java.util.Date date)
   {
     check(date != null, "getMonth的参数不能为空。");
     Calendar calendar = Calendar.getInstance();
     calendar.setTime(date);
     return calendar.get(2) + 1;
   }
 
   public static int getDay(java.util.Date date)
   {
     check(date != null, "getDay的参数不能为空。");
     Calendar calendar = Calendar.getInstance();
     calendar.setTime(date);
     return calendar.get(5);
   }
 
   public static int getHour(java.util.Date date)
   {
     check(date != null, "getHour的参数不能为空。");
     Calendar calendar = Calendar.getInstance();
     calendar.setTime(date);
     return calendar.get(10);
   }
 
   public static int getMinute(java.util.Date date)
   {
     check(date != null, "getMinute的参数不能为空。");
     Calendar calendar = Calendar.getInstance();
     calendar.setTime(date);
     return calendar.get(12);
   }
 
   public static java.sql.Date getFirstDateOfYear(java.util.Date date)
   {
     Calendar calendar = Calendar.getInstance();
     calendar.setTime(date);
     calendar.set(2, 0);
     calendar.set(5, 1);
     return java.sql.Date.valueOf(new SimpleDateFormat("yyyy-MM-dd").format(calendar.getTime()));
   }
 
   public static java.sql.Date getFirstDateOfYear(int year) {
     Calendar calendar = Calendar.getInstance();
     calendar.set(1, year);
     calendar.set(2, 0);
     calendar.set(5, 1);
     return java.sql.Date.valueOf(new SimpleDateFormat("yyyy-MM-dd").format(calendar.getTime()));
   }
 
   public static java.sql.Date getLastDateOfYear(java.util.Date date)
   {
     Calendar calendar = Calendar.getInstance();
     calendar.setTime(date);
     calendar.add(1, 1);
     calendar.set(2, 0);
     calendar.set(5, 0);
     return java.sql.Date.valueOf(new SimpleDateFormat("yyyy-MM-dd").format(calendar.getTime()));
   }
 
   public static java.sql.Date getLastDateOfYear(int year) {
     Calendar calendar = Calendar.getInstance();
     calendar.set(1, year + 1);
     calendar.set(2, 0);
     calendar.set(5, 0);
     return java.sql.Date.valueOf(new SimpleDateFormat("yyyy-MM-dd").format(calendar.getTime()));
   }
 
   public static java.sql.Date getFirstDateOfLastYear(java.util.Date date)
   {
     Calendar calendar = Calendar.getInstance();
     calendar.setTime(date);
     calendar.add(1, -1);
     calendar.set(2, 0);
     calendar.set(5, 1);
     return java.sql.Date.valueOf(new SimpleDateFormat("yyyy-MM-dd").format(calendar.getTime()));
   }
 
   public static java.sql.Date getLastDateOfLastYear(java.util.Date date)
   {
     Calendar calendar = Calendar.getInstance();
     calendar.setTime(date);
     calendar.set(2, 0);
     calendar.set(5, 0);
     return java.sql.Date.valueOf(new SimpleDateFormat("yyyy-MM-dd").format(calendar.getTime()));
   }
 
   public static java.util.Date addDays(java.util.Date date, int days) {
     Calendar calendar = Calendar.getInstance();
     calendar.setTime(date);
     calendar.add(5, days);
     return calendar.getTime();
   }
 
   public static int getSecond(java.util.Date date)
   {
     check(date != null, "getYear的参数不能为空！");
     Calendar calendar = Calendar.getInstance();
     calendar.setTime(date);
     return calendar.get(13);
   }
 
   public static java.sql.Date getFirstDateOfMonth(java.util.Date date)
   {
     Calendar calendar = Calendar.getInstance();
     calendar.setTime(date);
     calendar.set(5, 1);
     return java.sql.Date.valueOf(new SimpleDateFormat("yyyy-MM-dd").format(calendar.getTime()));
   }
 
   public static java.sql.Date getLastDateOfMonth(java.util.Date date)
   {
     Calendar calendar = Calendar.getInstance();
     calendar.setTime(date);
     calendar.add(2, 1);
     calendar.set(5, 0);
     return java.sql.Date.valueOf(new SimpleDateFormat("yyyy-MM-dd").format(calendar.getTime()));
   }
 
   public static java.sql.Date getFirstDateOfLastMonth(java.util.Date date) {
     Calendar calendar = Calendar.getInstance();
     calendar.setTime(date);
     calendar.add(2, -1);
     calendar.set(5, 1);
     return java.sql.Date.valueOf(new SimpleDateFormat("yyyy-MM-dd").format(calendar.getTime()));
   }
 
   public static java.sql.Date getLastDateOfLastMonth(java.util.Date date) {
     Calendar calendar = Calendar.getInstance();
     calendar.setTime(date);
 
     calendar.add(2, -1);
 
     int lastDay = calendar.getActualMaximum(5);
     calendar.set(5, lastDay);
 
     return java.sql.Date.valueOf(new SimpleDateFormat("yyyy-MM-dd").format(calendar.getTime()));
   }
 
   public static java.sql.Date getFirstDateOfWeek(java.util.Date date)
   {
     Calendar calendar = Calendar.getInstance();
     calendar.setTime(date);
     calendar.set(7, 2);
     return java.sql.Date.valueOf(new SimpleDateFormat("yyyy-MM-dd").format(calendar.getTime()));
   }
 
   public static java.sql.Date getLastDateOfWeek(java.util.Date date)
   {
     Calendar calendar = Calendar.getInstance();
     calendar.setTime(date);
     calendar.set(7, 7);
     calendar.add(5, 1);
     return java.sql.Date.valueOf(new SimpleDateFormat("yyyy-MM-dd").format(calendar.getTime()));
   }
 
   public static java.sql.Date getFirstDateOfLastWeek(java.util.Date date)
   {
     Calendar calendar = Calendar.getInstance();
 
     java.sql.Date firstDayOfWeek = getFirstDateOfWeek(date);
     calendar.setTime(firstDayOfWeek);
     calendar.add(5, -7);
 
     return java.sql.Date.valueOf(new SimpleDateFormat("yyyy-MM-dd").format(calendar.getTime()));
   }
 
   public static java.sql.Date getLastDateOfLastWeek(java.util.Date date)
   {
     Calendar calendar = Calendar.getInstance();
 
     java.sql.Date lastDayOfWeek = getFirstDateOfWeek(date);
     calendar.setTime(lastDayOfWeek);
     calendar.add(5, -1);
 
     return java.sql.Date.valueOf(new SimpleDateFormat("yyyy-MM-dd").format(calendar.getTime()));
   }
 
   public static int getDayOfWeek(java.util.Date date)
   {
     Calendar localCalendar = Calendar.getInstance();
     localCalendar.setTime(date);
     return localCalendar.get(7);
   }
 
   public static String toString(Object obj)
   {
     if (obj == null) return null;
     if ((obj instanceof Timestamp)) return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format((java.util.Date)obj);
     if ((obj instanceof Time)) return new SimpleDateFormat("HH:mm:ss").format((java.util.Date)obj);
     if ((obj instanceof java.sql.Date)) return new SimpleDateFormat("yyyy-MM-dd").format((java.util.Date)obj);
     if ((obj instanceof BigDecimal)) return new DecimalFormat("#.##################################").format(obj);
     return obj.toString();
   }
 
   public static int toInteger(Object obj)
   {
     check(obj != null, "toInteger的参数不能为空。");
     if ((obj instanceof String)) return Integer.valueOf((String)obj).intValue();
     if ((obj instanceof Number)) {
       return ((Number)obj).intValue();
     }
     throw new RuntimeException("错误的toInteger参数类型：" + obj.getClass());
   }
 
   public static BigDecimal toDecimal(Object obj)
   {
     check(obj != null, "toDecimal的参数不能为空。");
     if ((obj instanceof BigDecimal)) {
       return (BigDecimal)obj;
     }
     BigDecimal result = null;
     if ((obj instanceof String)) result = BigDecimal.valueOf(Double.valueOf((String)obj).doubleValue());
     else if ((obj instanceof Number)) result = BigDecimal.valueOf(((Number)obj).doubleValue());
     else
       throw new RuntimeException("错误的toDecimal参数类型：" + obj.getClass());
     result.setScale(20, RoundingMode.HALF_UP);
     return result;
   }
 
   public static long toLong(Object obj)
   {
     check(obj != null, "toLong的参数不能为空。");
     if ((obj instanceof String)) return Long.valueOf((String)obj).longValue();
     if ((obj instanceof Number)) {
       return ((Number)obj).longValue();
     }
     throw new RuntimeException("错误的toLong参数类型：" + obj.getClass());
   }
 
   public static double toDouble(Object obj)
   {
     check(obj != null, "toDouble的参数不能为空。");
     if ((obj instanceof String)) return Double.valueOf((String)obj).doubleValue();
     if ((obj instanceof Number)) {
       return ((Number)obj).doubleValue();
     }
     throw new RuntimeException("错误的toDouble参数类型：" + obj.getClass());
   }
 
   public static float toFloat(Object obj)
   {
     check(obj != null, "toFloat的参数不能为空。");
     if ((obj instanceof String)) return Float.valueOf((String)obj).floatValue();
     if ((obj instanceof Number)) {
       return ((Number)obj).floatValue();
     }
     throw new RuntimeException("错误的toFloat参数类型：" + obj.getClass());
   }
 
   public static Float roundTo(Float value, int digit) {
     BigDecimal b = new BigDecimal(value.floatValue());
     return Float.valueOf(b.setScale(digit, 4).floatValue());
   }
 
   public static java.sql.Date toDate(Object obj)
   {
     check(obj != null, "toDate的参数不能为空。");
     if ((obj instanceof java.sql.Date)) return (java.sql.Date)obj;
     if ((obj instanceof String)) return java.sql.Date.valueOf((String)obj);
     if ((obj instanceof java.util.Date)) return java.sql.Date.valueOf(new SimpleDateFormat("yyyy-MM-dd").format((java.util.Date)obj));
     throw new RuntimeException("错误的toDate参数类型：" + obj.getClass());
   }
 
   public static Timestamp toDateTime(Object obj)
   {
     check(obj != null, "toDateTime的参数不能为空。");
     if ((obj instanceof Timestamp)) return (Timestamp)obj;
     if ((obj instanceof String)) try {
         return new Timestamp(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse((String)obj).getTime());
       } catch (Exception localException) {
         throw new RuntimeException("将字符串：" + obj + "转换为DATETIME时出错！");
       }
     if ((obj instanceof java.util.Date)) return new Timestamp(((java.util.Date)obj).getTime());
     throw new RuntimeException("错误的toDateTime参数类型：" + obj.getClass());
   }
 
   public static Time toTime(Object obj)
   {
     check(obj != null, "toTime的参数不能为空。");
     if ((obj instanceof Time)) return (Time)obj;
     if ((obj instanceof String)) return Time.valueOf((String)obj);
     if ((obj instanceof java.util.Date)) return Time.valueOf(new SimpleDateFormat("HH:mm:ss").format((java.util.Date)obj));
     throw new RuntimeException("错误的toTime参数类型：" + obj.getClass());
   }
 
   public static String toChineseNumber(Number value, boolean isCapital)
   {
     check(value != null, "toChineseNumber的参数不能为空。");
     check(isCapital, "目前不支持转换为小写的汉字数字！");
     if ((value instanceof BigDecimal)) {
       return ChineseNumber.format((BigDecimal)value);
     }
     return ChineseNumber.format(value.doubleValue());
   }
 
   public static String toChineseMoney(Number value)
   {
     check(value != null, "toChineseMoney的参数不能为空。");
     String s = null;
     if ((value instanceof BigDecimal)) s = ChineseNumber.format((BigDecimal)value);
     else {
       s = ChineseNumber.format(value.doubleValue());
     }
     return ChineseNumber.toMoneyString(s);
   }
 
   public static String ltrim(String value)
   {
     if (value == null) return null;
     if ("".equals(value)) return "";
     int i = 0;
     while ((i < value.length()) && (value.charAt(i) <= ' '))
       i++;
     return value.substring(i);
   }
 
   public static String rtrim(String value)
   {
     if (value == null) return null;
     if ("".equals(value)) return "";
     int i = value.length();
     while ((i > 0) && (value.charAt(i - 1) <= ' '))
       i--;
     return value.substring(0, i);
   }
 
   public static String lpad(int length, int number) {
     String f = "%0" + length + "d";
     return String.format(f, new Object[] { Integer.valueOf(number) });
   }
 
   public static String getExtOfFile(String path)
   {
     String str = getNameOfFile(path);
     if ((str == null) || ("".equals(str))) return null;
     return str.indexOf(46) != -1 ? str.substring(str.lastIndexOf(46) + 1, str.length()) : null;
   }
 
   public static String getPathOfFile(String path)
   {
     if ((path == null) || ("".equals(path))) return null;
     path = path.trim();
     if (path.indexOf(47) == -1) return null;
     return path.substring(0, path.lastIndexOf(47));
   }
 
   public static String getNameOfFile(String path)
   {
     if ((path == null) || ("".equals(path))) return null;
     path = path.trim();
     if (path.indexOf(47) == -1) return path;
     return path.substring(path.lastIndexOf(47) + 1, path.length());
   }
 
   public static String getNameNoExtOfFile(String path)
   {
     String fileName = getNameOfFile(path);
     if ((fileName == null) || ("".equals(fileName))) return fileName;
     return fileName.indexOf(46) != -1 ? fileName.substring(0, fileName.lastIndexOf(46)) : fileName;
   }
 
   private static void check(boolean isOK, String message)
   {
     if (!isOK) {
       RuntimeException ex = new RuntimeException(message);
       logger.error("Error in CommonUtils:", ex);
       throw ex;
     }
   }
 
   public static boolean isLongNull(Long value) {
     return (value == null) || (value.intValue() == 0);
   }
 
   public static Long transformBizId(SDO sdo, String keyName) {
     Long bizId = (Long)sdo.getProperty("bizId", Long.class);
     sdo.putProperty(keyName, bizId);
     return bizId;
   }
 
   public static boolean isMoblieFormat(String value) {
     Pattern p = null;
     Matcher m = null;
     boolean result = false;
     p = Pattern.compile("^[1][3,4,5,7,8][0-9]{9}$");
     m = p.matcher(value);
     result = m.matches();
     return result;
   }
 
   static class ChineseNumber
   {
     private static String[] UNIT = { "", "拾", "佰", "仟", "万", "拾", "佰", "仟", "亿", "拾", "佰", "仟" };
 
     private static String[] BIG = { "零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖" };
 
     private static int WAN_IDX = 4;
 
     private static int YI_IDX = 8;
 
     private static int LAST_ZERO = 1;
 
     private static int VALID_WAN = 2;
 
     private static int VALID_YI = 4;
 
     private static int STARTED = 8;
 
     public static String format(double paramDouble) {
       return format(new DecimalFormat("#.##################################").format(paramDouble));
     }
 
     public static String format(int value) {
       return format(String.valueOf(value));
     }
 
     public static String format(BigDecimal value) {
       return format(new DecimalFormat("#.##################################").format(value));
     }
 
     public static String format(String value) {
       if ((value == null) || ("".equals(value))) {
         return null;
       }
 
       Double.valueOf(value);
       StringBuffer sb = new StringBuffer();
       if (value.charAt(0) == '-') {
         sb.append("负");
         value = value.substring(1);
       }
 
       String[] valueArray = value.split("[.]");
       if ((valueArray.length > 2) || (valueArray.length < 1)) {
         throw new RuntimeException("非法的数值格式：" + value);
       }
       sb.append(formatInteger(valueArray[0]));
       if (valueArray.length == 2) {
         sb.append("点");
         for (int k : valueArray[1].toCharArray())
           sb.append(BIG[(k - 48)]);
       }
       return sb.toString();
     }
 
     private static String formatInteger(String value)
     {
       StringBuffer sb = new StringBuffer();
       int i = 0;
       for (int j = 0; j < value.length(); j++) {
         int k = value.length() - j - 1;
         String str = UNIT[k];
         int m = value.charAt(j) - '0';
         if (m == 0) {
           if (((str.equals("亿")) && ((i & VALID_YI) > 0)) || ((str.equals("万")) && ((i & VALID_WAN) > 0))) {
             sb.append(str);
           }
           if (((i & STARTED) == 0) && (j == value.length() - 1)) sb.append(BIG[m]);
           i |= LAST_ZERO;
         } else {
           if (((i & LAST_ZERO) > 0) && ((i & STARTED) > 0)) sb.append("零");
           if (k >= YI_IDX) i |= VALID_YI;
           else if (k >= WAN_IDX) i |= VALID_WAN;
           i &= (LAST_ZERO ^ 0xFFFFFFFF);
           sb.append(BIG[m]);
           sb.append(str);
           i |= STARTED;
         }
       }
 
       return sb.toString();
     }
 
     public static String toMoneyString(String value)
     {
       CommonUtil.check((value != null) && (!"".equals(value)), "传入的数值不能为空。");
       if (value.indexOf(28857) >= 0) {
         String[] valueArray = value.split("点");
         CommonUtil.check(valueArray.length == 2, "非法的数字字符串：" + value);
         CommonUtil.check(valueArray[1].length() <= 2, "超出精度的金额数值：" + value);
         StringBuffer sb = new StringBuffer(valueArray[0]);
         sb.append("元");
         sb.append(valueArray[1].charAt(0));
         sb.append("角");
         if (valueArray[1].length() == 2) {
           sb.append(valueArray[1].charAt(1));
           sb.append("分");
         }
         return sb.toString();
       }
       return value + "元整";
     }
   }
 }

