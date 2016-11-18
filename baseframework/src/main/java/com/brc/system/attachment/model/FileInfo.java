 package com.brc.system.attachment.model;
 
 import com.brc.system.opm.Operator;
 import com.brc.util.ClassHelper;
 import com.brc.util.FileHelper;
 import com.brc.util.ThreadLocalUtil;
 import java.io.UnsupportedEncodingException;
 import java.security.MessageDigest;
 import java.security.NoSuchAlgorithmException;
 import java.sql.Timestamp;
 import java.util.HashMap;
 import java.util.Map;
 
 public class FileInfo
 {
   private int chunkIndex;
   private String size;
   private String name;
   private String id;
   private int chunks;
   private int chunk;
   private String lastModifiedDate;
   private String type;
   private String ext;
   private String bizId;
   private String bizCode;
   private String attachmentCode;
   private String isMore;
   private String savePath;
   private String uniqueName;
 
   public FileInfo()
   {
     this.bizCode = "";
     this.attachmentCode = "";
   }
 
   public String getType() {
     return this.type;
   }
 
   public void setType(String type) {
     this.type = type;
   }
 
   public String getLastModifiedDate() {
     return this.lastModifiedDate;
   }
 
   public void setLastModifiedDate(String lastModifiedDate) {
     this.lastModifiedDate = lastModifiedDate;
   }
 
   public int getChunks() {
     return this.chunks;
   }
 
   public void setChunks(int chunks) {
     this.chunks = chunks;
   }
 
   public int getChunk() {
     return this.chunk;
   }
 
   public void setChunk(int chunk) {
     this.chunk = chunk;
   }
 
   public String getId() {
     return this.id;
   }
 
   public void setId(String id) {
     this.id = id;
   }
 
   public int getChunkIndex() {
     return this.chunkIndex;
   }
 
   public void setChunkIndex(int chunkIndex) {
     this.chunkIndex = chunkIndex;
   }
 
   public String getSize() {
     return this.size;
   }
 
   public void setSize(String size) {
     this.size = size;
   }
 
   public String getName() {
     return this.name;
   }
 
   public void setName(String name) {
     this.name = name;
   }
 
   public String getExt() {
     return this.ext;
   }
 
   public void setExt(String ext) {
     this.ext = ext;
   }
 
   public String getBizId() {
     return this.bizId;
   }
 
   public void setBizId(String bizId) {
     this.bizId = bizId;
   }
 
   public String getBizCode() {
     return this.bizCode;
   }
 
   public void setBizCode(String bizCode) {
     this.bizCode = bizCode;
   }
 
   public String getAttachmentCode() {
     return this.attachmentCode;
   }
 
   public void setAttachmentCode(String attachmentCode) {
     this.attachmentCode = attachmentCode;
   }
 
   public String getIsMore() {
     return this.isMore;
   }
 
   public void setIsMore(String isMore) {
     this.isMore = isMore;
   }
 
   public String getSavePath() {
     return this.savePath;
   }
 
   public void setSavePath(String savePath) {
     this.savePath = savePath;
   }
 
   public String getUniqueName() {
     return this.uniqueName;
   }
 
   public void setUniqueName(String uniqueName) {
     this.uniqueName = uniqueName;
   }
 
   private String md5(String content) {
     StringBuffer sb = new StringBuffer();
     try {
       MessageDigest md5 = MessageDigest.getInstance("MD5");
       md5.update(content.getBytes("UTF-8"));
       byte[] tmpFolder = md5.digest();
       for (int i = 0; i < tmpFolder.length; i++) {
         sb.append(Integer.toString((tmpFolder[i] & 0xFF) + 256, 16).substring(1));
       }
       return sb.toString();
     } catch (NoSuchAlgorithmException ex) {
       ex.printStackTrace();
       return null;
     } catch (UnsupportedEncodingException ex) {
       ex.printStackTrace();
     }return null;
   }
 
   public String getUniqueFileName()
   {
     StringBuffer name = new StringBuffer();
     name.append(getBizId());
     name.append(getBizCode());
     name.append(getAttachmentCode());
     name.append(getName());
     name.append(getType());
     name.append(getLastModifiedDate());
     name.append(getSize());
     String s = md5(name.toString());
     return s;
   }
 
   public Map<String, Object> toMap() {
     Long size = (Long)ClassHelper.convert(getSize(), Long.class);
     String fileExt = FileHelper.getFileExtName(getName());
     Operator operator = (Operator)ThreadLocalUtil.getVariable("operator", Operator.class);
     Map param = new HashMap();
     param.put("bizCode", getBizCode());
     param.put("bizId", getBizId());
     param.put("attachmentCode", getAttachmentCode());
     param.put("isMore", getIsMore());
     param.put("path", getSavePath());
     param.put("fileName", getName());
     param.put("fileSize", FileHelper.formetFileSize(size.longValue()));
     param.put("fileKind", fileExt);
     param.put("fileLength", size);
     param.put("isFtp", Integer.valueOf(0));
     if (operator != null) {
       param.put("creatorId", operator.getPersonMemberId());
       param.put("creatorName", operator.getPersonMemberName());
     }
     param.put("createDate", new Timestamp(System.currentTimeMillis()));
     return param;
   }
 
   public String toString() {
     return "name=" + this.name + "; size=" + this.size + "; chunkIndex=" + this.chunkIndex + "; id=" + this.id + "; chunks=" + this.chunks + "; chunk=" + this.chunk + "; lastModifiedDate=" + this.lastModifiedDate + "; type=" + this.type + "; ext=" + this.ext;
   }
 }

