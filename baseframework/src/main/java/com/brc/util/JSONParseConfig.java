 package com.brc.util;
 
 import java.sql.Timestamp;
 import net.sf.json.JsonConfig;
 import net.sf.json.processors.DefaultValueProcessor;
 import net.sf.json.processors.JsonValueProcessor;
 
 public class JSONParseConfig
 {
   public static final JsonConfig jc = new JsonConfig();
   private static final JsonDefaultDateValueProcessor defaultValueProcessor = new JsonDefaultDateValueProcessor();
 
   static { jc.registerJsonValueProcessor(java.sql.Date.class, defaultValueProcessor);
 
     jc.registerJsonValueProcessor(java.util.Date.class, defaultValueProcessor);
 
     jc.registerJsonValueProcessor(Timestamp.class, defaultValueProcessor);
 
     jc.registerDefaultValueProcessor(Number.class, new DefaultValueProcessor()
     {
       public Object getDefaultValue(Class type) {
         return null;
       }
     }); }
 
   static class JsonDefaultDateValueProcessor
     implements JsonValueProcessor
   {
     public Object processArrayValue(Object value, JsonConfig config)
     {
       return DateUtil.processDate(value);
     }
 
     public Object processObjectValue(String key, Object value, JsonConfig config)
     {
       return DateUtil.processDate(value);
     }
   }
 }

