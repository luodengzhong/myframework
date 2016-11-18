 package com.brc.client.taglib;
 
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.components.Component;
 import org.apache.struts2.views.jsp.ui.RadioTag;
 
 public class InputRadioTag extends RadioTag
 {
   private static final long serialVersionUID = 1L;
   protected String dictionary;
   protected String filter;
   protected String required;
 
   public void setDictionary(String dictionary)
   {
     this.dictionary = dictionary;
   }
 
   public void setFilter(String filter) {
     this.filter = filter;
   }
 
   public void setRequired(String required) {
     this.required = required;
   }
 
   public Component getBean(ValueStack stack, HttpServletRequest request, HttpServletResponse response)
   {
     return new InputRadio(stack, request, response);
   }
 
   protected void populateParams()
   {
     super.populateParams();
     InputRadio obj = (InputRadio)this.component;
     obj.setFilter(this.filter);
     obj.setDictionary(this.dictionary);
     obj.setRequired(this.required);
   }
 }

