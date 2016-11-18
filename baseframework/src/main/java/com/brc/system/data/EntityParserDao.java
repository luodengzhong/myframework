package com.brc.system.data;

import com.brc.exception.EntityExecutorException;
import com.brc.model.domain.parse.SQLBuilder;
import com.brc.util.QueryModel;
import com.brc.xmlbean.EntityDocument;
import com.brc.xmlbean.EntityDocument.Entity;
import java.io.Serializable;
import java.util.List;
import java.util.Map;

public abstract interface EntityParserDao extends JDBCDao
{
  public abstract SQLBuilder getSqlBuilder();

  public abstract Map<String, Object> getDefaultExprValues(EntityDocument.Entity paramEntity);

  public abstract Serializable insert(EntityDocument.Entity paramEntity, Map<String, Object> paramMap)
    throws EntityExecutorException;

  public abstract void batchInsert(EntityDocument.Entity paramEntity, List<Map<String, Object>> paramList)
    throws EntityExecutorException;

  public abstract int update(EntityDocument.Entity paramEntity, Map<String, Object> paramMap, String[] paramArrayOfString)
    throws EntityExecutorException;

  public abstract void batchUpdate(EntityDocument.Entity paramEntity, List<Map<String, Object>> paramList, String[] paramArrayOfString)
    throws EntityExecutorException;

  public abstract int updateByCondition(EntityDocument.Entity paramEntity, Map<String, Object> paramMap1, Map<String, Object> paramMap2, String[] paramArrayOfString)
    throws EntityExecutorException;

  public abstract int delete(EntityDocument.Entity paramEntity, Map<String, Object> paramMap)
    throws EntityExecutorException;

  public abstract int deleteByCondition(EntityDocument.Entity paramEntity, Map<String, Object> paramMap)
    throws EntityExecutorException;

  public abstract int deleteById(EntityDocument.Entity paramEntity, Serializable paramSerializable)
    throws EntityExecutorException;

  public abstract void deleteByIds(EntityDocument.Entity paramEntity, Serializable[] paramArrayOfSerializable)
    throws EntityExecutorException;

  public abstract Map<String, Object> load(EntityDocument.Entity paramEntity, Map<String, Object> paramMap)
    throws EntityExecutorException;

  public abstract Map<String, Object> loadById(EntityDocument.Entity paramEntity, Serializable paramSerializable)
    throws EntityExecutorException;

  public abstract <T> T loadObjectById(EntityDocument.Entity paramEntity, Class<T> paramClass, Serializable paramSerializable)
    throws EntityExecutorException;

  public abstract QueryModel getQueryModel(EntityDocument.Entity paramEntity, Map<String, Object> paramMap)
    throws EntityExecutorException;

  public abstract List<Map<String, Object>> query(EntityDocument.Entity paramEntity, Map<String, Object> paramMap)
    throws EntityExecutorException;

  public abstract <T> List<T> query(EntityDocument.Entity paramEntity, Map<String, Object> paramMap, Class<T> paramClass)
    throws EntityExecutorException;

  public abstract Integer count(EntityDocument.Entity paramEntity, Map<String, Object> paramMap)
    throws EntityExecutorException;

  public abstract List<Map<String, Object>> queryBySqlName(EntityDocument.Entity paramEntity, String paramString, Map<String, Object> paramMap)
    throws EntityExecutorException;

  public abstract <T> T queryBySqlName(EntityDocument.Entity paramEntity, String paramString, Class<T> paramClass, Object[] paramArrayOfObject)
    throws EntityExecutorException;

  public abstract QueryModel getQueryModelByName(EntityDocument.Entity paramEntity, String paramString, Map<String, Object> paramMap)
    throws EntityExecutorException;

  public abstract int executeUpdateBySqlName(EntityDocument.Entity paramEntity, String paramString, Object[] paramArrayOfObject);

  public abstract String getSqlByName(EntityDocument.Entity paramEntity, String paramString);

  public abstract void checkUniqueness(EntityDocument.Entity paramEntity, Map<String, Object> paramMap, boolean paramBoolean, String[] paramArrayOfString);
}

