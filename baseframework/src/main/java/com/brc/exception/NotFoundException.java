 package com.brc.exception;
 
 import java.io.PrintStream;
 
 public class NotFoundException extends RuntimeException
 {
   protected Exception exception;
   protected boolean fatal;
 
   public NotFoundException()
   {
   }
 
   public NotFoundException(String s)
   {
     super(s);
   }
 
   public NotFoundException(Exception exception1) {
     this(exception1, exception1.getMessage());
   }
 
   public NotFoundException(Exception exception1, String s) {
     super(s);
     this.exception = exception1;
   }
 
   public NotFoundException(Exception exception1, String s, boolean flag) {
     this(exception1, s);
     setFatal(flag);
   }
 
   public boolean isFatal() {
     return this.fatal;
   }
 
   public void setFatal(boolean flag) {
     this.fatal = flag;
   }
 
   public void printStackTrace() {
     super.printStackTrace();
     if (this.exception != null)
       this.exception.printStackTrace();
   }
 
   public void printStackTrace(PrintStream printstream) {
     super.printStackTrace(printstream);
     if (this.exception != null)
       this.exception.printStackTrace(printstream);
   }
 
   public String toString() {
     if (this.exception != null) {
       return super.toString() + " wraps: [" + this.exception.toString() + "]";
     }
     return super.toString();
   }
 }

