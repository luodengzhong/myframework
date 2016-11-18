 package com.brc.util.excel.export;
 
 import com.brc.exception.ApplicationException;
 import com.brc.system.data.JDBCDao;
 import com.brc.system.data.QueryRowMapper;
 import com.brc.util.ClassHelper;
 import com.brc.util.DateUtil;
 import com.brc.util.DictUtil;
 import com.brc.util.FileHelper;
 import com.brc.util.Singleton;
 import com.brc.util.StringUtil;
 import com.brc.util.excel.ExportExcel;
 import java.awt.Color;
 import java.io.File;
 import java.io.FileInputStream;
 import java.io.FileOutputStream;
 import java.io.IOException;
 import java.io.InputStream;
 import java.io.OutputStream;
 import java.io.OutputStreamWriter;
 import java.io.Writer;
 import java.sql.ResultSet;
 import java.sql.SQLException;
 import java.sql.Timestamp;
 import java.util.ArrayList;
 import java.util.Collections;
 import java.util.Comparator;
 import java.util.Enumeration;
 import java.util.HashMap;
 import java.util.List;
 import java.util.Map;
 import java.util.zip.ZipEntry;
 import java.util.zip.ZipFile;
 import java.util.zip.ZipOutputStream;
 import org.apache.poi.openxml4j.opc.PackagePart;
 import org.apache.poi.openxml4j.opc.PackagePartName;
 import org.apache.poi.ss.usermodel.Cell;
 import org.apache.poi.ss.usermodel.Row;
 import org.apache.poi.ss.usermodel.Sheet;
 import org.apache.poi.ss.util.CellRangeAddress;
 import org.apache.poi.ss.util.CellReference;
 import org.apache.poi.xssf.usermodel.XSSFCellStyle;
 import org.apache.poi.xssf.usermodel.XSSFColor;
 import org.apache.poi.xssf.usermodel.XSSFSheet;
 import org.apache.poi.xssf.usermodel.XSSFWorkbook;
 import org.dom4j.Element;
 
 public class XSSFExport
   implements IExcelExport
 {
   private static final String XML_ENCODING = "UTF-8";
   private static final String TITLE_STYLE_NAME = "title_cell_style";
   private Element headRoot;
   private Map<String, Object> datas;
   private List<ExportField> fields;
   private List<CellRangeAddress> rangeAddress;
   private Map<String, HeadCell> headCells;
   private Map<String, XSSFCellStyle> stylesMap;
   private XSWriteDelegate delegate;
 
   public XSSFExport()
   {
     this.datas = null;
 
     this.fields = new ArrayList();
 
     this.rangeAddress = new ArrayList();
 
     this.headCells = new HashMap();
 
     this.stylesMap = new HashMap();
   }
 
   public void setDelegate(XSWriteDelegate delegate)
   {
     this.delegate = delegate;
   }
 
   public void setDatas(Map<String, Object> datas)
   {
     this.datas = datas;
   }
 
   public void setHeadRoot(Element root) {
     this.headRoot = root;
   }
 
   private void addHeadCell(Cell c)
   {
     String key = c.getRowIndex() + "," + c.getColumnIndex();
     this.headCells.put(key, new HeadCell(c.getColumnIndex(), c.getStringCellValue(), null));
   }
 
   private List<HeadCell> getHeadCells(int rownum)
   {
     List heads = new ArrayList(this.fields.size());
     for (String key : this.headCells.keySet()) {
       if (key.startsWith(rownum + ",")) {
         heads.add(this.headCells.get(key));
       }
     }
     Collections.sort(heads, new Comparator() {
       public int compare(Object o11, Object o22) {
	XSSFExport.HeadCell o1 = (HeadCell) o11;
	XSSFExport.HeadCell o2 = (HeadCell) o22;
         return o1.getCol() > o2.getCol() ? 1 : -1;
       }
     });
     return heads;
   }
 
   public String expExcel() throws Exception
   {
     String template = FileHelper.createTmpFilePath("xlsx");
     File file = new File(template);
     XSSFWorkbook wb = new XSSFWorkbook();
     XSSFSheet sheet = wb.createSheet("sheet1");
 
     int index = createHead(sheet);
 
     createStyles(wb);
     String sheetRef = sheet.getPackagePart().getPartName().getName();
     FileOutputStream os = new FileOutputStream(file);
     wb.write(os);
     os.close();
 
     File tmp = File.createTempFile("sheet", ".xml");
     Writer fw = new OutputStreamWriter(new FileOutputStream(tmp), "UTF-8");
     generate(fw, index);
     fw.close();
     String outFilePath = FileHelper.createTmpFilePath("xlsx");
 
     FileOutputStream out = new FileOutputStream(outFilePath);
     substitute(file, tmp, sheetRef.substring(1), out);
     out.close();
     if (file.exists()) {
       file.delete();
     }
     return outFilePath;
   }
 
   private void createStyles(XSSFWorkbook wb)
   {
     Map tmpStylesMap = new HashMap();
     tmpStylesMap.put("string", createStyles(wb, "string", null));
     tmpStylesMap.put("date", createStyles(wb, "date", null));
     tmpStylesMap.put("datetime", createStyles(wb, "datetime", null));
     tmpStylesMap.put("number", createStyles(wb, "number", null));
     tmpStylesMap.put("money", createStyles(wb, "money", null));
     XSSFCellStyle title = wb.createCellStyle();
 
     title.setAlignment((short)2);
     title.setVerticalAlignment((short)1);
     this.stylesMap.put("title_cell_style", title);
     String code = ""; String fieldType = ""; String backgroundColor = "";
     for (ExportField field : this.fields) {
       fieldType = field.getType();
       code = field.getField();
       backgroundColor = field.getBackgroundColor();
       if (StringUtil.isBlank(fieldType)) {
         fieldType = "string";
       }
       if (!StringUtil.isBlank(backgroundColor)) {
         this.stylesMap.put(code, createStyles(wb, fieldType, backgroundColor));
       } else {
         XSSFCellStyle s = (XSSFCellStyle)tmpStylesMap.get(fieldType.toLowerCase());
         this.stylesMap.put(code, s != null ? s : title);
       }
     }
   }
 
   private XSSFCellStyle createStyles(XSSFWorkbook wb, String type, String backgroundColor)
   {
     XSSFCellStyle style = wb.createCellStyle();
     if (type.equalsIgnoreCase("string")) {
       style.setAlignment((short)1);
       style.setVerticalAlignment((short)1);
     } else if (type.equalsIgnoreCase("date")) {
       style.setAlignment((short)2);
       style.setVerticalAlignment((short)1);
     } else if (type.equalsIgnoreCase("datetime")) {
       style.setAlignment((short)2);
       style.setVerticalAlignment((short)1);
     } else if (type.equalsIgnoreCase("number")) {
       style.setAlignment((short)3);
       style.setVerticalAlignment((short)1);
     } else if (type.equalsIgnoreCase("money")) {
       style.setAlignment((short)3);
       style.setVerticalAlignment((short)1);
     } else {
       style.setAlignment((short)1);
       style.setVerticalAlignment((short)1);
     }
     if (!StringUtil.isBlank(backgroundColor)) {
       Color color = parseColor(backgroundColor);
       if (color != null) {
         style.setFillForegroundColor(new XSSFColor(color));
         style.setFillPattern((short)1);
       }
     }
 
     return style;
   }
 
   private Color parseColor(String colorString)
   {
     Color color = null;
     try {
       color = new Color(Integer.parseInt(colorString, 16));
     }
     catch (Exception e) {
     }
     return color;
   }
 
   private XSSFCellStyle getStylesByCode(String type)
   {
     XSSFCellStyle style = (XSSFCellStyle)this.stylesMap.get(type);
     if (style == null) {
       style = (XSSFCellStyle)this.stylesMap.get("title_cell_style");
     }
     return style;
   }
 
   private int createHead(Sheet sheet)
   {
     Object[] tables_obj = this.headRoot.elements().toArray();
     int rowsLength = 0;
     int iLen = tables_obj.length;
     int i = 0;
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
           int rowSpan = StringUtil.toInt(col.attributeValue("rowSpan"));
           int colSpan = StringUtil.toInt(col.attributeValue("colSpan"));
           int index = StringUtil.toInt(col.attributeValue("index"));
           index = index < 0 ? this.fields.size() : index;
           String titlename = col.getText();
           String field = col.attributeValue("field");
           String coltype = col.attributeValue("type");
           String dictionary = col.attributeValue("dictionary");
           String backgroundColor = col.attributeValue("backgroundColor");
           if (!StringUtil.isBlank(field)) {
             ExportField fobj = new ExportField();
             fobj.setTitle(titlename);
             fobj.setField(field);
             fobj.setType(coltype);
             fobj.setIndex(index);
             if (!StringUtil.isBlank(dictionary)) {
               fobj.setDictionary(dictionary);
             }
             if (!StringUtil.isBlank(backgroundColor)) {
               fobj.setBackgroundColor(backgroundColor);
             }
             this.fields.add(fobj);
           }
 
           if ((titlename != null) && (!titlename.equals(""))) {
             if (srow == null) {
               srow = sheet.createRow(e_row);
             }
             while ((srow.getCell(e_rol) != null) && (3 == srow.getCell(e_rol).getCellType())) {
               e_rol++;
             }
             Cell c = srow.getCell(e_rol);
             if (c == null) {
               c = srow.createCell(e_rol);
             }
             c.setCellValue(titlename);
             addHeadCell(c);
           }
 
           if (rowSpan > 0) {
             if (colSpan > 0) {
               for (int m = e_row + 1; m <= rowSpan + e_row - 1; m++) {
                 Row newrow = sheet.getRow(m);
                 if (newrow == null) {
                   newrow = sheet.createRow(m);
                 }
                 addHeadCell(newrow.createCell(e_rol));
                 for (int x = 1; x < colSpan; x++) {
                   addHeadCell(newrow.createCell(e_rol + x));
                 }
                 this.rangeAddress.add(new CellRangeAddress(m, m, e_rol, e_rol + colSpan - 1));
               }
               this.rangeAddress.add(new CellRangeAddress(e_row, rowSpan + e_row - 1, e_rol, e_rol + colSpan - 1));
               e_rol += colSpan;
             } else {
               for (int m = e_row + 1; m <= rowSpan + e_row - 1; m++) {
                 Row newrow = sheet.getRow(m);
                 if (newrow == null) {
                   newrow = sheet.createRow(m);
                 }
                 addHeadCell(newrow.createCell(e_rol));
               }
               this.rangeAddress.add(new CellRangeAddress(e_row, rowSpan + e_row - 1, e_rol, e_rol));
               e_rol++;
             }
           } else if (colSpan > 0) {
             for (int x = 1; x < colSpan; x++) {
               addHeadCell(srow.createCell(e_rol + x));
             }
             this.rangeAddress.add(new CellRangeAddress(e_row, e_row, e_rol, e_rol + colSpan - 1));
             e_rol += colSpan;
           } else {
             e_rol++;
           }
         }
         rowsLength++;
       }
       i++;
     }
 
     Collections.sort(this.fields, new Comparator() {
       public int compare(Object o11, Object o22) {
	ExportField o1 = (ExportField) o11;
	ExportField o2 = (ExportField) o22;
         return o1.getIndex().compareTo(o2.getIndex());
       }
     });
     return rowsLength;
   }
 
   private void generate(Writer out, int index)
     throws Exception
   {
     SpreadsheetWriter sw = new SpreadsheetWriter(out);
     sw.beginWorkSheet();
     sw.beginSheet();
 
     XSSFCellStyle title = getStylesByCode("title_cell_style");
     for (int i = 0; i < index; i++) {
       sw.insertRow(i);
       for (HeadCell c : getHeadCells(i)) {
         sw.createCell(c.getCol(), c.getTitle(), title.getIndex());
       }
       sw.endRow();
     }
     out.flush();
 
     writeDatas(sw, index);
     sw.endSheet();
     if (this.delegate != null) {
       this.delegate.onBeforeMergeCell(this.rangeAddress);
     }
 
     if (this.rangeAddress.size() > 0) {
       sw.beginMergerCell();
       for (CellRangeAddress cra : this.rangeAddress) {
         sw.setMergeCell(cra.getFirstRow(), cra.getFirstColumn(), cra.getLastRow(), cra.getLastColumn());
       }
       sw.endMergerCell();
     }
     sw.endWorkSheet();
   }
 
   private void writeDatas(SpreadsheetWriter sw, int index)
     throws IOException
   {
     if ((null == this.datas) || (this.datas.size() == 0)) return;
     List<Map<String,Object>> list = (List)this.datas.get("Rows");
     int rownum = index;
     int fieldLength = this.fields.size();
     String field = null;
     Object value = null;
     String fieldType = null;
     ExportField exportField = null;
     XSSFCellStyle cellStyle = null;
     if ((null != list) && (list.size() > 0)) {
       int exportExcelCount = ((Integer)ClassHelper.convert(Singleton.getParameter("exportExcelCount", String.class), Integer.class, Integer.valueOf(10000))).intValue();
       if (list.size() > exportExcelCount) {
         throw new ApplicationException("导出数据量太大,请适当调整查询条件!");
       }
       for (Map data : list) {
         sw.insertRow(rownum);
         for (int i = 0; i < fieldLength; i++) {
           exportField = (ExportField)this.fields.get(i);
           field = exportField.getField();
           fieldType = exportField.getType();
           value = ExportExcel.getObjectValue(exportField, data.get(field));
           cellStyle = getStylesByCode(field);
           writeDataCell(sw, i, fieldType, cellStyle, value);
         }
         sw.endRow();
         rownum++;
       }
     }
 
     writeTotalField(sw, rownum);
   }
 
   private void writeDataCell(SpreadsheetWriter sw, int index, String fieldType, XSSFCellStyle style, Object value)
     throws IOException
   {
     String valueStr = "";
     if (((value instanceof java.util.Date)) && 
       (!fieldType.equalsIgnoreCase("datetime")) && (!fieldType.equalsIgnoreCase("date"))) {
       fieldType = "date";
     }
 
     if (fieldType.equalsIgnoreCase("datetime")) {
       if ((value instanceof java.util.Date)) {
         valueStr = DateUtil.getDateFormat(9, (java.util.Date)value);
       } else if ((value instanceof String)) {
         valueStr = value.toString();
         if (valueStr.length() > 16) {
           valueStr = valueStr.substring(0, 16);
         }
       }
       sw.createCell(index, valueStr, style.getIndex());
     } else if (fieldType.equalsIgnoreCase("date")) {
       if ((value instanceof java.util.Date)) {
         valueStr = DateUtil.getDateFormat(1, (java.util.Date)value);
       } else if ((value instanceof String)) {
         valueStr = value.toString();
         if (valueStr.length() > 10) {
           valueStr = valueStr.substring(0, 10);
         }
       }
       sw.createCell(index, valueStr, style.getIndex());
     } else if ((fieldType.equalsIgnoreCase("number")) || (fieldType.equalsIgnoreCase("money"))) {
       if ((value != null) && (!value.equals(""))) {
         double b = Double.parseDouble(value.toString());
         sw.createCell(index, b, style.getIndex());
       } else {
         sw.createCell(index, "", style.getIndex());
       }
     } else {
       sw.createCell(index, value.toString(), style.getIndex());
     }
   }
 
   private void writeTotalField(SpreadsheetWriter sw, int rownum)
     throws IOException
   {
     if ((null == this.datas) || (this.datas.size() == 0)) return;
     Map totals = (Map)this.datas.get("totalFields");
 
     if ((totals != null) && (totals.size() > 0)) {
       sw.insertRow(rownum);
       Object value = null;
       String field = "";
       XSSFCellStyle style = null;
       for (int i = 0; i < this.fields.size(); i++) {
         field = ((ExportField)this.fields.get(i)).getField();
         value = totals.get(field) != null ? totals.get(field) : "";
         style = getStylesByCode(field);
         if ((value != null) && (!value.equals(""))) {
           double b = Double.parseDouble(value.toString());
           sw.createCell(i, b, style.getIndex());
         } else {
           sw.createCell(i, "", style.getIndex());
         }
       }
       sw.endRow();
     }
   }
 
   public String expExcel(String sql, Map<String, Object> param, JDBCDao jdbcDao)
     throws Exception
   {
     String template = FileHelper.createTmpFilePath("xlsx");
     File file = new File(template);
     XSSFWorkbook wb = new XSSFWorkbook();
     XSSFSheet sheet = wb.createSheet("sheet1");
 
     int index = createHead(sheet);
 
     createStyles(wb);
     String sheetRef = sheet.getPackagePart().getPartName().getName();
     FileOutputStream os = new FileOutputStream(file);
     wb.write(os);
     os.close();
 
     File tmp = File.createTempFile("sheet", ".xml");
     Writer fw = new OutputStreamWriter(new FileOutputStream(tmp), "UTF-8");
     generate(fw, index, sql, param, jdbcDao);
     fw.close();
     String outFilePath = FileHelper.createTmpFilePath("xlsx");
 
     FileOutputStream out = new FileOutputStream(outFilePath);
     substitute(file, tmp, sheetRef.substring(1), out);
     out.close();
     if (file.exists()) {
       file.delete();
     }
     return outFilePath;
   }
 
   private void generate(Writer out, final int index, String sql, Map<String, Object> param, JDBCDao jdbcDao)
     throws Exception
   {
     final SpreadsheetWriter sw = new SpreadsheetWriter(out);
     sw.beginWorkSheet();
     sw.beginSheet();
 
     XSSFCellStyle title = getStylesByCode("title_cell_style");
     for (int i = 0; i < index; i++) {
       sw.insertRow(i);
       for (HeadCell c : getHeadCells(i)) {
         sw.createCell(c.getCol(), c.getTitle(), title.getIndex());
       }
       sw.endRow();
     }
     out.flush();
     final int fieldLength = this.fields.size();
 
     List list = jdbcDao.queryToListByMapperMapParam(sql, new QueryRowMapper() {
       public Object mapRow(ResultSet arg0, int arg1) throws SQLException {
         try {
           sw.insertRow(index + arg1);
           ExportField field = null;
           for (int i = 0; i < fieldLength; i++) {
             field = (ExportField)XSSFExport.this.fields.get(i);
             XSSFExport.this.writeDataCell(sw, i, field.getType(), XSSFExport.this.getStylesByCode(field.getField()), XSSFExport.this.getObjectValue(field, arg0));
           }
           sw.endRow();
         } catch (Exception e) {
           throw new SQLException(e);
         }
         return null;
       }
     }
     , param);
 
     writeTotalField(sw, index + list.size());
     list = null;
     sw.endSheet();
 
     if (this.rangeAddress.size() > 0) {
       sw.beginMergerCell();
       for (CellRangeAddress cra : this.rangeAddress) {
         sw.setMergeCell(cra.getFirstRow(), cra.getFirstColumn(), cra.getLastRow(), cra.getLastColumn());
       }
       sw.endMergerCell();
     }
     sw.endWorkSheet();
   }
 
   public Object getObjectValue(ExportField field, ResultSet rs)
     throws SQLException
   {
     String fieldName = field.getField();
     String dictionary = field.getDictionary();
     if (fieldName.endsWith("TextView")) {
       fieldName = fieldName.substring(0, fieldName.lastIndexOf("TextView"));
       dictionary = fieldName;
     }
     fieldName = StringUtil.getUnderscoreName(fieldName);
     Object value = null;
     try {
       value = rs.getObject(fieldName);
     } catch (Exception e) {
     }
     if (value == null) return "";
     if ((value instanceof java.sql.Date))
       return new java.util.Date(((java.sql.Date)value).getTime());
     if ((value instanceof Timestamp)) {
       return new java.util.Date(((Timestamp)value).getTime());
     }
     if (!StringUtil.isBlank(dictionary)) {
       String textView = DictUtil.getDictionaryDetailText(dictionary, value);
       if (StringUtil.isBlank(textView)) {
         return value;
       }
       return textView;
     }
 
     return value;
   }
 
   private static void substitute(File zipfile, File tmpfile, String entry, OutputStream out)
     throws IOException
   {
     ZipFile zip = new ZipFile(zipfile);
 
     ZipOutputStream zos = new ZipOutputStream(out);
 
     Enumeration en = zip.entries();
     while (en.hasMoreElements()) {
       ZipEntry ze = (ZipEntry)en.nextElement();
       if (!ze.getName().equals(entry)) {
         zos.putNextEntry(new ZipEntry(ze.getName()));
         InputStream is = zip.getInputStream(ze);
         copyStream(is, zos);
         is.close();
       }
     }
     zos.putNextEntry(new ZipEntry(entry));
     InputStream is = new FileInputStream(tmpfile);
     copyStream(is, zos);
     is.close();
     zos.close();
     zip.close();
   }
 
   private static void copyStream(InputStream in, OutputStream out) throws IOException {
     byte[] chunk = new byte[1024];
     int count;
     while ((count = in.read(chunk)) >= 0)
       out.write(chunk, 0, count);
   }
 
   public static class SpreadsheetWriter
   {
     private final Writer _out;
     private int _rownum;
 
     public SpreadsheetWriter(Writer out) {
       this._out = out;
     }
 
     public void beginWorkSheet() throws IOException {
       this._out.write("<?xml version=\"1.0\" encoding=\"UTF-8\"?><worksheet xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\">");
     }
 
     public void beginSheet() throws IOException {
       this._out.write("<sheetData>\n");
     }
 
     public void endSheet() throws IOException {
       this._out.write("</sheetData>");
     }
 
     public void endWorkSheet() throws IOException
     {
       this._out.write("</worksheet>");
     }
 
     public void insertRow(int rownum) throws IOException
     {
       this._out.write("<row r=\"" + (rownum + 1) + "\">\n");
       this._rownum = rownum;
     }
 
     public void endRow() throws IOException {
       this._out.write("</row>\n");
     }
 
     public void beginMergerCell() throws IOException {
       this._out.write("<mergeCells>\n");
     }
 
     public void endMergerCell() throws IOException {
       this._out.write("</mergeCells>\n");
     }
 
     public void setMergeCell(int beginColumn, int beginCell, int endColumn, int endCell) throws IOException
     {
       this._out.write("<mergeCell ref=\"" + getExcelName(beginCell) + (beginColumn + 1) + ":" + getExcelName(endCell) + (endColumn + 1) + "\"/>\n");
     }
 
     public void createCell(int columnIndex, String value, int styleIndex) throws IOException {
       String ref = new CellReference(this._rownum, columnIndex).formatAsString();
       this._out.write("<c r=\"" + ref + "\" t=\"inlineStr\"");
       if (styleIndex != -1) this._out.write(" s=\"" + styleIndex + "\"");
       this._out.write(">");
       this._out.write("<is><t><![CDATA[" + checkXmlChar(value) + "]]></t></is>");
       this._out.write("</c>");
     }
 
     private String checkXmlChar(String data)
     {
       StringBuffer appender = new StringBuffer("");
       if (!StringUtil.isBlank(data)) {
         appender = new StringBuffer(data.length());
         for (int i = 0; i < data.length(); i++) {
           char ch = data.charAt(i);
           if ((ch == '\t') || (ch == '\n') || (ch == '\r') || ((ch >= ' ') && (ch <= 55295)) || ((ch >= 57344) && (ch <= 65533)) || ((ch >= 65536) && (ch <= 1114111)))
           {
             appender.append(ch);
           }
         }
       }
       String result = appender.toString();
       return result.replaceAll("]]>", "");
     }
 
     public void createCell(int columnIndex, String value) throws IOException {
       createCell(columnIndex, value, -1);
     }
 
     public void createCell(int columnIndex, double value, int styleIndex) throws IOException {
       String ref = new CellReference(this._rownum, columnIndex).formatAsString();
       this._out.write("<c r=\"" + ref + "\" t=\"n\"");
       if (styleIndex != -1) this._out.write(" s=\"" + styleIndex + "\"");
       this._out.write(">");
       this._out.write("<v>" + value + "</v>");
       this._out.write("</c>");
     }
 
     public void createCell(int columnIndex, double value) throws IOException {
       createCell(columnIndex, value, -1);
     }
 
     public static String getExcelName(int num)
     {
       StringBuffer temp = new StringBuffer();
       double i = Math.floor(Math.log(25.0D * num / 26.0D + 1.0D) / Math.log(26.0D)) + 1.0D;
       if (i > 1.0D) {
         double sub = num - 26.0D * (Math.pow(26.0D, i - 1.0D) - 1.0D) / 25.0D;
         for (double j = i; j > 0.0D; j -= 1.0D) {
           temp.append((char)(int)(sub / Math.pow(26.0D, j - 1.0D) + 65.0D));
           sub %= Math.pow(26.0D, j - 1.0D);
         }
       } else {
         temp.append((char)(num + 65));
       }
       return temp.toString();
     }
   }
 
   private class HeadCell
   {
     private int col;
     private String title;
 
     private HeadCell(int col, String title,String str)
     {
       this.col = col;
       this.title = title;
     }
 
     public int getCol() {
       return this.col;
     }
 
     public String getTitle() {
       return StringUtil.isBlank(this.title) ? "" : this.title;
     }
   }
 
   public static abstract interface XSWriteDelegate
   {
     public abstract void onBeforeMergeCell(List<CellRangeAddress> paramList);
   }
 }

