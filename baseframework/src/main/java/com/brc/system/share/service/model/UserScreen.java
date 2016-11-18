 package com.brc.system.share.service.model;
 
 import java.util.ArrayList;
 import java.util.List;
 
 public class UserScreen
 {
   private Long id;
   private String personMemberId;
   private String personId;
   private List<UserScreenFunction> functions = new ArrayList();
 
   public UserScreen()
   {
   }
 
   public UserScreen(Long id) {
     this.id = id;
   }
 
   public Long getId() {
     return this.id;
   }
 
   public void setId(Long id) {
     this.id = id;
   }
 
   public String getPersonMemberId() {
     return this.personMemberId;
   }
 
   public void setPersonMemberId(String personMemberId) {
     this.personMemberId = personMemberId;
   }
 
   public String getPersonId() {
     return this.personId;
   }
 
   public void setPersonId(String personId) {
     this.personId = personId;
   }
 
   public List<UserScreenFunction> getFunctions() {
     return this.functions;
   }
 
   public void setFunctions(List<UserScreenFunction> functions) {
     this.functions = functions;
   }
 
   public void addFunction(UserScreenFunction fun) {
     this.functions.add(fun);
   }
 }

