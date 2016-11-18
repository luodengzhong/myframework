 package com.brc.util;
 
 import java.util.HashMap;
 import java.util.Map;
 
 public class QueryModel
 {
   private String sql;
   private int pageSize;
   private int pageIndex;
   private Map<String, Object> queryParams;
   private String sortFieldName;
   private String sortOrder;
   private String totalFields;
   private boolean isPopedom;
   private String xmlHeads;
   private String xmlFilePath;
   private String manageType;
   private boolean isTreeQuery = false;
 
   Map<String, Object> dictionaryMap = null;
   private String defaultOrderBy;
   private String exportExcelType;
   private String exportType;
 
   public String getXmlFilePath()
   {
     return this.xmlFilePath;
   }
 
   public void setXmlFilePath(String xmlFilePath) {
     this.xmlFilePath = xmlFilePath;
   }
 
   public String getXmlHeads() {
     return this.xmlHeads;
   }
 
   public void setXmlHeads(String xmlHeads) {
     this.xmlHeads = xmlHeads;
   }
 
   public QueryModel() {
     this.isPopedom = true;
     this.sortOrder = "desc";
     this.pageSize = 0;
     this.pageIndex = 0;
     this.queryParams = new HashMap(4);
     this.dictionaryMap = new HashMap(4);
     this.exportType = null;
   }
 
   public QueryModel(boolean isPopedom) {
     this.isPopedom = isPopedom;
     this.sortOrder = "desc";
     this.pageSize = 0;
     this.pageIndex = 0;
     this.queryParams = new HashMap(4);
     this.dictionaryMap = new HashMap(4);
   }
 
   public boolean isPopedom() {
     return this.isPopedom;
   }
 
   public void setPopedom(boolean isPopedom) {
     this.isPopedom = isPopedom;
   }
 
   public String getSortOrder() {
     return this.sortOrder;
   }
 
   public void setSortOrder(String sortOrder) {
     this.sortOrder = sortOrder;
   }
 
   public String getSortFieldName() {
     if (StringUtil.isBlank(this.sortFieldName)) {
       return "";
     }
     if (this.sortFieldName.endsWith("TextView")) {
       return this.sortFieldName.replace("TextView", "");
     }
     return this.sortFieldName;
   }
 
   public void setSortFieldName(String sortFieldName)
   {
     this.sortFieldName = sortFieldName;
   }
 
   public String getSql() {
     return this.sql;
   }
 
   public void setSql(String sql) {
     this.sql = sql;
   }
 
   public Map<String, Object> getQueryParams() {
     return this.queryParams;
   }
 
   public void putParam(String key, Object obj) {
     this.queryParams.put(key, obj);
   }
 
   public void putLikeParam(String key, Object obj) {
     this.queryParams.put(key, "%" + obj + "%");
   }
 
   public void putAll(Map<String, Object> map) {
     if (map != null) this.queryParams.putAll(map); 
   }
 
   public int getPageIndex()
   {
     return this.pageIndex;
   }
 
   public void setPageIndex(int pageIndex) {
     this.pageIndex = pageIndex;
   }
 
   public int getPageSize() {
     return this.pageSize;
   }
 
   public void setPageSize(int pageSize) {
     this.pageSize = pageSize;
   }
 
   public int getStart() {
     return (this.pageIndex > 0 ? this.pageIndex - 1 : 0) * this.pageSize;
   }
 
   public void setQueryParams(Map<String, Object> queryParams) {
     this.queryParams = queryParams;
   }
 
   public String getTotalFields() {
     return this.totalFields;
   }
 
   public void setTotalFields(String totalFields) {
     this.totalFields = totalFields;
   }
 
   public String getManageType() {
     return this.manageType;
   }
 
   public void setManageType(String manageType) {
     this.manageType = manageType;
   }
 
   public boolean isTreeQuery() {
     return this.isTreeQuery;
   }
 
   public void setTreeQuery(boolean isTreeQuery) {
     this.isTreeQuery = isTreeQuery;
   }
 
   public Map<String, Object> getDictionaryMap() {
     return this.dictionaryMap;
   }
 
   public void setDictionaryMap(Map<String, Object> dictionaryMap) {
     this.dictionaryMap = dictionaryMap;
   }
 
   public void putDictionary(String code, Map<String, String> map) {
     this.dictionaryMap.put(code, map);
   }
 
   public String getDefaultOrderBy() {
     return this.defaultOrderBy;
   }
 
   public void setDefaultOrderBy(String defaultOrderBy) {
     this.defaultOrderBy = defaultOrderBy;
   }
 
   public int getExportExcelType() {
     if (StringUtil.isBlank(this.exportExcelType))
       return 1;
     if (this.exportExcelType.equals("xls")) {
       return 0;
     }
     return 1;
   }
 
   public String getExportType() {
     return this.exportType;
   }
 
   public void setExportType(String exportType) {
     this.exportType = exportType;
   }
 
   public void setExportExcelType(String exportExcelType) {
     this.exportExcelType = exportExcelType;
   }
 }

