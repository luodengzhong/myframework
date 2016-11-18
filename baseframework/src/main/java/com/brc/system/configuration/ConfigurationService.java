package com.brc.system.configuration;

import com.brc.util.QueryModel;
import com.brc.util.SDO;
import java.io.Serializable;
import java.util.List;
import java.util.Map;

public abstract interface ConfigurationService
{
  public static final String COMMON_TREE_ENTITY_NAME = "commonTree";
  public static final String MODEL_FILE_NAME = "config/domain/com/brc/configuration/configuration.xml";
  public static final String COMMON_MODEL_FILE_NAME = "/config/domain/com/brc/configuration/common.xml";
  public static final String COMMON_HANDLER = "commonHandler";
  public static final String COMMON_HANDLER_GROUP = "commonHandlerGroup";

  public abstract Long insertCommonTree(SDO paramSDO);

  public abstract void updateCommonTree(SDO paramSDO);

  public abstract void deleteCommonTree(Long paramLong, Integer paramInteger);

  public abstract Long getCommonTreeNextSequence(Long paramLong);

  public abstract void updateCommonTreeSequence(Map<Long, Long> paramMap);

  public abstract SDO loadCommonTreeNode(Long paramLong);

  public abstract SDO loadCommonTrees(SDO paramSDO);

  public abstract SDO loadSlicedCommonTrees(SDO paramSDO);

  public abstract void saveUserProcessTemplate(SDO paramSDO);

  public abstract List<Map<String, Object>> queryUserProcessTemplate(SDO paramSDO);

  public abstract void saveUserProcessTemplateDetail(SDO paramSDO);

  public abstract void deleteUserProcessTemplate(SDO paramSDO);

  public abstract List<Map<String, Object>> queryHandlerOrgByBizId(Long paramLong);

  public abstract List<Map<String, Object>> getHandlerByBizIdAndKindId(Long paramLong, String paramString);

  public abstract List<Map<String, Object>> queryHandlerPersonsByKindIdObGroupId(Serializable paramSerializable, String paramString);

  public abstract void deleteHandlerByBizId(Serializable paramSerializable);

  public abstract void deleteHandlerByHandlerId(List<Object[]> paramList);

  public abstract void deleteHandlerByHandlerId(Long[] paramArrayOfLong);

  public abstract void insertHandlerByDataSet(List<Map<String, Object>> paramList);

  public abstract void updateHandlerByDataSet(List<Map<String, Object>> paramList);

  public abstract void saveHandlerByBizIdAndData(List<Object> paramList, Serializable paramSerializable);

  public abstract List<Map<String, Object>> queryHandlerPersonsByBizIdAndKindId(Serializable paramSerializable, String paramString);

  public abstract QueryModel getQueryCommonHandlerModel(SDO paramSDO);
}

