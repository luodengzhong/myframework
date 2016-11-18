 package com.brc.exception;
 
 public class ApplicationException extends RuntimeException
 {
   private static final long serialVersionUID = 1L;
 
   public ApplicationException()
   {
   }
 
   public ApplicationException(String s)
   {
     super(s);
   }
 
   public ApplicationException(String s, Throwable throwable) {
     super(s, throwable);
   }
 
   public ApplicationException(Throwable throwable) {
     super(throwable);
   }
 }

