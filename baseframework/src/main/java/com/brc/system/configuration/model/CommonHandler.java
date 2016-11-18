 package com.brc.system.configuration.model;
 
 import java.io.Serializable;
 
 public class CommonHandler
   implements Serializable
 {
   private static final long serialVersionUID = -3258585796774549879L;
   private Long bizId;
   private String kindId;
   private String orgUnitId;
   private String orgUnitName;
   private String orgKindId;
   private String fullId;
 
   public String getKindId()
   {
     return this.kindId;
   }
 
   public void setKindId(String kindId) {
     this.kindId = kindId;
   }
 
   public String getOrgUnitId() {
     return this.orgUnitId;
   }
 
   public void setOrgUnitId(String orgUnitId) {
     this.orgUnitId = orgUnitId;
   }
 
   public String getOrgUnitName() {
     return this.orgUnitName;
   }
 
   public void setOrgUnitName(String orgUnitName) {
     this.orgUnitName = orgUnitName;
   }
 
   public String getOrgKindId() {
     return this.orgKindId;
   }
 
   public void setOrgKindId(String orgKindId) {
     this.orgKindId = orgKindId;
   }
 
   public String getFullId() {
     return this.fullId;
   }
 
   public void setFullId(String fullId) {
     this.fullId = fullId;
   }
 
   public Long getBizId() {
     return this.bizId;
   }
 
   public void setBizId(Long bizId) {
     this.bizId = bizId;
   }
 }

