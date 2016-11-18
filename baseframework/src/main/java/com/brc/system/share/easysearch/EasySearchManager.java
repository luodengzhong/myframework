 package com.brc.system.share.easysearch;
 
 import com.brc.exception.NotFoundException;
 import com.brc.system.share.easysearch.model.EasySearchMappingModel;
 import com.brc.util.StringUtil;
 import com.brc.util.XmlLoadManager;
 import com.brc.xmlbean.EasySearchMappingDocument;
 import com.brc.xmlbean.EasySearchMappingDocument.Factory;
 import java.io.IOException;
 import java.io.InputStream;
 import java.util.HashMap;
 import java.util.Map;
 import org.springframework.core.io.ClassPathResource;
 
 public class EasySearchManager extends XmlLoadManager<EasySearchMappingModel>
 {
   private Map<String, String> mapping = new HashMap(4);
 
   public void setMapping(Map<String, String> mapping) {
     this.mapping = mapping;
   }
 
   public EasySearchMappingModel loadConfigFile(String type)
     throws NotFoundException
   {
     String path = (String)this.mapping.get(type);
     if (StringUtil.isBlank(path)) {
       throw new NotFoundException("类型为'" + type + "'的配置文件未找到!");
     }
     InputStream inputStream = null;
     try {
       ClassPathResource resource = getResource(path);
       inputStream = resource.getInputStream();
       EasySearchMappingDocument doc = EasySearchMappingDocument.Factory.parse(inputStream);
       EasySearchMappingModel mappingModel = new EasySearchMappingModel(doc.getEasySearchMapping());
       mappingModel.setVersions(Long.valueOf(resource.lastModified()));
       mappingModel.setConfigFilePath(path);
       return mappingModel;
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

