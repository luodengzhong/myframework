package com.brc.client.service;

import com.brc.util.SDO;
import java.util.Map;

public abstract interface HomePageService
{
  public abstract Map<String, Object> queryOtherSystemTasks(SDO paramSDO);
}

