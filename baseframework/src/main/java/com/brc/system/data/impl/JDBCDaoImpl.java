 package com.brc.system.data.impl;
 
 import com.brc.exception.ApplicationException;
 import com.brc.exception.SQLParseException;
 import com.brc.system.data.JDBCDao;
 import com.brc.system.data.QueryRowMapper;
 import com.brc.system.data.util.JDBCCallableStatementCreator;
 import com.brc.system.data.util.OrcaleLobResultSetExtractor;
 import com.brc.system.data.util.ParseSQLParam;
 import com.brc.system.data.util.RowSetUtil;
 import com.brc.system.data.util.SQLRowSetOracleResultSetExtractor;
 import com.brc.util.LogHome;
 import java.sql.PreparedStatement;
 import java.sql.SQLException;
 import java.util.Iterator;
 import java.util.List;
 import java.util.Map;
 import java.util.regex.Matcher;
 import java.util.regex.Pattern;
 import java.util.regex.PatternSyntaxException;
 import javax.sql.DataSource;
 import org.apache.log4j.Logger;
 import org.springframework.dao.DataAccessException;
 import org.springframework.jdbc.core.BatchPreparedStatementSetter;
 import org.springframework.jdbc.core.JdbcTemplate;
 import org.springframework.jdbc.core.ResultSetExtractor;
 import org.springframework.jdbc.core.SqlParameter;
 import org.springframework.jdbc.core.StatementCreatorUtils;
 import org.springframework.jdbc.core.support.AbstractLobCreatingPreparedStatementCallback;
 import org.springframework.jdbc.support.lob.LobCreator;
 import org.springframework.jdbc.support.lob.LobHandler;
 import org.springframework.jdbc.support.rowset.SqlRowSet;
 
 public class JDBCDaoImpl
   implements JDBCDao
 {
   private JdbcTemplate jdbcTemplate;
   private LobHandler lobHandler;
 
   public void setJdbcTemplate(JdbcTemplate jdbcTemplate)
   {
     this.jdbcTemplate = jdbcTemplate;
   }
 
   public void setLobHandler(LobHandler lobHandler) {
     this.lobHandler = lobHandler;
   }
 
   public DataSource getDataSource() {
     return this.jdbcTemplate.getDataSource();
   }
 
   public ResultSetExtractor getResultSetExtractor() {
     return new SQLRowSetOracleResultSetExtractor();
   }
 
   public List<Object[]> executeQuery(String sql, Object[] args)
     throws ApplicationException
   {
     SqlRowSet srs = (SqlRowSet)this.jdbcTemplate.query(sql, args, getResultSetExtractor());
     toSqlString(sql, args);
     return RowSetUtil.toArrayList(srs);
   }
 
   public <T> List<T> queryToList(String sql, Class<T> cls, Object[] args)
     throws ApplicationException
   {
     toSqlString(sql, args);
 
     SqlRowSet srs = (SqlRowSet)this.jdbcTemplate.query(sql, args, getResultSetExtractor());
     return RowSetUtil.toList(srs, cls);
   }
 
   public <T> List<T> queryToListByMapParam(String sql, Class<T> cls, Map<String, Object> param)
     throws ApplicationException
   {
     ParseSQLParam parser = getParseSqlParam(sql, param);
     return queryToList(parser.getParseSql(), cls, parser.getValues().toArray());
   }
 
   public List<?> queryToListByMapper(String sql, QueryRowMapper mapper, Object[] args)
     throws ApplicationException
   {
     toSqlString(sql, args);
     return this.jdbcTemplate.query(sql, args, mapper);
   }
 
   public List<?> queryToListByMapperMapParam(String sql, QueryRowMapper mapper, Map<String, Object> param)
     throws ApplicationException
   {
     ParseSQLParam parser = getParseSqlParam(sql, param);
     return queryToListByMapper(parser.getParseSql(), mapper, parser.getValues().toArray());
   }
 
   public List<Map<String, Object>> queryToListMap(String sql, Object[] args)
     throws ApplicationException
   {
     toSqlString(sql, args);
     SqlRowSet srs = (SqlRowSet)this.jdbcTemplate.query(sql, args, getResultSetExtractor());
     return RowSetUtil.toMapList(srs);
   }
 
   public List<Map<String, Object>> queryToMapListByMapParam(String sql, Map<String, Object> param)
     throws ApplicationException
   {
     ParseSQLParam parser = getParseSqlParam(sql, param);
     return queryToListMap(parser.getParseSql(), parser.getValues().toArray());
   }
 
   public Map<String, Object> queryToMap(String sql, Object[] args)
     throws ApplicationException
   {
     toSqlString(sql, args);
     SqlRowSet srs = (SqlRowSet)this.jdbcTemplate.query(sql, args, getResultSetExtractor());
     return RowSetUtil.toMap(srs);
   }
 
   public Map<String, Object> queryToMapByMapParam(String sql, Map<String, Object> params)
     throws ApplicationException
   {
     ParseSQLParam parser = getParseSqlParam(sql, params);
     return queryToMap(parser.getParseSql(), parser.getValues().toArray());
   }
 
   public <T> T queryToObject(String sql, Class<T> cls, Object[] args)
     throws ApplicationException
   {
     toSqlString(sql, args);
     SqlRowSet srs = (SqlRowSet)this.jdbcTemplate.query(sql, args, getResultSetExtractor());
     return RowSetUtil.toObject(srs, cls);
   }
 
   public <T> T queryToObjectByMapParam(String sql, Class<T> cls, Map<String, Object> param)
     throws ApplicationException
   {
     ParseSQLParam parser = getParseSqlParam(sql, param);
     return queryToObject(parser.getParseSql(), cls, parser.getValues().toArray());
   }
 
   public int queryToInt(String sql, Object[] args)
     throws ApplicationException
   {
     int result = 0;
     Object object = queryToObject(sql, Integer.class, args);
     if ((object != null) && (!object.toString().equals("")) && (!object.toString().equalsIgnoreCase("null"))) {
       result = Integer.parseInt(object.toString());
     }
     return result;
   }
 
   public Long getSequence(String name)
     throws ApplicationException
   {
     String sql = "select " + name + ".nextval from dual";
     SqlRowSet srs = (SqlRowSet)this.jdbcTemplate.query(sql, getResultSetExtractor());
     return (Long)RowSetUtil.toObject(srs, Long.class);
   }
 
   public Long queryToLong(String sql, Object[] args)
     throws ApplicationException
   {
     Long a = null;
     Object object = queryToObject(sql, Long.class, args);
     if ((object != null) && (!object.toString().equals("")) && (!object.toString().equalsIgnoreCase("null"))) {
       a = Long.valueOf(Long.parseLong(object.toString()));
     }
     return a;
   }
 
   public String queryToString(String sql, Object[] args)
     throws ApplicationException
   {
     return (String)queryToObject(sql, String.class, args);
   }
 
   public int executeUpdate(String sql, Object[] args)
     throws ApplicationException
   {
     toSqlString(sql, args);
     return this.jdbcTemplate.update(sql, args);
   }
 
   public int executeUpdateByMapParam(String sql, Map<String, Object> param)
     throws ApplicationException
   {
     ParseSQLParam parser = getParseSqlParam(sql, param);
     return executeUpdate(parser.getParseSql(), parser.getValues().toArray());
   }
 
   public void batchUpdate(String[] sql)
     throws ApplicationException
   {
     this.jdbcTemplate.batchUpdate(sql);
   }
 
   public void batchUpdate(String sql, final List<Object[]> dataSet)
     throws ApplicationException
   {
     BatchPreparedStatementSetter setter = new BatchPreparedStatementSetter() {
       public int getBatchSize() {
         return dataSet.size();
       }
 
       public void setValues(PreparedStatement ps, int i) {
         Object[] obj = (Object[])dataSet.get(i);
         try {
           RowSetUtil.setStatementParams(ps, obj);
         } catch (SQLException e) {
           LogHome.getLog().error(e);
           e.printStackTrace();
         }
       }
     };
     toSqlStringBatch(sql, dataSet);
     this.jdbcTemplate.batchUpdate(sql, setter);
   }
 
   public Map<String, Object> call(String sql, List<SqlParameter> declaredParameters, Object[] param)
     throws ApplicationException
   {
     toSqlString(sql, param);
     return this.jdbcTemplate.call(new JDBCCallableStatementCreator(sql, param, declaredParameters), declaredParameters);
   }
 
   private String toSqlString(String sql, Object[] args)
     throws ApplicationException
   {
     String str = sql;
     try {
       if (args != null)
         for (int i = 0; i < args.length; i++)
           try {
             str = str.replaceFirst("\\?", "'" + args[i] + "'");
           } catch (PatternSyntaxException e) {
             e.printStackTrace();
           }
     }
     catch (Exception e)
     {
       LogHome.getLog().error(e);
     }
     Matcher matcher = pattern.matcher(str);
     str = matcher.replaceAll("");
     LogHome.getLog().info(str);
     return str;
   }
 
   private String toSqlStringBatch(String sql, List<Object[]> dataSet)
     throws ApplicationException
   {
     String str = "";
     Object[] objects;
     if (dataSet != null)
     {
       for (Iterator i$ = dataSet.iterator(); i$.hasNext(); objects = (Object[])i$.next());
     }
     else {
       LogHome.getLog().info(sql);
     }
     return str;
   }
 
   private ParseSQLParam getParseSqlParam(String sql, Map<String, Object> param)
     throws SQLParseException
   {
     ParseSQLParam parser = new ParseSQLParam();
     parser.parse(sql);
     List<String> names = parser.getParameter();
     Object obj = null;
     for (String name : names) {
       obj = param.get(name);
       if (obj == null) {
         throw new SQLParseException("未找到参数:" + name + " 对应的数据！");
       }
       parser.addValue(obj);
     }
     return parser;
   }
 
   public void saveClob(String sql, final String data, final Object[] param) throws ApplicationException
   {
     this.jdbcTemplate.execute(sql, new AbstractLobCreatingPreparedStatementCallback(this.lobHandler) {
       protected void setValues(PreparedStatement pstmt, LobCreator lobCreator) throws SQLException, DataAccessException {
         lobCreator.setClobAsString(pstmt, 1, data);
         int i = 2;
         for (Object o : param) {
           StatementCreatorUtils.setParameterValue(pstmt, i, -2147483648, o);
           i++;
         }
       }
     });
   }
 
   public Map<String, Object> loadClob(String sql, String[] clobNames, Object[] param) throws ApplicationException
   {
     OrcaleLobResultSetExtractor rse = new OrcaleLobResultSetExtractor(this.lobHandler, clobNames);
     this.jdbcTemplate.query(sql, rse, param);
     return rse.getMap();
   }
 
   public String loadClob(String sql, Object[] param) throws ApplicationException
   {
     OrcaleLobResultSetExtractor rse = new OrcaleLobResultSetExtractor(this.lobHandler);
     this.jdbcTemplate.query(sql, rse, param);
     return rse.getClobString();
   }
 }

