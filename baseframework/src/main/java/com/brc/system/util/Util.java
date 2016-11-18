 package com.brc.system.util;
 
 import com.brc.system.opm.OrgException;
 import java.security.MessageDigest;
 import java.security.NoSuchAlgorithmException;
 import java.util.ArrayList;
 import java.util.List;
 import org.apache.log4j.Logger;
 
 public class Util
 {
   private static final String CHECK_ERR_MSG = "check error!";
   private static Logger logger = Logger.getLogger(Util.class);
 
   public static int i = 0;
 
   private static boolean nativeDebug = false;
 
   private static boolean timeDebug = false;
 
   public static void check(boolean isOk, String format, Object[] objs)
   {
     if (!isOk)
       throw new RuntimeException(String.format(format, objs));
   }
 
   public static void checkNotNull(String message, Object obj)
   {
     if (obj == null) {
       OrgException ex = new OrgException(String.format("%s不能为空!", new Object[] { message }));
       logger.error(new StringBuilder().append("检查 ").append(message).append(" 时报错！").toString(), ex);
       throw ex;
     }
   }
 
   public static String getLineSep()
   {
     return System.getProperty("line.separator");
   }
 
   public static void checkNotExist(String message, Object obj)
   {
     if (obj == null) {
       OrgException ex = new OrgException(String.format("%s不存在!", new Object[] { message }));
       logger.error(new StringBuilder().append("检查 ").append(message).append(" 时报错！").toString(), ex);
       throw ex;
     }
   }
 
   public static void checkNotEmptyString(String message, String value)
   {
     checkNotEmptyString(message, value, logger);
   }
 
   public static void checkNotEmptyString(String message, String value, Logger logger)
   {
     if (isEmptyString(value)) {
       OrgException ex = new OrgException(String.format("%s不能为空!", new Object[] { message }));
       if (!isNull(logger)) logger.error(new StringBuilder().append("检查 ").append(message).append(" 时报错！").toString(), ex);
       throw ex;
     }
   }
 
   public static void checkAllNotNull(String message, Object[] objs)
   {
     for (Object item : objs)
       if (item == null) {
         OrgException ex = new OrgException(String.format("%s不能为空!", new Object[] { message }));
         logger.error(new StringBuilder().append("检查 ").append(message).append(" 时报错！").toString(), ex);
         throw ex;
       }
   }
 
   public static void check(boolean isOK, Object obj) {
     if (!isOK) {
       OrgException ex = new OrgException(new StringBuilder().append("").append(obj).toString());
       logger.error("check error!", ex);
       throw ex;
     }
   }
 
   public static void check(boolean isOK, Object obj1, Object obj2)
   {
     if (!isOK) {
       OrgException ex = new OrgException(buildString(new Object[] { obj1, obj2 }));
       logger.error("check error!", ex);
       throw ex;
     }
   }
 
   public static void check(boolean isOK, Object obj1, Object obj2, Object obj3) {
     if (!isOK) {
       OrgException ex = new OrgException(buildString(new Object[] { obj1, obj2, obj3 }));
       logger.error("check error!", ex);
       throw ex;
     }
   }
 
   public static void check(boolean isOK, Object obj1, Object obj2, Object obj3, Object obj4) {
     if (!isOK) {
       OrgException ex = new OrgException(buildString(new Object[] { obj1, obj2, obj3, obj4 }));
       logger.error("check error!", ex);
       throw ex;
     }
   }
 
   public static void check(boolean isOK, Object obj1, Object obj2, Object obj3, Object obj4, Object obj5) {
     if (!isOK) {
       OrgException ex = new OrgException(buildString(new Object[] { obj1, obj2, obj3, obj4, obj5 }));
       logger.error("check error!", ex);
       throw ex;
     }
   }
 
   public static void check(boolean isOK, Object obj1, Object obj2, Object obj3, Object obj4, Object obj5, Object obj6) {
     if (!isOK) {
       OrgException localModelException = new OrgException(buildString(new Object[] { obj1, obj2, obj3, obj4, obj5, obj6 }));
       logger.error("check error!", localModelException);
       throw localModelException;
     }
   }
 
   private static String buildString(Object[] objs) {
     StringBuilder sb = new StringBuilder();
     for (Object item : objs)
       sb.append(item);
     return sb.toString();
   }
 
   public static boolean isNotEmptyString(String s) {
     return (s != null) && (s.trim().length() != 0);
   }
 
   public static boolean isEmptyString(String s) {
     return (null == s) || ("".equals(s));
   }
 
   public static boolean isNull(Object obj) {
     return obj == null;
   }
 
   public static boolean isNotNull(Object obj) {
     return obj != null;
   }
 
   public static String arrayToString(Object[] array, String formatter, String delimiter)
   {
     StringBuffer sb = new StringBuffer();
     for (Object item : array) {
       if (sb.length() > 0) {
         sb.append(delimiter);
       }
       sb.append(String.format(formatter, new Object[] { item.toString() }));
     }
     return sb.toString();
   }
 
   public static List<String> stringArrayToList(String[] array) {
     List result = new ArrayList(array.length);
     for (int i = 0; i < array.length; i++) {
       result.add(array[i]);
     }
     return result;
   }
 
   public static String MD5(String value) {
     if (value == null)
       return null;
     try
     {
       StringBuffer sb = new StringBuffer();
       for (byte b : MessageDigest.getInstance("MD5").digest(value.getBytes()))
         sb.append(String.format("%02x", new Object[] { Byte.valueOf(b) }));
       return sb.toString().toUpperCase();
     } catch (NoSuchAlgorithmException localNoSuchAlgorithmException) {
       throw new RuntimeException("can't covert to md5!", localNoSuchAlgorithmException);
     }
   }
 
   public static int charCount(String paramString, char paramChar) {
     if (isEmptyString(paramString)) return 0;
     int j = 0;
     for (char c : paramString.toCharArray())
       if (c == paramChar) j++;
     return j;
   }
 }

