 package com.brc.system.opm;
 
 public class OrgException extends RuntimeException
 {
   private static final long serialVersionUID = -4240953176441207682L;
 
   public OrgException()
   {
   }
 
   public OrgException(String message)
   {
     super(message);
   }
 
   public OrgException(Throwable cause) {
     super(cause);
   }
 
   public OrgException(String message, Throwable cause) {
     super(message, cause);
   }
 }

