package com.brc.system.plugIn;

import com.brc.exception.ApplicationException;

public abstract interface StartPlugIn
{
  public abstract void init()
    throws ApplicationException;
}

