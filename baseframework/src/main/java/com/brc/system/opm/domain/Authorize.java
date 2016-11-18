 package com.brc.system.opm.domain;
 
 import java.io.Serializable;
 
 public class Authorize
   implements Serializable
 {
   private static final long serialVersionUID = 1L;
   private Long id;
   private String orgId;
   private String orgName;
   private String orgFullId;
   private String orgFullName;
   private Long roleId;
   private String creatorId;
   private java.util.Date createDate;
   private Long version;
 
   public Long getId()
   {
     return this.id;
   }
 
   public void setId(Long id) {
     this.id = id;
   }
 
   public String getOrgId() {
     return this.orgId;
   }
 
   public void setOrgId(String orgId) {
     this.orgId = orgId;
   }
 
   public String getOrgName() {
     return this.orgName;
   }
 
   public void setOrgName(String orgName) {
     this.orgName = orgName;
   }
 
   public String getOrgFullId() {
     return this.orgFullId;
   }
 
   public void setOrgFullId(String orgFullId) {
     this.orgFullId = orgFullId;
   }
 
   public String getOrgFullName() {
     return this.orgFullName;
   }
 
   public void setOrgFullName(String orgFullName) {
     this.orgFullName = orgFullName;
   }
 
   public Long getRoleId() {
     return this.roleId;
   }
 
   public void setRoleId(Long roleId) {
     this.roleId = roleId;
   }
 
   public String getCreatorId() {
     return this.creatorId;
   }
 
   public void setCreatorId(String creatorId) {
     this.creatorId = creatorId;
   }
 
   public java.util.Date getCreateDate() {
     return this.createDate;
   }
 
   public void setCreateDate(java.util.Date createDate) {
     if (null == createDate) {
       this.createDate = null;
       return;
     }
     this.createDate = new java.sql.Date(createDate.getTime());
   }
 
   public Long getVersion() {
     return this.version;
   }
 
   public void setVersion(Long version) {
     this.version = version;
   }
 }

