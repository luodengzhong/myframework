 package com.brc.util;
 
 import com.brc.system.dictionary.model.DictionaryModel;
 import java.util.HashMap;
 import java.util.LinkedHashMap;
 import java.util.Map;
 import java.util.Map.Entry;
import java.util.Set;
 
 public class DictUtil
 {
   public static Map<String, String> getDictionary(String code, String type)
   {
     String[] s = code.split("[.]");
     String[] filters = StringUtil.isBlank(type) ? null : type.split(",");
     Map dictionary = Singleton.getDictionary(s[(s.length - 1)], filters);
     if ((null != dictionary) && (dictionary.size() > 0)) {
       Map map = new LinkedHashMap(dictionary.size());
				Set<Entry> set = dictionary.entrySet();
       for (Map.Entry entry : set) {
         map.put(((DictionaryModel)entry.getValue()).getValue(), ((DictionaryModel)entry.getValue()).getName());
       }
       return map;
     }
     return new HashMap();
   }
 
   public static Map<String, String> getDictionary(String code)
   {
     return getDictionary(code, null);
   }
 
   public static String getThreadLocalDictionaryDetailText(String code, Object value)
   {
     if (value == null) return null;
     String v = (String)ClassHelper.convert(value, String.class);
     if (StringUtil.isBlank(v)) return null;
     Map map = (Map)ThreadLocalUtil.getVariable("queryModelDictionaryMap", Map.class);
     if (map != null) {
       Map model = (Map)map.get(code);
       if (model != null) {
         String text = getText(model, v);
         if (!StringUtil.isBlank(text)) {
           return text;
         }
       }
       return null;
     }
     return null;
   }
 
   public static String getDictionaryDetailText(String code, Object value) {
     String textView = getThreadLocalDictionaryDetailText(code, value);
     if (StringUtil.isBlank(textView)) {
       return Singleton.getDictionaryDetailText(code, value);
     }
     return textView;
   }
 
   private static String getText(Map<String, String> map, String value) {
     if ((map == null) || (map.size() == 0)) {
       return null;
     }
     if (StringUtil.isBlank(value)) {
       return null;
     }
     String t = (String)map.get(value);
     if (!StringUtil.isBlank(t)) {
       return t;
     }
     String[] vs = value.split(",");
     StringBuffer text = new StringBuffer();
     for (String v : vs) {
       t = (String)map.get(v);
       if (!StringUtil.isBlank(t)) {
         text.append(t).append(",");
       }
     }
     return text.toString();
   }
 }

