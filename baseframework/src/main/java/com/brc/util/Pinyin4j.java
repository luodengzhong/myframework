 package com.brc.util;
 import java.util.HashSet;
 import java.util.Iterator;
 import java.util.Set;

 import net.sourceforge.pinyin4j.PinyinHelper;
 import net.sourceforge.pinyin4j.format.HanyuPinyinCaseType;
 import net.sourceforge.pinyin4j.format.HanyuPinyinOutputFormat;
 import net.sourceforge.pinyin4j.format.HanyuPinyinToneType;
 import net.sourceforge.pinyin4j.format.HanyuPinyinVCharType;
 import net.sourceforge.pinyin4j.format.exception.BadHanyuPinyinOutputFormatCombination;
 
 public class Pinyin4j
 {
   public static String makeStringByStringSet(Set<String> stringSet)
   {
     StringBuilder str = new StringBuilder();
     int i = 0;
     for (String s : stringSet) {
       if (i == stringSet.size() - 1)
         str.append(s);
       else {
         str.append(new StringBuilder().append(s).append(",").toString());
       }
       i++;
     }
     return str.toString().toLowerCase();
   }
 
   public static String makeString(String str) {
     Set stringSet = getPinyin(str);
     Iterator i$ = stringSet.iterator(); if (i$.hasNext()) { String s = (String)i$.next();
       return s;
     }
     return "";
   }
 
   public static Set<String> getPinyin(String src)
   {
     if ((src != null) && (!src.trim().equalsIgnoreCase("")))
     {
       char[] srcChar = src.toCharArray();
 		
       HanyuPinyinOutputFormat hanYuPinOutputFormat = new HanyuPinyinOutputFormat();
 
       hanYuPinOutputFormat.setCaseType(HanyuPinyinCaseType.LOWERCASE);
       hanYuPinOutputFormat.setToneType(HanyuPinyinToneType.WITHOUT_TONE);
       hanYuPinOutputFormat.setVCharType(HanyuPinyinVCharType.WITH_V);
 
       String[][] temp = new String[src.length()][];
       for (int i = 0; i < srcChar.length; i++) {
         char c = srcChar[i];
 
         if (String.valueOf(c).matches("[\\u4E00-\\u9FA5]+"))
           try {
             temp[i] = PinyinHelper.toHanyuPinyinStringArray(srcChar[i], hanYuPinOutputFormat);
           } catch (BadHanyuPinyinOutputFormatCombination e) {
             e.printStackTrace();
           }
         else if (((c >= 'A') && (c <= 'Z')) || ((c >= 'a') && (c <= 'z'))){
						String [] t =  { String.valueOf(srcChar[i]) };
	           temp[i] = t ;
					}
         else {
						String [] t =  { String.valueOf(srcChar[i]) };
	           temp[i] = t ;
         }
       }
       String[] pingyinArray = Exchange(temp);
       Set pinyinSet = new HashSet();
       for (int i = 0; i < pingyinArray.length; i++) {
         pinyinSet.add(pingyinArray[i]);
       }
       return pinyinSet;
     }
     return null;
   }
 
   public static String[] Exchange(String[][] strJaggedArray)
   {
     String[][] temp = DoExchange(strJaggedArray);
     return temp[0];
   }
 
   private static String[][] DoExchange(String[][] strJaggedArray)
   {
     int len = strJaggedArray.length;
     if (len >= 2) {
       int len1 = strJaggedArray[0].length;
       int len2 = strJaggedArray[1].length;
       int newlen = len1 * len2;
       String[] temp = new String[newlen];
       int Index = 0;
       for (int i = 0; i < len1; i++) {
         for (int j = 0; j < len2; j++) {
           temp[Index] = new StringBuilder().append(strJaggedArray[0][i]).append(strJaggedArray[1][j]).toString();
           Index++;
         }
       }
       String[][] newArray = new String[len - 1][];
       for (int i = 2; i < len; i++) {
         newArray[(i - 1)] = strJaggedArray[i];
       }
       newArray[0] = temp;
       return DoExchange(newArray);
     }
     return strJaggedArray;
   }
 
   public static void main(String[] args)
   {
     String str = "谢昕1";
     System.out.println(makeString(str));
   }
 }

