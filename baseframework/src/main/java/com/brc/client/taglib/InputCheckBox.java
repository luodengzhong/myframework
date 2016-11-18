 package com.brc.client.taglib;
 
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.components.Checkbox;
 import org.apache.struts2.views.annotations.StrutsTag;
 import org.apache.struts2.views.annotations.StrutsTagAttribute;
 
 @StrutsTag(name="InputCheckBox", tldTagClass="com.brc.client.taglib.InputCheckBox", description="input check box tag for Wrapper ")
 public class InputCheckBox extends Checkbox
 {
   protected String checked;
 
   @StrutsTagAttribute(description="checked", type="Boolean", defaultValue="false")
   public void setChecked(String checked)
   {
     this.checked = checked;
   }
 
   public InputCheckBox(ValueStack stack, HttpServletRequest request, HttpServletResponse response)
   {
     super(stack, request, response);
   }
 
   protected String getDefaultTemplate()
   {
     return "inputCheckBox";
   }
 
   protected Class getValueClassType() {
     return String.class;
   }
 
   public void evaluateExtraParams() {
     super.evaluateExtraParams();
     if (this.value == null) {
       this.value = "1";
     }
     addParameter("value", this.value);
     if (this.name != null) {
       String expr = completeExpressionIfAltSyntax(this.name);
       Object v = findValue(expr);
       if (v != null) {
         String[] vs = v.toString().split(",");
         for (String t : vs) {
           if (t.equals(this.value)) {
             addParameter("checked", Boolean.valueOf(true));
             break;
           }
         }
       }
     }
     if (null != this.checked) {
       addParameter("checked", findValue(this.checked, Boolean.class));
     }
     if (null == this.id)
       addParameter("id", null);
   }
 }

