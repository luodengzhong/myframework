 package com.brc.system.share.treeview;
 
 import com.brc.exception.NotFoundException;
 import com.brc.system.share.treeview.model.TreeViewMappingModel;
 import com.brc.util.XmlLoadManager;
 import com.brc.xmlbean.TreeMappingDocument;
 import com.brc.xmlbean.TreeMappingDocument.Factory;
 import java.io.IOException;
 import java.io.InputStream;
 import org.springframework.core.io.ClassPathResource;
 
 public class TreeViewManager extends XmlLoadManager<TreeViewMappingModel>
 {
   public TreeViewMappingModel loadConfigFile(String path)
     throws NotFoundException
   {
     InputStream inputStream = null;
     try {
       ClassPathResource resource = getResource(path);
       inputStream = resource.getInputStream();
       TreeMappingDocument doc = TreeMappingDocument.Factory.parse(inputStream);
       TreeViewMappingModel mappingModel = new TreeViewMappingModel(doc.getTreeMapping());
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

