 package com.brc.system.opm.domain;
 
 import java.io.Serializable;
 import java.util.Date;
 
 public class BizManagement
   implements Serializable
 {
   private static final long serialVersionUID = 1L;
   private Integer id;
   private String orgId;
   private String orgName;
   private String orgFullId;
   private String orgFullName;
   private Integer manageTypeId;
   private String manageOrgId;
   private String manageOrgName;
   private String manageOrgFullId;
   private String manageOrgFullName;
   private String creatorFullId;
   private String creatorFullName;
   private Date createDate;
   private Integer kindId;
   private Integer version;
 
   public Integer getId()
   {
     return this.id;
   }
 
   public void setId(Integer id) {
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
 
   public Integer getManageTypeId() {
     return this.manageTypeId;
   }
 
   public void setManageTypeId(Integer manageTypeId) {
     this.manageTypeId = manageTypeId;
   }
 
   public String getManageOrgId() {
     return this.manageOrgId;
   }
 
   public void setManageOrgId(String manageOrgId) {
     this.manageOrgId = manageOrgId;
   }
 
   public String getManageOrgName() {
     return this.manageOrgName;
   }
 
   public void setManageOrgName(String manageOrgName) {
     this.manageOrgName = manageOrgName;
   }
 
   public String getManageOrgFullId() {
     return this.manageOrgFullId;
   }
 
   public void setManageOrgFullId(String manageOrgFullId) {
     this.manageOrgFullId = manageOrgFullId;
   }
 
   public String getManageOrgFullName() {
     return this.manageOrgFullName;
   }
 
   public void setManageOrgFullName(String manageOrgFullName) {
     this.manageOrgFullName = manageOrgFullName;
   }
 
   public String getCreatorFullId() {
     return this.creatorFullId;
   }
 
   public void setCreatorFullId(String creatorFullId) {
     this.creatorFullId = creatorFullId;
   }
 
   public Date getCreateDate() {
     return this.createDate;
   }
 
   public void setCreateDate(Date createDate) {
     this.createDate = createDate;
   }
 
   public String getCreatorFullName() {
     return this.creatorFullName;
   }
 
   public void setCreatorFullName(String creatorFullName) {
     this.creatorFullName = creatorFullName;
   }
 
   public Integer getKindId() {
     return this.kindId;
   }
 
   public void setKindId(Integer kindId) {
     this.kindId = kindId;
   }
 
   public Integer getVersion() {
     return this.version;
   }
 
   public void setVersion(Integer version) {
     this.version = version;
   }
 }

