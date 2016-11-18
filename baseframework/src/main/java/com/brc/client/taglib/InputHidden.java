 package com.brc.client.taglib;
 
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.components.Hidden;
 import org.apache.struts2.views.annotations.StrutsTag;
 import org.apache.struts2.views.annotations.StrutsTagAttribute;
 
 @StrutsTag(name="InputHidden", tldTagClass="com.brc.client.taglib.InputHidden", description="input tag for Wrapper ")
 public class InputHidden extends Hidden
 {
   private String type;
 
   @StrutsTagAttribute(description="type", type="String")
   public void setType(String type)
   {
     this.type = type;
   }
 
   public InputHidden(ValueStack stack, HttpServletRequest request, HttpServletResponse response) {
     super(stack, request, response);
   }
 
   protected String getDefaultTemplate()
   {
     return "inputHidden";
   }
 
   public void evaluateExtraParams()
   {
     if (this.name != null) {
       String expr = completeExpressionIfAltSyntax(this.name);
       Object obj = findValue(expr);
       if (obj != null) {
         Object formatData = TaglibUtil.formatData(obj, this.type);
         addParameter("nameValue", formatData);
       }
     }
     super.evaluateExtraParams();
   }
 }

