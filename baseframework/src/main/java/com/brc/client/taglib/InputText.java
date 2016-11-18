 package com.brc.client.taglib;
 
 import com.brc.util.StringUtil;
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.components.TextField;
 import org.apache.struts2.views.annotations.StrutsTag;
 import org.apache.struts2.views.annotations.StrutsTagAttribute;
 
 @StrutsTag(name="InputText", tldTagClass="com.brc.client.taglib.InputText", description="input tag for Wrapper")
 public class InputText extends TextField
 {
   protected String wrapper;
   protected String mask;
   protected String required;
   protected String match;
   protected String dataOptions;
 
   @StrutsTagAttribute(description="wrapper", type="String")
   public void setWrapper(String wrapper)
   {
     this.wrapper = wrapper;
   }
 
   @StrutsTagAttribute(description="mask", type="String")
   public void setMask(String mask) {
     this.mask = mask;
   }
 
   @StrutsTagAttribute(description="required", type="Boolean", defaultValue="false")
   public void setRequired(String required) {
     this.required = required;
   }
 
   @StrutsTagAttribute(description="match", type="String")
   public void setMatch(String match) {
     this.match = match;
   }
 
   @StrutsTagAttribute(description="dataOptions", type="String")
   public void setDataOptions(String dataOptions) {
     this.dataOptions = dataOptions;
   }
 
   public InputText(ValueStack stack, HttpServletRequest request, HttpServletResponse response) {
     super(stack, request, response);
   }
 
   protected String getDefaultTemplate()
   {
     return "inputText";
   }
 
   protected void evaluateExtraParams()
   {
     super.evaluateExtraParams();
     String valueMask = null;
     if (null != this.wrapper) {
       addParameter("wrapper", this.wrapper);
       if ((this.wrapper.equals("date")) || (this.wrapper.equalsIgnoreCase("dateTime"))) valueMask = this.wrapper;
     }
     if (null != this.mask) {
       valueMask = findString(this.mask);
       addParameter("mask", valueMask);
     }
     if (!StringUtil.isBlank(valueMask)) {
       String expr = completeExpressionIfAltSyntax(this.name);
       Object obj = findValue(expr);
       Object formatData = TaglibUtil.formatData(obj, valueMask);
       addParameter("nameValue", formatData);
     }
     if (null != this.required) {
       addParameter("required", findValue(this.required, Boolean.class));
     }
     if (null != this.match) {
       addParameter("match", this.match);
     }
     if (null != this.dataOptions)
       addParameter("dataOptions", this.dataOptions);
   }
 }

