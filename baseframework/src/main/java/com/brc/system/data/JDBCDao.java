 package com.brc.system.data;
 
 import com.brc.exception.ApplicationException;
 import java.util.List;
 import java.util.Map;
 import java.util.regex.Pattern;
 import javax.sql.DataSource;
 import org.springframework.jdbc.core.SqlParameter;
 
 public abstract interface JDBCDao
 {
   public static final Pattern pattern = Pattern.compile("\t|\r|\n");
 
   public abstract DataSource getDataSource();
 
   public abstract List<Object[]> executeQuery(String paramString, Object[] paramArrayOfObject)
     throws ApplicationException;
 
   public abstract <T> List<T> queryToList(String paramString, Class<T> paramClass, Object[] paramArrayOfObject)
     throws ApplicationException;
 
   public abstract <T> List<T> queryToListByMapParam(String paramString, Class<T> paramClass, Map<String, Object> paramMap)
     throws ApplicationException;
 
   public abstract List<?> queryToListByMapper(String paramString, QueryRowMapper paramQueryRowMapper, Object[] paramArrayOfObject)
     throws ApplicationException;
 
   public abstract List<?> queryToListByMapperMapParam(String paramString, QueryRowMapper paramQueryRowMapper, Map<String, Object> paramMap)
     throws ApplicationException;
 
   public abstract List<Map<String, Object>> queryToListMap(String paramString, Object[] paramArrayOfObject)
     throws ApplicationException;
 
   public abstract List<Map<String, Object>> queryToMapListByMapParam(String paramString, Map<String, Object> paramMap)
     throws ApplicationException;
 
   public abstract Map<String, Object> queryToMap(String paramString, Object[] paramArrayOfObject)
     throws ApplicationException;
 
   public abstract Map<String, Object> queryToMapByMapParam(String paramString, Map<String, Object> paramMap)
     throws ApplicationException;
 
   public abstract <T> T queryToObject(String paramString, Class<T> paramClass, Object[] paramArrayOfObject)
     throws ApplicationException;
 
   public abstract <T> T queryToObjectByMapParam(String paramString, Class<T> paramClass, Map<String, Object> paramMap)
     throws ApplicationException;
 
   public abstract int queryToInt(String paramString, Object[] paramArrayOfObject)
     throws ApplicationException;
 
   public abstract Long getSequence(String paramString)
     throws ApplicationException;
 
   public abstract Long queryToLong(String paramString, Object[] paramArrayOfObject)
     throws ApplicationException;
 
   public abstract String queryToString(String paramString, Object[] paramArrayOfObject)
     throws ApplicationException;
 
   public abstract int executeUpdate(String paramString, Object[] paramArrayOfObject)
     throws ApplicationException;
 
   public abstract int executeUpdateByMapParam(String paramString, Map<String, Object> paramMap)
     throws ApplicationException;
 
   public abstract void batchUpdate(String[] paramArrayOfString)
     throws ApplicationException;
 
   public abstract void batchUpdate(String paramString, List<Object[]> paramList)
     throws ApplicationException;
 
   public abstract Map<String, Object> call(String paramString, List<SqlParameter> paramList, Object[] paramArrayOfObject)
     throws ApplicationException;
 
   public abstract void saveClob(String paramString1, String paramString2, Object[] paramArrayOfObject)
     throws ApplicationException;
 
   public abstract Map<String, Object> loadClob(String paramString, String[] paramArrayOfString, Object[] paramArrayOfObject)
     throws ApplicationException;
 
   public abstract String loadClob(String paramString, Object[] paramArrayOfObject)
     throws ApplicationException;
 }

