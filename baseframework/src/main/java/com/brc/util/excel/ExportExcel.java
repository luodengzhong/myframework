 package com.brc.util.excel;
 
 import com.brc.exception.ApplicationException;
 import com.brc.exception.ExportExcelException;
 import com.brc.util.FileHelper;
 import com.brc.util.Singleton;
 import com.brc.util.StringUtil;
 import com.brc.util.excel.export.ExportField;
 import com.brc.util.excel.export.HSSFExport;
 import com.brc.util.excel.export.IExcelExport;
 import com.brc.util.excel.export.XSSFExport;
 import com.brc.util.excel.export.XSSFExport.XSWriteDelegate;
 import java.io.ByteArrayInputStream;
 import java.io.File;
 import java.util.HashMap;
 import java.util.Map;
 import org.dom4j.Document;
 import org.dom4j.Element;
 import org.dom4j.io.SAXReader;
 
 public class ExportExcel
 {
   public static Element readXml(String xmlHeads, String xmlFilePath)
     throws Exception
   {
     SAXReader reader = new SAXReader();
     Document document = null;
     if ((xmlHeads != null) && (!xmlHeads.equals("")))
     {
       document = reader.read(new ByteArrayInputStream(xmlHeads.getBytes("UTF-8")));
 
       return document.getRootElement();
     }if ((xmlFilePath != null) && (!xmlFilePath.equals(""))) {
       File file = new File("" + FileHelper.FILE_SEPARATOR + xmlFilePath);
       if ((file != null) && (file.exists()))
         document = reader.read(file);
       else {
         document = reader.read(new File(xmlFilePath));
       }
       return document.getRootElement();
     }
     throw new ApplicationException("表头不存在，不能导出Excel!");
   }
 
   public static Object getObjectValue(ExportField field, Object value)
   {
     if (value == null) return "";
     if ((value instanceof java.sql.Date)) {
       return new java.util.Date(((java.sql.Date)value).getTime());
     }
     if (!StringUtil.isBlank(field.getDictionary())) {
       String textView = Singleton.getDictionaryDetailText(field.getDictionary(), value);
       if (textView != null) {
         return textView;
       }
     }
     return value;
   }
 
   public static String createExcel(String xml)
   {
     IExcelExport exporter = new XSSFExport();
     try {
       Element headRoot = readXml(xml, null);
       exporter.setHeadRoot(headRoot);
       String s = exporter.expExcel();
       File file = new File(s);
       if (file.exists()) {
         return s;
       }
       throw new ExportExcelException("文件生成失败!");
     }
     catch (Exception e) {
       throw new ExportExcelException(e);
     }
   }
 
   public static Map<String, Object> doExport(String head) {
     return doExport(null, head, null, 1);
   }
 
   public static Map<String, Object> doExport(Map<String, Object> datas, String head) {
     return doExport(datas, head, null, 1);
   }
 
   public static Map<String, Object> doExport(Map<String, Object> datas, String head, String xmlPath) {
     return doExport(datas, head, xmlPath, 1);
   }
 
   public static Map<String, Object> doExport(XSSFExport.XSWriteDelegate delegate, Map<String, Object> datas, String head) {
     Map m = new HashMap(1);
     XSSFExport exporter = new XSSFExport();
     try
     {
       Element headRoot = readXml(head, null);
       exporter.setDatas(datas);
       exporter.setHeadRoot(headRoot);
       exporter.setDelegate(delegate);
       String s = exporter.expExcel();
       File file = new File(s);
       if (file.exists())
         m.put("file", file.getName());
       else
         throw new ExportExcelException("文件生成失败!");
     }
     catch (Exception e) {
       throw new ExportExcelException(e);
     }
     return m;
   }
 
   public static Map<String, Object> doExport(Map<String, Object> datas, String head, String xmlPath, int type)
   {
     Map m = new HashMap(1);
     IExcelExport exporter = null;
     if (type == 0)
       exporter = new HSSFExport();
     else
       exporter = new XSSFExport();
     try
     {
       Element headRoot = readXml(head, xmlPath);
       exporter.setDatas(datas);
       exporter.setHeadRoot(headRoot);
       String s = exporter.expExcel();
       File file = new File(s);
       if (file.exists())
         m.put("file", file.getName());
       else
         throw new ExportExcelException("文件生成失败!");
     }
     catch (Exception e) {
       throw new ExportExcelException(e);
     }
     return m;
   }
 }

