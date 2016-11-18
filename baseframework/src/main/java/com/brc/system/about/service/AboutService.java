package com.brc.system.about.service;

import com.brc.util.SDO;
import java.util.List;
import java.util.Map;

public abstract interface AboutService
{
  public abstract Map<String, Object> loadTrees(SDO paramSDO);

  public abstract Long saveHelp(SDO paramSDO);

  public abstract Map<String, Object> loadHelp(SDO paramSDO);

  public abstract void deleteHelp(SDO paramSDO);

  public abstract void deleteHelpDetail(Long[] paramArrayOfLong);

  public abstract Map<String, Object> slicedQueryHelpDetail(SDO paramSDO);

  public abstract void updateHelpDetailStatus(Long[] paramArrayOfLong, int paramInt);

  public abstract List<Map<String, String>> loadHelpByCode(SDO paramSDO);

  public abstract List<Map<String, Object>> queryHelpByKeyWork(SDO paramSDO)
    throws Exception;

  public abstract String queryParentIds(SDO paramSDO)
    throws Exception;

  public abstract boolean hasModifPermissions(SDO paramSDO)
    throws Exception;

  public abstract void saveHelpById(SDO paramSDO)
    throws Exception;

  public abstract String getHelpFileByHelpId(SDO paramSDO)
    throws Exception;
}

