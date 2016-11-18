 package com.brc.exception;
 
 public class XmlLoadException extends ApplicationException
 {
   public XmlLoadException()
   {
   }
 
   public XmlLoadException(String s)
   {
     super(s);
   }
 
   public XmlLoadException(String s, Throwable throwable) {
     super(s, throwable);
   }
 
   public XmlLoadException(Throwable throwable) {
     super(throwable);
   }
 }

