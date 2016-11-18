 package com.brc.util;
 
 import com.brc.exception.ApplicationException;
 import java.lang.reflect.InvocationTargetException;
 import java.math.BigDecimal;
 import java.sql.Timestamp;
 import org.apache.commons.beanutils.BeanUtils;
 import org.apache.commons.beanutils.ConvertUtils;
 import org.apache.commons.beanutils.Converter;
 import org.apache.commons.beanutils.converters.BigDecimalConverter;
 import org.apache.commons.beanutils.converters.LongConverter;
 import org.apache.log4j.Logger;
 
 public class ClassHelper extends BeanUtils
 {
   private static Logger log = LogHome.getLog(ClassHelper.class);
 
   public static void copyProperties(Object form, Object to)
   {
     try
     {
       BeanUtils.copyProperties(to, form);
     } catch (IllegalAccessException illegalaccessexception) {
       log.error(illegalaccessexception.toString());
     } catch (InvocationTargetException invocationtargetexception) {
       log.error(invocationtargetexception.toString());
     } catch (Exception e) {
       e.printStackTrace();
       log.error(e.toString());
     }
   }
 
   public static Object clone(Object form) {
     Object to = null;
     try {
       to = form.getClass().newInstance();
       BeanUtils.copyProperties(to, form);
     } catch (IllegalAccessException illegalaccessexception) {
       log.error(illegalaccessexception.toString());
     } catch (InvocationTargetException invocationtargetexception) {
       log.error(invocationtargetexception.toString());
     } catch (Exception e) {
       e.printStackTrace();
       log.error(e.toString());
     }
     return to;
   }
 
   public static void setProperty(Object bean, String name, Object value)
   {
     try
     {
       BeanUtils.setProperty(bean, name, value);
     } catch (IllegalAccessException e) {
       e.printStackTrace();
       log.error(e);
     } catch (InvocationTargetException e) {
       e.printStackTrace();
       log.error(e);
     }
   }
 
   public static String getProperty(Object bean, String name) {
     try {
       return BeanUtils.getProperty(bean, name);
     } catch (IllegalAccessException e) {
       e.printStackTrace();
       log.error(e);
     } catch (InvocationTargetException e) {
       e.printStackTrace();
       log.error(e);
     } catch (NoSuchMethodException e) {
       e.printStackTrace();
       log.error(e);
     }
     return null;
   }
 
   public static Object convert(Object obj, String className)
   {
     if ((obj == null) || (obj.toString().equals("")))
       return null;
     try
     {
       Object value = checkNumberValue(obj, className);
       Class cls = Class.forName(className);
       Object o = ConvertUtils.convert(value, cls);
       if (o == null) {
         throw new ApplicationException("强制类型转换错误:[" + obj + "][" + className + "]");
       }
       return o;
     } catch (ClassNotFoundException e) {
       throw new ApplicationException(e);
     }
   }
 
   public static <T> T convert(Object obj, Class<T> cls)
   {
     if ((obj == null) || (obj.toString().equals(""))) {
       return null;
     }
     Object value = checkNumberValue(obj, cls);
     Object o = ConvertUtils.convert(value, cls);
     if (o == null) {
       throw new ApplicationException("强制类型转换错误:[" + obj + "][" + cls.getName() + "]");
     }
     return (T) o;
   }
 
   public static <T> T convert(Object obj, Class<T> cls, Object defaultValue)
   {
     if ((obj == null) || (obj.toString().equals(""))) {
       return (T) defaultValue;
     }
     Object value = checkNumberValue(obj, cls);
     Object o = ConvertUtils.convert(value, cls);
     if (o == null) {
       return (T) defaultValue;
     }
     return (T) o;
   }
 
   public static boolean isBaseType(Class<?> cls)
   {
     String[] baseTypeArr = { "java.lang.Byte", "java.lang.Short", "java.lang.Integer", "java.lang.Long", "java.lang.Float", "java.lang.Double", "java.lang.Character", "java.lang.Boolean", "java.lang.String", "java.util.Date", "java.math.BigDecimal" };
 
     for (int i = 0; i < baseTypeArr.length; i++) {
       if (cls.getName().equals(baseTypeArr[i])) {
         return true;
       }
     }
     return false;
   }
 
   public static boolean isSubClass(Class<?> subClass, Class<?> parent)
   {
     for (Class c = subClass; c != null; c = c.getSuperclass()) {
       if (c == parent) return true;
     }
     return false;
   }
 
   public static boolean isInterface(Class<?> subClass, Class<?> type)
   {
     Class[] face = subClass.getInterfaces();
     int i = 0; for (int j = face.length; i < j; i++) {
       if (face[i] == type) {
         return true;
       }
       Class[] face1 = face[i].getInterfaces();
       for (int x = 0; x < face1.length; x++) {
         if (face1[x] == type)
           return true;
         if (isInterface(face1[x], type)) {
           return true;
         }
       }
     }
 
     if (null != subClass.getSuperclass()) {
       return isInterface(subClass.getSuperclass(), type);
     }
     return false;
   }
 
   private static Object checkNumberValue(Object obj, String className)
     throws ClassNotFoundException
   {
     if (null == obj) {
       return null;
     }
     Class cls = Class.forName(className);
     return checkNumberValue(obj, cls);
   }
 
   private static Object checkNumberValue(Object obj, Class<?> cls)
   {
     if (null == obj) {
       return null;
     }
     if (isSubClass(cls, Number.class)) {
       return obj.toString().replace(",", "");
     }
     return obj;
   }
 
   static
   {
     ConvertUtils.register(new DateConverter(), java.sql.Date.class);
     ConvertUtils.register(new DateConverter(), java.util.Date.class);
     ConvertUtils.register(new DateConverter(), Timestamp.class);
 
     ConvertUtils.register(new LongConverter(null), Long.class);
     ConvertUtils.register(new BigDecimalConverter(null), BigDecimal.class);
     ConvertUtils.register(new Converter() {
       public Object convert(Class type, Object value) {
         if (value == null) {
           return null;
         }
         if ((value instanceof Number))
           return value;
         try
         {
           return new BigDecimal(value.toString()); } catch (Exception e) {
         }
         return null;
       }
     }
     , Number.class);
   }
 }

