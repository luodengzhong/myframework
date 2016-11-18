 package com.brc.system.opm.domain;
 
 import java.io.Serializable;
 
 public class OrgFunctionAuthorize
   implements Serializable
 {
   private static final long serialVersionUID = 1L;
   private Long id;
   private String orgId;
   private Long orgFunctionId;
   private Long version;
 
   public Long getId()
   {
     return this.id;
   }
 
   public void setId(Long id) {
     this.id = id;
   }
 
   public Long getOrgFunctionId() {
     return this.orgFunctionId;
   }
 
   public void setOrgFunctionId(Long orgFunctionId) {
     this.orgFunctionId = orgFunctionId;
   }
 
   public String getOrgId() {
     return this.orgId;
   }
 
   public void setOrgId(String orgId) {
     this.orgId = orgId;
   }
 
   public Long getVersion() {
     return this.version;
   }
 
   public void setVersion(Long version) {
     this.version = version;
   }
 }

