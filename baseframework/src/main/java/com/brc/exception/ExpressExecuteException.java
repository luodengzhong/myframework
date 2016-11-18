 package com.brc.exception;
 
 public class ExpressExecuteException extends ApplicationException
 {
   public ExpressExecuteException()
   {
   }
 
   public ExpressExecuteException(String s)
   {
     super(s);
   }
 
   public ExpressExecuteException(String s, Throwable throwable) {
     super(s, throwable);
   }
 
   public ExpressExecuteException(Throwable throwable) {
     super(throwable);
   }
 }

