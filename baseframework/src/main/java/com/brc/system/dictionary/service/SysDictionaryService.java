package com.brc.system.dictionary.service;

import com.brc.system.dictionary.model.DictionaryModel;
import com.brc.util.SDO;
import java.io.Serializable;
import java.util.List;
import java.util.Map;

public abstract interface SysDictionaryService
{
  public abstract Serializable insertDictionary(SDO paramSDO, List<Object> paramList);

  public abstract void updateDictionary(SDO paramSDO, List<Object> paramList);

  public abstract Map<String, Object> loadDictionary(SDO paramSDO);

  public abstract void deleteDictionary(Long[] paramArrayOfLong);

  public abstract void updateDictionaryParentId(Long[] paramArrayOfLong, Long paramLong);

  public abstract void updateDictionaryStatus(Long[] paramArrayOfLong, int paramInt);

  public abstract Map<String, Object> slicedQueryDictionary(SDO paramSDO);

  public abstract void deleteDictionaryDetail(Long[] paramArrayOfLong);

  public abstract Map<String, Object> slicedQueryDictionaryDetail(SDO paramSDO);

  public abstract void updateDictionaryDetailStatus(Long[] paramArrayOfLong, int paramInt);

  public abstract List<DictionaryModel> queryAllDictionary();

  public abstract void syncCache();
}

