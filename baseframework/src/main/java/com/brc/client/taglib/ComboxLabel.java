 package com.brc.client.taglib;
 
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.views.annotations.StrutsTag;
 import org.apache.struts2.views.annotations.StrutsTagAttribute;
 
 @StrutsTag(name="ComboxLabel", tldTagClass="com.brc.client.taglib.ComboxLabel", description="input tag for Wrapper ")
 public class ComboxLabel extends Combox
 {
   protected String width;
   protected String labelWidth;
 
   @StrutsTagAttribute(description="width", type="Integer")
   public void setWidth(String width)
   {
     this.width = width;
   }
 
   @StrutsTagAttribute(description="labelWidth", type="Integer")
   public void setLabelWidth(String labelWidth) {
     this.labelWidth = labelWidth;
   }
 
   public ComboxLabel(ValueStack stack, HttpServletRequest request, HttpServletResponse response)
   {
     super(stack, request, response);
   }
 
   protected String getDefaultTemplate()
   {
     return "comboxLabel";
   }
 
   public void evaluateExtraParams()
   {
     super.evaluateExtraParams();
     if (null != this.width) {
       addParameter("width", findValue(this.width, Integer.class));
     }
     if (null != this.labelWidth)
       addParameter("labelWidth", findValue(this.labelWidth, Integer.class));
   }
 }

