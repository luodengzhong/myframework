 package com.brc.client.taglib;
 
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.components.Component;
 import org.apache.struts2.views.jsp.ui.AbstractUITag;
 
 public class LayoutTag extends AbstractUITag
 {
   private String proportion;
   private String average;
 
   public String getProportion()
   {
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
 
   public Component getBean(ValueStack vs, HttpServletRequest request, HttpServletResponse response)
   {
     return new Layout(vs, request, response);
   }
 
   protected void populateParams() {
     super.populateParams();
     Layout obj = (Layout)this.component;
     String[] proportions = null;
     if ((null == this.proportion) || (this.proportion.trim().equals(""))) {
       if ((null == this.average) || (this.average.trim().equals(""))) {
         proportions = "14%,19%,14%,19%,14%,19%".split(",");
       } else {
         Integer avg = Integer.valueOf(this.average);
         if (avg.intValue() < 100) {
           int i = 100 / avg.intValue();
           proportions = new String[avg.intValue()];
           for (int j = 0; j < avg.intValue(); j++)
             proportions[j] = (String.valueOf(i) + "%");
         }
       }
     }
     else {
       proportions = this.proportion.split(",");
     }
     obj.setProportions(proportions);
   }
 }

