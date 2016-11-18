package com.brc.client.session;

import com.brc.system.opm.Operator;

public abstract interface SessionCache
{
  public abstract Operator getOperator(String paramString);

  public abstract void setOperator(String paramString, Operator paramOperator);
}

