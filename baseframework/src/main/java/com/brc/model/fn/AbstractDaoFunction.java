 package com.brc.model.fn;
 
 import com.brc.system.share.service.ServiceUtil;
 
 public abstract class AbstractDaoFunction extends AbstractFunction
 {
   protected ServiceUtil serviceUtil;
 
   public ServiceUtil getServiceUtil()
   {
     return this.serviceUtil;
   }
 
   public void setServiceUtil(ServiceUtil serviceUtil) {
     this.serviceUtil = serviceUtil;
   }
 }

