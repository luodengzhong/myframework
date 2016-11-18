package com.brc.system.person.service;

import com.brc.util.SDO;
import java.io.Serializable;
import java.util.Map;

public abstract interface SuggestionBoxService
{
  public abstract Serializable insert(SDO paramSDO);

  public abstract void update(SDO paramSDO);

  public abstract Map<String, Object> load(SDO paramSDO);

  public abstract void delete(SDO paramSDO);

  public abstract Map<String, Object> slicedQuery(SDO paramSDO);
}

