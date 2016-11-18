 package com.brc.util;
 
 import com.brc.exception.NotFoundException;
 import java.io.IOException;
 import org.springframework.core.io.ClassPathResource;
 
 public abstract class XmlLoadManager<T>
 {
   public abstract T loadConfigFile(String paramString)
     throws NotFoundException;
 
   protected ClassPathResource getResource(String name)
     throws IOException
   {
     return new ClassPathResource(name);
   }
 
   public static Long getLastModified(String name)
     throws IOException
   {
     return Long.valueOf(new ClassPathResource(name).lastModified());
   }
 }

