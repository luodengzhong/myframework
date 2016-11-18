 package com.brc.client.taglib;
 
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.components.Component;
 import org.apache.struts2.views.jsp.ui.AbstractUITag;
 
 public class FileListTag extends AbstractUITag
 {
   private static final long serialVersionUID = -468174884295243151L;
   private String bizId;
   private String bizCode;
   private String readOnly = "false";
 
   private String isWrap = "true";
 
   private String isClass = "false";
 
   private String inTable = "false";
   private String proportion;
   private String springBean;
 
   public String getBizId()
   {
     return this.bizId;
   }
 
   public void setBizId(String bizId) {
     this.bizId = bizId;
   }
 
   public String getBizCode() {
     return this.bizCode;
   }
 
   public void setBizCode(String bizCode) {
     this.bizCode = bizCode;
   }
 
   public String getReadOnly() {
     return this.readOnly;
   }
 
   public void setReadOnly(String readOnly) {
     this.readOnly = readOnly;
   }
 
   public String getIsWrap() {
     return this.isWrap;
   }
 
   public void setIsWrap(String isWrap) {
     this.isWrap = isWrap;
   }
 
   public String getIsClass() {
     return this.isClass;
   }
 
   public void setIsClass(String isClass) {
     this.isClass = isClass;
   }
 
   public String getInTable() {
     return this.inTable;
   }
 
   public void setInTable(String inTable) {
     this.inTable = inTable;
   }
 
   public String getProportion() {
     return this.proportion;
   }
 
   public void setProportion(String proportion) {
     this.proportion = proportion;
   }
 
   public String getSpringBean() {
     return this.springBean;
   }
 
   public void setSpringBean(String springBean) {
     this.springBean = springBean;
   }
 
   public Component getBean(ValueStack vs, HttpServletRequest request, HttpServletResponse response) {
     return new FileList(vs, request, response, this.springBean);
   }
 
   protected void populateParams() {
     super.populateParams();
     FileList obj = (FileList)this.component;
     obj.setBizCode(this.bizCode);
     obj.setBizId(this.bizId);
     obj.setReadOnly(this.readOnly);
     obj.setIsWrap(this.isWrap);
     obj.setIsClass(this.isClass);
     obj.setInTable(this.inTable);
     obj.setProportion(this.proportion);
   }
 }

