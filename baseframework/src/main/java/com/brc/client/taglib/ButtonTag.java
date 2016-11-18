 package com.brc.client.taglib;
 
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.components.Component;
 import org.apache.struts2.views.jsp.ui.AbstractUITag;
 
 public class ButtonTag extends AbstractUITag
 {
   private String power;
   private String type;
 
   public String getType()
   {
     return this.type;
   }
 
   public void setType(String type) {
     this.type = type;
   }
 
   public String getPower() {
     return this.power;
   }
 
   public void setPower(String power) {
     this.power = power;
   }
 
   public Component getBean(ValueStack vs, HttpServletRequest request, HttpServletResponse response)
   {
     return new Button(vs, request, response);
   }
 
   protected void populateParams() {
     super.populateParams();
     Button obj = (Button)this.component;
     obj.setPower(this.power);
     if (null == this.type)
       obj.setType(this.type);
   }
 }

