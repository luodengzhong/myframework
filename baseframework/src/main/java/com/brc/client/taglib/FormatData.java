 package com.brc.client.taglib;
 
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.components.UIBean;
 import org.apache.struts2.views.annotations.StrutsTag;
 import org.apache.struts2.views.annotations.StrutsTagAttribute;
 
 @StrutsTag(name="FormatData", tldTagClass="com.brc.client.taglib.FormatData", description="FormatData")
 public class FormatData extends UIBean
 {
   private String type;
 
   public String getType()
   {
     return this.type;
   }
 
   @StrutsTagAttribute(description="type", type="String")
   public void setType(String type) {
     this.type = type;
   }
 
   public FormatData(ValueStack vs, HttpServletRequest req, HttpServletResponse res) {
     super(vs, req, res);
   }
 
   protected String getDefaultTemplate() {
     return "formatData";
   }
 
   protected void evaluateExtraParams() {
     super.evaluateExtraParams();
     String expr = completeExpressionIfAltSyntax(this.name);
     Object obj = findValue(expr);
     Object formatData = TaglibUtil.formatData(obj, this.type);
     addParameter("nameValue", formatData);
   }
 }

