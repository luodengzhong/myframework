 package com.brc.system.dictionary.model;
 
 import java.io.Serializable;
 
 public class DictionaryModel
   implements Serializable
 {
   private static final long serialVersionUID = -3062010881704917833L;
   protected String code;
   protected String value;
   protected String name;
   protected String remark;
   protected String type;
 
   public String getCode()
   {
     return this.code;
   }
 
   public void setCode(String code) {
     this.code = code;
   }
 
   public String getValue()
   {
     return this.value;
   }
 
   public void setValue(String value) {
     this.value = value;
   }
 
   public String getName()
   {
     return this.name;
   }
 
   public void setName(String name) {
     this.name = name;
   }
 
   public String getRemark()
   {
     return this.remark;
   }
 
   public void setRemark(String remark) {
     this.remark = remark;
   }
 
   public String getType()
   {
     return this.type;
   }
 
   public void setType(String type) {
     this.type = type;
   }
 }

