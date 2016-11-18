package com.brc.system.share.service;

import com.brc.util.QueryModel;
import com.brc.util.SDO;
import java.util.List;
import java.util.Map;

public abstract interface SQLQuery
{
  public static final String RECORD = "Total";
  public static final String PAGE_PARAM_NAME = "page";
  public static final String PAGE_SIZE_PARAM_NAME = "pagesize";
  public static final String SORT_NAME_PARAM_NAME = "sortname";
  public static final String SORT_ORDER_PARAM_NAME = "sortorder";
  public static final String EXPORT_TYPE = "exportType";
  public static final String EXPOR_THEAD = "exportHead";
  public static final String TOTAL_FIELDS = "totalFields";
  public static final String ROWS = "Rows";
  public static final String EXPORT_EXCEL_TYPE = "exportExcelType";
  public static final String DICTIONARY_MAP = "queryModelDictionaryMap";

  public abstract Map<String, Object> executeSlicedQuery(QueryModel paramQueryModel, SDO paramSDO);

  public abstract Map<String, Object> executeQuery(QueryModel paramQueryModel, SDO paramSDO);

  public abstract Map<String, Object> executeQuery(QueryModel paramQueryModel, String paramString1, String paramString2);

  public abstract Map<String, Object> exportExecuteQuery(QueryModel paramQueryModel);

  public abstract int getTotal(String paramString1, String paramString2, Object paramObject);

  public abstract int getTotal(String paramString, Map<String, Object> paramMap);

  public abstract List<Map<String, Object>> queryListForPaging(String paramString, Map<String, Object> paramMap, int paramInt1, int paramInt2);

  public abstract Map<String, Object> queryTotalByFields(String paramString1, String paramString2, Map<String, Object> paramMap);
}

