 package com.brc.message.impl;
 
 import com.brc.exception.ApplicationException;
 import com.brc.message.NoteSend;
 
 public class NoteSendImpl
   implements NoteSend
 {
   public void doSendNote(String message, String mobtel)
     throws Exception
   {
     if ((mobtel == null) || (mobtel.equals("")))
       throw new ApplicationException("手机号码为空，无法发送!");
   }
 }

