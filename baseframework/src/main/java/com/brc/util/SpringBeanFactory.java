 package com.brc.util;
 
 import javax.servlet.ServletContext;
 import org.springframework.context.ApplicationContext;
 import org.springframework.web.context.support.WebApplicationContextUtils;
 
 public class SpringBeanFactory
 {
   public static Object getBean(ServletContext servletContext, String name)
   {
     if (servletContext == null) return null;
     ApplicationContext d = WebApplicationContextUtils.getWebApplicationContext(servletContext);
     return d.getBean(name);
   }
 
   public static <T> T getBean(ServletContext servletContext, String name, Class<T> type) {
     if (servletContext == null) return null;
     ApplicationContext d = WebApplicationContextUtils.getWebApplicationContext(servletContext);
     return d.getBean(name, type);
   }
 }

