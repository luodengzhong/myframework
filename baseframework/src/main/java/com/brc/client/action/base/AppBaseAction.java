 package com.brc.client.action.base;
 
 import com.brc.exception.ApplicationException;
 import com.brc.util.LogHome;
 import com.brc.util.StringUtil;
 import java.io.FileOutputStream;
 import java.io.IOException;
 import java.io.OutputStream;
 import javax.servlet.ServletOutputStream;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.log4j.Logger;
 import sun.misc.BASE64Decoder;
 
 public class AppBaseAction extends CommonAction
 {
   private static final long serialVersionUID = 1L;
 
   public String blank(String msg)
   {
     HttpServletResponse response = getResponse();
     LogHome.getLog(this).debug(msg);
     try
     {
       byte[] stringBytes = StringUtil.compress(msg);
       response.setContentLength(stringBytes.length);
       response.getOutputStream().write(stringBytes);
       response.getOutputStream().flush();
       response.getOutputStream().close();
     } catch (IOException e) {
       e.printStackTrace();
     }
     return null;
   }
 
   public void stringToImage(String imgData, String imgFilePath)
     throws IOException
   {
     if (imgData == null) throw new ApplicationException("未读取到图片信息!");
     BASE64Decoder decoder = new BASE64Decoder();
 
     OutputStream out = null;
     try {
       byte[] b = decoder.decodeBuffer(imgData);
       out = new FileOutputStream(imgFilePath);
       out.write(b);
       out.flush();
     } catch (IOException e) {
       e.printStackTrace();
       LogHome.getLog(this).error("解码并生成图片错误：", e);
       throw e;
     } finally {
       if (out != null) out.close();
     }
   }
 }

