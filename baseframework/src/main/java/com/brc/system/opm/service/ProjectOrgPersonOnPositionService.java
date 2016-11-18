package com.brc.system.opm.service;

import java.util.Map;

public abstract interface ProjectOrgPersonOnPositionService
{
  public abstract Map<String, Object> queryOnPosition(String paramString);

  public abstract Map<String, Object> saveOnPosition(String paramString, Long paramLong, String[] paramArrayOfString);
}

