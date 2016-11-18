package com.brc.system.attachment.service.impl;

import com.brc.exception.ApplicationException;
import com.brc.system.attachment.model.FileInfo;
import com.brc.system.attachment.model.FileLock;
import com.brc.system.attachment.service.AttachmentService;
import com.brc.system.attachment.service.WebUploaderService;
import com.brc.util.ClassHelper;
import com.brc.util.DateUtil;
import com.brc.util.FileHelper;
import com.brc.util.LogHome;
import com.brc.util.Singleton;
import java.io.File;
import java.io.FileFilter;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.locks.Lock;
import org.apache.log4j.Logger;

public class WebUploaderServiceImpl
  implements WebUploaderService
{
  private AttachmentService attachmentService;

  public void setAttachmentService(AttachmentService attachmentService)
  {
    this.attachmentService = attachmentService;
  }

  private String a()
  {
    String path = FileHelper.getFileTempPath();
    StringBuffer sb = new StringBuffer();
    sb.append(path);
    sb.append(FileHelper.FILE_SEPARATOR);
    sb.append("tmp");
    sb.append(DateUtil.getDateFormat("yyyyMM", new Date()));
    sb.append(FileHelper.FILE_SEPARATOR);
    return sb.toString();
  }

  private String a(FileInfo info)
  {
    String bizCode = info.getBizCode();
    StringBuffer sb = new StringBuffer();
    sb.append(FileHelper.FILE_SEPARATOR);
    sb.append((String)ClassHelper.convert(bizCode, String.class, "temp"));
    sb.append(FileHelper.FILE_SEPARATOR);
    sb.append(DateUtil.getDateFormat("yyyyMM", new Date()));
    sb.append(FileHelper.FILE_SEPARATOR);

    return sb.toString();
  }

  private Map<String, String> b(FileInfo info)
  {
    Map map = new HashMap(3);
    String savePath = FileHelper.getFileSavePath();
    String saveUrl = a(info);
    File uploadDir = new File(savePath);
    if ((!uploadDir.exists()) || (!uploadDir.isDirectory())) {
      LogHome.getLog(this).error("上传文件夹不存在：" + savePath);
      throw new ApplicationException("上传文件夹" + (String)Singleton.getParameter("uploadPath", String.class) + "不存在，请检查");
    }
    savePath = savePath + saveUrl;
    File dirFile = new File(savePath);
    if ((!dirFile.exists()) || (!dirFile.isDirectory())) {
      dirFile.mkdirs();
    }

    String newFileName = c(info.getName());
    map.put("savePath", savePath);
    map.put("saveUrl", saveUrl + newFileName);
    map.put("newFileName", newFileName);
    return map;
  }

  public File getReadySpace(FileInfo info)
  {
    String path = a();

    if (!a(path, false)) {
      return null;
    }

    if (info.getChunks() > 0) {
      String newFileName = String.valueOf(info.getChunk());
      String fileFolder = info.getUniqueFileName();
      if (fileFolder == null) {
        return null;
      }
      path = path + fileFolder;
      if (!a(path, true)) {
        return null;
      }
      return new File(path, newFileName);
    }
    Map filePath = b(info);
    info.setSavePath((String)filePath.get("saveUrl"));
    return new File((String)filePath.get("savePath"), (String)filePath.get("newFileName"));
  }

  public boolean chunkCheck(FileInfo info)
  {
    String path = a();
    StringBuffer file = new StringBuffer(path);
    file.append(info.getUniqueName());
    file.append(FileHelper.FILE_SEPARATOR);
    file.append(info.getChunkIndex());
    Long size = Long.valueOf(info.getSize());

    File target = new File(file.toString());
    if ((target.isFile()) && (size.longValue() == target.length())) {
      return true;
    }
    return false;
  }

  public File chunksMerge(FileInfo info)
  {
    String path = a();
    String folder = info.getUniqueName();
    String filePath = path + folder;
    int chunks = info.getChunks();
    int syschunks = b(filePath);

    if (chunks != syschunks) {
      throw new ApplicationException("分片数量错误[" + chunks + "--" + syschunks + "][" + folder + "]!");
    }

    Lock lock = FileLock.getLock(folder);
    lock.lock();
    FileOutputStream fileOut = null;
    FileChannel outChannel = null;
    try
    {
      File[] folders = a(filePath);
      if (folders == null) {
        return null;
      }
      Map saveFilePath = b(info);
      List<File> files = new ArrayList(Arrays.asList(folders));
      if (chunks == files.size())
      {
        Collections.sort(files, new Comparator()
        {
          public int compare(Object o11, Object o22) {
        	  File o1 = (File) o11;
        	  File o2 = (File) o22;
            if (Integer.valueOf(o1.getName()).intValue() < Integer.valueOf(o2.getName()).intValue()) {
              return -1;
            }
            return 1;
          }

        });
        File outputFile = new File((String)saveFilePath.get("savePath"), (String)saveFilePath.get("newFileName"));
        outputFile.createNewFile();
        fileOut = new FileOutputStream(outputFile);
        outChannel = fileOut.getChannel();

        FileChannel inChannel = null;
        FileInputStream fileIn = null;
        ByteBuffer bb = null;
        for (File file : files)
        {
          fileIn = new FileInputStream(file);
          inChannel = fileIn.getChannel();
          bb = ByteBuffer.allocate(8192);
          while (inChannel.read(bb) != -1) {
            bb.flip();
            outChannel.write(bb);
            bb.clear();
          }
          inChannel.close();
          fileIn.close();
          file.delete();
        }
        files = null;

        a(folder, path);

        info.setSavePath((String)saveFilePath.get("saveUrl"));
        return outputFile;
      }
    } catch (Exception ex) {
      ex.printStackTrace();
      throw new ApplicationException(ex);
    }
    finally {
      lock.unlock();

      FileLock.removeLock(folder);
      if (outChannel != null) {
        try {
          outChannel.close();
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
      if (fileOut != null) {
        try {
          fileOut.close();
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
    }

    return null;
  }

  public Long saveFileMap(FileInfo info, File newFile)
  {
    if ((newFile == null) || (!newFile.exists())) {
      throw new ApplicationException("文件上传失败!");
    }
    Long id = null;
    try {
      BigDecimal size = new BigDecimal(info.getSize());
      BigDecimal fileLength = new BigDecimal(newFile.length());
      if (size.compareTo(fileLength) != 0) {
        throw new ApplicationException("上传文件大小错误[" + size.toString() + "," + fileLength.toString() + "],请联系管理员!");
      }
      info.setSize(newFile.length() + "");
      Map param = info.toMap();
      id = this.attachmentService.save(param);
    }
    catch (Exception ex) {
      FileHelper.delErrorFile(info.getSavePath());
      throw new ApplicationException(ex);
    }
    return id;
  }

  private boolean a(String folder, String path)
  {
    File garbage = new File(path + folder);
    if (!garbage.delete()) {
      return false;
    }

    garbage = new File(path, folder + ".tmp");
    if (!garbage.delete()) {
      return false;
    }
    return true;
  }

  private File[] a(String folder)
  {
    File targetFolder = new File(folder);
    return targetFolder.listFiles(new FileFilter()
    {
      public boolean accept(File file) {
        if (file.isDirectory()) {
          return false;
        }
        return true;
      }
    });
  }

  private int b(String folder)
  {
    File[] filesList = a(folder);
    return filesList.length;
  }

  private boolean a(String file, boolean hasTmp)
  {
    File tmpFile = new File(file);
    if (!tmpFile.exists()) {
      try {
        tmpFile.mkdir();
      } catch (SecurityException ex) {
        ex.printStackTrace();
        return false;
      }
    }
    if (hasTmp)
    {
      tmpFile = new File(file + ".tmp");
      if (tmpFile.exists())
        tmpFile.setLastModified(System.currentTimeMillis());
      else {
        try {
          tmpFile.createNewFile();
        } catch (IOException ex) {
          ex.printStackTrace();
          return false;
        }
      }
    }
    return true;
  }

  private String c(String extName)
  {
    String[] ext = extName.split("\\.");
    String newFileName = System.currentTimeMillis() + "_" + new Random().nextInt(1000) + "." + ext[(ext.length - 1)];
    return newFileName;
  }
}