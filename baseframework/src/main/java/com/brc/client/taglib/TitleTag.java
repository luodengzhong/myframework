 package com.brc.client.taglib;
 
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.components.Component;
 import org.apache.struts2.views.annotations.StrutsTagAttribute;
 import org.apache.struts2.views.jsp.ui.AbstractUITag;
 
 public class TitleTag extends AbstractUITag
 {
   protected String hideTable;
   protected String needLine;
   protected String hideIndex;
 
   public String getHideTable()
   {
     return this.hideTable;
   }
 
   @StrutsTagAttribute(description="hideTable", type="String")
   public void setHideTable(String hideTable) {
     this.hideTable = hideTable;
   }
 
   @StrutsTagAttribute(description="needLine", type="Boolean", defaultValue="false")
   public void setNeedLine(String needLine) {
     this.needLine = needLine;
   }
 
   @StrutsTagAttribute(description="hideTable", type="String")
   public void setHideIndex(String hideIndex) {
     this.hideIndex = hideIndex;
   }
 
   public Component getBean(ValueStack vs, HttpServletRequest request, HttpServletResponse response)
   {
     return new Title(vs, request, response);
   }
 
   protected void populateParams() {
     super.populateParams();
     Title title = (Title)this.component;
     title.setHideTable(this.hideTable);
     title.setNeedLine(this.needLine);
     title.setHideIndex(this.hideIndex);
   }
 }

