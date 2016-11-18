 package com.brc.client.taglib;
 
 import com.brc.util.ClassHelper;
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.components.TextArea;
 import org.apache.struts2.views.annotations.StrutsTag;
 import org.apache.struts2.views.annotations.StrutsTagAttribute;
 
 @StrutsTag(name="MultilineTextInput", tldTagClass="com.brc.client.taglib.MultilineTextInput", description="textarea tag for Wrapper")
 public class MultilineTextInput extends TextArea
 {
   protected String required;
   protected String maxlength;
 
   @StrutsTagAttribute(description="maxlength", type="Integer")
   public void setMaxlength(String maxlength)
   {
     this.maxlength = maxlength;
   }
 
   @StrutsTagAttribute(description="required", type="Boolean", defaultValue="false")
   public void setRequired(String required) {
     this.required = required;
   }
 
   public MultilineTextInput(ValueStack stack, HttpServletRequest request, HttpServletResponse response)
   {
     super(stack, request, response);
   }
 
   protected String getDefaultTemplate()
   {
     return "multilineTextInput";
   }
 
   public void evaluateExtraParams()
   {
     super.evaluateExtraParams();
     if (null != this.required) {
       addParameter("required", findValue(this.required, Boolean.class));
     }
     if (null != this.maxlength) {
       addParameter("maxlength", findValue(this.maxlength, Integer.class));
     }
     if (null != this.disabled) {
       addParameter("disabled", findValue(this.disabled, Boolean.class));
     }
     if (null != this.rows) {
       Integer height = Integer.valueOf(((Integer)ClassHelper.convert(this.rows, Integer.class, Integer.valueOf(1))).intValue() * 15);
       if (null != this.cssStyle)
         this.cssStyle = ("height:" + height + "px;" + this.cssStyle);
       else {
         this.cssStyle = ("height:" + height + "px;");
       }
       addParameter("cssStyle", this.cssStyle);
     }
   }
 }

