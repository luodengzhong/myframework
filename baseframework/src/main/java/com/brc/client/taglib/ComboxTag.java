 package com.brc.client.taglib;
 
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.components.Component;
 import org.apache.struts2.views.jsp.ui.SelectTag;
 
 public class ComboxTag extends SelectTag
 {
   private static final long serialVersionUID = -4506587928277134021L;
   protected String property;
   protected String required;
   protected String dictionary;
   protected String filter;
 
   public void setProperty(String property)
   {
     this.property = property;
   }
 
   public void setRequired(String required) {
     this.required = required;
   }
 
   public void setDictionary(String dictionary) {
     this.dictionary = dictionary;
   }
 
   public void setFilter(String filter) {
     this.filter = filter;
   }
 
   public Component getBean(ValueStack stack, HttpServletRequest request, HttpServletResponse response)
   {
     return new Combox(stack, request, response);
   }
 
   protected void populateParams()
   {
     super.populateParams();
     Combox obj = (Combox)this.component;
     obj.setRequired(this.required);
     if ((null == this.name) && (null != this.property)) {
       obj.setName(this.property);
     }
     if (null == this.cssClass) {
       obj.setCssClass("select");
     }
     obj.setFilter(this.filter);
     obj.setDictionary(this.dictionary);
   }
 }

