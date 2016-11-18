 package com.brc.system.opm.domain;
 
 import java.io.Serializable;
 
 public class BaseManagementType
   implements Serializable
 {
   private static final long serialVersionUID = 1L;
   protected Integer id;
   protected String code;
   protected String name;
   protected Integer bizManagementTypeId;
   protected Integer sequence;
   protected Integer version;
 
   public Integer getId()
   {
     return this.id;
   }
 
   public void setId(Integer id) {
     this.id = id;
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
 
   public Integer getBizManagementTypeId() {
     return this.bizManagementTypeId;
   }
 
   public void setBizManagementTypeId(Integer bizManagementTypeId) {
     this.bizManagementTypeId = bizManagementTypeId;
   }
 
   public Integer getSequence() {
     return this.sequence;
   }
 
   public void setSequence(Integer sequence) {
     this.sequence = sequence;
   }
 
   public Integer getVersion() {
     return this.version;
   }
 
   public void setVersion(Integer version) {
     this.version = version;
   }
 }

