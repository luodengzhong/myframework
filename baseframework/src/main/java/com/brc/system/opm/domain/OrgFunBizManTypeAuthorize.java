 package com.brc.system.opm.domain;
 
 import java.io.Serializable;
 import java.util.HashMap;
 import java.util.Map;
 
 public class OrgFunBizManTypeAuthorize
   implements Serializable
 {
   private static final long serialVersionUID = 1L;
   private Long id;
   private Integer organKindId;
   private Long orgFunctionId;
   private Long bizManagmentTypeId;
   private Long version;
 
   public Long getId()
   {
     return this.id;
   }
 
   public void setId(Long id) {
     this.id = id;
   }
 
   public Integer getOrganKindId() {
     return this.organKindId;
   }
 
   public void setOrganKindId(Integer organKindId) {
     this.organKindId = organKindId;
   }
 
   public Long getOrgFunctionId() {
     return this.orgFunctionId;
   }
 
   public void setOrgFunctionId(Long orgFunctionId) {
     this.orgFunctionId = orgFunctionId;
   }
 
   public Long getBizManagmentTypeId() {
     return this.bizManagmentTypeId;
   }
 
   public void setBizManagmentTypeId(Long bizManagmentTypeId) {
     this.bizManagmentTypeId = bizManagmentTypeId;
   }
 
   public Long getVersion() {
     return this.version;
   }
 
   public void setVersion(Long version) {
     this.version = version;
   }
 
   public static enum OrganKind {
     HQ(1, "总部"), FILIALE(2, "分子公司"), PUBLIC(3, "公用");
 
     private final int id;
     private final String displayName;
 
     private OrganKind(int id, String displayName) {
       this.id = id;
       this.displayName = displayName;
     }
 
     public int getId() {
       return this.id;
     }
 
     public String getDisplayName() {
       return this.displayName;
     }
 
     public static Map<Integer, String> getData() {
       Map result = new HashMap(3);
       for (OrganKind item : values()) {
         result.put(Integer.valueOf(item.getId()), item.getDisplayName());
       }
       return result;
     }
   }
 }

