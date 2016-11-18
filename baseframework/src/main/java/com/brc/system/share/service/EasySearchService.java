package com.brc.system.share.service;

import com.brc.system.share.easysearch.EasySearchDTO;
import com.brc.util.SDO;
import java.util.Map;

public abstract interface EasySearchService
{
  public abstract void search(EasySearchDTO paramEasySearchDTO, SDO paramSDO)
    throws Exception;

  public abstract Map<String, Object> comboGridSearch(EasySearchDTO paramEasySearchDTO, SDO paramSDO);
}

