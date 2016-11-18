 package com.brc.util;
 
 import java.util.HashMap;
 import java.util.Map;
 
 public class ThreadLocalUtil
 {
   private static ThreadLocal<Map<String, Object>> mapThreadLocal = new ThreadLocal();
 
   public static Map<String, Object> getVariableMap() {
     Map variableMap = (Map)mapThreadLocal.get();
     if (variableMap == null) {
       variableMap = new HashMap();
       mapThreadLocal.set(variableMap);
     }
     return variableMap;
   }
 
   public static void setVariableMap(Map<String, Object> variableMap) {
     removeVariableMap();
     if (variableMap != null)
       mapThreadLocal.set(variableMap);
   }
 
   public static void removeVariableMap()
   {
     Map variableMap = (Map)mapThreadLocal.get();
     if (variableMap != null) {
       variableMap.clear();
     }
     mapThreadLocal.set(null);
     mapThreadLocal.remove();
   }
 
   public static void addVariable(String key, Object object) {
     if (object != null)
       getVariableMap().put(key, object);
   }
 
   public static Object getVariable(String key)
   {
     if (!StringUtil.isBlank(key)) {
       return getVariableMap().get(key);
     }
     return null;
   }
 
   public static <T> T getVariable(String key, Class<T> cls)
   {
     if (!StringUtil.isBlank(key)) {
       return (T) getVariableMap().get(key);
     }
     return null;
   }
 
   public static Object removeVariable(String key)
   {
     return getVariableMap().remove(key);
   }
 }

