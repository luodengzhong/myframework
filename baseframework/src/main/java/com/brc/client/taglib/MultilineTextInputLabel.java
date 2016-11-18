 package com.brc.client.taglib;
 
 import com.brc.util.ClassHelper;
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.views.annotations.StrutsTag;
 import org.apache.struts2.views.annotations.StrutsTagAttribute;
 
 @StrutsTag(name="MultilineTextInputLabel", tldTagClass="com.brc.client.taglib.MultilineTextInputLabel", description="textarea tag for Wrapper ")
 public class MultilineTextInputLabel extends MultilineTextInput
 {
   protected String width;
   protected String height;
   protected String labelWidth;
 
   @StrutsTagAttribute(description="width", type="Integer")
   public void setWidth(String width)
   {
     this.width = width;
   }
 
   @StrutsTagAttribute(description="height", type="Integer")
   public void setHeight(String height) {
     this.height = height;
   }
 
   @StrutsTagAttribute(description="labelWidth", type="Integer")
   public void setLabelWidth(String labelWidth) {
     this.labelWidth = labelWidth;
   }
 
   public MultilineTextInputLabel(ValueStack stack, HttpServletRequest request, HttpServletResponse response)
   {
     super(stack, request, response);
   }
 
   protected String getDefaultTemplate()
   {
     return "multilineTextInputLabel";
   }
 
   public void evaluateExtraParams()
   {
     super.evaluateExtraParams();
     if (null != this.width) {
       addParameter("width", findValue(this.width, Integer.class));
     }
     if (null != this.rows) {
       Integer height = Integer.valueOf(((Integer)ClassHelper.convert(this.rows, Integer.class, Integer.valueOf(1))).intValue() * 15);
       addParameter("height", height);
     }
     if (null != this.height) {
       addParameter("height", findValue(this.height, Integer.class));
     }
     if (null != this.labelWidth)
       addParameter("labelWidth", findValue(this.labelWidth, Integer.class));
   }
 }

