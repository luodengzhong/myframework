package com.brc.message;

import java.util.Vector;

public abstract interface EmailSend
{
  public abstract void doSendEmail(String paramString1, String paramString2, String paramString3)
    throws Exception;

  public abstract void doSendEmailWithAttachment(String paramString1, String paramString2, String paramString3, Vector paramVector)
    throws Exception;
}

