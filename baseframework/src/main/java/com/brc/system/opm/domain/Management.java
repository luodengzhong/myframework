 package com.brc.system.opm.domain;
 
 import java.io.Serializable;
 
 public class Management
   implements Serializable
 {
   private static final long serialVersionUID = 2161891257543076096L;
   private String code;
   private String orgFullId;
   private String orgFullName;
   private String orgId;
   private String orgName;
   private String manageId;
   private String manageFullId;
   private String manageFullName;
   private String manageName;
 
   public String getCode()
   {
     return this.code;
   }
 
   void setCode(String code) {
     this.code = code;
   }
 
   public String getManageFullId() {
     return this.manageFullId;
   }
 
   void setManageFullId(String manageFullId) {
     this.manageFullId = manageFullId;
   }
 
   public String getManageFullName() {
     return this.manageFullName;
   }
 
   void setManageFName(String manageFullName) {
     this.manageFullName = manageFullName;
   }
 
   public String getManageID() {
     return this.manageId;
   }
 
   void setManageId(String manageId) {
     this.manageId = manageId;
   }
 
   public String getManageName() {
     return this.manageName;
   }
 
   void setManageName(String manageName) {
     this.manageName = manageName;
   }
 
   public String getOrgFullID() {
     return this.orgFullId;
   }
 
   void setOrgFID(String orgFullId) {
     this.orgFullId = orgFullId;
   }
 
   public String getOrgFullName() {
     return this.orgFullName;
   }
 
   public void setOrgFName(String orgFullName) {
     this.orgFullName = orgFullName;
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
 }

