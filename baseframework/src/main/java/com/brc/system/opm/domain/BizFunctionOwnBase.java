 package com.brc.system.opm.domain;
 
 import java.io.Serializable;
 
 public class BizFunctionOwnBase
   implements Serializable
 {
   private static final long serialVersionUID = 1L;
   private Long bizFunctionOwnBase;
   private Long bizFunctionTypeId;
   private Long baseFunctionTypeId;
   private Long sequence;
   private Long version;
 
   public Long getBizFunctionOwnBase()
   {
     return this.bizFunctionOwnBase;
   }
 
   public void setBizFunctionOwnBase(Long bizFunctionOwnBase) {
     this.bizFunctionOwnBase = bizFunctionOwnBase;
   }
 
   public Long getBizFunctionTypeId() {
     return this.bizFunctionTypeId;
   }
 
   public void setBizFunctionTypeId(Long bizFunctionTypeId) {
     this.bizFunctionTypeId = bizFunctionTypeId;
   }
 
   public Long getBaseFunctionTypeId() {
     return this.baseFunctionTypeId;
   }
 
   public void setBaseFunctionTypeId(Long baseFunctionTypeId) {
     this.baseFunctionTypeId = baseFunctionTypeId;
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

