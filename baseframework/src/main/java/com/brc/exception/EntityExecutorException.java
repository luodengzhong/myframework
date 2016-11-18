 package com.brc.exception;
 
 public class EntityExecutorException extends ApplicationException
 {
   private static final long serialVersionUID = 1L;
 
   public EntityExecutorException()
   {
   }
 
   public EntityExecutorException(String s)
   {
     super(s);
   }
 
   public EntityExecutorException(String s, Throwable throwable) {
     super(s, throwable);
   }
 
   public EntityExecutorException(Throwable throwable) {
     super(throwable);
   }
 }

