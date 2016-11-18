 package com.brc.client.taglib;
 
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.components.Component;
 
 public class ComboxLabelTag extends ComboxTag
 {
   private static final long serialVersionUID = 1L;
   protected String width;
   protected String labelWidth;
 
   public void setWidth(String width)
   {
     this.width = width;
   }
 
   public void setLabelWidth(String labelWidth) {
     this.labelWidth = labelWidth;
   }
 
   public Component getBean(ValueStack stack, HttpServletRequest request, HttpServletResponse response)
   {
     return new ComboxLabel(stack, request, response);
   }
 
   protected void populateParams()
   {
     super.populateParams();
     ComboxLabel obj = (ComboxLabel)this.component;
     obj.setWidth(this.width);
     obj.setLabelWidth(this.labelWidth);
   }
 }

