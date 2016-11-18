 package com.brc.client.taglib;
 
 import com.brc.util.Constants;
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.components.UIBean;
 import org.apache.struts2.views.annotations.StrutsTag;
 import org.apache.struts2.views.annotations.StrutsTagAttribute;
 
 @StrutsTag(name="HeadBase", tldTagClass="com.brc.client.taglib.HeadBase", description="HeadBase")
 public class HeadBase extends UIBean
 {
   private String include;
 
   public String getInclude()
   {
     return this.include;
   }
 
   @StrutsTagAttribute(description="include", type="String")
   public void setInclude(String include) {
     this.include = include;
   }
 
   public HeadBase(ValueStack vs, HttpServletRequest req, HttpServletResponse res)
   {
     super(vs, req, res);
   }
 
   protected String getDefaultTemplate() {
     return "headBase";
   }
 
   protected void evaluateExtraParams()
   {
     super.evaluateExtraParams();
     if (null != this.include) {
       String[] a = this.include.split(",");
       for (String s : a) {
         addParameter(s, Boolean.valueOf(true));
       }
     }
     addParameter("webApp", Constants.WEB_APP);
   }
 }

