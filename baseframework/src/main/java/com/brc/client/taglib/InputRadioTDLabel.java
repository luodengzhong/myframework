 package com.brc.client.taglib;
 
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.views.annotations.StrutsTag;
 import org.apache.struts2.views.annotations.StrutsTagAttribute;
 
 @StrutsTag(name="InputRadioTDLabel", tldTagClass="com.brc.client.taglib.InputRadioTDLabel", description="input radio tag for Wrapper ")
 public class InputRadioTDLabel extends InputRadio
 {
   protected String colspan;
 
   @StrutsTagAttribute(description="colspan", type="Integer")
   public void setColspan(String colspan)
   {
     this.colspan = colspan;
   }
 
   public InputRadioTDLabel(ValueStack stack, HttpServletRequest request, HttpServletResponse response)
   {
     super(stack, request, response);
   }
 
   protected String getDefaultTemplate()
   {
     return "inputRadioTDLabel";
   }
 
   public void evaluateExtraParams()
   {
     super.evaluateExtraParams();
     if (null != this.colspan)
       addParameter("colspan", findValue(this.colspan, Integer.class));
   }
 }

