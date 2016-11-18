 package com.brc.system.opm.domain;
 
 import com.brc.exception.ApplicationException;
 
 public enum RoleKind
 {
   FUN("fun", "功能角色"), REMIND("remind", "提醒角色");
 
   private final String id;
   private final String message;
 
   private RoleKind(String id, String message) { this.id = id;
     this.message = message; }
 
   public static RoleKind fromId(String id)
   {
     switch (id) {
     case "fun":
       return FUN;
     case "remind":
       return REMIND;
     }
     throw new ApplicationException(String.format("无效的角色类型“%s”！", new Object[] { id }));
   }
 
   public String toString()
   {
     return "RoleKind{id=" + this.id + ",message=" + this.message + " }";
   }
 
   public String getId() {
     return this.id;
   }
 
   public String getMessage() {
     return this.message;
   }
 
   public boolean isSpecifiedKind(String id) {
     return this.id.equals(id);
   }
 }

