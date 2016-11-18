 package com.brc.message.impl;
 
 import com.brc.exception.ApplicationException;
 import com.brc.message.ClientMessageSend;
 import com.brc.message.EmailSend;
 import com.brc.message.MessageSend;
 import com.brc.message.NoteSend;
 import com.brc.message.model.Messages;
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.data.QueryRowMapper;
 import com.brc.system.data.util.BuildSQLUtil;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.util.ClassHelper;
 import com.brc.util.LogHome;
 import com.brc.util.StringUtil;
import com.brc.xmlbean.EntityDocument;
 import com.brc.xmlbean.EntityDocument.Entity;
 import java.sql.ResultSet;
 import java.sql.SQLException;
 import java.sql.Timestamp;
 import java.util.ArrayList;
 import java.util.Date;
 import java.util.HashMap;
 import java.util.List;
 import java.util.Map;
 import org.apache.log4j.Logger;
 
 public class MessageSendImpl
   implements MessageSend
 {
   private ServiceUtil serviceUtil;
   private EmailSend emailSend;
   private NoteSend noteSend;
   private ClientMessageSend clientMessageSend;
   private int perCycleMaxCount;
   private int repeatDoCount;
 
   public MessageSendImpl()
   {
     this.perCycleMaxCount = 100;
 
     this.repeatDoCount = 3;
   }
   public void setServiceUtil(ServiceUtil serviceUtil) {
     this.serviceUtil = serviceUtil;
   }
 
   public void setEmailSend(EmailSend emailSend) {
     this.emailSend = emailSend;
   }
 
   public void setNoteSend(NoteSend noteSend) {
     this.noteSend = noteSend;
   }
 
   public void setClientMessageSend(ClientMessageSend clientMessageSend) {
     this.clientMessageSend = clientMessageSend;
   }
 
   public void setPerCycleMaxCount(int perCycleMaxCount) {
     this.perCycleMaxCount = perCycleMaxCount;
   }
 
   public void setRepeatDoCount(int repeatDoCount) {
     this.repeatDoCount = repeatDoCount;
   }
 
   private EntityDocument.Entity getEntity() {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/cfg/sysMessageSend.xml", "messageSend");
   }
 
   private EntityDocument.Entity getDetailEntity() {
     return this.serviceUtil.getEntity("config/domain/com/brc/system/cfg/sysMessageSend.xml", "messageSendDetail");
   }
 
   public void doSendNote(String message, String mobtel)
   {
     try
     {
       this.noteSend.doSendNote(message, mobtel);
     } catch (Exception e) {
       LogHome.getLog(this).error("短信发送失败--", e);
       throw new ApplicationException("短信发送失败--" + e.getMessage());
     }
   }
 
   public void doSendEmail(String content, String title, String email)
   {
     try
     {
       this.emailSend.doSendEmail(content, title, email);
     } catch (Exception e) {
       LogHome.getLog(this).error("邮件发送失败--", e);
       throw new ApplicationException("邮件发送失败--" + e.getMessage());
     }
   }
 
   public void doSendClient(String from, String to, String subject, String body, String uri)
   {
     try
     {
       boolean flag = this.clientMessageSend.sendMessage(from, to, subject, body, uri);
       if (!flag)
         throw new ApplicationException("发送失败!");
     }
     catch (Exception e) {
       LogHome.getLog(this).error("客户端发送失败--", e);
       throw new ApplicationException("客户端发送失败--" + e.getMessage());
     }
   }
 
   public void saveMessage(final Messages msg)
   {
     msg.checkData();
     String loadPersonInfoSql = this.serviceUtil.getEntityDao().getSqlByName(getEntity(), "loadPersonInfo");
 
     String senderId = msg.getSenderId();
     final Map sender = this.serviceUtil.getEntityDao().queryToMap(loadPersonInfoSql, new Object[] { senderId, senderId, senderId });
     if ((null == sender) || (sender.size() == 0)) {
       throw new ApplicationException("发送者不能为空!");
     }
     String receiverSql = msg.getReceiverSql();
     final String[] sendKinds = msg.getSendKinds();
 
     if (!StringUtil.isBlank(receiverSql))
     {
       String sql = "select seq_table.*, seq_message_id.nextval as seq_message_id from (" + receiverSql + ") seq_table";
       final List messages = new ArrayList();
       final List messageDetail = new ArrayList();
       this.serviceUtil.getEntityDao().queryToListByMapper(sql, new QueryRowMapper() {
         public Object mapRow(ResultSet arg0, int arg1) throws SQLException {
           Long id = Long.valueOf(arg0.getLong("seq_message_id"));
 
           Map message = new HashMap(13);
           message.put("messageSendId", id);
           message.put("senderId", sender.get("id"));
           message.put("senderCode", sender.get("loginName"));
           message.put("senderName", sender.get("name"));
           message.put("receiverId", arg0.getString("id"));
           message.put("receiverCode", arg0.getString("login_name"));
           message.put("receiverName", arg0.getString("name"));
           message.put("title", msg.getTitle());
           message.put("content", msg.getContent());
           message.put("bizId", msg.getBizId());
           message.put("bizUrl", msg.getBizUrl());
           message.put("createDate", new Timestamp(System.currentTimeMillis()));
           if (msg.getSendDate() != null) {
             Timestamp sdt = new Timestamp(msg.getSendDate().getTime());
             Timestamp tmp = new Timestamp(System.currentTimeMillis());
             if (sdt.compareTo(tmp) > 0)
               message.put("sendDate", msg.getSendDate());
             else
               message.put("sendDate", tmp);
           }
           else {
             message.put("sendDate", new Timestamp(System.currentTimeMillis()));
           }
           messages.add(message);
           for (String sendKind : sendKinds) {
             Map detail = new HashMap(7);
             detail.put("messageSendId", id);
             detail.put("messageSendKind", sendKind);
             detail.put("status", Integer.valueOf(0));
             detail.put("errorNum", Integer.valueOf(0));
             detail.put("isHandle", Integer.valueOf(0));
             if (sendKind.equals("note"))
             {
               String mobilePhone = (String)ClassHelper.convert(arg0.getString("mobile_phone"), String.class, "");
               if (StringUtil.isBlank(mobilePhone)) {
                 continue;
               }
               detail.put("sendParam", mobilePhone);
             } else if (sendKind.equals("email"))
             {
               String email = (String)ClassHelper.convert(arg0.getString("email"), String.class, "");
               if (StringUtil.isBlank(email)) {
                 continue;
               }
               detail.put("sendParam", email); } else {
               if (!sendKind.equals("client")) continue;
               detail.put("sendParam", msg.getBizUrl());
             }
 
             messageDetail.add(detail);
           }
           return null;
         }
       }
       , msg.getReceiverSqlParam());
 
       if (messages.size() > 0) {
         this.serviceUtil.getEntityDao().batchInsert(getEntity(), messages);
       }
       if (messageDetail.size() > 0)
         this.serviceUtil.getEntityDao().batchInsert(getDetailEntity(), messageDetail);
     }
     else
     {
       String[] receiverIds = msg.getReceiverIds();
       List messages = new ArrayList(receiverIds.length);
       List messageDetail = new ArrayList(receiverIds.length * sendKinds.length);
       for (String receiverId : receiverIds) {
         Map receiver = this.serviceUtil.getEntityDao().queryToMap(loadPersonInfoSql, new Object[] { receiverId, receiverId, receiverId });
         if ((null != receiver) && (receiver.size() != 0))
         {
           Long id = this.serviceUtil.getEntityDao().getSequence("SEQ_MESSAGE_ID");
 
           Map message = new HashMap(13);
           message.put("messageSendId", id);
           message.put("senderId", sender.get("id"));
           message.put("senderCode", sender.get("loginName"));
           message.put("senderName", sender.get("name"));
           message.put("receiverId", receiver.get("id"));
           message.put("receiverCode", receiver.get("loginName"));
           message.put("receiverName", receiver.get("name"));
           message.put("title", msg.getTitle());
           message.put("content", msg.getContent());
           message.put("bizId", msg.getBizId());
           message.put("bizUrl", msg.getBizUrl());
           message.put("createDate", new Timestamp(System.currentTimeMillis()));
           if (msg.getSendDate() != null) {
             Timestamp sdt = new Timestamp(msg.getSendDate().getTime());
             Timestamp tmp = new Timestamp(System.currentTimeMillis());
             if (sdt.compareTo(tmp) > 0)
               message.put("sendDate", msg.getSendDate());
             else
               message.put("sendDate", tmp);
           }
           else {
             message.put("sendDate", new Timestamp(System.currentTimeMillis()));
           }
           messages.add(message);
           for (String sendKind : sendKinds) {
             Map detail = new HashMap(7);
             detail.put("messageSendId", id);
             detail.put("messageSendKind", sendKind);
             detail.put("status", Integer.valueOf(0));
             detail.put("errorNum", Integer.valueOf(0));
             detail.put("isHandle", Integer.valueOf(0));
             if (sendKind.equals("note"))
             {
               String mobilePhone = (String)ClassHelper.convert(receiver.get("mobilePhone"), String.class, "");
               if (StringUtil.isBlank(mobilePhone)) {
                 continue;
               }
               detail.put("sendParam", mobilePhone);
             } else if (sendKind.equals("email"))
             {
               String email = (String)ClassHelper.convert(receiver.get("email"), String.class, "");
               if (StringUtil.isBlank(email)) {
                 continue;
               }
               detail.put("sendParam", email); } else {
               if (!sendKind.equals("client")) continue;
               detail.put("sendParam", msg.getBizUrl());
             }
 
             messageDetail.add(detail);
           }
         }
       }
       if (messages.size() > 0) {
         this.serviceUtil.getEntityDao().batchInsert(getEntity(), messages);
       }
       if (messageDetail.size() > 0)
         this.serviceUtil.getEntityDao().batchInsert(getDetailEntity(), messageDetail);
     }
   }
 
   private List<Map<String, Object>> querySendMessages()
   {
     String sql = this.serviceUtil.getEntityDao().getSqlByName(getEntity(), "querySendMessages");
     sql = BuildSQLUtil.getOracleOptimizeSQL(0, this.perCycleMaxCount, sql);
     return this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[0]);
   }
 
   @Deprecated
   public void execute()
   {
     try
     {
       List <Map<String,Object>> list = querySendMessages();
       if ((list != null) && (list.size() > 0)) {
         String sql = this.serviceUtil.getEntityDao().getSqlByName(getDetailEntity(), "updateHandle");
         List dataSet = new ArrayList(list.size());
         for (Map map : list) {
           dataSet.add(new Object[] { Integer.valueOf(1), map.get("messageSendDetailId") });
         }
 
         this.serviceUtil.getEntityDao().batchUpdate(sql, dataSet);
         LogHome.getLog(this).info("需要处理数据：" + list.size());
 
         new Thread(new sendThread(list, this.repeatDoCount)).start();
       }
     } catch (Exception e) {
       e.printStackTrace();
       LogHome.getLog(this).error("定时发送消息:", e);
     }
   }
 
   private void updateMessageDetails(List<Map<String, Object>> msgs)
   {
     this.serviceUtil.getEntityDao().batchUpdate(getDetailEntity(), msgs, new String[0]);
   }
 
   class sendThread
     implements Runnable
   {
     private List<Map<String, Object>> msgs;
     private int repeatDoCount = 3;
 
     public sendThread(List<Map<String, Object>> msgs,int repeatDoCount) {
       this.msgs = msgs;
       this.repeatDoCount = repeatDoCount;
     }
 
     public void run() {
       List details = new ArrayList(this.msgs.size());
       for (Map msg : this.msgs) {
         details.add(doSend(msg));
       }
       if (details.size() > 0)
         MessageSendImpl.this.updateMessageDetails(details);
     }
 
     private Map<String, Object> doSend(Map<String, Object> msg)
     {
       int errorNum = ((Integer)ClassHelper.convert(msg.get("errorNum"), Integer.class, Integer.valueOf(0))).intValue();
       String messageSendKind = (String)ClassHelper.convert(msg.get("messageSendKind"), String.class, "client");
       String content = (String)ClassHelper.convert(msg.get("content"), String.class, "");
       String title = (String)ClassHelper.convert(msg.get("title"), String.class, "");
       String sendParam = (String)ClassHelper.convert(msg.get("sendParam"), String.class, "");
       String senderCode = (String)ClassHelper.convert(msg.get("senderCode"), String.class, "admin");
       String receiverCode = (String)ClassHelper.convert(msg.get("receiverCode"), String.class, "");
       Long messageSendDetailId = (Long)ClassHelper.convert(msg.get("messageSendDetailId"), Long.class);
       Map detail = new HashMap(4);
       detail.put("messageSendDetailId", messageSendDetailId);
       detail.put("isHandle", Integer.valueOf(0));
       try {
         if (messageSendKind.equals("note")) {
           MessageSendImpl.this.noteSend.doSendNote(content, sendParam);
         } else if (messageSendKind.equals("email")) {
           MessageSendImpl.this.emailSend.doSendEmail(content, title, sendParam);
         } else if (messageSendKind.equals("client")) {
           boolean flag = MessageSendImpl.this.clientMessageSend.sendMessage(senderCode, receiverCode, title, content, sendParam);
           if (!flag) {
             throw new ApplicationException("发送失败!");
           }
         }
         detail.put("status", Integer.valueOf(1));
         detail.put("remark", "发送成功");
         detail.put("errorNum", Integer.valueOf(errorNum));
       } catch (Exception e) {
         LogHome.getLog(this).error(new StringBuilder().append("发送失败--").append(messageSendKind).toString(), e);
         String errorMessage = e.getMessage();
         errorMessage = new StringBuilder().append("发送失败--").append(StringUtil.isBlank(errorMessage) ? "" : errorMessage).toString();
         if (errorMessage.length() > 100) {
           errorMessage = errorMessage.substring(100);
         }
         detail.put("status", Integer.valueOf(0));
         detail.put("remark", errorMessage);
         detail.put("errorNum", Integer.valueOf(errorNum + 1));
         if (errorNum >= this.repeatDoCount)
         {
           detail.put("status", Integer.valueOf(2));
         }
       }
       return detail;
     }
   }
 }

