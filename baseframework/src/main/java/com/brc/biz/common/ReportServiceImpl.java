 package com.brc.biz.common;
 
 import org.springframework.beans.factory.annotation.Value;
 import org.springframework.stereotype.Service;
 
 @Service("reportService")
 public class ReportServiceImpl
   implements ReportService
 {
 
   @Value("#{fineReport['fr.fineReportWebUrl']}")
   private String fineReportWebUrl;
 
   public String getReportWebUrl()
   {
     return this.fineReportWebUrl;
   }
 
   public String getFineReportWebUrl() {
     return this.fineReportWebUrl;
   }
 
   public void setFineReportWebUrl(String fineReportWebUrl) {
     this.fineReportWebUrl = fineReportWebUrl;
   }
 }

