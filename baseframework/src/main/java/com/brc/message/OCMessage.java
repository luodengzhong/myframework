package com.brc.message;

public abstract interface OCMessage
{
  public abstract boolean sendMessageToOc(String paramString1, String paramString2, String paramString3, String paramString4, String paramString5)
    throws Exception;
}

