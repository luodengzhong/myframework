 package com.brc.util;
 
 import freemarker.template.Configuration;
 import freemarker.template.Template;
 import java.io.BufferedWriter;
 import java.io.StringWriter;
 import java.util.Map;
 import javax.servlet.ServletContext;
 
 public class FreemarkerUtil
 {
   private static Configuration config = null;
 
   public static Configuration getConfiguation()
   {
     return config;
   }
 
   public static void setTemplateLoading(ServletContext context)
   {
     config.setServletContextForTemplateLoading(context, "/template");
   }
 
   public static String generate(String template, Map<String, Object> variables)
     throws Exception
   {
     Template tp = config.getTemplate(template, "utf-8");
     StringWriter stringWriter = new StringWriter();
     BufferedWriter writer = new BufferedWriter(stringWriter);
     tp.setEncoding("utf-8");
     tp.process(variables, writer);
     String htmlStr = stringWriter.toString();
     writer.flush();
     writer.close();
     return htmlStr;
   }
 
   static
   {
     config = new Configuration();
     config.setDefaultEncoding("UTF-8");
   }
 }

