package com.brc.system.datasyn.service;

public abstract interface SynIdLogService
{
  public abstract long getLastSynId(String paramString);

  public abstract void updateSynId(String paramString, Long paramLong);
}

