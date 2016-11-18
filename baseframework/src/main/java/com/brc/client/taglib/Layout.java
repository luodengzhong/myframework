 package com.brc.client.taglib;
 
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.components.UIBean;
 import org.apache.struts2.views.annotations.StrutsTag;
 
 @StrutsTag(name="Layout", tldTagClass="com.brc.client.taglib.Layout", description="Layout")
 public class Layout extends UIBean
 {
   private String[] proportions;
 
   public void setProportions(String[] proportions)
   {
     this.proportions = proportions;
   }
 
   public Layout(ValueStack vs, HttpServletRequest req, HttpServletResponse res) {
     super(vs, req, res);
   }
 
   protected String getDefaultTemplate() {
     return "layout";
   }
 
   protected void evaluateExtraParams() {
     if (null != this.proportions) {
       addParameter("proportions", this.proportions);
     }
     super.evaluateExtraParams();
   }
 }

