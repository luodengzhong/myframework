 package com.brc.client.session;
 
 import com.brc.exception.ApplicationException;
 import com.brc.system.opm.Operator;
 import com.brc.util.Singleton;
 import java.util.concurrent.TimeoutException;
 import net.rubyeye.xmemcached.MemcachedClient;
 import net.rubyeye.xmemcached.exception.MemcachedException;
 
 public class SessionMemcachedImpl
   implements SessionCache
 {
   private MemcachedClient cache;
 
   public void setCache(MemcachedClient cache)
   {
     this.cache = cache;
   }
 
   public Operator getOperator(String key)
   {
     try {
       Operator cachedOperator = (Operator)this.cache.get("sessionId" + key);
       if (cachedOperator != null) {
         setOperator(key, cachedOperator);
       }
       return cachedOperator;
     } catch (TimeoutException|InterruptedException|MemcachedException e) {
       throw new ApplicationException("获取缓存数据失败", e);
     }
   }
 
   public void setOperator(String key, Operator obj)
   {
     int expireTime = ((Integer)Singleton.getParameter("App.Token.ExpireTime", Integer.class)).intValue();
     try {
       this.cache.set("sessionId" + key, expireTime, obj);
     } catch (TimeoutException|InterruptedException|MemcachedException e) {
       throw new ApplicationException("设置缓存数据失败", e);
     }
   }
 }

