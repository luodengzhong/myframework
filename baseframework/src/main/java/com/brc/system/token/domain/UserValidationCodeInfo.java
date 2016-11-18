 package com.brc.system.token.domain;
 
 import java.io.Serializable;
 
 public final class UserValidationCodeInfo
   implements Serializable
 {
   private static final long serialVersionUID = 1L;
   private final String mobile;
   private final String validationCode;
   private final long creationTime;
 
   public UserValidationCodeInfo(String mobile, String validationCode, long creationTime)
   {
     this.mobile = mobile;
     this.validationCode = validationCode;
     this.creationTime = creationTime;
   }
 
   public String getMobile() {
     return this.mobile;
   }
 
   public String getValidationCode() {
     return this.validationCode;
   }
 
   public long getCreationTime() {
     return this.creationTime;
   }
 
   public String toString()
   {
     return "UserValidationCodeInfo [mobile=" + this.mobile + ", validationCode=" + this.validationCode + ", creationTime=" + this.creationTime + "]";
   }
 }

