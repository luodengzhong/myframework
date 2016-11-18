 package com.brc.system.data.impl;
 
 import org.springframework.jdbc.core.ResultSetExtractor;
 import org.springframework.jdbc.core.SqlRowSetResultSetExtractor;
 
 public class SQLServerJDBCDaoImpl extends JDBCDaoImpl
 {
   public ResultSetExtractor<?> getResultSetExtractor()
   {
     return new SqlRowSetResultSetExtractor();
   }
 }

