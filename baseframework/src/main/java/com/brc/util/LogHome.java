 package com.brc.util;
 
 import java.io.ByteArrayOutputStream;
 import java.io.PrintStream;
 import org.apache.log4j.Logger;
 import org.apache.log4j.spi.LoggerFactory;
 
 public class LogHome
 {
   public static Logger getLog()
   {
     return Logger.getLogger(LogHome.class);
   }
 
   public static Logger getLog(Class cls) {
     return Logger.getLogger(cls);
   }
 
   public static Logger getLog(Object obj) {
     return Logger.getLogger(obj.getClass());
   }
 
   public static Logger getLog(String name, LoggerFactory loggerFactory) {
     return Logger.getLogger(name, loggerFactory);
   }
 
   public static void logExceptionStackTrace(Exception e) {
     Logger log = getLog();
     ByteArrayOutputStream os = new ByteArrayOutputStream();
     PrintStream p = new PrintStream(os);
     e.printStackTrace(p);
     log.error(os.toString());
   }
 }

