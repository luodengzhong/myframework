 package com.brc.message.impl;
 
 import com.brc.message.ClientMessageSend;
 import com.brc.message.model.UcpBusinessServiceStub;
 import com.brc.message.model.UcpBusinessServiceStub.SendMessage;
 import com.brc.message.model.UcpBusinessServiceStub.SendMessageResponse;
 import com.brc.util.Singleton;
 
 public class ClientMessageOCImpl
   implements ClientMessageSend
 {
   private String getEndpoint()
   {
     return (String)Singleton.getParameter("ucpWebService", String.class);
   }
 
   public boolean sendMessage(String from, String to, String subject, String body, String uri) throws Exception {
     String endpoint = getEndpoint();
     UcpBusinessServiceStub stub = new UcpBusinessServiceStub(endpoint);
     UcpBusinessServiceStub.SendMessage sendMessage = new UcpBusinessServiceStub.SendMessage();
     sendMessage.setFrom(from);
     sendMessage.setTo(to);
     sendMessage.setSubject(subject);
     sendMessage.setBody(body);
     sendMessage.setUri(uri);
     UcpBusinessServiceStub.SendMessageResponse sdm = stub.sendMessage(sendMessage);
     return sdm.getSendMessageResult();
   }
 }

