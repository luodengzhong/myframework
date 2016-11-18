package com.brc.message;

import com.brc.message.model.Messages;

public abstract interface MessageSend
{
  public static final String MODEL_FILE_NAME = "config/domain/com/brc/system/cfg/sysMessageSend.xml";
  public static final String MESSAGE_SEND = "messageSend";
  public static final String MESSAGE_SEND_DETAIL = "messageSendDetail";

  public abstract void doSendEmail(String paramString1, String paramString2, String paramString3);

  public abstract void doSendNote(String paramString1, String paramString2);

  public abstract void doSendClient(String paramString1, String paramString2, String paramString3, String paramString4, String paramString5);

  public abstract void saveMessage(Messages paramMessages);
}

