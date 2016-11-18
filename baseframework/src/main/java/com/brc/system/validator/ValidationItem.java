 package com.brc.system.validator;
 
 public class ValidationItem
 {
   private String fieldName;
   private String displayName;
   private ValidationKind kind;
 
   public String getFieldName()
   {
     return this.fieldName;
   }
 
   public void setFieldName(String fieldName) {
     this.fieldName = fieldName;
   }
 
   public String getDisplayName() {
     return this.displayName;
   }
 
   public void setDisplayName(String displayName) {
     this.displayName = displayName;
   }
 
   public ValidationKind getKind() {
     return this.kind;
   }
 
   public void setKind(ValidationKind kind) {
     this.kind = kind;
   }
 
   public boolean isNotNull() {
     return ValidationKind.isNotNull(this.kind);
   }
 
   public boolean isUnique() {
     return ValidationKind.isUnique(this.kind);
   }
 
   public ValidationItem(String fieldName, String displayName, ValidationKind kind) {
     this.fieldName = fieldName;
     this.displayName = displayName;
     this.kind = kind;
   }
 }

