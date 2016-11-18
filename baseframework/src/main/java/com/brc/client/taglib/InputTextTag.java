 package com.brc.client.taglib;
 
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.components.Component;
 import org.apache.struts2.views.jsp.ui.TextFieldTag;
 
 public class InputTextTag extends TextFieldTag
 {
   private static final long serialVersionUID = -4506587928277134021L;
   protected String wrapper;
   protected String mask;
   protected String property;
   protected String required;
   protected String match;
   protected String dataOptions;
 
   public Component getBean(ValueStack stack, HttpServletRequest request, HttpServletResponse response)
   {
     return new InputText(stack, request, response);
   }
 
   protected void populateParams()
   {
     super.populateParams();
     InputText obj = (InputText)this.component;
     obj.setWrapper(this.wrapper);
     obj.setMask(this.mask);
     obj.setRequired(this.required);
     obj.setMatch(this.match);
     obj.setDataOptions(this.dataOptions);
     if ((null == this.name) && (null != this.property)) {
       obj.setName(this.property);
     }
     if (null == this.cssClass)
       obj.setCssClass("text");
   }
 
   public void setWrapper(String wrapper)
   {
     this.wrapper = wrapper;
   }
 
   public void setMask(String mask) {
     this.mask = mask;
   }
 
   public void setProperty(String property) {
     this.property = property;
   }
 
   public void setRequired(String required) {
     this.required = required;
   }
 
   public String getMatch() {
     return this.match;
   }
 
   public void setMatch(String match) {
     this.match = match;
   }
 
   public String getDataOptions() {
     return this.dataOptions;
   }
 
   public void setDataOptions(String dataOptions) {
     this.dataOptions = dataOptions;
   }
 }

