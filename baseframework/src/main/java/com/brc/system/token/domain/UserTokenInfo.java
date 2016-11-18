 package com.brc.system.token.domain;
 
 import java.io.Serializable;
 import java.util.HashMap;
 import java.util.Map;
 
 public class UserTokenInfo
   implements Serializable
 {
   private static final long serialVersionUID = 1L;
   private final String token;
   private final String contactId;
   private final String mobile;
   private final boolean isTest;
   private final String ip;
   private long lastUpdateTtime;
   private final Map<String, Object> attributes = new HashMap();
 
   public Map<String, Object> getAttributes() {
     return this.attributes;
   }
 
   public UserTokenInfo(String token, String contactId, String mobile, boolean isTest, String ip, long lastUpdateTtime) {
     this.token = token;
     this.contactId = contactId;
     this.mobile = mobile;
     this.isTest = isTest;
     this.ip = ip;
     this.lastUpdateTtime = lastUpdateTtime;
   }
 
   public boolean isTest() {
     return this.isTest;
   }
 
   public String getContactId() {
     return this.contactId;
   }
 
   public String getMobile()
   {
     return this.mobile;
   }
 
   public String getToken() {
     return this.token;
   }
 
   public void setLastUpdateTtime(long lastUpdateTtime) {
     this.lastUpdateTtime = lastUpdateTtime;
   }
 
   public long getLastUpdateTtime() {
     return this.lastUpdateTtime;
   }
 
   public String getIp() {
     return this.ip;
   }
 
   public String toString()
   {
     return "UserTokenInfo [token=" + this.token + ", mobile=" + this.mobile + ", lastUpdateTtime=" + this.lastUpdateTtime + "]";
   }
 }

