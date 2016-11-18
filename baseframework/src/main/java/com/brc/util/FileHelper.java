 package com.brc.util;
 
 import java.io.BufferedOutputStream;
 import java.io.ByteArrayOutputStream;
 import java.io.File;
 import java.io.FileInputStream;
 import java.io.FileOutputStream;
 import java.io.IOException;
 import java.io.InputStream;
 import java.io.PrintStream;
 import java.io.Serializable;
 import java.text.DecimalFormat;
 import java.util.Date;
 import java.util.Properties;
 import java.util.Random;
 import org.apache.commons.io.FileUtils;
 import org.apache.log4j.Logger;
 
 public class FileHelper
 {
   public static final String FILE_SEPARATOR = System.getProperties().getProperty("file.separator");
 
   public static String getTmpdir()
   {
     return System.getProperty("java.io.tmpdir");
   }
 
   public static String getFileExtName(String filePath)
   {
     int pos = filePath.lastIndexOf(".");
     if (-1 == pos) return "";
     return filePath.substring(pos + 1).toLowerCase();
   }
 
   public static String getFileName(String filePath)
   {
     int pos = filePath.lastIndexOf(".");
     if (-1 == pos) return "";
     return filePath.substring(0, pos);
   }
 
   public static String getFileSavePath()
   {
     String saveUrl = (String)Singleton.getParameter("uploadPath", String.class);
//     String savePath = FILE_SEPARATOR + "uploadPath" + FILE_SEPARATOR;
     String savePath = saveUrl;
 
     File uploadDir = new File(savePath);
     if ((!uploadDir.exists()) || (!uploadDir.isDirectory())) {
       savePath = Singleton.getRealPath() + saveUrl;
     }
     return savePath;
   }
 
   public static String getFileTempPath()
   {
     String saveUrl = (String)Singleton.getParameter("uploadTempPath", String.class);
//     String savePath = FILE_SEPARATOR + "uploadTempPath" + FILE_SEPARATOR;
     String savePath = saveUrl;
 
     File uploadDir = new File(savePath);
     if ((!uploadDir.exists()) || (!uploadDir.isDirectory())) {
       savePath = Singleton.getRealPath() + saveUrl;
     }
     return savePath;
   }
 
   public static String getConvertOutputPath() {
     return (String)Singleton.getParameter("convertOutputPath", String.class);
   }
 
   public static boolean isFile(String filePath)
   {
     if ((filePath == null) || (filePath.equals(""))) return false;
     filePath = getFileSavePath() + filePath;
     File f = new File(filePath);
     if (!f.exists()) return false;
     return f.isFile();
   }
 
   public static boolean exists(String filePath)
   {
     if ((filePath == null) || (filePath.equals(""))) return false;
     filePath = getFileSavePath() + filePath;
     File f = new File(filePath);
     return f.exists();
   }
 
   public static void delFile(String filePath)
   {
     if ((filePath == null) || (filePath.equals(""))) return; filePath = getFileSavePath() + filePath;
     File f = new File(filePath);
     if ((f.exists()) && (f.isFile()));
   }
 
   public static void delErrorFile(String filePath)
   {
     if ((filePath == null) || (filePath.equals(""))) return;
     filePath = getFileSavePath() + filePath;
     File f = new File(filePath);
     if ((f.exists()) && (f.isFile()))
       f.delete();
   }
 
   public static void delConvertFiles(String fileId)
   {
     String filePath = getConvertOutputPath();
     if ((filePath == null) || (filePath.equals(""))) return;
     File dir = new File(filePath + fileId + File.separator);
     if ((dir.exists()) && (dir.isDirectory())) {
       File[] fs = dir.listFiles();
       for (File f : fs) {
         if (f.exists()) f.delete();
       }
       dir.delete();
     }
   }
 
   public static void cleanFile(String folder)
   {
     if ((folder == null) || (folder.equals(""))) return;
     folder = getFileSavePath() + folder;
     File f = new File(folder);
     if (f.isDirectory()) {
       File[] fs = f.listFiles();
       for (int i = 0; i < fs.length; i++);
     }
   }
 
   public static File getFile(String filePath)
   {
     if ((filePath == null) || (filePath.equals(""))) return null;
     filePath = getFileSavePath() + filePath;
     File f = new File(filePath);
     if ((f.exists()) && (f.isFile())) {
       return f;
     }
     return null;
   }
 
   public static File getRealPathFile(String filePath) {
     if ((filePath == null) || (filePath.equals(""))) return null;
     filePath = Singleton.getRealPath() + filePath;
     File f = new File(filePath);
     if ((f.exists()) && (f.isFile())) {
       return f;
     }
     return null;
   }
 
   public static byte[] readFileToByteArray(File f)
     throws Exception
   {
     if ((!f.exists()) || (!f.isFile())) {
       return null;
     }
     byte[] fileb = null;
     InputStream is = null;
     ByteArrayOutputStream out = new ByteArrayOutputStream();
     try {
       is = new FileInputStream(f);
       byte[] b = new byte[1024];
       int n;
       while ((n = is.read(b)) != -1) {
         out.write(b, 0, n);
       }
       fileb = out.toByteArray();
     } catch (Exception e) {
       throw new Exception("readFileToByteArray", e);
     } finally {
       if (is != null)
         try {
           is.close();
         }
         catch (Exception e) {
         }
       if (out != null)
         try {
           out.close();
         }
         catch (Exception e) {
         }
     }
     return fileb;
   }
 
   public static void writeByteToFile(byte[] bfile, String filePath, String fileName)
   {
     BufferedOutputStream bos = null;
     FileOutputStream fos = null;
     File file = null;
     try {
       File dir = new File(filePath);
       if ((!dir.exists()) && (dir.isDirectory())) {
         dir.mkdirs();
       }
       file = new File(filePath, fileName);
       fos = new FileOutputStream(file);
       bos = new BufferedOutputStream(fos);
       bos.write(bfile);
     } catch (Exception e) {
       e.printStackTrace();
     } finally {
       if (bos != null) {
         try {
           bos.close();
         } catch (IOException e1) {
           e1.printStackTrace();
         }
       }
       if (fos != null)
         try {
           fos.close();
         } catch (IOException e1) {
           e1.printStackTrace();
         }
     }
   }
 
   public static boolean copyFile(File fromFile, String filePath)
   {
     if ((filePath == null) || (filePath.equals(""))) return false;
     filePath = getFileSavePath() + filePath;
     File toFile = new File(filePath);
     try {
       FileUtils.copyFile(fromFile, toFile);
     } catch (IOException e) {
       LogHome.getLog(FileHelper.class).error("复制文件错误:", e);
       return false;
     }
     return true;
   }
 
   public static boolean copyFileTo(File fromFile, String filePath) {
     if ((filePath == null) || (filePath.equals(""))) return false;
     File toFile = new File(filePath);
     try {
       FileUtils.copyFile(fromFile, toFile);
     } catch (IOException e) {
       LogHome.getLog(FileHelper.class).error("复制文件错误:", e);
       return false;
     }
     return true;
   }
 
   public static boolean copyFile(File fromFile, File toFile) {
     try {
       FileUtils.copyFile(fromFile, toFile);
     } catch (IOException e) {
       LogHome.getLog(FileHelper.class).error("复制文件错误:", e);
       return false;
     }
     return true;
   }
 
   public static boolean copyFile(String fromPath, String filePath)
   {
     File fromFile = getFile(fromPath);
     if (null == fromFile) return false;
     return copyFile(fromFile, filePath);
   }
 
   public static String copyFileByCode(String fromPath, String code) {
     File fromFile = getFile(fromPath);
     if (null == fromFile) return null;
     String newFileName = System.currentTimeMillis() + "_" + new Random().nextInt(1000) + "." + getFileExtName(fromPath);
     StringBuffer sb = new StringBuffer();
     sb.append(FILE_SEPARATOR);
     sb.append((String)ClassHelper.convert(code, String.class, "temp"));
     sb.append(FILE_SEPARATOR);
     sb.append(DateUtil.getDateFormat("yyyyMM", new Date()));
     sb.append(FILE_SEPARATOR);
     sb.append(newFileName);
     boolean flag = copyFile(fromFile, sb.toString());
     if (flag) {
       return sb.toString();
     }
     return null;
   }
 
   public static String formetFileSize(long fileSize)
   {
     DecimalFormat df = new DecimalFormat("#.00");
     String fileSizeString = "";
     if (fileSize < 1024L)
       fileSizeString = df.format(fileSize) + "B";
     else if (fileSize < 1048576L)
       fileSizeString = df.format(fileSize / 1024.0D) + "K";
     else if (fileSize < 1073741824L)
       fileSizeString = df.format(fileSize / 1048576.0D) + "M";
     else {
       fileSizeString = df.format(fileSize / 1073741824.0D) + "G";
     }
     return fileSizeString;
   }
 
   public static void checkDir(String pathName)
   {
     File filePath = new File(pathName);
     if (!filePath.isDirectory())
       filePath.mkdirs();
   }
 
   public static void checkFile(String filePathName)
     throws IOException
   {
     File file = new File(filePathName);
     if (!file.exists())
       file.createNewFile();
   }
 
   public static String createTmpFilePath(String fileExt)
   {
     StringBuffer filePath = new StringBuffer();
     filePath.append(getTmpdir()).append(FILE_SEPARATOR);
     filePath.append(System.currentTimeMillis()).append("_").append(new Random().nextInt(1000));
     filePath.append(".").append(fileExt);
     return filePath.toString();
   }
 
   public static String getHelpFileSavePath()
   {
     String saveUrl = (String)Singleton.getParameter("helpFilePath", String.class);
     String savePath = FILE_SEPARATOR + "helpFilePath" + FILE_SEPARATOR;
 
     File uploadDir = new File(savePath);
     if ((!uploadDir.exists()) || (!uploadDir.isDirectory())) {
       savePath = Singleton.getRealPath() + saveUrl;
     }
     return savePath;
   }
 
   public static File getHelpFile(String filePath)
   {
     if ((filePath == null) || (filePath.equals(""))) return null;
     filePath = getHelpFileSavePath() + FILE_SEPARATOR + filePath;
     File f = new File(filePath);
     if ((f.exists()) && (f.isFile())) {
       return f;
     }
     return null;
   }
 
   public static boolean isPicture(String filePath)
   {
     if ((filePath == null) || (filePath.equals(""))) return false;
     String fileKind = filePath.toLowerCase();
     if ((fileKind.endsWith("gif")) || (fileKind.endsWith("jpg")) || (fileKind.endsWith("jpeg")) || (fileKind.endsWith("png")) || (fileKind.endsWith("bmp"))) {
       return true;
     }
     return false;
   }
 
   public static String getConvertUrl(Serializable id, boolean isReadOnly)
   {
     String converUrl = (String)Singleton.getParameter("SYS.Convert.URL", String.class);
     String method = "%s/attachment.do?method=convertAttachment&attachmentId=%s&isReadOnly=%s&a=%s";
     return String.format(method, new Object[] { converUrl, id, isReadOnly ? "true" : "false", Long.valueOf(System.currentTimeMillis()) });
   }
 
   public static void main(String[] args) {
     String path = "c:\\uploadPath\\1443521409418_89.txt";
     File f = new File(path);
     System.out.println("exists:" + f.exists());
   }
 }

