 package com.brc.system.opm.domain;
 
 import java.io.Serializable;
 
 public class BaseFunctionType
   implements Serializable
 {
   private static final long serialVersionUID = 1L;
   private Long baseFunctionTypeId;
   private Long folderId;
   private String code;
   private String name;
   private Long sequence;
   private Long version;
 
   public Long getBaseFunctionTypeId()
   {
     return this.baseFunctionTypeId;
   }
 
   public void setBaseFunctionTypeId(Long baseFunctionTypeId) {
     this.baseFunctionTypeId = baseFunctionTypeId;
   }
 
   public Long getFolderId() {
     return this.folderId;
   }
 
   public void setFolderId(Long folderId) {
     this.folderId = folderId;
   }
 
   public String getCode() {
     return this.code;
   }
 
   public void setCode(String code) {
     this.code = code;
   }
 
   public String getName() {
     return this.name;
   }
 
   public void setName(String name) {
     this.name = name;
   }
 
   public Long getSequence() {
     return this.sequence;
   }
 
   public void setSequence(Long sequence) {
     this.sequence = sequence;
   }
 
   public Long getVersion() {
     return this.version;
   }
 
   public void setVersion(Long version) {
     this.version = version;
   }
 }

