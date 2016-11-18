 package com.brc.util.excel.export;
 
 import com.brc.exception.ApplicationException;
 import com.brc.util.ClassHelper;
 import com.brc.util.DateUtil;
 import com.brc.util.FileHelper;
 import com.brc.util.LogHome;
 import com.brc.util.QRCodeUtil;
 import com.brc.util.Singleton;
 import com.brc.util.StringUtil;
 import com.brc.util.excel.ExportExcel;
 import java.awt.image.BufferedImage;
 import java.io.ByteArrayOutputStream;
 import java.io.File;
 import java.io.FileOutputStream;
 import java.util.ArrayList;
 import java.util.Collections;
 import java.util.Comparator;
 import java.util.Date;
 import java.util.HashMap;
 import java.util.List;
 import java.util.Map;
 import javax.imageio.ImageIO;
 import org.apache.log4j.Logger;
 import org.apache.poi.hssf.usermodel.HSSFClientAnchor;
 import org.apache.poi.hssf.usermodel.HSSFWorkbook;
 import org.apache.poi.ss.usermodel.Cell;
 import org.apache.poi.ss.usermodel.CellStyle;
 import org.apache.poi.ss.usermodel.ClientAnchor;
 import org.apache.poi.ss.usermodel.Drawing;
 import org.apache.poi.ss.usermodel.Font;
 import org.apache.poi.ss.usermodel.Row;
 import org.apache.poi.ss.usermodel.Sheet;
 import org.apache.poi.ss.usermodel.Workbook;
 import org.apache.poi.ss.util.CellRangeAddress;
 import org.dom4j.Element;
 
 public class HSSFExport
   implements IExcelExport
 {
   private Element headRoot;
   private Map<String, Object> datas = null;
 
   private Map<String, Font> fontMap = new HashMap();
 
   private Map<String, CellStyle> styleMap = new HashMap();
 
   private List<ExportField> fields = new ArrayList();
 
   public void setDatas(Map<String, Object> datas) {
     this.datas = datas;
   }
 
   public void setHeadRoot(Element root) {
     this.headRoot = root;
   }
 
   private Workbook getWorkbook()
   {
     return new HSSFWorkbook();
   }
 
   private Font getFont(Workbook workbook, short fontHeight)
   {
     Font font = (Font)this.fontMap.get(fontHeight + "");
     if (font == null) {
       font = workbook.createFont();
       font.setFontName("宋体");
       font.setFontHeightInPoints(fontHeight);
       this.fontMap.put(fontHeight + "", font);
     }
     return font;
   }
 
   private CellStyle getStyle(Workbook wb, short alignment)
   {
     CellStyle style = (CellStyle)this.styleMap.get(alignment + "");
     if (style == null) {
       style = wb.createCellStyle();
       style.setAlignment(alignment);
 
       style.setVerticalAlignment((short)1);
       this.styleMap.put(alignment + "", style);
     }
     return style;
   }
 
   private int intFormat(String s) {
     if ((s == null) || (s.equals(""))) return -1; try
     {
       return Integer.parseInt(s); } catch (Exception e) {
     }
     return -1;
   }
 
   public String expExcel()
     throws Exception
   {
     Sheet sheet = null;
     FileOutputStream out = null;
     File file = null;
     String filePath = FileHelper.createTmpFilePath("xls");
     try {
       file = new File(filePath);
       out = new FileOutputStream(file);
       Object[] tables_obj = this.headRoot.elements().toArray();
       int iLen = tables_obj.length;
       int i = 0;
       Workbook wb = getWorkbook();
       sheet = wb.createSheet("sheet1");
       if (null == sheet) {
         return "";
       }
       int e_row = 0;
       int e_rol = 0;
 
       while (i < iLen)
       {
         Element table = (Element)tables_obj[i];
         Object[] table_obj = table.elements().toArray();
         for (int j = 0; j < table_obj.length; j++)
         {
           Row srow = sheet.getRow(j);
           Element row = (Element)table_obj[j];
           Object[] row_obj = row.elements().toArray();
           e_row = j;
           e_rol = 0;
           for (int k = 0; k < row_obj.length; k++) {
             Element col = (Element)row_obj[k];
             int rowSpan = intFormat(col.attributeValue("rowSpan"));
             int colSpan = intFormat(col.attributeValue("colSpan"));
             int index = intFormat(col.attributeValue("index"));
             index = index < 0 ? this.fields.size() : index;
             String titlename = col.getText();
             String field = col.attributeValue("field");
             String coltype = col.attributeValue("type");
             String dictionary = col.attributeValue("dictionary");
             if (!StringUtil.isBlank(field)) {
               ExportField fobj = new ExportField();
               fobj.setTitle(titlename);
               fobj.setField(field);
               fobj.setType(coltype);
               fobj.setIndex(index);
               fobj.setDictionary(dictionary);
               this.fields.add(fobj);
             }
 
             if ((titlename != null) && (!titlename.equals(""))) {
               if (srow == null) {
                 srow = sheet.createRow(e_row);
               }
               while ((srow.getCell(e_rol) != null) && (3 == srow.getCell(e_rol).getCellType())) {
                 e_rol++;
               }
               if ((coltype != null) && (coltype.equals("showImage"))) {
                 addPicture(wb, sheet, "image", titlename, e_rol, e_row);
               }
               Cell c = srow.getCell(e_rol);
               if (c == null) {
                 c = srow.createCell(e_rol);
               }
               Font font = getFont(wb, (short)10);
               CellStyle style = getStyle(wb, (short)2);
               style.setFont(font);
               c.setCellStyle(style);
               c.setCellType(1);
               c.setCellValue(titlename);
             }
 
             if (rowSpan > 0) {
               if (colSpan > 0) {
                 for (int m = e_row + 1; m <= rowSpan + e_row - 1; m++) {
                   Row newrow = sheet.getRow(m);
                   if (newrow == null) {
                     newrow = sheet.createRow(m);
                   }
                   newrow.createCell(e_rol);
                   for (int x = 1; x < colSpan; x++)
                     newrow.createCell(e_rol + x);
                   sheet.addMergedRegion(new CellRangeAddress(m, m, e_rol, e_rol + colSpan - 1));
                 }
                 sheet.addMergedRegion(new CellRangeAddress(e_row, rowSpan + e_row - 1, e_rol, e_rol + colSpan - 1));
                 e_rol += colSpan;
               }
               else {
                 for (int m = e_row + 1; m <= rowSpan + e_row - 1; m++) {
                   Row newrow = sheet.getRow(m);
                   if (newrow == null) {
                     newrow = sheet.createRow(m);
                   }
 
                   newrow.createCell(e_rol);
                 }
                 sheet.addMergedRegion(new CellRangeAddress(e_row, rowSpan + e_row - 1, e_rol, e_rol));
                 e_rol++;
               }
             } else if (colSpan > 0) {
               for (int x = 1; x < colSpan; x++)
                 srow.createCell(e_rol + x);
               sheet.addMergedRegion(new CellRangeAddress(e_row, e_row, e_rol, e_rol + colSpan - 1));
               e_rol += colSpan;
             } else {
               e_rol++;
             }
           }
         }
 
         i++;
       }
       writeDatas(wb, sheet);
 
       wb.write(out);
     } catch (Exception e) {
       if ((file != null) && (file.exists())) file.delete();
       e.printStackTrace();
       throw new ApplicationException(e.getMessage());
     } finally {
       if (out != null) out.close();
     }
     return filePath;
   }
 
   private void writeDatas(Workbook wb, Sheet sheet)
   {
     if ((null == this.datas) || (this.datas.size() == 0)) return;
     List list = (List)this.datas.get("Rows");
     Map totals = (Map)this.datas.get("totalFields");
     int e_row = sheet.getLastRowNum() + 1;
     Collections.sort(this.fields, new Comparator()
     {
				
       public int compare(Object o11, Object o22) {
					ExportField o1 = (ExportField) o11;
					ExportField o2 = (ExportField) o22;
         return o1.getIndex().compareTo(o2.getIndex());
       }
     });
     try {
       String field = "";
       Object value = "";
       ExportField fobj = null;
       if ((null != list) && (list.size() > 0)) {
         int length = list.size();
         int exportExcelCount = ((Integer)ClassHelper.convert(Singleton.getParameter("exportExcelCount", String.class), Integer.class, Integer.valueOf(10000))).intValue();
         if (length > exportExcelCount) {
           throw new ApplicationException("导出数据量太大,请适当调整查询条件!");
         }
         for (int x = 0; x < length; x++) {
           Map data = (Map)list.get(x);
           for (int i = 0; i < this.fields.size(); i++) {
             fobj = (ExportField)this.fields.get(i);
             field = fobj.getField();
             value = ExportExcel.getObjectValue(fobj, data.get(field));
             if ((fobj.getType().equals("image")) || (fobj.getType().equals("twoDimensionCode"))) {
               addPicture(wb, sheet, fobj.getType(), value.toString(), i, e_row);
             }
             Cell cell = null;
             if (sheet.getRow(e_row) == null)
               cell = sheet.createRow(e_row).createCell(i);
             else {
               cell = sheet.getRow(e_row).createCell(i);
             }
             Font font = getFont(wb, (short)10);
             CellStyle style = null;
             if (fobj.getType().toLowerCase().equals("datetime")) {
               String t = "";
               if ((value instanceof Date)) {
                 t = DateUtil.getDateFormat(9, (Date)value);
               } else if ((value instanceof String)) {
                 t = value.toString();
                 if (t.length() > 16) {
                   t = t.substring(0, 16);
                 }
               }
               style = getStyle(wb, (short)2);
               cell.setCellType(1);
               cell.setCellValue(t);
             }
             if (fobj.getType().toLowerCase().equals("date")) {
               String t = "";
               if ((value instanceof Date)) {
                 t = DateUtil.getDateFormat(1, (Date)value);
               } else if ((value instanceof String)) {
                 t = value.toString();
                 if (t.length() > 10) {
                   t = t.substring(0, 10);
                 }
               }
               style = getStyle(wb, (short)2);
               cell.setCellType(1);
               cell.setCellValue(t);
             } else if (fobj.getType().equals("number")) {
               cell.setCellType(0);
               if ((value != null) && (!value.equals(""))) {
                 double b = Double.parseDouble(value.toString());
                 cell.setCellValue(b);
               } else {
                 cell.setCellValue("");
               }
               style = getStyle(wb, (short)3);
             } else if (fobj.getType().equals("money")) {
               cell.setCellType(0);
               if ((value != null) && (!value.equals(""))) {
                 String m = StringUtil.formatToCurrency(value.toString());
                 cell.setCellValue(m);
               } else {
                 cell.setCellValue("");
               }
               style = getStyle(wb, (short)3);
             } else {
               cell.setCellType(1);
               cell.setCellValue(value.toString());
               style = getStyle(wb, (short)2);
             }
             style.setFont(font);
             cell.setCellStyle(style);
           }
           e_row++;
         }
       }
       if (totals != null)
         for (int i = 0; i < this.fields.size(); i++) {
           fobj = (ExportField)this.fields.get(i);
           field = fobj.getField();
           value = totals.get(field) != null ? totals.get(field) : "";
           Cell cell = null;
           if (sheet.getRow(e_row) == null)
             cell = sheet.createRow(e_row).createCell(i);
           else {
             cell = sheet.getRow(e_row).createCell(i);
           }
           Font font = getFont(wb, (short)10);
           CellStyle style = getStyle(wb, (short)3);
           style.setFont(font);
           cell.setCellStyle(style);
           if (fobj.getType().equals("money")) {
             cell.setCellType(0);
             if ((value != null) && (!value.equals(""))) {
               String m = StringUtil.formatToCurrency(value.toString());
               cell.setCellValue(m);
             } else {
               cell.setCellValue("");
             }
             style = getStyle(wb, (short)3);
           }
           else if ((value != null) && (!value.equals(""))) {
             double b = Double.parseDouble(value.toString());
             cell.setCellType(0);
             cell.setCellValue(b);
           } else {
             cell.setCellValue("");
           }
         }
     }
     catch (Exception ex)
     {
       ex.printStackTrace();
       throw new ApplicationException(ex.getMessage());
     }
   }
 
   private void addPicture(Workbook wb, Sheet sheet, String fieldtype, String value, int col, int row)
   {
     ByteArrayOutputStream byteArrayOut = new ByteArrayOutputStream();
     try {
       if (fieldtype.equals("image")) {
         File f = FileHelper.getFile(value);
         if (f == null) return;
         BufferedImage bufferImg = ImageIO.read(f);
         ImageIO.write(bufferImg, "png", byteArrayOut);
       } else if (fieldtype.equals("twoDimensionCode")) {
         QRCodeUtil util = new QRCodeUtil();
         util.setCodeContent(value);
         util.setCodeOutput(byteArrayOut);
         util.encoderCode();
       }
       Drawing drawing = sheet.createDrawingPatriarch();
       ClientAnchor anchor = null;
       anchor = new HSSFClientAnchor(0, 0, 0, 0, (short)col, row, (short)(col + 1), row + 1);
       drawing.createPicture(anchor, wb.addPicture(byteArrayOut.toByteArray(), 6));
     }
     catch (Exception e) {
       LogHome.getLog(this).error("EXCEL中插入图片", e);
     }
   }
 }

