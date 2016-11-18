 package com.brc.system.attachment.model;
 
 import com.brc.system.opm.Operator;
 import com.brc.util.FileHelper;
 import com.brc.util.StringUtil;
 import com.brc.util.ThreadLocalUtil;
 import java.io.File;
 
 public class WebOfficeDTO
 {
   public String recordID = null;
 
   public String template = null;
 
   public String fileName = null;
 
   public String fileType = null;
 
   public String userName = null;
 
   public String editType = null;
 
   public String getRecordID() {
     return this.recordID;
   }
 
   public void setRecordID(String recordID) {
     this.recordID = recordID;
   }
 
   public String getTemplate() {
     return this.template;
   }
 
   public void setTemplate(String template) {
     this.template = template;
   }
 
   public String getFileName() {
     return this.fileName;
   }
 
   public void setFileName(String fileName) {
     this.fileName = fileName;
   }
 
   public String getFileType() {
     return this.fileType;
   }
 
   public void setFileType(String fileType) {
     this.fileType = fileType;
   }
 
   public String getUserName() {
     return this.userName;
   }
 
   public void setUserName(String userName) {
     this.userName = userName;
   }
 
   public String getEditType() {
     return this.editType;
   }
 
   public void setEditType(String editType) {
     this.editType = editType;
   }
 
   public void setFile(File file) {
     setFileName(file.getName());
     setFileType("." + FileHelper.getFileExtName(file.getName()));
   }
 
   public void setDefaultParamValue()
   {
     if (StringUtil.isBlank(this.recordID)) {
       this.recordID = String.valueOf(System.currentTimeMillis());
     }
 
     if (StringUtil.isBlank(this.editType)) {
       this.editType = "1";
     }
 
     if (StringUtil.isBlank(this.fileType)) {
       this.fileType = ".doc";
     }
 
     if (StringUtil.isBlank(this.userName)) {
       Operator op = (Operator)ThreadLocalUtil.getVariable("operator", Operator.class);
       if (op != null) {
         this.userName = op.getFullName();
       }
     }
 
     if (StringUtil.isBlank(this.template)) {
       this.template = "";
     }
     if (StringUtil.isBlank(this.fileName))
       this.fileName = (this.recordID + this.fileType);
   }
 }

