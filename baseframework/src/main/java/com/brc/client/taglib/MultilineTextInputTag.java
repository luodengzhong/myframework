 package com.brc.client.taglib;
 
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.components.Component;
 import org.apache.struts2.views.jsp.ui.TextareaTag;
 
 public class MultilineTextInputTag extends TextareaTag
 {
   private static final long serialVersionUID = -4506587928277134021L;
   protected String maxlength;
   protected String required;
 
   public Component getBean(ValueStack stack, HttpServletRequest request, HttpServletResponse response)
   {
     return new MultilineTextInput(stack, request, response);
   }
 
   protected void populateParams()
   {
     super.populateParams();
     MultilineTextInput obj = (MultilineTextInput)this.component;
     obj.setMaxlength(this.maxlength);
     obj.setRequired(this.required);
     if (null == this.cssClass) {
       obj.setCssClass("textarea");
     }
     if (this.disabled != null) {
       Boolean flag = (Boolean)findValue(this.disabled, Boolean.class);
       if (flag.booleanValue()) {
         obj.setCssClass("textareaReadonly");
         obj.setReadonly("true");
         obj.setDisabled("false");
         obj.setDisabled("true");
       }
     }
   }
 
   public void setRequired(String required) {
     this.required = required;
   }
 
   public void setMaxlength(String maxlength) {
     this.maxlength = maxlength;
   }
 }

