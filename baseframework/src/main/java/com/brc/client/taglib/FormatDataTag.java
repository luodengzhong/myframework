 package com.brc.client.taglib;
 
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.components.Component;
 import org.apache.struts2.views.jsp.ui.AbstractUITag;
 
 public class FormatDataTag extends AbstractUITag
 {
   private String type;
 
   public String getType()
   {
     return this.type;
   }
 
   public void setType(String type) {
     this.type = type;
   }
 
   public Component getBean(ValueStack vs, HttpServletRequest request, HttpServletResponse response) {
     return new FormatData(vs, request, response);
   }
 
   protected void populateParams() {
     super.populateParams();
     FormatData obj = (FormatData)this.component;
     obj.setType(this.type);
   }
 }

