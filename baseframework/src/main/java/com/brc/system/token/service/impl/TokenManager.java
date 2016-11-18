 package com.brc.system.token.service.impl;
 
 import com.brc.exception.ApplicationException;
 import com.brc.system.opm.Operator;
 import com.brc.system.token.domain.UserTokenInfo;
 import com.brc.util.Singleton;
 import com.brc.util.StringUtil;
 import java.io.PrintStream;
 import java.util.Date;
 import java.util.Map;
 import java.util.UUID;
 import java.util.concurrent.TimeoutException;
 import javax.annotation.Resource;
 import net.rubyeye.xmemcached.MemcachedClient;
 import net.rubyeye.xmemcached.exception.MemcachedException;
 import org.springframework.stereotype.Component;
 
 @Component
 public final class TokenManager
 {
   public static String PREFIX_WEB = "Web_";
 
   @Resource
   private MemcachedClient xMemcachedClient;
 
   public <T> T getCache(String key) {
     try { return this.xMemcachedClient.get(key);
     } catch (TimeoutException|InterruptedException|MemcachedException e) {
       throw new ApplicationException("获取缓存数据失败。", e);
     }
   }
 
   public <T> void setCache(String key, T obj) {
     int expireTime = ((Integer)Singleton.getParameter("App.Token.ExpireTime", Integer.class)).intValue();
     try {
       this.xMemcachedClient.set(key, expireTime, obj);
     } catch (TimeoutException|InterruptedException|MemcachedException e) {
       throw new ApplicationException("设置缓存数据失败。", e);
     }
   }
 
   public void removeCache(String key) {
     try {
       this.xMemcachedClient.delete(key);
     } catch (TimeoutException|InterruptedException|MemcachedException e) {
       e.printStackTrace();
     }
   }
 
   public void remove(String token) {
     if (StringUtil.isBlank(token)) {
       return;
     }
     UserTokenInfo uti = (UserTokenInfo)getCache(token);
     removeCache(token);
     removeCache(uti.getMobile());
 
     if (!isMobile(uti.getMobile()))
       removeCache(PREFIX_WEB + token);
   }
 
   public void removeByMobile(String mobile)
   {
     try {
       UserTokenInfo uti = (UserTokenInfo)getCache(mobile);
       if (uti == null) {
         return;
       }
       String token = uti.getToken();
       remove(token);
     } catch (Exception e) {
     }
   }
 
   public boolean isMobile(String mobile) {
     return mobile.matches("^1\\d{10}$");
   }
 
   public void put(String token, UserTokenInfo userTokenInfo) {
     setCache(token, userTokenInfo);
     setCache(userTokenInfo.getMobile(), userTokenInfo);
   }
 
   public void put(String token, UserTokenInfo userTokenInfo, Operator operator) {
     put(token, userTokenInfo);
     setCache(PREFIX_WEB + token, operator);
   }
 
   public UserTokenInfo get(String token) {
     UserTokenInfo uti = (UserTokenInfo)getCache(token);
     if (uti == null) {
       return null;
     }
     getCache(uti.getMobile());
     if (!isMobile(uti.getMobile())) {
       getCache(PREFIX_WEB + token);
     }
     return uti;
   }
 
   public UserTokenInfo createAndPutFromOperator(Operator operator)
   {
     String token = UUID.randomUUID().toString().replaceAll("-", "");
 
     UserTokenInfo uti = new UserTokenInfo(token, operator.getId(), operator.getLoginName(), false, operator.getId(), new Date().getTime());
     uti.getAttributes().put("fullId", operator.getFullId());
     uti.getAttributes().put("name", operator.getName());
     uti.getAttributes().put("id", operator.getId());
     uti.getAttributes().put("oper", operator);
 
     put(token, uti, operator);
     return uti;
   }
 
   public boolean isTokenFromWeb(String token) {
     if (!StringUtil.isBlank(token)) {
       return token.indexOf(PREFIX_WEB) > -1;
     }
     return false;
   }
 
   public static void main(String[] args) {
     TokenManager m = new TokenManager();
     System.out.println(m.isMobile("17012345670"));
   }
 }

