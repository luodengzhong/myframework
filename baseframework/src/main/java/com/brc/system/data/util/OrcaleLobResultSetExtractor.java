 package com.brc.system.data.util;
 
 import com.brc.util.ListUtil;
 import com.brc.util.Singleton;
 import com.brc.util.StringUtil;
 import java.io.IOException;
 import java.sql.ResultSet;
 import java.sql.ResultSetMetaData;
 import java.sql.SQLException;
 import java.util.HashMap;
 import java.util.Map;
 import org.springframework.dao.DataAccessException;
 import org.springframework.jdbc.core.support.AbstractLobStreamingResultSetExtractor;
 import org.springframework.jdbc.support.lob.LobHandler;
 
 public class OrcaleLobResultSetExtractor extends AbstractLobStreamingResultSetExtractor
 {
   private LobHandler lobHandler;
   private String clobString;
   private String[] clobColumnNames;
   private Map<String, Object> map;
 
   public OrcaleLobResultSetExtractor(LobHandler lobHandler)
   {
     this.lobHandler = lobHandler;
   }
 
   public OrcaleLobResultSetExtractor(LobHandler lobHandler, String[] clobColumnNames) {
     this.lobHandler = lobHandler;
     this.clobColumnNames = clobColumnNames;
   }
 
   public String getClobString() {
     return this.clobString;
   }
 
   public Map<String, Object> getMap() {
     return this.map;
   }
 
   protected void handleNoRowFound() throws DataAccessException
   {
     this.map = new HashMap(1);
   }
 
   protected void streamData(ResultSet resultset) throws SQLException, IOException, DataAccessException
   {
     if ((this.clobColumnNames == null) || (this.clobColumnNames.length == 0)) {
       this.clobString = this.lobHandler.getClobAsString(resultset, 1);
     } else {
       ResultSetMetaData rsmd = resultset.getMetaData();
       int columnCount = rsmd.getColumnCount();
       this.map = new HashMap(columnCount);
       String columnName = "";
       String key = "";
       for (int i = 0; i < columnCount; i++) {
         columnName = rsmd.getColumnLabel(i + 1).trim();
         key = StringUtil.getHumpName(columnName);
         if (ListUtil.contains(this.clobColumnNames, key)) {
           this.map.put(key, this.lobHandler.getClobAsString(resultset, columnName));
         } else {
           Object value = resultset.getObject(i + 1);
           String textView = Singleton.getDictionaryDetailText(key, value);
           if (textView != null) {
             this.map.put(key + "TextView", textView);
           }
           this.map.put(key, RowSetUtil.convertValue(value));
         }
       }
     }
   }
 }

