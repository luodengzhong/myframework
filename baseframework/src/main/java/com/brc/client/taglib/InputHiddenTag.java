 package com.brc.client.taglib;
 
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.components.Component;
 import org.apache.struts2.views.jsp.ui.HiddenTag;
 
 public class InputHiddenTag extends HiddenTag
 {
   private static final long serialVersionUID = 1L;
   private String type;
 
   public String getType()
   {
     return this.type;
   }
 
   public void setType(String type) {
     this.type = type;
   }
 
   public Component getBean(ValueStack stack, HttpServletRequest request, HttpServletResponse response)
   {
     return new InputHidden(stack, request, response);
   }
 
   protected void populateParams()
   {
     super.populateParams();
     InputHidden obj = (InputHidden)this.component;
     obj.setType(this.type);
   }
 }

