 package com.brc.system.share.easysearch;
 
 import com.brc.exception.ApplicationException;
 import com.brc.system.share.easysearch.model.QuerySchemeField;
 import com.brc.system.share.easysearch.model.QuerySchemeModel;
 import com.brc.util.SDO;
 import com.brc.util.SpringBeanFactory;
 import com.brc.util.StringUtil;
 import java.util.ArrayList;
 import java.util.HashMap;
 import java.util.List;
 import java.util.Map;
 import java.util.Set;
 import javax.servlet.ServletContext;
 
 public class EasySearchDTO extends QuerySchemeModel
 {
   private static final String cascadeField = "cascadeField";
   private static final String commonField = "commonField";
   private static final String commonParam = "cascadeParam";
   public static final String searchQueryCondition = "searchQueryCondition";
   private int count;
   private Integer intPage;
   private int sumPage;
   private Integer pageSize;
   private String params;
   private String folderId;
   private String condition;
   private Map<String, Object> queryParams = new HashMap(4);
   private List<QuerySchemeField> headList;
   private List<Map<String, String>> datas;
   private ServletContext servletContext;
   Map<String, Object> dictionaryMap;
   private SDO sdo;
 
   public void setServletContext(ServletContext servletContext)
   {
     this.servletContext = servletContext;
   }
 
   public String getParams() {
     return this.params;
   }
 
   public void setParams(String params) {
     this.params = params;
   }
 
   public String getCondition() {
     return this.condition;
   }
 
   public void setCondition(String condition) {
     this.condition = condition;
   }
 
   public EasySearchDTO() {
     this.count = 0;
     this.intPage = Integer.valueOf(0);
     this.sumPage = 0;
     this.pageSize = Integer.valueOf(0);
     this.params = null;
     this.dictionaryMap = new HashMap(4);
   }
 
   public void setHeards(List<QuerySchemeField> heards) {
     super.setHeards(heards);
     Set s = super.getHeardComparator();
     this.headList = new ArrayList(s.size());
     this.headList.addAll(s);
   }
 
   public List<QuerySchemeField> getHeadList() {
     return this.headList;
   }
 
   public int getHeadLength() {
     int headlength = 0;
     for (int i = 0; i < this.headList.size(); i++) {
       QuerySchemeField o = (QuerySchemeField)this.headList.get(i);
       if (!o.getType().equals("hidden")) headlength++;
     }
     return headlength;
   }
 
   public int getCount() {
     return this.count;
   }
 
   public void setCount(int count) {
     this.count = count;
   }
 
   public int getIntPage() {
     return this.intPage.intValue();
   }
 
   public void setIntPage(Integer intPage) {
     this.intPage = Integer.valueOf(intPage != null ? intPage.intValue() : 1);
   }
 
   public int getPageSize() {
     return this.pageSize.intValue();
   }
 
   public void setPageSize(Integer pageSize) {
     this.pageSize = Integer.valueOf(pageSize != null ? pageSize.intValue() : 15);
   }
 
   public int getSumPage() {
     return this.sumPage;
   }
 
   public void setSumPage(int sumPage) {
     this.sumPage = sumPage;
   }
 
   public String getFolderId() {
     return this.folderId;
   }
 
   public void setFolderId(String folderId) {
     this.folderId = folderId;
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
 
   public Map<String, Object> getDictionaryMap() {
     return this.dictionaryMap;
   }
 
   public void setDictionaryMap(Map<String, Object> dictionaryMap) {
     this.dictionaryMap = dictionaryMap;
   }
 
   public void putDictionary(String code, Map<String, String> map) {
     this.dictionaryMap.put(code, map);
   }
 
   public String getEasySearchSql() {
     String beanName = getSqlBeanName();
     if (StringUtil.isBlank(beanName))
       return super.getSql();
     try
     {
       EasySearchSql sql = (EasySearchSql)SpringBeanFactory.getBean(this.servletContext, beanName, EasySearchSql.class);
       return sql.getEasySearchSql(this);
     } catch (Exception e) {
       throw new ApplicationException("调用接口错误[" + beanName + "]:" + e.getMessage());
     }
   }
 
   public String reBuildSql()
   {
     StringBuffer wheresql = new StringBuffer("1=1");
     StringBuffer tmpSql = new StringBuffer();
     String sql = getEasySearchSql();
     tmpSql.append("select rebuild.* from (").append(sql).append(") rebuild where (");
     if (!StringUtil.isBlank(this.params)) {
       if (sql.indexOf("cascadeField") != -1) {
         String[] flag = this.params.toUpperCase().split(" ");
         for (int i = 0; i < flag.length; i++)
           if ((flag[i] != null) && (!flag[i].equals(""))) {
             wheresql.append(" and  upper(rebuild.").append("cascadeField").append(") like :").append("cascadeParam" + i);
             putLikeParam("cascadeParam" + i, flag[i]);
           }
       }
       else if (sql.indexOf("commonField") != -1) {
         String[] flag = this.params.toUpperCase().split(" ");
         int length = flag.length;
         if (length > 0) {
           wheresql.append(" and (");
           for (int i = 0; i < length; i++) {
             if ((flag[i] != null) && (!flag[i].equals(""))) {
               wheresql.append(" upper(rebuild.").append("commonField").append(") like :").append("cascadeParam" + i).append(" ");
               wheresql.append("or");
               putLikeParam("cascadeParam" + i, flag[i]);
             }
           }
           if (wheresql.lastIndexOf("or") == wheresql.length() - 2) {
             wheresql.replace(wheresql.length() - 2, wheresql.length(), "");
           }
           wheresql.append(")");
         }
       } else {
         for (QuerySchemeField field : getHeards()) {
           if ((field.isCondition()) && 
             (!field.getType().equals("hidden")) && (!field.getType().equals("dictionary"))) {
             if (wheresql.length() == 3) {
               wheresql.delete(0, wheresql.length());
             }
             wheresql.append(" upper(rebuild.").append(StringUtil.getUnderscoreName(field.getCode())).append(") like :").append("cascadeParam").append(" or");
           }
 
         }
 
         putLikeParam("cascadeParam", this.params.toUpperCase());
         if (wheresql.lastIndexOf("or") == wheresql.length() - 2) {
           wheresql.replace(wheresql.length() - 2, wheresql.length(), "");
         }
       }
     }
     tmpSql.append(wheresql).append(")");
     if ((!StringUtil.isBlank(this.folderId)) && 
       (!StringUtil.isBlank(getFolderKindId()))) {
       if (getFolderKindId().equals("org")) {
         tmpSql.append(" and  rebuild.full_id like :").append("sysfolderFullId");
         putLikeParam("sysfolderFullId", this.folderId);
       } else if (!StringUtil.isBlank(getFolderIdName())) {
         tmpSql.append(" and  rebuild.").append(getFolderIdName()).append(" = :").append(getFolderIdName());
         putParam(getFolderIdName(), this.folderId);
       }
 
     }
 
     if (!StringUtil.isBlank(this.condition)) {
       this.condition = this.condition.trim();
       String start = this.condition.substring(0, 3);
       tmpSql.append(" ");
       if (start.toUpperCase().equals("AND"))
         tmpSql.append(this.condition);
       else {
         tmpSql.append("and ").append(this.condition);
       }
     }
 
     if (!StringUtil.isBlank(getOrderby())) {
       tmpSql.append(" order by ").append(getOrderby());
     }
     return tmpSql.toString();
   }
 
   public int getStart() {
     return (this.intPage.intValue() > 0 ? this.intPage.intValue() - 1 : 0) * this.pageSize.intValue();
   }
 
   public void setComputeCount(int count) {
     int s = (count + (this.pageSize.intValue() != 0 ? this.pageSize.intValue() : 1) - 1) / (this.pageSize.intValue() != 0 ? this.pageSize.intValue() : 1);
     if (this.intPage.intValue() > s) {
       this.intPage = Integer.valueOf(s);
     }
     if (this.intPage.intValue() < 1) {
       this.intPage = Integer.valueOf(1);
     }
     this.sumPage = s;
     this.count = count;
   }
 
   public List<Map<String, String>> getDatas() {
     return this.datas;
   }
 
   public void setDatas(List<Map<String, String>> datas) {
     this.datas = datas;
   }
 
   public SDO getSdo() {
     return this.sdo;
   }
 
   public void setSdo(SDO sdo) {
     this.sdo = sdo;
   }
 }

