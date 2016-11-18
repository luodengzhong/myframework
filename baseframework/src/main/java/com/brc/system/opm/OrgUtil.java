 package com.brc.system.opm;
 
 import com.brc.system.util.Util;
 
 public class OrgUtil
 {
   public static String getDefaultPassword()
   {
     return "12345678";
   }
 
   public static String getDefaultEncryptPassword()
   {
     return Util.MD5(getDefaultPassword());
   }
 }

