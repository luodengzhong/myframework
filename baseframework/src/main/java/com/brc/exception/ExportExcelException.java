 package com.brc.exception;
 
 public class ExportExcelException extends ApplicationException
 {
   public ExportExcelException()
   {
   }
 
   public ExportExcelException(String s)
   {
     super(s);
   }
 
   public ExportExcelException(String s, Throwable throwable) {
     super(s, throwable);
   }
 
   public ExportExcelException(Throwable throwable) {
     super(throwable);
   }
 }

