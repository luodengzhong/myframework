 package com.brc.util;
 
 import com.brc.exception.ApplicationException;
 import java.io.PrintStream;
 import java.util.ArrayList;
 import java.util.Iterator;
 import java.util.List;
 import java.util.Map;
 
 public class ListUtil
 {
   public static String join(List<Map<String, Object>> list, String prop, String separator)
     throws ApplicationException
   {
     StringBuffer ret = new StringBuffer("");
     String property = "";
     if (list == null) {
       throw new ApplicationException("输入的列表为空！");
     }
     for (Map m : list) {
       property = (String)ClassHelper.convert(m.get(prop), String.class, "");
       ret.append(separator).append(property);
     }
     return ret.substring(separator.length());
   }
 
   public static String join(List<?> list, String separator)
     throws ApplicationException
   {
     StringBuffer ret = new StringBuffer("");
     String property = "";
     if (list == null) {
       throw new ApplicationException("输入的列表为空！");
     }
     for (Iterator i$ = list.iterator(); i$.hasNext(); ) { Object o = i$.next();
       property = (String)ClassHelper.convert(o, String.class, "");
       ret.append(separator).append(property);
     }
     return ret.substring(separator.length());
   }
 
   public static <T> boolean contains(T[] array, T v)
   {
     for (Object e : array) {
       if ((e == v) || ((v != null) && (v.equals(e)))) {
         return true;
       }
     }
     return false;
   }
 
   public static void main(String[] args) {
     List list = new ArrayList();
     list.add("1");
     list.add("2");
     System.out.println(join(list, ","));
   }
 }

