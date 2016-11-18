 package com.brc.model.domain;
 
 import com.brc.exception.NotFoundException;
 import com.brc.util.XmlLoadManager;
 import com.brc.xmlbean.DomainDocument;
 import com.brc.xmlbean.DomainDocument.Factory;
 import java.io.IOException;
 import java.io.InputStream;
 import org.springframework.core.io.ClassPathResource;
 
 public class DomainManager extends XmlLoadManager<DomainModel>
 {
   public DomainModel loadConfigFile(String path)
     throws NotFoundException
   {
     InputStream inputStream = null;
     try {
       ClassPathResource resource = getResource(path);
       inputStream = resource.getInputStream();
       DomainDocument doc = DomainDocument.Factory.parse(inputStream);
       DomainModel model = new DomainModel(doc.getDomain());
       model.setVersions(Long.valueOf(resource.lastModified()));
       model.setConfigFilePath(path);
       return model;
     } catch (Exception e) {
       throw new NotFoundException("读取配置文件失败:" + e.getMessage());
     } finally {
       if (inputStream != null)
         try {
           inputStream.close();
         } catch (IOException e) {
           e.printStackTrace();
         }
     }
   }
 }

