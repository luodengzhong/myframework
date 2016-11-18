 package com.brc.system.attachment.model;
 
 import java.util.HashMap;
 import java.util.Map;
 import java.util.concurrent.locks.Lock;
 import java.util.concurrent.locks.ReentrantLock;
 
 public class FileLock
 {
   private static Map<String, Lock> LOCKS = new HashMap();
 
   public static synchronized Lock getLock(String key) {
     if (LOCKS.containsKey(key)) {
       return (Lock)LOCKS.get(key);
     }
     Lock one = new ReentrantLock();
     LOCKS.put(key, one);
     return one;
   }
 
   public static synchronized void removeLock(String key)
   {
     LOCKS.remove(key);
   }
 }

