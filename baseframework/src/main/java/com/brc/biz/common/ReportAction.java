 package com.brc.biz.common;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.util.StringUtil;
 import java.util.Map;
 import java.util.Map.Entry;
 import javax.annotation.Resource;
 
 public class ReportAction extends CommonAction
 {
   private static final long serialVersionUID = -1536039085049877283L;
 
   @Resource
   private ReportService reportService;
   private static final String WEB_REPORT_SERVER_PATH = "/WebReport/ReportServer?reportlet=";
   private static final String DEFAULT_PATH = "%2F";
   private String fileDir;
 
   protected String getPagePath()
   {
     String reportWebUrl = this.reportService.getReportWebUrl();
     String currFileDir = this.fileDir;
 
     if ((!StringUtil.isBlank(this.fileDir)) && (!this.fileDir.endsWith("/"))) {
       currFileDir = this.fileDir + "/";
     }
 
     currFileDir = currFileDir.replaceAll("/", "%2F");
 
     reportWebUrl = reportWebUrl + "/WebReport/ReportServer?reportlet=" + currFileDir;
 
     return reportWebUrl;
   }
 
   protected String redirectReport(String page, String fileDir)
   {
     redirectReport(page, fileDir, null);
 
     return "none";
   }
 
   protected String redirectReport(String page, String fileDir, Map<String, Object> params)
   {
     this.fileDir = fileDir;
 
     if (StringUtil.isBlank(page))
       page = null;
     else if (!page.endsWith(".cpt")) {
       page = getPagePath() + page + ".cpt";
     }
 
     if ((null != params) && (params.size() > 0)) {
       for (Map.Entry it : params.entrySet()) {
         String value = getCjkEncode(it.getValue());
         page = page + "&" + (String)it.getKey() + "=" + value;
       }
 
     }
 
     redirectReport(page);
     return "none";
   }
 
   private String getCjkEncode(Object value)
   {
     if (value == null) {
       return "";
     }
     String text = value.toString();
     String newText = "";
     for (int i = 0; i < text.length(); i++) {
       int code = text.codePointAt(i);
       if ((code >= 128) || (code == 91) || (code == 93))
       {
         newText = newText + "[" + Integer.toHexString(code) + "]";
       }
       else newText = newText + text.charAt(i);
     }
 
     return newText;
   }
 
   public String getFileDir() {
     return this.fileDir;
   }
 
   public void setFileDir(String fileDir) {
     this.fileDir = fileDir;
   }
 }

