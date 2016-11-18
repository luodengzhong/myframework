 package com.brc.exception;
 
 public class SQLParseException extends ApplicationException
 {
   public SQLParseException()
   {
   }
 
   public SQLParseException(String s)
   {
     super(s);
   }
 
   public SQLParseException(String s, Throwable throwable) {
     super(s, throwable);
   }
 
   public SQLParseException(Throwable throwable) {
     super(throwable);
   }
 }

