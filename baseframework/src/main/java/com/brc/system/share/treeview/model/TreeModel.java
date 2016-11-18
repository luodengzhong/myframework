 package com.brc.system.share.treeview.model;
 
 import com.brc.util.StringUtil;
 import java.io.Serializable;
 import java.lang.reflect.Field;
 
 public class TreeModel
   implements Serializable
 {
   public static final String TREE_PARENT_ID = "treeParentId";
   private String name;
   private String desc;
   private String table;
   private String primarykey;
   private String connectby;
   private String label;
   private String orderby;
   private String order;
   private String root;
   private String hiddencol;
   private String condition;
   private String searchQueryCondition;
   private String manageType;
   private boolean ajax = false;
 
   public boolean isAjax() {
     return this.ajax;
   }
 
   public void setAjax(boolean ajax) {
     this.ajax = ajax;
   }
 
   public String getCondition() {
     return this.condition;
   }
 
   public void setCondition(String condition) {
     this.condition = condition;
   }
 
   public String getConnectby() {
     return this.connectby;
   }
 
   public void setConnectby(String connectby) {
     this.connectby = connectby;
   }
 
   public String getHiddencol() {
     return this.hiddencol;
   }
 
   public void setHiddencol(String hiddencol) {
     this.hiddencol = hiddencol;
   }
 
   public String getLabel() {
     return this.label;
   }
 
   public void setLabel(String label) {
     this.label = label;
   }
 
   public String getOrder() {
     return this.order;
   }
 
   public void setOrder(String order) {
     this.order = order;
   }
 
   public String getOrderby() {
     return this.orderby;
   }
 
   public void setOrderby(String orderby) {
     this.orderby = orderby;
   }
 
   public String getPrimarykey() {
     return this.primarykey;
   }
 
   public void setPrimarykey(String primarykey) {
     this.primarykey = primarykey;
   }
 
   public String getRoot() {
     return this.root;
   }
 
   public void setRoot(String root) {
     this.root = root;
   }
 
   public String getTable() {
     return this.table;
   }
 
   public void setTable(String table) {
     this.table = table;
   }
 
   public String getDesc() {
     return this.desc;
   }
 
   public void setDesc(String desc) {
     this.desc = desc;
   }
 
   public String getSearchQueryCondition() {
     return this.searchQueryCondition;
   }
 
   public void setSearchQueryCondition(String searchQueryCondition) {
     this.searchQueryCondition = searchQueryCondition;
   }
 
   public String getManageType() {
     return this.manageType;
   }
 
   public void setManageType(String manageType) {
     this.manageType = manageType;
   }
 
   private String getConditionSql() {
     StringBuffer conditionSql = new StringBuffer();
     if (!StringUtil.isBlank(this.condition)) {
       this.condition = this.condition.trim();
       String start = this.condition.substring(0, 3);
       conditionSql.append(" ");
       if (start.toUpperCase().equals("AND"))
         conditionSql.append(this.condition);
       else {
         conditionSql.append("and ").append(this.condition);
       }
     }
     if (!StringUtil.isBlank(this.searchQueryCondition)) {
       this.searchQueryCondition = this.searchQueryCondition.trim();
       String start = this.searchQueryCondition.substring(0, 3);
       conditionSql.append(" ");
       if (start.toUpperCase().equals("AND"))
         conditionSql.append(this.searchQueryCondition);
       else {
         conditionSql.append("and ").append(this.searchQueryCondition);
       }
     }
     return conditionSql.toString();
   }
 
   private String getHeadSql() {
     StringBuffer sb = new StringBuffer("select ");
     sb.append(this.primarykey).append(",");
     sb.append(this.connectby).append(",");
     sb.append(this.label).append(",");
     if ((this.hiddencol != null) && (!this.hiddencol.equals(""))) {
       String[] fs = this.hiddencol.split(",");
       for (String f : fs) {
         sb.append(f).append(",");
       }
     }
     sb.append("(select count(0) from ").append(this.table).append(" a where a.").append(this.connectby).append("=t.").append(this.primarykey).append(" ").append(getConditionSql()).append(")as has_children");
 
     sb.append(" from ").append(this.table).append(" t");
     return sb.toString();
   }
 
   public String getRootSql() {
     StringBuffer sb = new StringBuffer(getHeadSql());
     sb.append(" where ");
     if ((this.root != null) && (!this.root.equals("")))
       sb.append(this.root);
     else {
       sb.append(this.connectby).append(" is null");
     }
     sb.append(" ").append(getConditionSql()).append(getOrderSql());
     return sb.toString();
   }
 
   private String getOrderSql() {
     StringBuffer sb = new StringBuffer();
     if ((this.orderby != null) && (!this.orderby.equals(""))) {
       sb.append(" order by ").append(this.orderby);
     }
     if ((this.order != null) && (!this.order.equals(""))) sb.append(" ").append(this.order);
     return sb.toString();
   }
 
   public String getChildrenSql() {
     StringBuffer sb = new StringBuffer(getHeadSql());
     sb.append(" where ").append(this.connectby).append("=:treeParentId");
     sb.append(" ").append(getConditionSql()).append(getOrderSql());
     return sb.toString();
   }
 
   public String getName() {
     return this.name;
   }
 
   public void setName(String name) {
     this.name = name;
   }
 
   public void setParameter(String key, String value)
   {
     Class klass = getClass();
     try {
       Field f = klass.getDeclaredField(key.toLowerCase());
       if (f != null) f.set(this, value); 
     }
     catch (SecurityException e) { e.printStackTrace();
     } catch (NoSuchFieldException e) {
       e.printStackTrace();
     } catch (IllegalArgumentException e) {
       e.printStackTrace();
     } catch (IllegalAccessException e) {
       e.printStackTrace();
     }
   }
 }

