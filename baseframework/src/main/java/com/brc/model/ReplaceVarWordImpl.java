 package com.brc.model;
 
 import com.brc.exception.ApplicationException;
 import com.brc.util.FileHelper;
 import com.brc.util.StringUtil;
 import java.io.ByteArrayInputStream;
 import java.io.File;
 import java.io.FileInputStream;
 import java.io.FileNotFoundException;
 import java.io.FileOutputStream;
 import java.io.IOException;
 import java.io.InputStream;
 import java.io.PrintStream;
 import java.util.ArrayList;
 import java.util.HashMap;
 import java.util.Iterator;
 import java.util.List;
 import java.util.Map;
 import java.util.Map.Entry;
 import java.util.Set;
 import java.util.regex.Matcher;
 import java.util.regex.Pattern;
 import org.apache.poi.POIXMLDocument;
 import org.apache.poi.hwpf.HWPFDocument;
 import org.apache.poi.hwpf.usermodel.Range;
 import org.apache.poi.xwpf.usermodel.UnderlinePatterns;
 import org.apache.poi.xwpf.usermodel.VerticalAlign;
 import org.apache.poi.xwpf.usermodel.XWPFDocument;
 import org.apache.poi.xwpf.usermodel.XWPFParagraph;
 import org.apache.poi.xwpf.usermodel.XWPFRun;
 import org.apache.poi.xwpf.usermodel.XWPFTable;
 import org.apache.poi.xwpf.usermodel.XWPFTableCell;
 import org.apache.poi.xwpf.usermodel.XWPFTableRow;
 import org.docx4j.Docx4J;
 import org.docx4j.openpackaging.exceptions.Docx4JException;
 import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
 import org.docx4j.openpackaging.parts.CustomXmlPart;
 import org.dom4j.Document;
 import org.dom4j.DocumentException;
 import org.dom4j.DocumentHelper;
 import org.dom4j.Element;
 
 public class ReplaceVarWordImpl
 {
   public static final String DOCUMENT_REGEX = "\\$\\{[^{}]+\\}";
   public static final String WORD_TYPE = "docx";
 
   public static Element getTemplateElementInWord(String filePath, String xmlNamespaceURI)
   {
     String ext = FileHelper.getFileExtName(filePath);
     if (StringUtil.isBlank(ext)) {
       throw new ApplicationException("错误的文件类别！");
     }
 
     if (!ext.equalsIgnoreCase("docx")) {
       throw new ApplicationException("文件类型只能为word的docx类型！");
     }
 
     Element templateElement = null;
     File file = new File(filePath);
     WordprocessingMLPackage wordMLPackage = null;
     try {
       wordMLPackage = Docx4J.load(file);
       HashMap map = wordMLPackage.getCustomXmlDataStorageParts();
       Iterator it = map.keySet().iterator();
       while ((null == templateElement) && (it.hasNext())) {
         String key = (String)it.next();
         CustomXmlPart part = (CustomXmlPart)map.get(key);
 
         Document doc = DocumentHelper.parseText(part.getXML());
         Element element = doc.getRootElement();
 
         String namespaceURI = element.getNamespaceURI();
 
         if (namespaceURI.equalsIgnoreCase(xmlNamespaceURI))
           templateElement = element;
       }
     }
     catch (Docx4JException|DocumentException e) {
       throw new ApplicationException(e.getMessage());
     }
 
     return templateElement;
   }
 
   public static boolean replaceTemplateElementInWord(String srcPath, String destPath, Element rootElement)
   {
     String spExt = FileHelper.getFileExtName(srcPath);
     String dpExt = FileHelper.getFileExtName(destPath);
     if ((StringUtil.isBlank(spExt)) || (StringUtil.isBlank(dpExt))) {
       throw new ApplicationException("错误的文件类别");
     }
 
     if ((!spExt.equalsIgnoreCase("docx")) || (!dpExt.equalsIgnoreCase("docx"))) {
       throw new ApplicationException("文件类型只能为word的docx类型！");
     }
 
     WordprocessingMLPackage wordMLPackage = null;
     try {
       wordMLPackage = Docx4J.load(new File(srcPath));
 
       InputStream xmlStream = new ByteArrayInputStream(rootElement.asXML().getBytes());
 
       Docx4J.bind(wordMLPackage, xmlStream, 7);
 
       Docx4J.save(wordMLPackage, new File(destPath), 0);
     } catch (Docx4JException e) {
       throw new ApplicationException(e.getMessage());
     }
 
     return true;
   }
 
   public static List<String> getReplaceElementsInWord(String filePath)
   {
     String ext = FileHelper.getFileExtName(filePath);
     if (StringUtil.isBlank(ext)) {
       throw new ApplicationException("错误的文件类别");
     }
 
     if (ext.equalsIgnoreCase("doc")) {
       ArrayList al = new ArrayList();
       File file = new File(filePath);
       HWPFDocument document = null;
       try {
         InputStream is = new FileInputStream(file);
         document = new HWPFDocument(is);
       } catch (FileNotFoundException e) {
         e.printStackTrace();
       } catch (IOException e) {
         e.printStackTrace();
       }
       Range range = document.getRange();
       String rangeText = range.text();
       CharSequence cs = rangeText.subSequence(0, rangeText.length());
       Pattern pattern = Pattern.compile("\\$\\{[^{}]+\\}");
       Matcher matcher = pattern.matcher(cs);
       int startPosition = 0;
       while (matcher.find(startPosition)) {
         if (!al.contains(matcher.group())) {
           al.add(matcher.group());
         }
         startPosition = matcher.end();
       }
       return al;
     }if (ext.equalsIgnoreCase("docx")) {
       ArrayList al = new ArrayList();
       XWPFDocument document = null;
       try {
         document = new XWPFDocument(POIXMLDocument.openPackage(filePath));
       } catch (IOException e) {
         e.printStackTrace();
       }
 
       Iterator itPara = document.getParagraphsIterator();
       while (itPara.hasNext()) {
         XWPFParagraph paragraph = (XWPFParagraph)itPara.next();
         String paragraphString = paragraph.getText();
         CharSequence cs = paragraphString.subSequence(0, paragraphString.length());
         Pattern pattern = Pattern.compile("\\$\\{[^{}]+\\}");
         Matcher matcher = pattern.matcher(cs);
         int startPosition = 0;
         while (matcher.find(startPosition)) {
           if (!al.contains(matcher.group())) {
             al.add(matcher.group());
           }
           startPosition = matcher.end();
         }
       }
 
       Iterator itTable = document.getTablesIterator();
       while (itTable.hasNext()) {
         XWPFTable table = (XWPFTable)itTable.next();
         int rcount = table.getNumberOfRows();
         for (int i = 0; i < rcount; i++) {
           XWPFTableRow row = table.getRow(i);
           List<XWPFTableCell> cells = row.getTableCells();
           for (XWPFTableCell cell : cells) {
             String cellText = "";
             cellText = cell.getText();
             CharSequence cs = cellText.subSequence(0, cellText.length());
             Pattern pattern = Pattern.compile("\\$\\{[^{}]+\\}");
             Matcher matcher = pattern.matcher(cs);
             int startPosition = 0;
             while (matcher.find(startPosition)) {
               if (!al.contains(matcher.group())) {
                 al.add(matcher.group());
               }
               startPosition = matcher.end();
             }
           }
         }
       }
       return al;
     }
     return null;
   }
 
   public static boolean replaceAndGenerateWord(String srcPath, String destPath, Map<String, String> map)
   {
     String sp = FileHelper.getFileExtName(srcPath);
     String dp = FileHelper.getFileExtName(destPath);
     if ((StringUtil.isBlank(sp)) || (StringUtil.isBlank(dp))) {
       throw new ApplicationException("错误的文件类别");
     }
 
     if (sp.equalsIgnoreCase("docx"))
       try {
         XWPFDocument document = new XWPFDocument(POIXMLDocument.openPackage(srcPath));
 
         Iterator itPara = document.getParagraphsIterator();
         while (itPara.hasNext()) {
           XWPFParagraph paragraph = (XWPFParagraph)itPara.next();
           List runs = paragraph.getRuns();
           for (int i = 0; i < runs.size(); i++) {
             String oneparaString = ((XWPFRun)runs.get(i)).getText(((XWPFRun)runs.get(i)).getTextPosition());
 
             if (null != oneparaString) {
               for (Map.Entry entry : map.entrySet()) {
                 if (oneparaString.contains((CharSequence)entry.getKey())) {
                   oneparaString = oneparaString.replace((CharSequence)entry.getKey(), (CharSequence)entry.getValue());
                 }
               }
             }
             ((XWPFRun)runs.get(i)).setText(oneparaString, 0);
           }
         }
 
         Iterator itTable = document.getTablesIterator();
         while (itTable.hasNext()) {
           XWPFTable table = (XWPFTable)itTable.next();
           int rcoundt = table.getNumberOfRows();
           Iterator i$;
           XWPFTableCell cell;
           Map.Entry e;
           for (int i = 0; i < rcoundt; i++) {
             XWPFTableRow row = table.getRow(i);
             List cells = row.getTableCells();
             for (i$ = cells.iterator(); i$.hasNext(); ) { cell = (XWPFTableCell)i$.next();
 
               for (i$ = map.entrySet().iterator(); i$.hasNext(); ) { e = (Map.Entry)i$.next();
 
                 for (XWPFParagraph paragraph : cell.getParagraphs()) {
                   if (paragraph.getText().indexOf((String)e.getKey()) != -1)
                   {
                     List cellRuns = paragraph.getRuns();
                     for (int c = 0; c < cellRuns.size(); c++) {
                       String oneparaString = ((XWPFRun)cellRuns.get(c)).getText(((XWPFRun)cellRuns.get(c)).getTextPosition());
 
                       XWPFRun run = (XWPFRun)cellRuns.get(c);
                       int textPosition = run.getTextPosition();
                       System.out.println(oneparaString);
 
                       if ((run.getText(textPosition) != null) && (run.getText(textPosition).contains((CharSequence)e.getKey()))) {
                         String cellTextString = run.getText(textPosition).replace((CharSequence)e.getKey(), (CharSequence)e.getValue());
 
                         run.setText(cellTextString, 0);
                       }
 
                     }
 
                   }
 
                 }
 
               }
 
             }
 
           }
 
         }
 
         FileOutputStream outStream = null;
         outStream = new FileOutputStream(destPath);
         document.write(outStream);
         outStream.close();
         return true;
       } catch (Exception e) {
         e.printStackTrace();
         return false;
       }
     if ((sp.equalsIgnoreCase("doc")) && (dp.equalsIgnoreCase("doc"))) {
       HWPFDocument document = null;
       try {
         document = new HWPFDocument(new FileInputStream(srcPath));
         Range range = document.getRange();
         for (Map.Entry entry : map.entrySet()) {
           range.replaceText((String)entry.getKey(), (String)entry.getValue());
         }
         FileOutputStream outStream = null;
         outStream = new FileOutputStream(destPath);
         document.write(outStream);
         outStream.close();
         return true;
       } catch (FileNotFoundException e) {
         e.printStackTrace();
         return false;
       } catch (IOException e) {
         e.printStackTrace();
         return false;
       }
     }
     return false;
   }
 
   private Map<String, Object> getWordXWPFRunStyle(XWPFRun runOld)
   {
     Map mapAttr = new HashMap();
     mapAttr.put("Color", runOld.getColor());
     if (-1 == runOld.getFontSize())
       mapAttr.put("FontSize", Integer.valueOf(12));
     else {
       mapAttr.put("FontSize", Integer.valueOf(runOld.getFontSize()));
     }
     mapAttr.put("Subscript", runOld.getSubscript());
     mapAttr.put("Underline", runOld.getUnderline());
     mapAttr.put("FontFamily", runOld.getFontFamily());
 
     mapAttr.put("Bold", Boolean.valueOf(runOld.isBold()));
     mapAttr.put("Italic", Boolean.valueOf(runOld.isItalic()));
     mapAttr.put("Strike", Boolean.valueOf(runOld.isStrike()));
     return mapAttr;
   }
 
   private XWPFRun setWordXWPFRunStyle(XWPFRun runNew, Map<String, Object> mapAttr, String text)
   {
     runNew.setColor((String)mapAttr.get("Color"));
     if ("-1".equals(mapAttr.get("FontSize").toString()))
       runNew.setFontSize(12);
     else {
       runNew.setFontSize(((Integer)mapAttr.get("FontSize")).intValue());
     }
     runNew.setUnderline((UnderlinePatterns)mapAttr.get("Underline"));
     runNew.setSubscript((VerticalAlign)mapAttr.get("Subscript"));
     runNew.setFontFamily((String)mapAttr.get("FontFamily"));
     System.out.println(mapAttr.get("FontFamily"));
 
     runNew.setBold(((Boolean)mapAttr.get("Bold")).booleanValue());
     runNew.setItalic(((Boolean)mapAttr.get("Italic")).booleanValue());
     runNew.setStrike(((Boolean)mapAttr.get("Strike")).booleanValue());
 
     runNew.setText(text, 0);
     return runNew;
   }
 
   public static void main(String[] args) {
     String filepathString = "C:/tmp/1.docx";
 
     String destpathString = "C:/tmp/2.docx";
     Map map = new HashMap();
     map.put("${a}", "哈哈");
     map.put("${b}", "2015-10-29");
     map.put("${c}", "哇哇");
 
     System.out.println(getReplaceElementsInWord(filepathString));
     System.out.println(replaceAndGenerateWord(filepathString, destpathString, map));
   }
 }

