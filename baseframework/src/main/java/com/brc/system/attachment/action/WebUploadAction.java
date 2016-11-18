 package com.brc.system.attachment.action;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.exception.ApplicationException;
 import com.brc.system.attachment.model.FileInfo;
 import com.brc.system.attachment.service.WebUploaderService;
 import com.brc.util.SDO;
 import com.brc.util.Singleton;
 import com.brc.util.StringUtil;
 import com.opensymphony.xwork2.ActionContext;
 import java.io.File;
 import java.io.FileInputStream;
 import java.io.FileOutputStream;
 import java.util.Iterator;
 import java.util.Map;
 import java.util.Set;
 import javax.servlet.RequestDispatcher;
 import javax.servlet.http.HttpServletRequest;
 
 public class WebUploadAction extends CommonAction
 {
   private static final long serialVersionUID = 1L;
   private WebUploaderService webUploaderService;
   private File file;
 
   public void setWebUploaderService(WebUploaderService webUploaderService)
   {
     this.webUploaderService = webUploaderService;
   }
 
   public File getFile()
   {
     return this.file;
   }
 
   public void setFile(File file) {
     this.file = file;
   }
 
   protected String getPagePath() {
     return "/lib/webUploader/";
   }
 
   public String forwardDemo()
   {
     return forward("demo");
   }
 
   private String getBackurl() {
     String backurl = getParameter("backurl");
     return backurl;
   }
 
   private SDO getParam()
   {
     SDO sdo = new SDO(true);
     Map map = ActionContext.getContext().getParameters();
     Iterator it = map.keySet().iterator();
     while (it.hasNext()) {
       String key = (String)it.next();
 
       if ((!key.equals("file")) && (!key.equals("uploadContentType")))
       {
         String[] values = (String[])map.get(key);
         if ((values != null) && (values.length > 0)) {
           if (values.length == 1)
             sdo.putProperty(key, StringUtil.decode(values[0]));
           else
             sdo.putProperty(key, values);
         }
       }
     }
     return sdo;
   }
 
   private FileInfo getFileInfo()
   {
     FileInfo info = new FileInfo();
     info.setSize(getParameter("size"));
     info.setName(getParameter("name"));
     info.setId(getParameter("id"));
     info.setLastModifiedDate(getParameter("lastModifiedDate"));
     info.setType(getParameter("type"));
     info.setExt(getParameter("ext"));
     info.setBizId(getParameter("bizId"));
     info.setBizCode(getParameter("bizCode"));
     info.setAttachmentCode(getParameter("attachmentCode"));
     info.setUniqueName(getParameter("uniqueName"));
     info.setIsMore(getParameter("isMore"));
     try {
       String chunkIndex = getParameter("chunkIndex");
       info.setChunkIndex(Integer.parseInt(chunkIndex));
     } catch (Exception e) {
     }
     try {
       String chunks = getParameter("chunks");
       info.setChunks(Integer.parseInt(chunks));
     } catch (Exception e) {
     }
     try {
       String chunk = getParameter("chunk");
       info.setChunk(Integer.parseInt(chunk));
     } catch (Exception e) {
     }
     return info;
   }
 
   public String ajaxUpload()
   {
     if (this.file != null) {
       FileInfo info = getFileInfo();
       try {
         File target = this.webUploaderService.getReadySpace(info);
         if (target == null) {
           return error("上传文件错误");
         }
         FileOutputStream fos = null;
         FileInputStream fis = null;
         try
         {
           fos = new FileOutputStream(target);
           fis = new FileInputStream(this.file);
           byte[] buffer = new byte[1024];
           int len = 0;
           while ((len = fis.read(buffer)) > 0)
             fos.write(buffer, 0, len);
         }
         catch (Exception e)
         {
           int len;
           if (target.exists()) target.delete();
           return error("数据上传失败");
         } finally {
           if (fos != null) fos.close();
           if (fis != null) fis.close();
         }
 
         if (info.getChunks() <= 0) {
           String backurl = getBackurl();
           if (StringUtil.isBlank(backurl)) {
             Long fileId = this.webUploaderService.saveFileMap(info, target);
             Map map = info.toMap();
             map.put("id", fileId);
             return toResult(map);
           }
           Map param = info.toMap();
 
           param.put("sdo", getParam());
           getSession().put("AttachmentInfo", param);
           getRequest().getRequestDispatcher(backurl).forward(getRequest(), getResponse());
           return "none";
         }
 
         return toResult("ok");
       } catch (Exception ex) {
         ex.printStackTrace();
         return error(ex.getMessage());
       }
     }
     return error("上传文件错误,未找到文件对象！");
   }
 
   private boolean filterType(String fileExt)
   {
     String allowTypes = (String)Singleton.getParameter("uploadFileType", String.class);
     if ((allowTypes == null) || (allowTypes.equals(""))) return true;
     String[] types = allowTypes.split(",");
     for (String type : types) {
       if (fileExt.toLowerCase().endsWith(type.toLowerCase())) {
         return true;
       }
     }
     return false;
   }
 
   public String md5Check()
   {
     FileInfo info = getFileInfo();
     String fileExt = info.getExt();
     if (!filterType(fileExt)) {
       return error("您要上传的文件类型不正确！");
     }
     String uniqueFileName = info.getUniqueFileName();
     return toResult(uniqueFileName);
   }
 
   public String chunkCheck()
   {
     FileInfo info = getFileInfo();
     if (this.webUploaderService.chunkCheck(info)) {
       return blank("{\"ifExist\": 1}");
     }
     return blank("{\"ifExist\": 0}");
   }
 
   public String chunksMerge()
   {
     FileInfo info = getFileInfo();
     try {
       File target = this.webUploaderService.chunksMerge(info);
       if (target == null) {
         throw new ApplicationException("文件上传失败!");
       }
       String backurl = getBackurl();
       if (StringUtil.isBlank(backurl)) {
         Long fileId = this.webUploaderService.saveFileMap(info, target);
         Map map = info.toMap();
         map.put("id", fileId);
         return toResult(map);
       }
       Map param = info.toMap();
 
       param.put("sdo", getParam());
       getSession().put("AttachmentInfo", param);
       getRequest().getRequestDispatcher(backurl).forward(getRequest(), getResponse());
       return "none";
     }
     catch (Exception e) {
       return error(e.getMessage());
     }
   }
 }

