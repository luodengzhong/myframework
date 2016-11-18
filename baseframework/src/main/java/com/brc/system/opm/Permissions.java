 package com.brc.system.opm;
 
 import java.io.Serializable;
 import java.util.HashSet;
 import java.util.Set;
 import org.apache.log4j.Logger;
 
 public class Permissions
   implements Serializable
 {
   private static final long serialVersionUID = 5430303089782623189L;
   private HashSet<String> mergedPermission = new HashSet();
 
   boolean loaded = false;
 
   public static Logger logger = Logger.getLogger(Permissions.class);
 
   private static final long __I__ = System.currentTimeMillis();
 
   boolean contains(Process process, String activity)
   {
     return false;
   }
 
   boolean contains(String paramString1, String paramString2)
   {
     return false;
   }
 
   boolean contains(Process paramProcess, String paramString1, String paramString2)
   {
     return false;
   }
 
   void checkPermission(Process paramProcess, String paramString1, String paramString2)
   {
   }
 
   void addPermission(Permission paramPermission)
   {
   }
 
   void normalizePermission()
   {
   }
 
   Set<String> getProcessList()
   {
     return null;
   }
 }

