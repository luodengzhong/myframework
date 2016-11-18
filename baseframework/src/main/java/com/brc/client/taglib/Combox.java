 package com.brc.client.taglib;
 
 import com.brc.util.ClassHelper;
 import com.brc.util.DictUtil;
 import com.brc.util.StringUtil;
 import com.opensymphony.xwork2.util.ValueStack;
 import java.util.HashMap;
 import java.util.Map;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.components.Select;
 import org.apache.struts2.views.annotations.StrutsTag;
 import org.apache.struts2.views.annotations.StrutsTagAttribute;
 
 @StrutsTag(name="Combox", tldTagClass="com.brc.client.taglib.Combox", description="input tag for Wrapper")
 public class Combox extends Select
 {
   protected String required;
   protected String dictionary;
   protected String filter;
 
   @StrutsTagAttribute(description="required", type="Boolean", defaultValue="false")
   public void setRequired(String required)
   {
     this.required = required;
   }
 
   @StrutsTagAttribute(description="dictionary", type="String")
   public void setDictionary(String dictionary) {
     this.dictionary = dictionary;
   }
 
   @StrutsTagAttribute(description="filter", type="String")
   public void setFilter(String filter) {
     this.filter = filter;
   }
 
   public Combox(ValueStack stack, HttpServletRequest request, HttpServletResponse response) {
     super(stack, request, response);
   }
 
   protected String getDefaultTemplate()
   {
     return "combox";
   }
 
   public void evaluateExtraParams()
   {
     setListParams();
     super.evaluateExtraParams();
     if (null != this.required) {
       addParameter("required", findValue(this.required, Boolean.class));
     }
     if ((null != this.disabled) && (this.disabled.endsWith("true")) && (this.list != null)) {
       Object obj = this.list;
       if ((this.list instanceof String)) {
         obj = findValue(this.list.toString());
       }
       if (null == obj) {
         return;
       }
       if (ClassHelper.isInterface(obj.getClass(), Map.class)) {
         Map m = (Map)obj;
         Object v = getParameters().get("nameValue");
         v = v != null ? (String)m.get(v.toString()) : "";
         addParameter("showValue", v);
       }
     }
   }
 
   private void setListParams() {
     String dictionaryName = this.dictionary;
     if (StringUtil.isBlank(dictionaryName)) {
       dictionaryName = this.name;
     }
     if ((this.list == null) && (!StringUtil.isBlank(dictionaryName))) {
       this.list = DictUtil.getDictionary(dictionaryName, this.filter);
     }
     if ((this.list instanceof String)) {
       Object obj = findValue(this.list.toString());
       if (obj == null) {
         this.list = new HashMap(1);
       }
     }
     if (this.name != null) {
       String expr = completeExpressionIfAltSyntax(this.name);
       Object obj = findValue(expr);
       if (obj != null) {
         addParameter("nameValue", obj);
       }
     }
     if (this.listKey == null) {
       this.listKey = "key";
     }
     if (this.listValue == null) {
       this.listValue = "value";
     }
     if ((this.emptyOption == null) || (this.emptyOption.equals("true")))
       this.emptyOption = "true";
   }
 }

