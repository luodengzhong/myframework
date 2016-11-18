package com.brc.model.domain.parse;

import com.brc.xmlbean.EntityDocument;
import com.brc.xmlbean.EntityDocument.Entity;
import java.util.Collection;
import java.util.Map;

public abstract interface SQLBuilder
{
  public abstract SQLExecutor buildDeleteSql(EntityDocument.Entity paramEntity);

  public abstract SQLExecutor buildDeleteSql(EntityDocument.Entity paramEntity, Collection<String> paramCollection);

  public abstract SQLExecutor buildInsertSql(EntityDocument.Entity paramEntity);

  public abstract SQLExecutor buildUpdateSql(EntityDocument.Entity paramEntity, Collection<String> paramCollection);

  public abstract SQLExecutor buildUpdateSql(EntityDocument.Entity paramEntity, Collection<String> paramCollection, String[] paramArrayOfString);

  public abstract SQLExecutor buildUpdateSql(EntityDocument.Entity paramEntity, Collection<String> paramCollection1, Collection<String> paramCollection2, String[] paramArrayOfString);

  public abstract SQLExecutor buildLoadSql(EntityDocument.Entity paramEntity);

  public abstract SQLExecutor buildQuerySql(EntityDocument.Entity paramEntity, Map<String, Object> paramMap);

  public abstract String getSqlByName(EntityDocument.Entity paramEntity, String paramString);

  public abstract SQLExecutor buildSqlByName(EntityDocument.Entity paramEntity, String paramString, Map<String, Object> paramMap);
}

