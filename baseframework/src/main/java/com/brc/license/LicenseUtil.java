 package com.brc.license;
 
 import com.brc.exception.ApplicationException;
 
 public class LicenseUtil
 {
   public static final License LICENSE = new License();
 
   public static native void getLicense(License paramLicense);
 
   static { try { System.loadLibrary("brcLicense");
       getLicense(LICENSE);
     } catch (UnsatisfiedLinkError e) {
       throw new ApplicationException("读取License出错。");
     }
   }
 }

