 package com.brc.model.fn;
 
 import com.brc.util.StringUtil;
 import java.util.HashMap;
 import java.util.Map;
 
 public class VariableContainer
 {
   private static ThreadLocal<Map<String, Object>> variableMapThreadLocal = new ThreadLocal();
 
   public static Map<String, Object> getVariableMap() {
     Map variableMap = (Map)variableMapThreadLocal.get();
     if (variableMap == null) {
       variableMap = new HashMap();
       variableMapThreadLocal.set(variableMap);
     }
     return variableMap;
   }
 
   public static void setVariableMap(Map<String, Object> variableMap) {
     removeVariableMap();
     if (variableMap != null)
       variableMapThreadLocal.set(variableMap);
   }
 
   public static void putVariableMap(Map<String, Object> map)
   {
     if (map != null)
       getVariableMap().putAll(map);
   }
 
   public static void removeVariableMap()
   {
     Map variableMap = (Map)variableMapThreadLocal.get();
     if (variableMap != null) {
       variableMap.clear();
     }
     variableMapThreadLocal.set(null);
     variableMapThreadLocal.remove();
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

