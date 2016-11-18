 package com.brc.client.taglib;
 
 import com.brc.util.StringUtil;
 
 public class JSTLFunction
 {
   public static boolean theSamePerson(String psmId1, String psmId2)
   {
     if ((StringUtil.isBlank(psmId1)) || (StringUtil.isBlank(psmId2))) {
       return false;
     }
     String personId1 = psmId1.split("@")[0];
     String personId2 = psmId2.split("@")[0];
     return personId1.equals(personId2);
   }
 
   public static String format(Object value, String type)
   {
     return TaglibUtil.formatData(value, type).toString();
   }
 
   public static String getWeekDay(Integer i)
   {
     String[] array = { "日", "一", "二", "三", "四", "五", "六" };
     if ((i == null) || (i.intValue() >= array.length)) {
       return "";
     }
     return "星期" + array[i.intValue()];
   }
 
   public static boolean checkContains(String str1, String str2)
   {
     if ((StringUtil.isBlank(str1)) || (StringUtil.isBlank(str2))) {
       return false;
     }
     String[] str = str1.split(",");
     for (String s : str) {
       if (s.equals(str2)) {
         return true;
       }
     }
     return false;
   }
 }

