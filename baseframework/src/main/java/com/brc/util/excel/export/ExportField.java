 package com.brc.util.excel.export;
 
 public class ExportField
 {
   private String title;
   private String field;
   private String type;
   private int index;
   private String dictionary;
   private String backgroundColor;
 
   public String getField()
   {
     return this.field;
   }
 
   public String getTitle() {
     return this.title;
   }
 
   public String getType() {
     return this.type;
   }
 
   public Integer getIndex() {
     return Integer.valueOf(this.index);
   }
 
   public String getDictionary() {
     return this.dictionary;
   }
 
   public void setDictionary(String dictionary) {
     this.dictionary = dictionary;
   }
 
   public void setTitle(String title) {
     this.title = title;
   }
 
   public void setField(String field) {
     this.field = field;
   }
 
   public void setType(String type) {
     if (type == null)
       this.type = "string";
     else
       this.type = type;
   }
 
   public void setIndex(int index)
   {
     this.index = index;
   }
 
   public String getBackgroundColor() {
     return this.backgroundColor;
   }
 
   public void setBackgroundColor(String backgroundColor) {
     this.backgroundColor = backgroundColor;
   }
 }

