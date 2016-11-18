package com.brc.system.share.service;

import com.brc.system.share.service.model.UserScreen;
import java.util.List;
import java.util.Map;

public abstract interface WorkTableService
{
  public static final String MODEL_FILE_NAME = "config/domain/com/brc/system/cfg/userScreen.xml";
  public static final String SYS_USER_SCREEN_ENTITY = "userScreen";
  public static final String SYS_USER_SCREEN_FUNCTION_ENTITY = "userScreenFunction";

  public abstract List<UserScreen> getUserScreens(String paramString);

  public abstract Long saveScreen(String paramString1, String paramString2);

  public abstract void deleteScreen(Long paramLong);

  public abstract void updateScreen(Long paramLong, String paramString);

  public abstract List<Map<String, Object>> getFunctionByPersonId(String paramString, Long paramLong);

  public abstract List<Map<String, Object>> getJobFunctionByPersonId(String paramString, Long paramLong);

  public abstract List<Map<String, Object>> getGroupFunctionByPersonId(String paramString, Long paramLong);

  public abstract List<Map<String, Object>> queryOftenUseFunction(String paramString);
}

