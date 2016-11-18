 package com.brc.client.taglib;
 
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.views.annotations.StrutsTag;
 import org.apache.struts2.views.annotations.StrutsTagAttribute;
 
 @StrutsTag(name="InputTextTDLabel", tldTagClass="com.brc.client.taglib.InputTextTDLabel", description="input tag for Wrapper ")
 public class InputTextTDLabel extends InputText
 {
   protected String colspan;
 
   @StrutsTagAttribute(description="colspan", type="Integer")
   public void setColspan(String colspan)
   {
     this.colspan = colspan;
   }
 
   public InputTextTDLabel(ValueStack stack, HttpServletRequest request, HttpServletResponse response)
   {
     super(stack, request, response);
   }
 
   protected String getDefaultTemplate()
   {
     return "inputTextTDLabel";
   }
 
   protected void evaluateExtraParams()
   {
     super.evaluateExtraParams();
     if (null != this.colspan)
       addParameter("colspan", findValue(this.colspan, Integer.class));
   }
 }

