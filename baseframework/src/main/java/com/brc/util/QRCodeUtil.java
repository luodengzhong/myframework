 package com.brc.util;
 
 import com.brc.exception.ApplicationException;
 import com.swetake.util.Qrcode;
 import java.awt.Color;
 import java.awt.Graphics2D;
 import java.awt.image.BufferedImage;
 import java.io.File;
 import java.io.IOException;
 import java.io.InputStream;
 import java.io.OutputStream;
 import javax.imageio.ImageIO;
 import jp.sourceforge.qrcode.QRCodeDecoder;
 import jp.sourceforge.qrcode.data.QRCodeImage;
 import jp.sourceforge.qrcode.exception.DecodingFailedException;
 import org.apache.log4j.Logger;
 
 public class QRCodeUtil
 {
   private String codeContent;
   private int codeSize;
   private String codeImgType;
   private String codeImgPath;
   private OutputStream codeOutput;
 
   public QRCodeUtil()
   {
     this.codeSize = 7;
     this.codeImgType = "png";
   }
 
   public String getCodeContent() {
     return this.codeContent;
   }
 
   public void setCodeContent(String codeContent) {
     this.codeContent = codeContent;
   }
 
   public int getCodeSize() {
     return this.codeSize;
   }
 
   public void setCodeSize(int codeSize) {
     this.codeSize = codeSize;
   }
 
   public String getCodeImgType() {
     return this.codeImgType;
   }
 
   public void setCodeImgType(String codeImgType) {
     this.codeImgType = codeImgType;
   }
 
   public String getCodeImgPath() {
     return this.codeImgPath;
   }
 
   public void setCodeImgPath(String codeImgPath) {
     this.codeImgPath = codeImgPath;
   }
 
   public OutputStream getCodeOutput() {
     return this.codeOutput;
   }
 
   public void setCodeOutput(OutputStream codeOutput) {
     this.codeOutput = codeOutput;
   }
 
   public void encoderCode()
     throws ApplicationException
   {
     if (StringUtil.isBlank(this.codeContent)) {
       throw new ApplicationException("二维码内容为空无法生成!");
     }
     if ((this.codeOutput == null) && (StringUtil.isBlank(this.codeImgPath)))
       throw new ApplicationException("二维码输出方式不能为空!");
     try
     {
       if (this.codeOutput != null) {
         encoderQRCode(this.codeContent, this.codeOutput, this.codeImgType, this.codeSize);
       }
 
       if (!StringUtil.isBlank(this.codeImgPath))
         encoderQRCode(this.codeContent, this.codeImgPath, this.codeImgType, this.codeSize);
     }
     catch (Exception e)
     {
       LogHome.getLog(this).error("生成二维码错误:", e);
       throw new ApplicationException("生成二维码错误:" + e.getMessage());
     }
   }
 
   public void encoderQRCode(String content, String imgPath, String imgType, int size)
     throws Exception
   {
     BufferedImage bufImg = doCreateCodeImage(content, imgType, size);
     File imgFile = new File(imgPath);
 
     ImageIO.write(bufImg, imgType, imgFile);
   }
 
   public void encoderQRCode(String content, OutputStream output, String imgType, int size)
     throws Exception
   {
     BufferedImage bufImg = doCreateCodeImage(content, imgType, size);
 
     ImageIO.write(bufImg, imgType, output);
   }
 
   private BufferedImage doCreateCodeImage(String content, String imgType, int size)
     throws Exception
   {
     Qrcode qrcodeHandler = new Qrcode();
 
     qrcodeHandler.setQrcodeErrorCorrect('M');
     qrcodeHandler.setQrcodeEncodeMode('B');
 
     qrcodeHandler.setQrcodeVersion(size);
 
     byte[] contentBytes = content.getBytes("utf-8");
 
     int imgSize = 67 + 12 * (size - 1);
     BufferedImage bufImg = new BufferedImage(imgSize, imgSize, 1);
 
     Graphics2D gs = bufImg.createGraphics();
 
     gs.setBackground(Color.WHITE);
     gs.clearRect(0, 0, imgSize, imgSize);
 
     gs.setColor(Color.BLACK);
 
     int pixoff = 2;
 
     if ((contentBytes.length > 0) && (contentBytes.length < 800)) {
       boolean[][] codeOut = qrcodeHandler.calQrcode(contentBytes);
       for (int i = 0; i < codeOut.length; i++) {
         for (int j = 0; j < codeOut.length; j++)
//           if (codeOut[j][i] != 0)
           if (codeOut[j][i])
             gs.fillRect(j * 3 + pixoff, i * 3 + pixoff, 3, 3);
       }
     }
     else
     {
       throw new Exception("QRCode content bytes length = " + contentBytes.length + " not in [0, 800].");
     }
 
     gs.dispose();
     bufImg.flush();
     return bufImg;
   }
 
   public String decoderQRCode(String imgPath)
   {
     File imageFile = new File(imgPath);
     BufferedImage bufImg = null;
     String content = null;
     try {
       bufImg = ImageIO.read(imageFile);
       QRCodeDecoder decoder = new QRCodeDecoder();
       content = new String(decoder.decode(new CodeImage(bufImg)), "utf-8");
     } catch (IOException e) {
       LogHome.getLog(this).error("解析二维码错误:", e);
       throw new ApplicationException("解析二维码错误:" + e.getMessage());
     } catch (DecodingFailedException dfe) {
       LogHome.getLog(this).error("解析二维码错误:", dfe);
       throw new ApplicationException("解析二维码错误:" + dfe.getMessage());
     }
     return content;
   }
 
   public String decoderQRCode(InputStream input)
   {
     BufferedImage bufImg = null;
     String content = null;
     try {
       bufImg = ImageIO.read(input);
       QRCodeDecoder decoder = new QRCodeDecoder();
       content = new String(decoder.decode(new CodeImage(bufImg)), "utf-8");
     } catch (IOException e) {
       LogHome.getLog(this).error("解析二维码错误:", e);
       throw new ApplicationException("解析二维码错误:" + e.getMessage());
     } catch (DecodingFailedException dfe) {
       LogHome.getLog(this).error("解析二维码错误:", dfe);
       throw new ApplicationException("解析二维码错误:" + dfe.getMessage());
     }
     return content;
   }
 
   public static void main(String[] args)
   {
     String imgPath = "D:/uploadPath/Michael_QRCode.png";
     String encoderContent = "Hello 中文,welcome to QRCode!";
     QRCodeUtil util = new QRCodeUtil();
     util.setCodeContent(encoderContent);
     util.setCodeImgPath(imgPath);
     util.encoderCode();
   }
 
   private class CodeImage
     implements QRCodeImage
   {
     BufferedImage bufImg;
 
     public CodeImage(BufferedImage bufImg)
     {
       this.bufImg = bufImg;
     }
 
     public int getHeight()
     {
       return this.bufImg.getHeight();
     }
 
     public int getPixel(int x, int y)
     {
       return this.bufImg.getRGB(x, y);
     }
 
     public int getWidth()
     {
       return this.bufImg.getWidth();
     }
   }
 }

