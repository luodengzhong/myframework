 package com.brc.util.excel.reader;
 
 import com.brc.util.StringUtil;
 import java.io.InputStream;
 import java.util.ArrayList;
 import java.util.Iterator;
 import java.util.List;
 import org.apache.poi.openxml4j.opc.OPCPackage;
 import org.apache.poi.ss.usermodel.BuiltinFormats;
 import org.apache.poi.ss.usermodel.DataFormatter;
 import org.apache.poi.xssf.eventusermodel.XSSFReader;
 import org.apache.poi.xssf.model.SharedStringsTable;
 import org.apache.poi.xssf.model.StylesTable;
 import org.apache.poi.xssf.usermodel.XSSFCellStyle;
 import org.apache.poi.xssf.usermodel.XSSFRichTextString;
 import org.xml.sax.Attributes;
 import org.xml.sax.InputSource;
 import org.xml.sax.SAXException;
 import org.xml.sax.XMLReader;
 import org.xml.sax.helpers.DefaultHandler;
 import org.xml.sax.helpers.XMLReaderFactory;
 
 public class XxlsReader extends DefaultHandler
 {
   private IExcelRowReader rowReader;
   private StylesTable stylesTable;
   private SharedStringsTable sst;
   private String lastContents;
   private boolean nextIsString;
   private int sheetIndex = -1;
 
   private List<String> rowlist = new ArrayList();
 
   private int curRow = 0;
 
   private int curCol = 0;
 
   private int preCol = 0;
 
   private int titleRow = 0;
 
   private int rowsize = 0;
   private short formatIndex;
   private String formatString;
   private DataFormatter formatter;
   private boolean isTElement;
 
   public void setRowReader(IExcelRowReader rowReader)
   {
     this.rowReader = rowReader;
   }
 
   public void processOneSheet(String filename, int sheetId)
     throws Exception
   {
     OPCPackage pkg = OPCPackage.open(filename);
     XSSFReader r = new XSSFReader(pkg);
     SharedStringsTable sst = r.getSharedStringsTable();
     this.stylesTable = r.getStylesTable();
     this.formatter = new DataFormatter();
     XMLReader parser = fetchSheetParser(sst);
 
     InputStream sheet2 = r.getSheet("rId" + sheetId);
     this.sheetIndex += 1;
     InputSource sheetSource = new InputSource(sheet2);
     parser.parse(sheetSource);
     sheet2.close();
   }
 
   public void process(String filename)
     throws Exception
   {
     OPCPackage pkg = OPCPackage.open(filename);
     XSSFReader r = new XSSFReader(pkg);
     this.stylesTable = r.getStylesTable();
     this.formatter = new DataFormatter();
     SharedStringsTable sst = r.getSharedStringsTable();
     XMLReader parser = fetchSheetParser(sst);
     Iterator sheets = r.getSheetsData();
     while (sheets.hasNext()) {
       this.curRow = 0;
       this.sheetIndex += 1;
       InputStream sheet = (InputStream)sheets.next();
       InputSource sheetSource = new InputSource(sheet);
       parser.parse(sheetSource);
       sheet.close();
     }
   }
 
   public XMLReader fetchSheetParser(SharedStringsTable sst) throws SAXException {
     XMLReader parser = XMLReaderFactory.createXMLReader("org.apache.xerces.parsers.SAXParser");
     this.sst = sst;
     parser.setContentHandler(this);
     return parser;
   }
 
   public void startElement(String uri, String localName, String name, Attributes attributes) throws SAXException
   {
     if (name.equals("c"))
     {
       String cellType = attributes.getValue("t");
       String rowStr = attributes.getValue("r");
       this.curCol = getRowIndex(rowStr);
       if ("s".equals(cellType))
         this.nextIsString = true;
       else {
         this.nextIsString = false;
       }
       this.formatIndex = -1;
       this.formatString = "";
       String cellStyleStr = attributes.getValue("s");
 
       if ((!"b".equals(cellType)) && (!"e".equals(cellType)) && (!"inlineStr".equals(cellType)) && (!"s".equals(cellType)) && (!"str".equals(cellType)) && 
         (cellStyleStr != null)) {
         int styleIndex = Integer.parseInt(cellStyleStr);
         XSSFCellStyle style = this.stylesTable.getStyleAt(styleIndex);
         this.formatIndex = style.getDataFormat();
         this.formatString = style.getDataFormatString();
         if (StringUtil.isBlank(this.formatString)) {
           this.formatString = BuiltinFormats.getBuiltinFormat(this.formatIndex);
         }
         if ((!StringUtil.isBlank(this.formatString)) && (
           (this.formatString.contains("m/d/yy")) || (this.formatString.contains("mm/dd/yy")) || (this.formatString.contains("yy/m/d")))) {
           this.formatString = "yyyy-MM-dd HH:mm:ss";
         }
 
       }
 
     }
 
     if ("t".equals(name))
       this.isTElement = true;
     else {
       this.isTElement = false;
     }
 
     this.lastContents = "";
   }
 
   public void endElement(String uri, String localName, String name)
     throws SAXException
   {
     if (this.nextIsString)
       try {
         int idx = Integer.parseInt(this.lastContents);
         this.lastContents = new XSSFRichTextString(this.sst.getEntryAt(idx)).toString();
       }
       catch (Exception e) {
       }
     if (this.isTElement) {
       String value = this.lastContents.trim();
       this.rowlist.add(this.curCol, value);
       this.curCol += 1;
       this.isTElement = false;
     }
     else if (name.equals("v")) {
       String value = this.lastContents.trim();
       value = value.equals("") ? " " : value;
       if ((!StringUtil.isBlank(value)) && 
         (!StringUtil.isBlank(this.formatString))) {
         try {
           value = this.formatter.formatRawCellContents(Double.parseDouble(value), this.formatIndex, this.formatString);
         }
         catch (Exception e)
         {
         }
       }
       int cols = this.curCol - this.preCol;
       if (cols > 1) {
         for (int i = 0; i < cols - 1; i++) {
           this.rowlist.add(this.preCol, "");
         }
       }
 
       this.preCol = this.curCol;
       this.rowlist.add(this.curCol - 1, value.trim());
     }
     else if (name.equals("row")) {
       int tmpCols = this.rowlist.size();
       if ((this.curRow > this.titleRow) && (tmpCols < this.rowsize)) {
         for (int i = 0; i < this.rowsize - tmpCols; i++) {
           this.rowlist.add(this.rowlist.size(), "");
         }
       }
       this.rowReader.getRows(this.sheetIndex, this.curRow, this.rowlist);
       if (this.curRow == this.titleRow) {
         this.rowsize = this.rowlist.size();
       }
       this.rowlist.clear();
       this.curRow += 1;
       this.curCol = 0;
       this.preCol = 0;
     }
   }
 
   public void characters(char[] ch, int start, int length)
     throws SAXException
   {
     this.lastContents += new String(ch, start, length);
   }
 
   public int getRowIndex(String rowStr)
   {
     rowStr = rowStr.replaceAll("[^A-Z]", "");
     byte[] rowAbc = rowStr.getBytes();
     int len = rowAbc.length;
     float num = 0.0F;
     for (int i = 0; i < len; i++) {
       num = (float)(num + (rowAbc[i] - 65 + 1) * Math.pow(26.0D, len - i - 1));
     }
     return (int)num;
   }
 
   public int getTitleRow() {
     return this.titleRow;
   }
 
   public void setTitleRow(int titleRow) {
     this.titleRow = titleRow;
   }
 }

