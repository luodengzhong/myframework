 package com.brc.util;
 
 public class NullFlag
 {
   public static final int INTNULL = -2147483648;
   public static final double DOUBLENULL = -1.0E-010D;
   public static final long LONGNULL = -9223372036854775808L;
 
   public static boolean isIntNull(int intPara)
   {
     if (intPara == -2147483648) {
       return true;
     }
     return false;
   }
 
   public static boolean isObjNull(Object obj)
   {
     if ((obj == null) || ("".equals(obj.toString()))) {
       return true;
     }
     return false;
   }
 
   public static boolean isDoubleNull(double doublePara)
   {
     if (doublePara == -1.0E-010D) {
       return true;
     }
     return false;
   }
 
   public static boolean isLongNull(long longPara)
   {
     if (longPara == -9223372036854775808L) {
       return true;
     }
     return false;
   }
 }

