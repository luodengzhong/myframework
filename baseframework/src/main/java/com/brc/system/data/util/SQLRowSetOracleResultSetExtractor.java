 package com.brc.system.data.util;
 
 import java.sql.ResultSet;
 import java.sql.SQLException;
 import javax.sql.rowset.CachedRowSet;
 import oracle.jdbc.rowset.OracleCachedRowSet;
 import org.springframework.dao.DataAccessException;
 import org.springframework.jdbc.core.ResultSetExtractor;
 import org.springframework.jdbc.support.rowset.ResultSetWrappingSqlRowSet;
 import org.springframework.jdbc.support.rowset.SqlRowSet;
 
 public class SQLRowSetOracleResultSetExtractor
   implements ResultSetExtractor
 {
   public Object extractData(ResultSet rs)
     throws SQLException, DataAccessException
   {
     return createSqlRowSet(rs);
   }
 
   protected SqlRowSet createSqlRowSet(ResultSet rs) throws SQLException {
     CachedRowSet rowSet = newCachedRowSet();
     rowSet.populate(rs);
     return new ResultSetWrappingSqlRowSet(rowSet);
   }
 
   protected CachedRowSet newCachedRowSet()
     throws SQLException
   {
     return new OracleCachedRowSet();
   }
 }

