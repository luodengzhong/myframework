 package com.brc.system.data.util;
 
 import com.brc.exception.ApplicationException;
 import com.brc.util.ClassHelper;
 import com.brc.util.DateUtil;
 import com.brc.util.DictUtil;
 import com.brc.util.LogHome;
 import com.brc.util.StringUtil;
 import java.sql.PreparedStatement;
 import java.sql.SQLException;
 import java.sql.Timestamp;
 import java.util.ArrayList;
 import java.util.HashMap;
 import java.util.List;
 import java.util.Map;
 import oracle.sql.TIMESTAMP;
 import org.apache.log4j.Logger;
 import org.springframework.jdbc.core.StatementCreatorUtils;
 import org.springframework.jdbc.support.rowset.SqlRowSet;
 import org.springframework.jdbc.support.rowset.SqlRowSetMetaData;
 
 public final class RowSetUtil
 {
   protected static final Logger log = LogHome.getLog(RowSetUtil.class.getName());
 
   public static <T> List<T> toList(SqlRowSet rs, Class<T> cls)
     throws ApplicationException
   {
     List list = new ArrayList(rs.getRow());
     SqlRowSetMetaData rsmd = null;
     try {
       if (rs != null) {
         if (!ClassHelper.isBaseType(cls)) {
           int iCol = 0;
           rsmd = rs.getMetaData();
           iCol = rsmd.getColumnCount();
           String[] propertyNameArr = new String[iCol];
           for (int i = 0; i < iCol; i++) {
             propertyNameArr[i] = StringUtil.getHumpName(rsmd.getColumnLabel(i + 1).trim());
           }
           while (rs.next()) {
             Object obj = cls.newInstance();
             for (int i = 0; i < iCol; i++) {
               ClassHelper.setProperty(obj, propertyNameArr[i], rs.getObject(i + 1));
             }
             list.add(obj);
           }
         } else {
           while (rs.next()) {
             list.add(ClassHelper.convert(rs.getObject(1), cls));
           }
         }
       }
       rsmd = null;
     } catch (IllegalAccessException e) {
       log.error(e);
       throw new ApplicationException(e);
     } catch (InstantiationException e) {
       log.error(e);
       throw new ApplicationException(e);
     } catch (RuntimeException e) {
       log.error(e);
       throw e;
     }
     return list;
   }
 
   public static <T> T toObject(SqlRowSet rs, Class<T> cls)
     throws ApplicationException
   {
     Object result = null;
     SqlRowSetMetaData rsmd = null;
     try {
       if (rs != null) {
         if (!ClassHelper.isBaseType(cls)) {
           int iCol = 0;
           rsmd = rs.getMetaData();
           iCol = rsmd.getColumnCount();
           String[] propertyNameArr = new String[iCol];
           for (int i = 0; i < iCol; i++) {
             propertyNameArr[i] = StringUtil.getHumpName(rsmd.getColumnLabel(i + 1).trim());
           }
           if (rs.next()) {
             Object obj = cls.newInstance();
             for (int i = 0; i < iCol; i++) {
               ClassHelper.setProperty(obj, propertyNameArr[i], rs.getObject(i + 1));
             }
             result = obj;
           }
         }
         else if (rs.next()) {
           result = ClassHelper.convert(rs.getObject(1), cls);
         }
       }
 
       rsmd = null;
     } catch (IllegalAccessException e) {
       log.error(e);
       throw new ApplicationException(e);
     } catch (InstantiationException e) {
       log.error(e);
       throw new ApplicationException(e);
     } catch (RuntimeException e) {
       log.error(e);
       throw e;
     }
     return (T) result;
   }
 
   public static Map<String, Object> toMap(SqlRowSet rs)
     throws ApplicationException
   {
     SqlRowSetMetaData rsmd = rs.getMetaData();
     int columnCount = rsmd.getColumnCount();
     Map map;
     if (rs.next()) {
       map = new HashMap(columnCount);
       for (int i = 0; i < columnCount; i++) {
         Object value = rs.getObject(i + 1);
         String key = StringUtil.getHumpName(rsmd.getColumnLabel(i + 1).trim());
         String textView = DictUtil.getDictionaryDetailText(key, value);
         if (textView != null) {
           map.put(key + "TextView", textView);
         }
         map.put(key, convertValue(value));
       }
     } else {
       map = new HashMap(0);
     }
     return map;
   }
 
   public static List<Map<String, Object>> toMapList(SqlRowSet rs)
     throws ApplicationException
   {
     List list = new ArrayList(rs.getRow());
     SqlRowSetMetaData rsmd = rs.getMetaData();
     int columnCount = rsmd.getColumnCount();
     while (rs.next()) {
       Map map = new HashMap(columnCount);
       for (int i = 0; i < columnCount; i++) {
         Object value = rs.getObject(i + 1);
         String key = StringUtil.getHumpName(rsmd.getColumnLabel(i + 1).trim());
         String textView = DictUtil.getDictionaryDetailText(key, value);
         if (textView != null) {
           map.put(key + "TextView", textView);
         }
         map.put(key, convertValue(value));
       }
       list.add(map);
     }
     return list;
   }
 
   public static List<Object[]> toArrayList(SqlRowSet rs)
     throws ApplicationException
   {
     List list = new ArrayList(rs.getRow());
     SqlRowSetMetaData rsmd = rs.getMetaData();
     int columnCount = rsmd.getColumnCount();
     while (rs.next()) {
       Object[] array = new Object[columnCount];
       for (int i = 0; i < columnCount; i++) {
         array[i] = rs.getObject(i + 1);
       }
       list.add(array);
     }
     return list;
   }
 
   public static Object[] toArray(SqlRowSet rs)
     throws ApplicationException
   {
     SqlRowSetMetaData rsmd = rs.getMetaData();
     int columnCount = rsmd.getColumnCount();
     Object[] array = new Object[columnCount];
     if (rs.next()) {
       for (int i = 0; i < columnCount; i++) {
         array[i] = rs.getObject(i + 1);
       }
     }
     return array;
   }
 
   public static void setStatementParams(PreparedStatement ps, Object[] objs)
     throws SQLException
   {
     for (int i = 0; i < objs.length; i++) {
       Object obj = objs[i];
       int j = i + 1;
       StatementCreatorUtils.setParameterValue(ps, j, -2147483648, obj);
     }
   }
 
   public static Object convertValue(Object value)
     throws ApplicationException
   {
     if (value == null) return "";
     try
     {
       if ((value instanceof java.sql.Date))
         return new java.util.Date(((java.sql.Date)value).getTime());
       if ((value instanceof TIMESTAMP)) {
         TIMESTAMP t = (TIMESTAMP)value;
         Timestamp tt = t.timestampValue();
         return DateUtil.getDateFormat(3, tt);
       }
     }
     catch (Exception e) {
       throw new ApplicationException(e);
     }
     return value;
   }
 }

