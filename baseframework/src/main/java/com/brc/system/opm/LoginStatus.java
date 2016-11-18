 package com.brc.system.opm;
 
 import com.brc.exception.ApplicationException;
 
 public enum LoginStatus
 {
   UNKOWN_ERROR(0, "未知错误"), 
   SUCCESS(1, "验证成功"), 
   USER_NOT_EXIST(2, "用户不存在"), 
   PASSWORD_ERROR(3, "密码错误"), 
   USER_DSIABLED(4, "用户已禁用"), 
   USER_LOGIC_DELETE(5, "用户已删除"), 
   PARAM_ERROR(6, "参数错误");
 
   private final int id;
   private final String message;
 
   private LoginStatus(int id, String message) {
     this.id = id;
     this.message = message;
   }
 
   public static LoginStatus fromNumber(int id) {
     switch (id) {
     case 0:
       return UNKOWN_ERROR;
     case 1:
       return SUCCESS;
     case 2:
       return USER_NOT_EXIST;
     case 3:
       return PASSWORD_ERROR;
     case 4:
       return USER_DSIABLED;
     case 5:
       return USER_LOGIC_DELETE;
     case 6:
       return PARAM_ERROR;
     }
     throw new ApplicationException(String.format("无效的登录状态“%s”！", new Object[] { Integer.valueOf(id) }));
   }
 
   public String toString()
   {
     return String.valueOf(this.id);
   }
 
   public int toId() {
     return this.id;
   }
 
   public String getMessage() {
     return this.message;
   }
 }

