 package com.brc.exception;
 
 public class PageForwardException extends ApplicationException
 {
   public PageForwardException()
   {
   }
 
   public PageForwardException(String s)
   {
     super(s);
   }
 
   public PageForwardException(String s, Throwable throwable) {
     super(s, throwable);
   }
 
   public PageForwardException(Throwable throwable) {
     super(throwable);
   }
 }

