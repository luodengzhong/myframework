 package com.brc.system.data.util;
 
 import com.brc.exception.SQLParseException;
 import java.io.PrintStream;
 import java.util.ArrayList;
 import java.util.List;
 
 public class ParseSQLParam
 {
   private StringBuffer sql = new StringBuffer();
   private List<String> parameter = new ArrayList(4);
   private List<Object> values = new ArrayList(4);
 
   public String getParseSql() {
     return this.sql.toString();
   }
 
   public List<String> getParameter() {
     return this.parameter;
   }
 
   public List<Object> getValues() {
     return this.values;
   }
 
   public void addValue(Object value) {
     this.values.add(value);
   }
 
   public static int firstIndexOfChar(String sqlString, String string, int startindex)
   {
     int matchAt = -1;
     for (int i = 0; i < string.length(); i++) {
       int curMatch = sqlString.indexOf(string.charAt(i), startindex);
       if (curMatch >= 0)
       {
         if (matchAt == -1)
           matchAt = curMatch;
         else
           matchAt = Math.min(matchAt, curMatch); 
       }
     }
     return matchAt;
   }
 
   public static boolean isEmpty(String string) {
     return (string == null) || (string.length() == 0);
   }
 
   public void other(char character) {
     this.sql.append(character);
   }
 
   public void namedParameter(String name) {
     this.parameter.add(name);
     this.sql.append('?');
   }
 
   public void parse(String sqlString) throws SQLParseException {
     int stringLength = sqlString.length();
     boolean inQuote = false;
     for (int indx = 0; indx < stringLength; indx++) {
       char c = sqlString.charAt(indx);
       if (inQuote) {
         if ('\'' == c)
           inQuote = false;
         other(c);
       }
       else if ('\'' == c) {
         inQuote = true;
         other(c);
       }
       else if (c == ':') {
         int right = firstIndexOfChar(sqlString, " \n\r\f\t,()=<>&|+-=/*'^![]#~\\", indx + 1);
 
         int chopLocation = right >= 0 ? right : sqlString.length();
         String param = sqlString.substring(indx + 1, chopLocation);
         if (isEmpty(param)) {
           throw new SQLParseException("Space is not allowed after parameter prefix ':' '" + sqlString + "'");
         }
 
         namedParameter(param);
         indx = chopLocation - 1;
       }
       else if (c == '?') {
         if ((indx < stringLength - 1) && (Character.isDigit(sqlString.charAt(indx + 1))))
         {
           int right = firstIndexOfChar(sqlString, " \n\r\f\t,()=<>&|+-=/*'^![]#~\\", indx + 1);
 
           int chopLocation = right >= 0 ? right : sqlString.length();
           String param = sqlString.substring(indx + 1, chopLocation);
           try {
             new Integer(param);
           } catch (NumberFormatException e) {
             throw new SQLParseException("JPA-style positional param was not an integral ordinal");
           }
 
           namedParameter(param);
           indx = chopLocation - 1;
         }
         else {
           other(c);
         }
       } else { other(c); }
     }
   }
 
   public static void main(String[] a)
   {
     String sql = "select *\n  from table1 t1, table2 t2\n where 1 = 1\n   and t1.type = :a\n    or t1.type = :b\n   and t2.type = :c\n   and t2.type like :c";
 
     ParseSQLParam test = new ParseSQLParam();
     try {
       test.parse(sql);
       System.out.println(test.sql.toString());
       System.out.println(test.parameter);
     } catch (Exception e) {
       e.printStackTrace();
     }
   }
 }

