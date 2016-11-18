 package com.brc.client.taglib;
 
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.components.Component;
 
 public class InputTextTDLabelTag extends InputTextTag
 {
   private static final long serialVersionUID = 1L;
   protected String colspan = "1";
 
   public String getColspan() {
     return this.colspan;
   }
 
   public void setColspan(String colspan) {
     this.colspan = colspan;
   }
 
   public Component getBean(ValueStack stack, HttpServletRequest request, HttpServletResponse response)
   {
     return new InputTextTDLabel(stack, request, response);
   }
 
   protected void populateParams()
   {
     super.populateParams();
     InputTextTDLabel obj = (InputTextTDLabel)this.component;
     obj.setColspan(this.colspan);
   }
 }

