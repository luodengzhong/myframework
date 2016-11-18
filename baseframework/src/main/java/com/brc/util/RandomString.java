 package com.brc.util;
 
 import java.io.PrintStream;
 
 public class RandomString
 {
   private static RandomString instance;
   private final String splitStr = " ";
 
   public static RandomString getInstance()
   {
     if (instance == null) {
       instance = new RandomString();
     }
     return instance;
   }
 
   private String getNumberString()
   {
     StringBuffer buf = new StringBuffer();
     for (int i = 2; i < 10; i++) {
       buf.append(String.valueOf(i));
       buf.append(" ");
     }
     return buf.toString();
   }
 
   private String getUppercase()
   {
     StringBuffer buf = new StringBuffer();
     for (int i = 0; i < 26; i++) {
       buf.append(String.valueOf((char)(65 + i)));
       buf.append(" ");
     }
     return buf.toString();
   }
 
   private String getLowercase()
   {
     StringBuffer buf = new StringBuffer();
     for (int i = 0; i < 26; i++) {
       buf.append(String.valueOf((char)(97 + i)));
       buf.append(" ");
     }
     return buf.toString();
   }
 
   private String getString(String type)
   {
     StringBuffer pstr = new StringBuffer();
     if (type.length() > 0) {
       if (type.indexOf('i') != -1)
         pstr.append(getNumberString());
       if (type.indexOf('l') != -1)
         pstr.append(getLowercase());
       if (type.indexOf('u') != -1) {
         pstr.append(getUppercase());
       }
     }
     return pstr.toString();
   }
 
   public String getRandomString(int length, String type)
   {
     String allStr = getString(type);
     String[] arrStr = allStr.split(" ");
     StringBuffer pstr = new StringBuffer();
     if (length > 0) {
       for (int i = 0; i < length; i++) {
         pstr.append(arrStr[new java.util.Random().nextInt(arrStr.length)]);
       }
     }
     return pstr.toString();
   }
 
   public static void main(String[] args) {
     System.out.println("type=i:" + getInstance().getRandomString(10, "i"));
 
     System.out.println("type=il:" + getInstance().getRandomString(10, "il"));
 
     System.out.println("type=ilu:" + getInstance().getRandomString(10, "ilu"));
 
     String aa = getInstance().getRandomString(10, "ilu");
     System.out.println(Md5Builder.getMd5(aa));
   }
 }

