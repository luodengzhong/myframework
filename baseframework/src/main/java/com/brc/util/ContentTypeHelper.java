 package com.brc.util;
 
 import java.util.HashMap;
 import java.util.Map;
 
 public class ContentTypeHelper
 {
   private static Map<String, String> contentTypes = new HashMap();
 
   public static String getContentType(String ext)
   {
     String type = (String)contentTypes.get(ext.toLowerCase());
     return type != null ? type : "application/unknown";
   }
 
   static
   {
     contentTypes.put("asp", "text/asp");
     contentTypes.put("avi", "video/avi");
     contentTypes.put("awf", "application/vnd.adobe.workflow");
     contentTypes.put("bmp", "image/bmp");
     contentTypes.put("css", "text/css");
     contentTypes.put("doc", "application/msword");
     contentTypes.put("dtd", "text/xml");
     contentTypes.put("exe", "application/x-msdownload");
     contentTypes.put("gif", "image/gif");
     contentTypes.put("htc", "text/x-component");
     contentTypes.put("htm", "text/html");
     contentTypes.put("html", "text/html");
     contentTypes.put("ico", "image/x-icon");
     contentTypes.put("img", "application/x-img");
     contentTypes.put("java", "java/*");
     contentTypes.put("jpe", "image/jpeg");
     contentTypes.put("jpeg", "image/jpeg");
     contentTypes.put("jpg", "image/jpeg");
     contentTypes.put("js", "application/x-javascript");
     contentTypes.put("jsp", "text/html");
     contentTypes.put("mdb", "application/msaccess");
     contentTypes.put("png", "image/png");
     contentTypes.put("ppt", "application/x-ppt");
     contentTypes.put("swf", "application/x-shockwave-flash");
     contentTypes.put("xhtml", "text/html");
     contentTypes.put("xls", "application/vnd.ms-excel");
     contentTypes.put("xlsx", "application/vnd.ms-excel");
     contentTypes.put("docx", "application/msword");
     contentTypes.put("pptx", "application/vnd.ms-powerpoint");
     contentTypes.put("txt", "text/plain");
     contentTypes.put("xml", "text/xml");
     contentTypes.put("pdf", "application/pdf");
     contentTypes.put("zip", "application/zip");
     contentTypes.put("rar", "application/rar");
     contentTypes.put("apk", "application/vnd.android.package-archive");
   }
 }

