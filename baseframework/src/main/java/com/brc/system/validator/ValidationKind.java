 package com.brc.system.validator;
 
 public enum ValidationKind
 {
   NOT_NULL, UNIQUE, NOT_NULL_AND_UNIQUE;
 
   public static boolean isNotNull(ValidationKind kind)
   {
     return (kind == NOT_NULL) || (kind == NOT_NULL_AND_UNIQUE);
   }
 
   public static boolean isUnique(ValidationKind kind)
   {
     return (kind == UNIQUE) || (kind == NOT_NULL_AND_UNIQUE);
   }
 }

