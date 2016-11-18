 package com.brc.util.excel.reader;
 
 public class ExcelReaderUtil
 {
   public static final String EXT_EXCEL03 = ".xls";
   public static final String EXT_EXCEL07 = ".xlsx";
 
   public static void readExcel(IExcelRowReader reader, String fileName)
     throws Exception
   {
     if (fileName.endsWith(".xls")) {
       HxlsReader reader03 = new HxlsReader(fileName);
       reader03.setRowReader(reader);
       reader03.process();
     }
     else if (fileName.endsWith(".xlsx")) {
       XxlsReader reader07 = new XxlsReader();
       reader07.setRowReader(reader);
       reader07.process(fileName);
     } else {
       throw new Exception("文件格式错误，fileName的扩展名只能是xls或xlsx。");
     }
   }
 
   public static void readExcel(IExcelRowReader reader, String filePath, String fileName)
     throws Exception
   {
     if (fileName.endsWith(".xls")) {
       HxlsReader reader03 = new HxlsReader(filePath);
       reader03.setRowReader(reader);
       reader03.process();
     }
     else if (fileName.endsWith(".xlsx")) {
       XxlsReader reader07 = new XxlsReader();
       reader07.setRowReader(reader);
       reader07.process(filePath);
     } else {
       throw new Exception("文件格式错误，fileName的扩展名只能是xls或xlsx。");
     }
   }
 }

