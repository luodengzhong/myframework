 package com.brc.system.share.service.model;
 
 public class UserScreenFunction
 {
   protected Long screenId;
   protected String functionId;
   protected String title;
   protected String icon;
   protected String location;
 
   public Long getScreenId()
   {
     return this.screenId;
   }
 
   public void setScreenId(Long screenId) {
     this.screenId = screenId;
   }
 
   public String getFunctionId() {
     return this.functionId;
   }
 
   public void setFunctionId(String functionId) {
     this.functionId = functionId;
   }
 
   public String getIcon() {
     return this.icon;
   }
 
   public void setIcon(String icon) {
     if ((icon == null) || (icon.equals("")))
       this.icon = "/desktop/images/default.png";
     else
       this.icon = icon;
   }
 
   public String getLocation()
   {
     return this.location;
   }
 
   public void setLocation(String location) {
     this.location = location;
   }
 
   public String getTitle() {
     return this.title;
   }
 
   public void setTitle(String title) {
     this.title = title;
   }
 }

