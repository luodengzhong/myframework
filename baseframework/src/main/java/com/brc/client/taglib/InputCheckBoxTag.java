 package com.brc.client.taglib;
 
 import com.opensymphony.xwork2.util.ValueStack;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.struts2.components.Component;
 import org.apache.struts2.views.jsp.ui.CheckboxTag;
 
 public class InputCheckBoxTag extends CheckboxTag
 {
   protected String checked;
   private static final long serialVersionUID = 1L;
 
   public String getChecked()
   {
     return this.checked;
   }
 
   public void setChecked(String checked) {
     this.checked = checked;
   }
 
   public Component getBean(ValueStack stack, HttpServletRequest request, HttpServletResponse response)
   {
     return new InputCheckBox(stack, request, response);
   }
 
   protected void populateParams() {
     super.populateParams();
     InputCheckBox obj = (InputCheckBox)this.component;
     obj.setChecked(this.checked);
   }
 }

