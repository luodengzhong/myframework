 package com.brc.message.model;
 
 import com.brc.exception.ApplicationException;
 import com.brc.util.StringUtil;
 import java.io.Serializable;
 import java.util.Date;
 
 public class Messages
   implements Serializable
 {
   protected String senderId;
   protected String[] receiverIds;
   protected String receiverSql;
   protected Object[] receiverSqlParam;
   protected String title;
   protected String content;
   protected String bizId;
   protected Date sendDate;
   protected String bizUrl;
   private String[] sendKinds;
 
   public String getSenderId()
   {
     return this.senderId;
   }
 
   public void setSenderId(String senderId) {
     this.senderId = senderId;
   }
 
   public String[] getReceiverIds() {
     return this.receiverIds;
   }
 
   public void setReceiverIds(String[] receiverIds) {
     this.receiverIds = receiverIds;
   }
 
   public String getTitle() {
     return this.title;
   }
 
   public void setTitle(String title) {
     this.title = title;
   }
 
   public String getContent() {
     return this.content;
   }
 
   public void setContent(String content) {
     this.content = content;
   }
 
   public String getBizId() {
     return this.bizId;
   }
 
   public void setBizId(String bizId) {
     this.bizId = bizId;
   }
 
   public Date getSendDate() {
     return this.sendDate;
   }
 
   public void setSendDate(Date sendDate) {
     this.sendDate = sendDate;
   }
 
   public String[] getSendKinds() {
     return this.sendKinds;
   }
 
   public void setSendKinds(String[] sendKinds) {
     this.sendKinds = sendKinds;
   }
 
   public String getBizUrl() {
     return this.bizUrl;
   }
 
   public void setBizUrl(String bizUrl) {
     this.bizUrl = bizUrl;
   }
 
   public String getReceiverSql() {
     return this.receiverSql;
   }
 
   public void setReceiverSql(String receiverSql) {
     this.receiverSql = receiverSql;
   }
 
   public Object[] getReceiverSqlParam() {
     return this.receiverSqlParam;
   }
 
   public void setReceiverSqlParam(Object[] receiverSqlParam) {
     this.receiverSqlParam = receiverSqlParam;
   }
 
   public void checkData() {
     if (StringUtil.isBlank(this.content)) {
       throw new ApplicationException("请输入内容!");
     }
     if (StringUtil.isBlank(this.senderId)) {
       throw new ApplicationException("发送者不能为空!");
     }
     if (((null == this.receiverIds) || (this.receiverIds.length == 0)) && 
       (StringUtil.isBlank(this.receiverSql))) {
       throw new ApplicationException("接收者不能为空!");
     }
 
     if ((null == this.sendKinds) || (this.sendKinds.length == 0))
       throw new ApplicationException("发送方式不能为空!");
   }
 }

