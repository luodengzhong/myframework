 package com.brc.system.share.easysearch.model;
 
 import java.io.Serializable;
 import java.util.ArrayList;
 import java.util.Comparator;
 import java.util.HashMap;
 import java.util.List;
 import java.util.Map;
 import java.util.Set;
 import java.util.TreeSet;
 
 public class QuerySchemeModel
   implements Serializable
 {
   private String sql;
   private List<QuerySchemeField> heards;
   private Map<String, QuerySchemeField> heardMap;
   private String name;
   private String desc;
   private boolean authority;
   private Long width;
   private String folderIdName;
   private String folderKindId;
   private String sqlBeanName;
   private String orderby;
 
   public QuerySchemeModel()
   {
     this.name = null;
     this.sql = null;
     this.desc = null;
     this.width = new Long(0L);
     this.authority = false;
     this.heards = new ArrayList();
     this.heardMap = new HashMap();
   }
 
   public QuerySchemeModel(int length) {
     this.name = null;
     this.sql = null;
     this.desc = null;
     this.width = new Long(0L);
     this.authority = false;
     this.heards = new ArrayList(length);
     this.heardMap = new HashMap(length);
   }
 
   public Set<QuerySchemeField> getHeardComparator()
   {
     Set temp = new TreeSet(new Comparator() {
       public int compare(Object o1, Object o2) {
         QuerySchemeField obj1 = (QuerySchemeField) o1;
         QuerySchemeField obj2 = (QuerySchemeField) o2;
         if (obj1.getSequence() > obj2.getSequence()) {
           return 1;
         }
         return -1;
       }
     });
     temp.addAll(this.heards);
     return temp;
   }
 
   public void addHeard(QuerySchemeField fobj) {
     this.heards.add(fobj);
     this.heardMap.put(fobj.getCode().toLowerCase(), fobj);
     if (!fobj.getType().endsWith("hidden"))
       this.width = Long.valueOf(this.width.longValue() + fobj.getWidth().longValue());
   }
 
   public String getSql()
   {
     return this.sql;
   }
 
   public void setSql(String sql) {
     this.sql = sql;
   }
 
   public List<QuerySchemeField> getHeards() {
     return this.heards;
   }
 
   public void setHeards(List<QuerySchemeField> heards) {
     this.heards = heards;
   }
 
   public QuerySchemeField getField(String key) {
     return (QuerySchemeField)this.heardMap.get(key);
   }
 
   public Map<String, QuerySchemeField> getHeardMap() {
     return this.heardMap;
   }
 
   public void setHeardMap(Map<String, QuerySchemeField> heardMap) {
     this.heardMap = heardMap;
   }
 
   public String getName() {
     return this.name;
   }
 
   public void setName(String name) {
     this.name = name;
   }
 
   public String getDesc() {
     return this.desc;
   }
 
   public void setDesc(String desc) {
     this.desc = desc;
   }
 
   public boolean isAuthority() {
     return this.authority;
   }
 
   public void setAuthority(boolean authority) {
     this.authority = authority;
   }
 
   public Long getWidth() {
     return this.width;
   }
 
   public void setWidth(Long width) {
     this.width = width;
   }
 
   public String getFolderIdName() {
     return this.folderIdName;
   }
 
   public void setFolderIdName(String folderIdName) {
     this.folderIdName = folderIdName;
   }
 
   public String getFolderKindId() {
     return this.folderKindId;
   }
 
   public void setFolderKindId(String folderKindId) {
     this.folderKindId = folderKindId;
   }
 
   public String getSqlBeanName() {
     return this.sqlBeanName;
   }
 
   public void setSqlBeanName(String sqlBeanName) {
     this.sqlBeanName = sqlBeanName;
   }
 
   public String getOrderby() {
     return this.orderby;
   }
 
   public void setOrderby(String orderby) {
     this.orderby = orderby;
   }
 }

