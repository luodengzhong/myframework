package com.brc.system.opm.service;

import com.brc.util.SDO;

public abstract interface OperatorService
{
  public abstract SDO getFunPermissions(String paramString);

  public abstract SDO getAgents();
}

