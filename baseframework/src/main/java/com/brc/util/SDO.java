 package com.brc.util;
 
 import com.brc.system.opm.Operator;
 import java.io.Serializable;
 import java.util.ArrayList;
 import java.util.HashMap;
 import java.util.Iterator;
 import java.util.List;
 import java.util.Map;
 import java.util.Set;
 import net.sf.json.JSONArray;
 import net.sf.json.JSONObject;
 
 public class SDO
   implements Serializable
 {
   private static final long serialVersionUID = 1162573785169817735L;
   private Map<String, Object> properties = new HashMap(4);
   private Operator operator;
   private boolean needDecode = false;
 
   public SDO()
   {
   }
 
   public SDO(boolean needDecode) {
     this.needDecode = needDecode;
   }
 
   public SDO(String datas) {
     parseJSONString(datas);
   }
 
   public SDO(Map<String, Object> properties) {
     this.properties = properties;
   }
 
   public Operator getOperator() {
     return this.operator;
   }
 
   public void setOperator(Operator operator) {
     this.operator = operator;
   }
 
   public Map<String, Object> getProperties() {
     return this.properties;
   }
 
   public void setProperties(Map<String, Object> propertyMap) {
     this.properties = propertyMap;
   }
 
   public Object getProperty(String key) {
     return this.properties.get(key);
   }
 
   public void putProperty(String key, Object value) {
     if ((value != null) && ((value instanceof String)) && (this.needDecode)) {
       value = StringUtil.decode((String)value);
     }
     this.properties.put(key, value);
   }
 
   public void removeProperty(String key) {
     this.properties.remove(key);
   }
 
   public void clearProperty() {
     this.properties.clear();
   }
 
   public <T> T getProperty(String key, Class<T> type)
   {
     if (this.properties.get(key) == null) {
       return null;
     }
     if (this.properties.get(key).getClass() == type) {
       return (T) this.properties.get(key);
     }
     if (ClassHelper.isInterface(this.properties.get(key).getClass(), type)) {
       return  (T)this.properties.get(key);
     }
     if ((!ClassHelper.isBaseType(type)) && (ClassHelper.isSubClass(this.properties.get(key).getClass(), type))) {
       return (T) this.properties.get(key);
     }
     String value = this.properties.get(key).toString();
     if (type == String.class) {
       return (T) value;
     }
     if (value.equals("")) return null;
     return ClassHelper.convert(value, type);
   }
 
   public <T> T getProperty(String key, Class<T> type, Object defaultValue)
   {
     if (this.properties.get(key) == null) {
       return (T) defaultValue;
     }
     if (this.properties.get(key).getClass() == type) {
       return (T) this.properties.get(key);
     }
     if (ClassHelper.isInterface(this.properties.get(key).getClass(), type)) {
       return (T) this.properties.get(key);
     }
     if ((!ClassHelper.isBaseType(type)) && (ClassHelper.isSubClass(this.properties.get(key).getClass(), type))) {
       return (T) this.properties.get(key);
     }
     String value = this.properties.get(key).toString();
     if (type == String.class) {
       return (T) value;
     }
     if (value.equals("")) return  (T)defaultValue;
     return ClassHelper.convert(value, type, defaultValue);
   }
 
   public Long[] getLongArray(String key)
   {
     String value = (String)getProperty(key, String.class);
     if (StringUtil.isBlank(value)) return null;
 
     JSONArray jsonArray = JSONArray.fromObject(value);
     Long[] arr = new Long[jsonArray.size()];
     for (int i = 0; i < jsonArray.size(); i++) {
       arr[i] = Long.valueOf(jsonArray.getLong(i));
     }
     return arr;
   }
 
   public String[] getStringArray(String key) {
     String value = (String)getProperty(key, String.class);
     if (StringUtil.isBlank(value)) return null;
 
     JSONArray jsonArray = JSONArray.fromObject(value);
     String[] arr = new String[jsonArray.size()];
     for (int i = 0; i < jsonArray.size(); i++) {
       arr[i] = jsonArray.getString(i);
     }
     return arr;
   }
 
   public List<Object> getList(String key) {
     String jsonStr = (String)getProperty(key, String.class);
     if (StringUtil.isBlank(jsonStr)) return null;
     JSONArray jsonArray = JSONArray.fromObject(jsonStr);
     List list = new ArrayList(jsonArray.size());
     parseJSON(jsonArray, list);
     return list;
   }
 
   public Map<String, Object> getObjectMap(String key) {
     String jsonStr = (String)getProperty(key, String.class);
     if (StringUtil.isBlank(jsonStr)) return null;
     JSONObject jsonObject = JSONObject.fromObject(jsonStr);
     Map map = new HashMap(jsonObject.size());
     parseJSON(jsonObject, map);
     return map;
   }
 
   public Map<Long, Long> getLongMap(String key) {
     Map m = getObjectMap(key);
     Map result = new HashMap(m.size());
     for (Object item : m.keySet()) {
       result.put(ClassHelper.convert(item, Long.class), ClassHelper.convert(m.get(item), Long.class));
     }
     return result;
   }
  
   public Map<String, Integer> getStringMap(String key) {
     Map m = getObjectMap(key);
     Map result = new HashMap(m.size());
     for (Object item : m.keySet()) {
       result.put(ClassHelper.convert(item, String.class), ClassHelper.convert(m.get(item), Integer.class));
     }
     return result;
   }
 
   public void parseJSONString(String jsonStr)
   {
     if (StringUtil.isBlank(jsonStr)) return;
     JSONObject jsonObject = JSONObject.fromObject(jsonStr);
     Map map = new HashMap(jsonObject.size());
     parseJSON(jsonObject, map);
     setProperties(map);
     jsonObject = null;
     map = null;
   }
 
   private void parseJSON(JSONObject jsonObject, Map<String, Object> map)
   {
     for (Iterator iterator = jsonObject.entrySet().iterator(); iterator.hasNext(); ) {
       String entryStr = String.valueOf(iterator.next());
       String key = entryStr.substring(0, entryStr.indexOf("="));
       if (jsonObject.get(key).getClass().equals(JSONObject.class)) {
         HashMap _map = new HashMap();
         map.put(key, _map);
         parseJSON(jsonObject.getJSONObject(key), _map);
       } else if (jsonObject.get(key).getClass().equals(JSONArray.class)) {
         List list = new ArrayList();
         map.put(key, list);
         parseJSON(jsonObject.getJSONArray(key), list);
       } else {
         map.put(key, jsonObject.get(key));
       }
     }
   }
 
   private void parseJSON(JSONArray jsonArray, List<Object> list)
   {
     for (int i = 0; i < jsonArray.size(); i++)
       if (jsonArray.get(i).getClass().equals(JSONArray.class)) {
         List _list = new ArrayList();
         list.add(_list);
         parseJSON(jsonArray.getJSONArray(i), _list);
       } else if (jsonArray.get(i).getClass().equals(JSONObject.class)) {
         HashMap _map = new HashMap();
         list.add(_map);
         parseJSON(jsonArray.getJSONObject(i), _map);
       } else {
         list.add(jsonArray.get(i));
       }
   }
 
   public String toString() {
     return JSONObject.fromObject(this.properties, JSONParseConfig.jc).toString();
   }
 
   public <T> T toObject(Class<T> cls)
     throws InstantiationException, IllegalAccessException
   {
     Object obj = cls.newInstance();
     Set<String> set = this.properties.keySet();
     for (String key : set) {
       ClassHelper.setProperty(obj, key, this.properties.get(key));
     }
     return (T) obj;
   }
 
   public void changKeyName(String oldName, String newName)
   {
     Object value = getProperty(oldName);
     removeProperty(oldName);
     putProperty(newName, value);
   }
 
   public boolean isApplyProcUnit()
   {
     String procUnitId = (String)getProperty("procUnitId", String.class, "Apply");
     return procUnitId.equalsIgnoreCase("Apply");
   }
 
   public static void main(String[] aa)
   {
   }
 }

