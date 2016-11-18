 package com.brc.util;
 
 import java.io.ByteArrayOutputStream;
 import java.io.IOException;
 import java.io.PrintStream;
 import java.math.BigDecimal;
 import java.net.URLDecoder;
 import java.net.URLEncoder;
 import java.util.HashMap;
 import java.util.List;
 import java.util.Map;
 import java.util.regex.Matcher;
 import java.util.regex.Pattern;
 import java.util.zip.GZIPOutputStream;
 
 public class StringUtil
 {
   private static final int CODE_BEGIN = 45217;
   private static final int CODE_END = 63486;
   private static char[] chinese_letter = { '啊', 33453, '擦', '搭', 34558, '发', '噶', '哈', '哈', '击', '喀', '垃', '妈', '拿', '哦', '啪', '期', '然', '撒', '塌', '塌', '塌', '挖', '昔', '压', '匝' };
 
   private static int[] english_letter = new int[27];
 
   private static char[] initial_table = { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'h', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 't', 't', 'w', 'x', 'y', 'z' };
   private static final Map<String, String> matcher;
   public static Pattern numberPattern = Pattern.compile("^(-?[1-9]\\d*\\.?\\d*)|(-?0\\.\\d*[1-9])|(-?[0])|(-?[0]\\.\\d*)$");
 
   public static String getFirstLetter(String s)
   {
     StringBuffer sb = new StringBuffer();
     int StrLength = s.length();
     try
     {
       for (int i = 0; i < StrLength; i++)
         sb.append(charToInitial(s.charAt(i)));
     }
     catch (Exception e) {
       return s;
     }
     return sb.toString().toUpperCase();
   }
 
   private static char charToInitial(char ch)
   {
     if ((ch >= 'a') && (ch <= 'z')) return (char)(ch - 'a' + 65);
     if ((ch >= 'A') && (ch <= 'Z')) return ch;
 
     int gb = getChineseCode(ch);
     if ((gb < 45217) || (gb > 63486)) {
       return ch;
     }
				int i = 0;
     for (; (i < 26) && ((gb < english_letter[i]) || (gb >= english_letter[(i + 1)])); i++);
     if (gb == 63486) {
       i = 25;
     }
     return initial_table[i];
   }
 
   private static int getChineseCode(char ch)
   {
     String str = new String();
     str = new StringBuilder().append(str).append(ch).toString();
     try {
       byte[] bytes = str.getBytes("GB2312");
       if (bytes.length < 2) return 0;
       return (bytes[0] << 8 & 0xFF00) + (bytes[1] & 0xFF); } catch (Exception e) {
     }
     return 0;
   }
 
   public static String decode(String input)
   {
     if (isBlank(input))
       return "";
     try
     {
       return URLDecoder.decode(input, "utf-8").trim(); } catch (Exception e) {
     }
     return input;
   }
 
   public static String encode(String input)
   {
     if (isBlank(input))
       return "";
     try
     {
       return URLEncoder.encode(input, "utf-8").trim(); } catch (Exception e) {
     }
     return input;
   }
 
   public static String formatToCurrency(BigDecimal b)
   {
     if (b != null) {
       return formatToCurrency(b.toString());
     }
     return "";
   }
 
   public static String formatToCurrency(String str)
   {
     if (isBlank(str)) {
       return "";
     }
     String tmp = keepDigit(str.trim(), 2, true);
     boolean flag = tmp.indexOf("-") >= 0;
     tmp = flag ? tmp.substring(1, tmp.length()) : tmp;
 
     int i = tmp.lastIndexOf(".");
     i = i < 0 ? tmp.length() - 3 : i - 3;
 
     while (i > 0) {
       tmp = new StringBuilder().append(tmp.substring(0, i)).append(",").append(tmp.substring(i)).toString();
       i -= 3;
     }
     if (flag) {
       tmp = new StringBuilder().append("-").append(tmp).toString();
     }
     return tmp;
   }
 
   public static String keepDigit(String value, int i, boolean recruitZero)
   {
     if (!isBlank(value)) {
       BigDecimal bd = new BigDecimal(value);
       bd = bd.setScale(i, 4);
       if (recruitZero) {
         return bd.toString();
       }
       String tmp = bd.toString();
       while ((tmp.indexOf(".") > 0) && ((tmp.endsWith("0")) || (tmp.endsWith(".")))) {
         tmp = tmp.substring(0, tmp.length() - 1);
       }
       return tmp;
     }
 
     return null;
   }
 
   public static byte[] compress(String str)
     throws IOException
   {
     ByteArrayOutputStream out = new ByteArrayOutputStream();
     GZIPOutputStream gzip = new GZIPOutputStream(out);
     gzip.write(str.getBytes("UTF-8"));
     gzip.close();
     return out.toByteArray();
   }
 
   public static boolean checkInteger(int purview, int optPurview)
   {
     int purviewValue = (int)Math.pow(2.0D, optPurview);
     return (purview & purviewValue) == purviewValue;
   }
 
   public static boolean isMatcher(String type, String value)
   {
     if ((isBlank(value)) || (isBlank(type))) return true;
     String match = (String)matcher.get(type);
     if (isBlank(match)) {
       match = type;
     }
     Pattern pattern = Pattern.compile(match);
     Matcher matcher = pattern.matcher(value);
     return matcher.matches();
   }
 
   public static boolean isNumber(Object str)
   {
     if ((str == null) || (str.toString().equals(""))) return false;
     return numberPattern.matcher(str.toString()).matches();
   }
 
   public static boolean isBlank(String str)
   {
     if (null == str) return true;
     if ("".equals(str.trim())) return true;
 
     return false;
   }
 
   public static int toInt(String s) {
     if ((s == null) || (s.equals(""))) return -1; try
     {
       return Integer.parseInt(s); } catch (Exception e) {
     }
     return -1;
   }
 
   public static String stringFilter(String str)
   {
     if (!isBlank(str)) {
       String regEx = "[`~!@#$%^&*()+=|{}':;',\\[\\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]";
       Pattern p = Pattern.compile(regEx);
       Matcher m = p.matcher(str);
       return m.replaceAll("").trim();
     }
     return str;
   }
 
   public static boolean hasField(String sql, String field)
   {
     String reg = new StringBuilder().append("(\\s|,|.)(").append(field.toUpperCase()).append(")(,|\\s)").toString();
     Pattern p = Pattern.compile(reg, 2);
     Matcher m = p.matcher(sql.toUpperCase());
     return m.find();
   }
 
   public static String getUnderscoreName(String name)
   {
     StringBuilder result = new StringBuilder();
     if ((name != null) && (name.length() > 0))
     {
       result.append(name.substring(0, 1).toUpperCase());
 
       for (int i = 1; i < name.length(); i++) {
         String s = name.substring(i, i + 1);
 
         if ((s.equals(s.toUpperCase())) && (!s.equals(",")) && (!s.equals("_")) && (!s.trim().equals("")) && (!Character.isDigit(s.charAt(0)))) {
           result.append("_");
         }
 
         result.append(s.toUpperCase());
       }
     }
     return result.toString();
   }
 
   public static String getHumpName(String columnName)
   {
     if ((columnName == null) || (columnName.length() == 0)) {
       return "";
     }
     columnName = columnName.toLowerCase();
     StringBuffer sb = new StringBuffer();
     String regex = "_";
     String addString = "";
     String[] sbArr = columnName.split(regex);
     if ((sbArr.length == 1) && (sbArr[0].length() == 1))
       sb.append(sbArr[0]);
     else {
       for (int i = 0; i < sbArr.length; i++) {
         if (i == 0) {
           if (sbArr[i].length() == 1)
             addString = sbArr[i].toUpperCase();
           else {
             addString = sbArr[i];
           }
         }
         else if (sbArr[i].length() == 1)
           addString = sbArr[i].toUpperCase();
         else {
           addString = new StringBuilder().append(sbArr[i].substring(0, 1).toUpperCase()).append(sbArr[i].substring(1, sbArr[i].length())).toString();
         }
 
         sb.append(addString);
       }
     }
     return sb.toString();
   }
 
   public static boolean isNumeric(String str)
   {
     int i = str.length();
     while (true) { i--; if (i < 0) break;
       int chr = str.charAt(i);
       if ((chr < 48) || (chr > 57)) return false;
     }
     return true;
   }
 
   public static String patternParser(String s, Map<?, ?> map)
     throws Exception
   {
     if (isBlank(s)) {
       return "";
     }
     String name = ""; String value = "";
     StringBuffer sb = new StringBuffer();
     boolean result = false;
 
     String reg = "\\{(.*?)\\}";
     Pattern p = Pattern.compile(reg, 2);
     Matcher m = p.matcher(s);
     result = m.find();
     while (result) {
       if (m.group(1) != null) {
         name = m.group(1).trim();
         value = (String)ClassHelper.convert(map.get(name), String.class);
         if (value != null)
           m.appendReplacement(sb, value);
         else {
           m.appendReplacement(sb, "");
         }
       }
       result = m.find();
     }
     m.appendTail(sb);
     return sb.toString();
   }
 
   public static String patternParser(String s, List<Object> list)
     throws Exception
   {
     if (isBlank(s)) {
       return "";
     }
     StringBuffer sb = new StringBuffer();
     boolean result = false;
 
     String reg = "\\{([0-9]+)\\}";
     Pattern p = Pattern.compile(reg, 2);
     Matcher m = p.matcher(s);
     result = m.find();
     String value = null;
     int index = 0; int length = list.size();
     while (result) {
       if (m.group(1) != null) {
         index = ((Integer)ClassHelper.convert(m.group(1).trim(), Integer.class)).intValue();
         if (index < length)
           value = (String)ClassHelper.convert(list.get(index), String.class);
         else {
           value = null;
         }
         if (value != null)
           m.appendReplacement(sb, value);
         else {
           m.appendReplacement(sb, "");
         }
       }
       result = m.find();
     }
     m.appendTail(sb);
     return sb.toString();
   }
 
   public static String initUpper(String str)
   {
     String tmp = str.length() > 1 ? str.substring(1) : "";
     return new StringBuilder().append(str.substring(0, 1).toUpperCase()).append(tmp).toString();
   }
 
   public static String initLower(String str)
   {
     String tmp = str.length() > 1 ? str.substring(1) : "";
     return new StringBuilder().append(str.substring(0, 1).toLowerCase()).append(tmp).toString();
   }
 
   public static String digitUppercase(BigDecimal n)
   {
     String[] fraction = { "角", "分" };
     String[] digit = { "零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖" };
     String[][] unit = { { "元", "万", "亿" }, { "", "拾", "佰", "仟" } };
 
     String head = n.signum() < 0 ? "负" : "";
     n = n.abs();
 
     String s = "";
     for (int i = 0; i < fraction.length; i++)
     {
       BigDecimal cn = n.movePointRight(i + 1).setScale(0, 3).remainder(new BigDecimal("10"));
       s = new StringBuilder().append(s).append(new StringBuilder().append(digit[cn.intValue()]).append(fraction[i]).toString().replaceAll("(零.)+", "")).toString();
     }
     if (s.length() < 1) {
       s = "整";
     }
 
     BigDecimal integerPart = n.setScale(0, 3);
 
     for (int i = 0; (i < unit[0].length) && (integerPart.signum() > 0); i++) {
       String p = "";
       for (int j = 0; (j < unit[1].length) && (n.signum() > 0); j++) {
         p = new StringBuilder().append(digit[integerPart.remainder(new BigDecimal("10")).intValue()]).append(unit[1][j]).append(p).toString();
         integerPart = integerPart.divide(new BigDecimal("10"));
       }
       s = new StringBuilder().append(p.replaceAll("(零.)*零$", "").replaceAll("^$", "零")).append(unit[0][i]).append(s).toString();
     }
     return new StringBuilder().append(head).append(s.replaceAll("(零.)*零元", "元").replaceFirst("(零.)+", "").replaceAll("(零.)+", "零").replaceAll("^整$", "零元整")).toString();
   }
 
   public static String stringToAscii(String value)
   {
     StringBuffer sbu = new StringBuffer();
     char[] chars = value.toCharArray();
     for (int i = 0; i < chars.length; i++) {
       if (i != chars.length - 1)
         sbu.append(chars[i]).append(",");
       else {
         sbu.append(chars[i]);
       }
     }
     return sbu.toString();
   }
 
   public static String asciiToString(String value)
   {
     StringBuffer sbu = new StringBuffer();
     String[] chars = value.split(",");
     for (int i = 0; i < chars.length; i++) {
       sbu.append((char)Integer.parseInt(chars[i]));
     }
     return sbu.toString();
   }
 
   public static void main(String[] ras)
     throws Exception
   {
     System.out.println(Pinyin4j.makeString("王娜"));
   }
 
   static
   {
     for (int i = 0; i < 26; i++)
     {
       english_letter[i] = getChineseCode(chinese_letter[i]);
     }
     english_letter[26] = 63486;
 
     matcher = new HashMap();
 
     matcher.put("email", "^([a-z0-9A-Z]+[-|\\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-zA-Z]{2,}$");
     matcher.put("url", "^(http|www|ftp|)?(://)?(//w+(-//w+)*)(//.(//w+(-//w+)*))*((://d+)?)(/(//w+(-//w+)*))*(//.?(//w)*)(//?)?(((//w*%)*(//w*//?)*(//w*:)*(//w*//+)*(//w*//.)*(//w*&)*(//w*-)*(//w*=)*(//w*%)*(//w*//?)*(//w*:)*(//w*//+)*(//w*//.)*(//w*&)*(//w*-)*(//w*=)*)*(//w*)*)$");
 
     matcher.put("ip", "(2[5][0-5]|2[0-4]\\d|1\\d{2}|\\d{1,2})\\.(25[0-5]|2[0-4]\\d|1\\d{2}|\\d{1,2})\\.(25[0-5]|2[0-4]\\d|1\\d{2}|\\d{1,2})\\.(25[0-5]|2[0-4]\\d|1\\d{2}|\\d{1,2})");
 
     matcher.put("phone", "^[1]([3][0-9]{1}|59|58|88|89)[0-9]{8}$");
     matcher.put("number", "^(-?[1-9]\\d*\\.?\\d*)|(-?0\\.\\d*[1-9])|(-?[0])|(-?[0]\\.\\d*)$");
     matcher.put("letter", "^[A-Za-z0-9]+$");
   }
 }

