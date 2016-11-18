 package com.brc.client.taglib;
 
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.components.Component;
 import org.apache.struts2.views.jsp.ui.AbstractUITag;
 
 public class TaskExecutionListTag extends AbstractUITag
 {
   private static final long serialVersionUID = -468174884295243151L;
   private String procUnitId;
   private String bizId;
   private String proportion;
   private String average;
   private String defaultUnitId;
   private String hasResult = "true";
 
   public String getProcUnitId() {
     return this.procUnitId;
   }
 
   public void setProcUnitId(String procUnitId) {
     this.procUnitId = procUnitId;
   }
 
   public String getBizId() {
     return this.bizId;
   }
 
   public void setBizId(String bizId) {
     this.bizId = bizId;
   }
 
   public String getProportion() {
     return this.proportion;
   }
 
   public void setProportion(String proportion) {
     this.proportion = proportion;
   }
 
   public String getAverage() {
     return this.average;
   }
 
   public void setAverage(String average) {
     this.average = average;
   }
 
   public String getDefaultUnitId() {
     return this.defaultUnitId;
   }
 
   public void setDefaultUnitId(String defaultUnitId) {
     this.defaultUnitId = defaultUnitId;
   }
 
   public String getHasResult() {
     return this.hasResult;
   }
 
   public void setHasResult(String hasResult) {
     this.hasResult = hasResult;
   }
 
   public Component getBean(ValueStack vs, HttpServletRequest request, HttpServletResponse response) {
     return new TaskExecutionList(vs, request, response);
   }
 
   protected void populateParams() {
     super.populateParams();
     TaskExecutionList obj = (TaskExecutionList)this.component;
     obj.setBizId(this.bizId);
     obj.setProcUnitId(this.procUnitId);
     obj.setDefaultUnitId(this.defaultUnitId);
     obj.setProportion(this.proportion);
     obj.setAverage(this.average);
     obj.setHasResult(this.hasResult);
   }
 }

