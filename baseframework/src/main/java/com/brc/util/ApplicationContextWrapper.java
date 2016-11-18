 package com.brc.util;
 
 import org.springframework.context.ApplicationContext;
 
 public class ApplicationContextWrapper
 {
   private ApplicationContext applicationContext;
 
   public static ApplicationContextWrapper getInstance()
   {
     return ApplicationContextHolder.instance;
   }
 
   public void setApplicationContext(ApplicationContext context) {
     this.applicationContext = context;
   }
 
   public ApplicationContext getApplicationContext() {
     return this.applicationContext;
   }
 
   public static synchronized void init(ApplicationContext context) {
     getInstance().setApplicationContext(context);
   }
 
   public static Object getBean(String beanName) {
     if (getInstance().getApplicationContext() == null) {
       return null;
     }
     return getInstance().getApplicationContext().getBean(beanName);
   }
 
   public static <T> T getBean(String name, Class<T> type)
   {
     if (getInstance().getApplicationContext() == null) {
       return null;
     }
     return getInstance().getApplicationContext().getBean(name, type);
   }
 
   static class ApplicationContextHolder
   {
     static ApplicationContextWrapper instance = new ApplicationContextWrapper();
   }
 }

