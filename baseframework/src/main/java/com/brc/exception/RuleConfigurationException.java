 package com.brc.exception;
 
 public class RuleConfigurationException extends RuntimeException
 {
   public RuleConfigurationException()
   {
   }
 
   public RuleConfigurationException(String s)
   {
     super(s);
   }
 
   public RuleConfigurationException(String s, Throwable throwable) {
     super(s, throwable);
   }
 
   public RuleConfigurationException(Throwable throwable) {
     super(throwable);
   }
 }

