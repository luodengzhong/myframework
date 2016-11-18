 package com.brc.client.taglib;
 
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.components.Component;
 import org.apache.struts2.views.jsp.ui.AbstractUITag;
 
 public class HeadBaseTag extends AbstractUITag
 {
   private String include;
 
   public String getInclude()
   {
     return this.include;
   }
 
   public void setInclude(String include) {
     this.include = include;
   }
 
   public Component getBean(ValueStack vs, HttpServletRequest request, HttpServletResponse response)
   {
     return new HeadBase(vs, request, response);
   }
 
   protected void populateParams() {
     super.populateParams();
     HeadBase obj = (HeadBase)this.component;
     obj.setInclude(this.include);
   }
 }

