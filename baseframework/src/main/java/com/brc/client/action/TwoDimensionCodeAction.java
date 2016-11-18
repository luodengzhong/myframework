 package com.brc.client.action;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.util.QRCodeUtil;
 import com.brc.util.StringUtil;
 import javax.servlet.http.HttpServletResponse;
 
 public class TwoDimensionCodeAction extends CommonAction
 {
   private String codeContent;
 
   public String getCodeContent()
   {
     return this.codeContent;
   }
 
   public void setCodeContent(String codeContent) {
     this.codeContent = StringUtil.decode(codeContent);
   }
 
   public String execute()
     throws Exception
   {
     QRCodeUtil util = new QRCodeUtil();
     util.setCodeContent(this.codeContent);
     util.setCodeOutput(getResponse().getOutputStream());
     util.encoderCode();
     return null;
   }
 }

