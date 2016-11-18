 package com.brc.client.taglib;
 
 import com.brc.util.DictUtil;
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.components.Radio;
 import org.apache.struts2.views.annotations.StrutsTag;
 import org.apache.struts2.views.annotations.StrutsTagAttribute;
 
 @StrutsTag(name="InputRadio", tldTagClass="com.brc.client.taglib.InputRadio", description="input radio tag for Wrapper ")
 public class InputRadio extends Radio
 {
   protected String dictionary;
   protected String filter;
   protected String required;
 
   @StrutsTagAttribute(description="dictionary", type="String")
   public void setDictionary(String dictionary)
   {
     this.dictionary = dictionary;
   }
 
   @StrutsTagAttribute(description="filter", type="String")
   public void setFilter(String filter) {
     this.filter = filter;
   }
 
   @StrutsTagAttribute(description="required", type="Boolean", defaultValue="false")
   public void setRequired(String required) {
     this.required = required;
   }
 
   public InputRadio(ValueStack stack, HttpServletRequest request, HttpServletResponse response) {
     super(stack, request, response);
   }
 
   protected String getDefaultTemplate()
   {
     return "inputRadio";
   }
 
   public void evaluateExtraParams() {
     if ((this.list == null) && (this.dictionary != null)) {
       this.list = DictUtil.getDictionary(this.dictionary, this.filter);
     }
     if (this.listKey == null) {
       this.listKey = "key";
     }
     if (this.listValue == null) {
       this.listValue = "value";
     }
     if (this.name != null) {
       String expr = completeExpressionIfAltSyntax(this.name);
       Object obj = findValue(expr);
       if ((obj != null) && (!obj.toString().equals(""))) {
         addParameter("nameValue", obj);
       }
     }
     if (null != this.required) {
       addParameter("required", findValue(this.required, Boolean.class));
     }
     super.evaluateExtraParams();
   }
 }

