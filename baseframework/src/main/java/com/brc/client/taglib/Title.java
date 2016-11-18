 package com.brc.client.taglib;
 
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.components.UIBean;
 import org.apache.struts2.views.annotations.StrutsTag;
 
 @StrutsTag(name="Title", tldTagClass="com.brc.client.taglib.Title", description="Title")
 public class Title extends UIBean
 {
   protected String hideTable;
   protected String needLine;
   protected String hideIndex;
 
   public String getHideTable()
   {
     return this.hideTable;
   }
 
   public void setHideTable(String hideTable) {
     this.hideTable = hideTable;
   }
 
   public String getNeedLine() {
     return this.needLine;
   }
 
   public void setNeedLine(String needLine) {
     this.needLine = needLine;
   }
 
   public String getHideIndex() {
     return this.hideIndex;
   }
 
   public void setHideIndex(String hideIndex) {
     this.hideIndex = hideIndex;
   }
 
   public Title(ValueStack vs, HttpServletRequest req, HttpServletResponse res) {
     super(vs, req, res);
   }
 
   protected String getDefaultTemplate() {
     return "title";
   }
 
   protected void evaluateExtraParams() {
     super.evaluateExtraParams();
     if (null != this.title) {
       addParameter("title", this.title);
     }
     if (null != this.id) {
       addParameter("id", this.id);
     }
     if (null != this.name) {
       addParameter("name", this.name);
     }
     if (null != this.hideTable) {
       addParameter("hideTable", this.hideTable);
     }
     if (null != this.needLine)
       addParameter("needLine", findValue(this.needLine, Boolean.class));
     else {
       addParameter("needLine", Boolean.valueOf(true));
     }
     if (null != this.hideIndex)
       addParameter("hideIndex", this.hideIndex);
   }
 }

