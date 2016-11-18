 package com.brc.model.domain;
 
 import com.brc.util.ConfigFileVersions;
import com.brc.xmlbean.DomainDocument;
 import com.brc.xmlbean.DomainDocument.Domain;
import com.brc.xmlbean.EntityDocument;
 import com.brc.xmlbean.EntityDocument.Entity;
 import java.io.Serializable;
 import java.util.HashMap;
 import java.util.Map;
 
 public class DomainModel
   implements Serializable, ConfigFileVersions
 {
   private static final long serialVersionUID = -3079015077515709853L;
   private String name;
   private Map<String, EntityDocument.Entity> entitys;
   private Long versions;
   private String configFilePath;
 
   public DomainModel(DomainDocument.Domain domain)
   {
     this.entitys = new HashMap(domain.getEntityArray().length);
     for (EntityDocument.Entity entity : domain.getEntityArray())
       this.entitys.put(entity.getName(), entity);
   }
 
   public String getName()
   {
     return this.name;
   }
 
   public void setName(String name) {
     this.name = name;
   }
 
   public Map<String, EntityDocument.Entity> getEntitys() {
     return this.entitys;
   }
 
   public EntityDocument.Entity getEntity(String name) {
     return (EntityDocument.Entity)this.entitys.get(name);
   }
 
   public void setVersions(Long versions) {
     this.versions = versions;
   }
 
   public Long getVersions()
   {
     return this.versions;
   }
 
   public String getConfigFilePath() {
     return this.configFilePath;
   }
 
   public void setConfigFilePath(String configFilePath) {
     this.configFilePath = configFilePath;
   }
 }

