 package com.brc.util;
 
 import com.brc.exception.ApplicationException;
 import com.brc.exception.ExportExcelException;
 import com.lowagie.text.DocumentException;
 import java.io.ByteArrayInputStream;
 import java.io.File;
 import java.io.FileNotFoundException;
 import java.io.FileOutputStream;
 import java.io.IOException;
 import java.io.OutputStream;
 import java.io.OutputStreamWriter;
 import java.io.PrintStream;
 import java.net.MalformedURLException;
 import java.util.Map;
 import org.apache.log4j.Logger;
 import org.apache.poi.poifs.filesystem.DirectoryEntry;
 import org.apache.poi.poifs.filesystem.POIFSFileSystem;
 import org.springframework.core.io.ClassPathResource;
 import org.xhtmlrenderer.pdf.ITextFontResolver;
 import org.xhtmlrenderer.pdf.ITextRenderer;
 
 public class PDFCreater
 {
   public static String createPDF(String data)
   {
     String filePath = FileHelper.createTmpFilePath("pdf");
     ClassPathResource resource = null;
     try {
       resource = new ClassPathResource("/font/simsun.ttc");
       OutputStream os = new FileOutputStream(filePath);
       ITextRenderer renderer = new ITextRenderer();
 
       ITextFontResolver fontResolver = renderer.getFontResolver();
       fontResolver.addFont(resource.getPath(), "Identity-H", false);
       renderer.setDocumentFromString(data);
 
       renderer.layout();
       renderer.createPDF(os);
       os.close();
     } catch (MalformedURLException e) {
       e.printStackTrace();
       throw new ApplicationException(e);
     } catch (DocumentException e) {
       e.printStackTrace();
       throw new ApplicationException(e);
     } catch (FileNotFoundException e) {
       e.printStackTrace();
       throw new ApplicationException(e);
     } catch (IOException e) {
       e.printStackTrace();
       throw new ApplicationException(e);
     }
     File file = new File(filePath);
     if (file.exists()) {
       return file.getName();
     }
     throw new ExportExcelException("文件生成失败!");
   }
 
   public static String createByBodyHTML(String bodyHTML)
   {
     StringBuffer document = new StringBuffer();
     document.append("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">");
     document.append("<html xmlns=\"http://www.w3.org/1999/xhtml\">").append("<head>").append("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />");
 
     document.append("<style type=\"text/css\" mce_bogus=\"1\">");
     document.append("body { font-family: SimSun;   font-size:12px;}");
     document.append("a {text-decoration:none;color:#000000;}");
     document.append("table {border: 1px solid #000000;border-width: 1px 0 0 1px;}");
     document.append("table td{border: 1px solid #000000;border-width: 0 1px 1px 0;height:25px;}");
     document.append("</style>");
     document.append("</head>").append("<body>");
     document.append(bodyHTML);
     document.append("</body></html>");
     return createPDF(document.toString());
   }
 
   public static String createByFreemarker(String template, Map<String, Object> variables)
   {
     if (!template.endsWith(".ftl"))
       template = "/pdfsimple/" + template + ".ftl";
     try
     {
       String htmlStr = FreemarkerUtil.generate(template, variables);
       return createPDF(htmlStr);
     } catch (Exception e) {
       LogHome.getLog(PDFCreater.class).error(e);
     }throw new ExportExcelException("文件生成失败!");
   }
 
   public static String createWord(String template, Map<String, Object> variables)
   {
     String filePath = FileHelper.createTmpFilePath("doc");
     ByteArrayInputStream bais = null;
     FileOutputStream fos = null;
     POIFSFileSystem poifs = null;
     if (!template.endsWith(".ftl"))
       template = "/pdfsimple/" + template + ".ftl";
     try
     {
       String content = FreemarkerUtil.generate(template, variables);
       byte[] b = content.getBytes("UTF-8");
       bais = new ByteArrayInputStream(b);
       poifs = new POIFSFileSystem();
       DirectoryEntry directory = poifs.getRoot();
       directory.createDocument("WordDocument", bais);
       fos = new FileOutputStream(filePath);
       poifs.writeFilesystem(fos);
     } catch (Exception e) {
       LogHome.getLog(PDFCreater.class).error(e);
       throw new ExportExcelException("文件生成失败!");
     } finally {
       try {
         if (fos != null) fos.close();
         if (bais != null) bais.close(); 
       }
       catch (IOException e) { LogHome.getLog(PDFCreater.class).error(e); }
 
     }
     File file = new File(filePath);
     if (file.exists()) {
       return file.getName();
     }
     throw new ExportExcelException("文件生成失败!");
   }
 
   public static String createHtml(String template, Map<String, Object> variables)
   {
     String filePath = FileHelper.createTmpFilePath("html");
     if (!template.endsWith(".ftl")) {
       template = "/pdfsimple/" + template + ".ftl";
     }
     FileOutputStream fos = null;
     OutputStreamWriter ow = null;
     try {
       String content = FreemarkerUtil.generate(template, variables);
       fos = new FileOutputStream(filePath);
       ow = new OutputStreamWriter(fos, "utf-8");
       ow.write(content);
       ow.flush();
     } catch (Exception e) {
       LogHome.getLog(PDFCreater.class).error(e);
       throw new ExportExcelException("文件生成失败!");
     } finally {
       try {
         if (fos != null) fos.close();
         if (ow != null) ow.close(); 
       }
       catch (IOException e) { LogHome.getLog(PDFCreater.class).error(e); }
 
     }
     File file = new File(filePath);
     if (file.exists()) {
       return file.getName();
     }
     throw new ExportExcelException("文件生成失败!");
   }
 
   public static void main(String[] args)
   {
     StringBuffer sb = new StringBuffer();
     sb.append("<table id=\"dialogTableRecord\" style=\"width: 99%;\" class=\"tableInput\" border='0' cellspacing='0' cellpadding='0'>");
     sb.append("<colgroup><col width=\"14%\"/><col width=\"19%\"/><col width=\"14%\"/><col width=\"19%\"/><col width=\"14%\"/><col width=\"19%\"/></colgroup>");
     sb.append("<tbody><tr><td style=\"padding-left:10px;\" class=\"title\">标准工资总额:</td><td class=\"edit disable\"><input type=\"text\" name=\"standardPay\" readonly=\"true\" class=\"text textReadonly\"/></td><td style=\"padding-left:10px;\" class=\"title\"><a code=\"basePay\" class=\"GridStyle\" href=\"javascript:void(0)\">基本工资</a>:</td><td class=\"edit disable\"><input type=\"text\" name=\"basePay\" readonly=\"true\" class=\"text textReadonly\"/></td><td style=\"padding-left:10px;\" class=\"title\"><a code=\"performancePay\" class=\"GridStyle\" href=\"javascript:void(0)\">绩效风险工资</a>:</td><td class=\"edit disable\"><input type=\"text\" name=\"performancePay\" readonly=\"true\" class=\"text textReadonly\"/></td></tr><tr><td style=\"padding-left:10px;\" class=\"title\"><a code=\"seniorityPay\" class=\"GridStyle\" href=\"javascript:void(0)\">工龄工资</a>:</td><td class=\"edit disable\"><input type=\"text\" name=\"seniorityPay\" readonly=\"true\" class=\"text textReadonly\"/></td><td style=\"padding-left:10px;\" class=\"title\"><a code=\"oneChildPay\" class=\"GridStyle\" href=\"javascript:void(0)\">独生子女补贴</a>:</td><td class=\"edit disable\"><input type=\"text\" name=\"oneChildPay\" readonly=\"true\" class=\"text textReadonly\"/></td><td style=\"padding-left:10px;\" class=\"title\"><a code=\"overtime\" class=\"GridStyle\" href=\"javascript:void(0)\">加班补贴</a>:</td><td class=\"edit disable\"><input type=\"text\" name=\"overtime\" readonly=\"true\" class=\"text textReadonly\"/></td></tr><tr><td style=\"padding-left:10px;\" class=\"title\"><a code=\"otherSubsidy\" class=\"GridStyle\" href=\"javascript:void(0)\">其他补贴</a>:</td><td class=\"edit disable\"><input type=\"text\" name=\"otherSubsidy\" readonly=\"true\" class=\"text textReadonly\"/></td><td style=\"padding-left:10px;\" class=\"title\"><a code=\"mealAllowance\" class=\"GridStyle\" href=\"javascript:void(0)\">误餐补贴</a>:</td><td class=\"edit disable\"><input type=\"text\" name=\"mealAllowance\" readonly=\"true\" class=\"text textReadonly\"/></td><td style=\"padding-left:10px;\" class=\"title\"><a code=\"distanceAllowance\" class=\"GridStyle\" href=\"javascript:void(0)\">异地津贴</a>:</td><td class=\"edit disable\"><input type=\"text\" name=\"distanceAllowance\" readonly=\"true\" class=\"text textReadonly\"/></td></tr><tr><td style=\"padding-left:10px;\" class=\"title\"><a code=\"salesCommissions\" class=\"GridStyle\" href=\"javascript:void(0)\">销售提成</a>:</td><td class=\"edit disable\"><input type=\"text\" name=\"salesCommissions\" readonly=\"true\" class=\"text textReadonly\"/></td><td style=\"padding-left:10px;\" class=\"title\"><a code=\"award\" class=\"GridStyle\" href=\"javascript:void(0)\">奖励</a>:</td><td class=\"edit disable\"><input type=\"text\" name=\"award\" readonly=\"true\" class=\"text textReadonly\"/></td><td style=\"padding-left:10px;\" class=\"title\"><a code=\"backPay\" class=\"GridStyle\" href=\"javascript:void(0)\">补发工资</a>:</td><td class=\"edit disable\"><input type=\"text\" name=\"backPay\" readonly=\"true\" class=\"text textReadonly\"/></td></tr><tr><td style=\"padding-left:10px;\" class=\"title\"><a code=\"penalty\" class=\"GridStyle\" href=\"javascript:void(0)\">罚款</a>:</td><td class=\"edit disable\"><input type=\"text\" name=\"penalty\" readonly=\"true\" class=\"text textReadonly\"/></td><td style=\"padding-left:10px;\" class=\"title\"><a code=\"oldAgeBenefit\" class=\"GridStyle\" href=\"javascript:void(0)\">扣养老保险金</a>:</td><td class=\"edit disable\"><input type=\"text\" name=\"oldAgeBenefit\" readonly=\"true\" class=\"text textReadonly\"/></td><td style=\"padding-left:10px;\" class=\"title\"><a code=\"medicare\" class=\"GridStyle\" href=\"javascript:void(0)\">扣医疗保险金</a>:</td><td class=\"edit disable\"><input type=\"text\" name=\"medicare\" readonly=\"true\" class=\"text textReadonly\"/></td></tr><tr><td style=\"padding-left:10px;\" class=\"title\"><a code=\"unemploymentInsurance\" class=\"GridStyle\" href=\"javascript:void(0)\">扣失业保险金</a>:</td><td class=\"edit disable\"><input type=\"text\" name=\"unemploymentInsurance\" readonly=\"true\" class=\"text textReadonly\"/></td><td style=\"padding-left:10px;\" class=\"title\"><a code=\"housingFund\" class=\"GridStyle\" href=\"javascript:void(0)\">扣住房公积金</a>:</td><td class=\"edit disable\"><input type=\"text\" name=\"housingFund\" readonly=\"true\" class=\"text textReadonly\"/></td><td style=\"padding-left:10px;\" class=\"title\"><a code=\"attendancePay\" class=\"GridStyle\" href=\"javascript:void(0)\">考勤扣款</a>:</td><td class=\"edit disable\"><input type=\"text\" name=\"attendancePay\" readonly=\"true\" class=\"text textReadonly\"/></td></tr><tr><td style=\"padding-left:10px;\" class=\"title\"><a code=\"deductPay\" class=\"GridStyle\" href=\"javascript:void(0)\">其它扣款</a>:</td><td class=\"edit disable\"><input type=\"text\" name=\"deductPay\" readonly=\"true\" class=\"text textReadonly\"/></td><td style=\"padding-left:10px;\" class=\"title\"><a code=\"pay01\" class=\"GridStyle\" href=\"javascript:void(0)\">税后补发</a>:</td><td class=\"edit disable\"><input type=\"text\" name=\"pay01\" readonly=\"true\" class=\"text textReadonly\"/></td><td style=\"padding-left:10px;\" class=\"title\"><a code=\"pay02\" class=\"GridStyle\" href=\"javascript:void(0)\">税后补扣</a>:</td><td class=\"edit disable\"><input type=\"text\" name=\"pay02\" readonly=\"true\" class=\"text textReadonly\"/></td></tr><tr><td style=\"padding-left:10px;\" class=\"title\">计税工资:</td><td class=\"edit disable\"><input type=\"text\" name=\"taxablePay\" readonly=\"true\" class=\"text textReadonly\"/></td><td style=\"padding-left:10px;\" class=\"title\">个人所得税:</td><td class=\"edit disable\"><input type=\"text\" name=\"incomeTax\" readonly=\"true\" class=\"text textReadonly\"/></td><td style=\"padding-left:10px;\" class=\"title\">扣款合计:</td><td class=\"edit disable\"><input type=\"text\" name=\"deductAll\" readonly=\"true\" class=\"text textReadonly\"/></td></tr><tr><td style=\"padding-left:10px;\" class=\"title\">应发工资:</td><td class=\"edit disable\"><input type=\"text\" name=\"totalPay\" readonly=\"true\" class=\"text textReadonly\"/></td><td style=\"padding-left:10px;\" class=\"title\">实发工资:</td><td class=\"edit disable\"><input type=\"text\" name=\"netPay\" readonly=\"true\" class=\"text textReadonly\"/></td><td colspan=\"2\" class=\"title\">&nbsp;</td></tr></tbody></table>");
     System.err.println(createByBodyHTML(sb.toString()));
   }
 }

