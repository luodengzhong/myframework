 package com.brc.client.taglib;
 
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.components.UIBean;
 import org.apache.struts2.views.annotations.StrutsTag;
 
 @StrutsTag(name="Button", tldTagClass="com.brc.client.taglib.Button", description="Button")
 public class Button extends UIBean
 {
   private String power;
   private String type;
 
   public String getPower()
   {
     return this.power;
   }
 
   public void setPower(String power) {
     this.power = power;
   }
 
   public String getType() {
     return this.type;
   }
 
   public void setType(String type) {
     this.type = type;
   }
 
   public Button(ValueStack vs, HttpServletRequest req, HttpServletResponse res) {
     super(vs, req, res);
   }
 
   protected String getDefaultTemplate() {
     return "inputButton";
   }
 
   protected void evaluateExtraParams() {
     super.evaluateExtraParams();
     if (null != this.id) {
       addParameter("id", this.id);
     }
     if (null != this.name) {
       addParameter("name", this.name);
     }
     if (null != this.type) {
       addParameter("type", this.type);
     }
     if (null != this.cssClass) {
       addParameter("cssClass", this.cssClass);
     }
     if (null != this.value) {
       addParameter("value", this.value);
     }
     if (null != this.onclick) {
       addParameter("onclick", this.onclick);
     }
     if (null != this.cssStyle)
       addParameter("cssStyle", this.cssStyle);
   }
 }

