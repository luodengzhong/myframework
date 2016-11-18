 package com.brc.system.opm.domain;
 
 import java.io.Serializable;
 
 public class OrgFunction
   implements Serializable
 {
   private static final long serialVersionUID = 1L;
   private Long id;
   private Long parentId;
   private String fullId;
   private String code;
   private String name;
   private String kindId;
   private Long version;
   private Integer sequence;
 
   public Long getId()
   {
     return this.id;
   }
 
   public void setId(Long id) {
     this.id = id;
   }
 
   public Long getParentId() {
     return this.parentId;
   }
 
   public void setParentId(Long parentId) {
     this.parentId = parentId;
   }
 
   public String getFullId() {
     return this.fullId;
   }
 
   public void setFullId(String fullId) {
     this.fullId = fullId;
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
 
   public String getKindId() {
     return this.kindId;
   }
 
   public void setKindId(String kindId) {
     this.kindId = kindId;
   }
 
   public Long getVersion() {
     return this.version;
   }
 
   public void setVersion(Long version) {
     this.version = version;
   }
 
   public Integer getSequence() {
     return this.sequence;
   }
 
   public void setSequence(Integer sequence) {
     this.sequence = sequence;
   }
 }

