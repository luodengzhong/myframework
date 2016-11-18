 package com.brc.system.opm.domain;
 
 import java.io.Serializable;
 
 public class BizFunction
   implements Serializable
 {
   private static final long serialVersionUID = 1L;
   private Long bizFunctionTypeId;
   private String code;
   private String name;
   private Long sequence;
   private Long version;
 
   public Long getBizFunctionTypeId()
   {
     return this.bizFunctionTypeId;
   }
 
   public void setBizFunctionTypeId(Long bizFunctionTypeId) {
     this.bizFunctionTypeId = bizFunctionTypeId;
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

