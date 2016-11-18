package com.brc.system.interfaceType;

import com.brc.util.SDO;
import java.util.Map;

public abstract interface InfoPromulgateService
{
  public abstract Map<String, Object> slicedQueryInfoPromulgate(SDO paramSDO);
}

