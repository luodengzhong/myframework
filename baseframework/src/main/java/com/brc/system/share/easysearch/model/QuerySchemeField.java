 package com.brc.system.share.easysearch.model;
 
 import java.io.Serializable;
 
 public class QuerySchemeField
   implements Serializable
 {
   private String name;
   private String code;
   private String type;
   private String mask;
   private int sequence = 1;
   private String align;
   private Long width;
   private String dictionary;
   private boolean isCondition;
 
   public QuerySchemeField()
   {
   }
 
   public QuerySchemeField(String name, String code, String type, String mask, int sequence, String align, String dictionary)
   {
     this.name = name;
     this.code = code;
     this.type = type;
     this.mask = mask;
     this.sequence = sequence;
     this.align = align;
     this.dictionary = dictionary;
   }
 
   public int getSequence() {
     return this.sequence;
   }
 
   public void setSequence(int sequence) {
     this.sequence = sequence;
   }
 
   public String getCode() {
     return this.code;
   }
 
   public void setCode(String code) {
     this.code = code;
   }
 
   public String getMask() {
     return this.mask;
   }
 
   public void setMask(String mask) {
     this.mask = mask;
   }
 
   public String getName() {
     return this.name;
   }
 
   public void setName(String name) {
     this.name = name;
   }
 
   public String getType() {
     return this.type;
   }
 
   public void setType(String type) {
     this.type = type;
   }
 
   public String getAlign() {
     return this.align;
   }
 
   public void setAlign(String align) {
     this.align = align;
   }
 
   public Long getWidth() {
     return this.width;
   }
 
   public void setWidth(Long width) {
     this.width = width;
   }
 
   public String getDictionary() {
     return this.dictionary;
   }
 
   public void setDictionary(String dictionary) {
     this.dictionary = dictionary;
   }
 
   public boolean isCondition() {
     return this.isCondition;
   }
 
   public void setCondition(boolean isCondition) {
     this.isCondition = isCondition;
   }
 }

