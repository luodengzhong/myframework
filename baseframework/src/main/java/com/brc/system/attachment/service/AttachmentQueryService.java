package com.brc.system.attachment.service;

import java.util.List;
import java.util.Map;

public abstract interface AttachmentQueryService
{
  public abstract List<Map<String, Object>> getAttachmentList(String paramString1, String paramString2);

  public abstract List<Map<String, Object>> getAttachmentGroupList(String paramString1, String paramString2);
}

