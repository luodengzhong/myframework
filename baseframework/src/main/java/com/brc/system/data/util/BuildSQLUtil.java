 package com.brc.system.data.util;
 
 import com.brc.util.SDO;
 import com.brc.util.StringUtil;
 
 public class BuildSQLUtil
 {
   public static String getOracleOptimizeSQL(int start, int pageSize, String sql)
   {
     if (pageSize < 0) return sql;
     String sToItem = String.valueOf(start + pageSize + 1);
     StringBuffer strSqlQuery = new StringBuffer();
     strSqlQuery.append("SELECT * FROM (SELECT ROWNUM AS MY_ROWNUM,TABLE_A.* FROM(");
     strSqlQuery.append(sql);
     strSqlQuery.append(") TABLE_A WHERE ROWNUM<").append(sToItem);
     strSqlQuery.append(") WHERE MY_ROWNUM>").append(start);
     return strSqlQuery.toString();
   }
 
   public static String getOracleOptimizeSQL(SDO sdo, String sql)
   {
     Integer pageSize = (Integer)sdo.getProperty("pagesize", Integer.class);
     pageSize = Integer.valueOf(pageSize != null ? pageSize.intValue() : 20);
     Integer pageIndex = (Integer)sdo.getProperty("page", Integer.class);
     pageIndex = Integer.valueOf(pageIndex != null ? pageIndex.intValue() : 1);
     int start = (pageIndex.intValue() > 0 ? pageIndex.intValue() - 1 : 0) * pageSize.intValue();
     int startPos = 0;
     int size = -1;
     if (pageSize.intValue() > 0) {
       startPos = start;
       size = pageSize.intValue();
     }
     if (pageSize.intValue() < 0) return sql;
     String sToItem = String.valueOf(startPos + size + 1);
     StringBuffer strSqlQuery = new StringBuffer();
     strSqlQuery.append("SELECT * FROM (SELECT ROWNUM AS MY_ROWNUM,TABLE_A.* FROM(");
     strSqlQuery.append(sql);
     strSqlQuery.append(") TABLE_A WHERE ROWNUM<").append(sToItem);
     strSqlQuery.append(") WHERE MY_ROWNUM>").append(startPos);
     return strSqlQuery.toString();
   }
 
   public static String getTotalSql(String sql)
   {
     return "select count(0) from (" + sql + ")";
   }
 
   public static String getTotleFieldsSql(String sql, String totleFields)
   {
     boolean flag = false;
     String[] fields = totleFields.split(",");
     String fieldName = "";
     StringBuffer sb = new StringBuffer("select ");
     for (int i = 0; i < fields.length; i++) {
       fieldName = StringUtil.getUnderscoreName(fields[i]);
       if (StringUtil.hasField(sql, fieldName)) {
         flag = true;
         sb.append("sum(").append(fieldName).append(") as ").append(fieldName).append(",");
       }
     }
     if (!flag) return "";
     sb.replace(sb.length() - 1, sb.length(), "");
     sb.append(" from (").append(sql).append(")");
     return sb.toString();
   }
 }

