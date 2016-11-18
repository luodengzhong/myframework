 package com.brc.system.opm.domain;
 
 import java.io.Serializable;
 
 public class Function
   implements Serializable
 {
   protected Long id;
   protected Long parentId;
   protected String code;
   protected String name;
   protected String fullName;
   protected String nodeKindId;
   protected Integer keyCode;
   protected String url;
   protected String icon;
   protected String remark;
   protected Integer depth;
   protected Integer status;
   protected Long sequence;
   protected Long version;
 
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
 
   public String getFullName() {
     return this.fullName;
   }
 
   public void setFullName(String fullName) {
     this.fullName = fullName;
   }
 
   public String getNodeKindId() {
     return this.nodeKindId;
   }
 
   public void setNodeKindId(String nodeKindId) {
     this.nodeKindId = nodeKindId;
   }
 
   public Integer getKeyCode() {
     return this.keyCode;
   }
 
   public void setKeyCode(Integer keyCode) {
     this.keyCode = keyCode;
   }
 
   public String getUrl() {
     return this.url;
   }
 
   public void setUrl(String url) {
     this.url = url;
   }
 
   public String getIcon() {
     return this.icon;
   }
 
   public void setIcon(String icon) {
     this.icon = icon;
   }
 
   public String getRemark() {
     return this.remark;
   }
 
   public void setRemark(String remark) {
     this.remark = remark;
   }
 
   public Integer getDepth() {
     return this.depth;
   }
 
   public void setDepth(Integer depth) {
     this.depth = depth;
   }
 
   public Integer getStatus() {
     return this.status;
   }
 
   public void setStatus(Integer status) {
     this.status = status;
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

