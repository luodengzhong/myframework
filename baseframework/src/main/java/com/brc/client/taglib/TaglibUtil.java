 package com.brc.client.taglib;
 
 import com.brc.util.DateUtil;
 import com.brc.util.StringUtil;
 import java.util.Date;
 
 public class TaglibUtil
 {
   public static Object formatData(Object obj, String type)
   {
     if (StringUtil.isBlank(type)) {
       return obj;
     }
     if (obj != null) {
       if ((type.equals("text")) || (type.equals("dictionary")))
         return obj.toString();
       if ((type.equals("date")) && ((obj instanceof Date)))
         return DateUtil.getDateFormat(1, (Date)obj);
       if ((type.toUpperCase().equals("DATETIME")) && ((obj instanceof Date)))
         return DateUtil.getDateFormat(9, (Date)obj);
       if (type.equals("money"))
         return StringUtil.formatToCurrency(obj.toString());
       if (!StringUtil.isBlank(obj.toString())) {
         try {
           int i = 0;
           if (type.indexOf(".") > -1) {
             String temp = type.split("\\.")[1];
             i = temp.length();
           } else {
             i = StringUtil.toInt(type);
             if ((i < 0) || (i > 9)) {
               return obj;
             }
           }
           return StringUtil.keepDigit(obj.toString(), i, true);
         } catch (Exception e) {
           return obj;
         }
       }
     }
     return "";
   }
 }

