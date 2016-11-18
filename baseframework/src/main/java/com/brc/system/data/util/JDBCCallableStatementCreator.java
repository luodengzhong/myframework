 package com.brc.system.data.util;
 
 import java.sql.CallableStatement;
 import java.sql.Connection;
 import java.sql.SQLException;
 import java.util.List;
 import org.springframework.jdbc.core.CallableStatementCreator;
 import org.springframework.jdbc.core.SqlOutParameter;
 
 public class JDBCCallableStatementCreator
   implements CallableStatementCreator
 {
   private Object[] params;
   private String sql;
   private List declaredParameters;
 
   public JDBCCallableStatementCreator(String sql, Object[] params, List declaredParameters)
   {
     this.params = params;
     this.sql = sql;
     this.declaredParameters = declaredParameters;
   }
 
   public CallableStatement createCallableStatement(Connection con) throws SQLException
   {
     CallableStatement cs = con.prepareCall(this.sql);
     int i = 1;
     if ((null != this.params) && (this.params.length > 0)) {
       RowSetUtil.setStatementParams(cs, this.params);
     }
     if ((null == this.declaredParameters) || (0 == this.declaredParameters.size())) {
       return cs;
     }
     for (; i <= this.declaredParameters.size(); i++) {
       if ((this.declaredParameters.get(i - 1) instanceof SqlOutParameter)) {
         cs.registerOutParameter(i, ((SqlOutParameter)this.declaredParameters.get(i - 1)).getSqlType());
       }
 
     }
 
     return cs;
   }
 }

