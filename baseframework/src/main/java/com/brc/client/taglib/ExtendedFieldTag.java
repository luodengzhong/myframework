 package com.brc.client.taglib;
 
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.components.Component;
 import org.apache.struts2.views.jsp.ui.AbstractUITag;
 
 public class ExtendedFieldTag extends AbstractUITag
 {
   private static final long serialVersionUID = -468174884295243151L;
   private String bizId;
   private String bizCode;
 
   public String getBizCode()
   {
     return this.bizCode;
   }
 
   public void setBizCode(String bizCode) {
     this.bizCode = bizCode;
   }
 
   public String getBizId() {
     return this.bizId;
   }
 
   public void setBizId(String bizId) {
     this.bizId = bizId;
   }
 
   public Component getBean(ValueStack vs, HttpServletRequest request, HttpServletResponse response) {
     return new ExtendedFieldList(vs, request, response);
   }
 
   protected void populateParams() {
     super.populateParams();
     ExtendedFieldList obj = (ExtendedFieldList)this.component;
     obj.setBizId(this.bizId);
     obj.setBizCode(this.bizCode);
   }
 }

