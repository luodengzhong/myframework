 package com.brc.system.attachment.action;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.exception.ApplicationException;
 import com.brc.system.attachment.model.WebOfficeDTO;
 import com.brc.system.attachment.service.AttachmentService;
 import com.brc.system.opm.Operator;
 import com.brc.util.ClassHelper;
 import com.brc.util.ContentTypeHelper;
 import com.brc.util.DateUtil;
 import com.brc.util.FileHelper;
 import com.brc.util.LogHome;
 import com.brc.util.SDO;
 import com.brc.util.Singleton;
 import com.brc.util.StringUtil;
 import com.opensymphony.xwork2.ActionContext;
 import java.io.File;
 import java.io.FileInputStream;
 import java.io.FileOutputStream;
 import java.io.InputStream;
 import java.sql.Timestamp;
 import java.util.Date;
 import java.util.HashMap;
 import java.util.Iterator;
 import java.util.List;
 import java.util.Map;
 import java.util.Random;
 import java.util.Set;
 import org.apache.log4j.Logger;
 
 public class AttachmentAction extends CommonAction
 {
   private AttachmentService service;
   private String bizCode;
   private String bizId;
   private String attachmentCode;
   private String isMore;
   private Long id;
   private String backurl;
   private File upload;
   private String uploadContentType;
   private String uploadFileName;
   private String fileMaxSize;
   private InputStream inputStream;
   private String fileName;
   private String remark;
   private String flag;
   private String contentType;
   private Long fileLength;
 
   public String getFileName()
   {
     return this.fileName;
   }
 
   public void setFileName(String fileName) {
     this.fileName = fileName;
   }
 
   public String getBizCode() {
     return this.bizCode;
   }
 
   public void setBizCode(String bizCode) {
     this.bizCode = bizCode;
   }
 
   public String getAttachmentCode() {
     return this.attachmentCode;
   }
 
   public void setAttachmentCode(String attachmentCode) {
     this.attachmentCode = attachmentCode;
   }
 
   public String getIsMore() {
     return this.isMore;
   }
 
   public void setIsMore(String isMore) {
     this.isMore = isMore;
   }
 
   public String getBizId() {
     return this.bizId;
   }
 
   public void setBizId(String bizId) {
     this.bizId = bizId;
   }
 
   public Long getId() {
     return this.id;
   }
 
   public void setId(Long id) {
     this.id = id;
   }
 
   public String getBackurl() {
     return this.backurl;
   }
 
   public void setBackurl(String backurl) {
     this.backurl = backurl;
   }
 
   public String getFileMaxSize() {
     return this.fileMaxSize;
   }
 
   public void setFileMaxSize(String fileMaxSize) {
     this.fileMaxSize = fileMaxSize;
   }
 
   public void setService(AttachmentService service) {
     this.service = service;
   }
 
   public void setUpload(File upload) {
     this.upload = upload;
   }
 
   public void setUploadContentType(String uploadContentType) {
     this.uploadContentType = uploadContentType;
   }
 
   public void setUploadFileName(String uploadFileName) {
     this.uploadFileName = uploadFileName;
   }
 
   public String getRemark() {
     return this.remark;
   }
 
   public void setRemark(String remark) {
     this.remark = remark;
   }
 
   public String getFlag() {
     return this.flag;
   }
 
   public void setFlag(String flag) {
     this.flag = flag;
   }
 
   public File getUpload() {
     return this.upload;
   }
 
   public String getUploadContentType() {
     return this.uploadContentType;
   }
 
   public String getUploadFileName() {
     return this.uploadFileName;
   }
 
   public InputStream getInputStream() {
     return this.inputStream;
   }
 
   private void setInputStream(InputStream inputStream) {
     this.inputStream = inputStream;
   }
 
   public Long getFileLength() {
     return this.fileLength;
   }
 
   public void setFileLength(Long fileLength) {
     this.fileLength = fileLength;
   }
 
   public String getContentType() {
     return this.contentType;
   }
 
   public void setContentType(String contentType) {
     this.contentType = contentType;
   }
 
   public boolean filterType(String fileExt)
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
 
   private String getFileSavePath()
   {
     String isAddDir = this.flag != null ? this.flag : "true";
     StringBuffer sb = new StringBuffer();
     sb.append(FileHelper.FILE_SEPARATOR);
     sb.append((String)ClassHelper.convert(this.bizCode, String.class, "temp"));
     if (!isAddDir.equals("false")) {
       sb.append(FileHelper.FILE_SEPARATOR);
       sb.append(DateUtil.getDateFormat("yyyyMM", new Date()));
     }
     sb.append(FileHelper.FILE_SEPARATOR);
 
     return sb.toString();
   }
 
   private Long getFileMaxSizeParameter()
   {
     String fileSize = "2";
     if (StringUtil.isBlank(this.fileMaxSize)) {
       fileSize = (String)Singleton.getParameter("uploadFileSize", String.class);
       fileSize = (fileSize != null) && (!fileSize.equals("")) ? fileSize : "2";
     } else {
       fileSize = this.fileMaxSize;
     }
     Long sizemax = null;
     try {
       Integer size = Integer.valueOf(Integer.parseInt(fileSize));
       sizemax = Long.valueOf(size.intValue() * 1024L * 1024L);
     } catch (Exception e) {
       sizemax = Long.valueOf(1000000L);
     }
     return sizemax;
   }
 
   public String upload()
     throws Exception
   {
     String fileExt = FileHelper.getFileExtName(getUploadFileName());
     if (!filterType(fileExt)) {
       return error("您要上传的文件类型不正确！");
     }
     String savePath = FileHelper.getFileSavePath();
     long sizemax = getFileMaxSizeParameter().longValue();
     if (getUpload().length() > sizemax) {
       return error("上传文件大小超过限制。");
     }
     File uploadDir = new File(savePath);
     if ((!uploadDir.exists()) || (!uploadDir.isDirectory())) {
       LogHome.getLog(this).error("上传文件夹不存在：" + savePath);
       return error("上传文件夹" + (String)Singleton.getParameter("uploadPath", String.class) + "不存在，请检查");
     }
 
     if (!uploadDir.canWrite()) {
       return error("上传目录没有写权限。");
     }
     String saveUrl = getFileSavePath();
     savePath = savePath + saveUrl;
     File dirFile = new File(savePath);
     if ((!dirFile.exists()) || (!dirFile.isDirectory())) {
       dirFile.mkdirs();
     }
     String newFileName = System.currentTimeMillis() + "_" + new Random().nextInt(1000) + "." + fileExt;
     FileOutputStream fos = null;
     FileInputStream fis = null;
     File uploadedFile = new File(savePath, newFileName);
     try
     {
       fos = new FileOutputStream(uploadedFile);
       fis = new FileInputStream(getUpload());
       byte[] buffer = new byte[1024];
       int len = 0;
       while ((len = fis.read(buffer)) > 0)
         fos.write(buffer, 0, len);
     }
     catch (Exception e)
     {
       int len;
       if (uploadedFile.exists()) uploadedFile.delete();
       LogHome.getLog(this).error("上传文件错误：", e);
       return error("上传文件失败。");
     } finally {
       if (fos != null) fos.close();
       if (fis != null) fis.close();
     }
     Operator operator = getOperator();
     Map param = new HashMap();
     param.put("bizCode", this.bizCode);
     param.put("bizId", this.bizId);
     param.put("attachmentCode", this.attachmentCode);
     param.put("isMore", this.isMore);
     param.put("path", saveUrl + newFileName);
     param.put("fileName", getUploadFileName());
     param.put("fileSize", FileHelper.formetFileSize(uploadedFile.length()));
     param.put("fileKind", fileExt);
     param.put("fileLength", Long.valueOf(uploadedFile.length()));
     param.put("isFtp", Integer.valueOf(0));
     param.put("remark", this.remark);
     param.put("creatorId", operator.getPersonMemberId());
     param.put("creatorName", operator.getPersonMemberName());
     param.put("createDate", new Timestamp(System.currentTimeMillis()));
     if ((this.backurl != null) && (!this.backurl.equals(""))) {
       if (this.backurl.equals("doSave")) {
         try {
           Long id = this.service.save(param);
           param.put("error", Integer.valueOf(0));
           param.put("id", id);
           return toResult(param);
         } catch (Exception e) {
           LogHome.getLog(this).error("上传文件保存错误:", e);
 
           FileHelper.delErrorFile(saveUrl + newFileName);
           return error("上传文件保存错误:" + e.getMessage());
         }
       }
       param.put("sdo", getParam());
       getSession().put("AttachmentInfo", param);
       return "redirect";
     }
 
     return toResult(param);
   }
 
   private SDO getParam()
   {
     SDO sdo = new SDO(true);
     Map map = ActionContext.getContext().getParameters();
     Iterator it = map.keySet().iterator();
     while (it.hasNext()) {
       String key = (String)it.next();
 
       if ((!key.equals("upload")) && (!key.equals("uploadContentType")))
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
 
   public String doQuery()
     throws Exception
   {
     try
     {
       List l = this.service.getAttachmentList(this.bizCode, this.bizId);
       return success(l);
     } catch (Exception e) {
       LogHome.getLog(this).error(e);
       e.printStackTrace();
       return error("查询附件出错:" + e.getMessage());
     }
   }
 
   public String doDelete()
     throws Exception
   {
     Operator operator = getOperator();
     String isCheck = getParameter("isCheck");
     try {
       this.service.delete(this.id, operator.getId(), Boolean.valueOf(isCheck).booleanValue());
       return success();
     } catch (Exception e) {
       LogHome.getLog(this).error(e);
       e.printStackTrace();
       return error("查询附件出错:" + e.getMessage());
     }
   }
 
   public String doDeleteAll()
     throws Exception
   {
     Operator operator = getOperator();
     String isCheck = getParameter("isCheck");
     try {
       this.service.deleteAll(this.bizCode, this.bizId, operator.getId(), Boolean.valueOf(isCheck).booleanValue());
       return success();
     } catch (Exception e) {
       LogHome.getLog(this).error(e);
       e.printStackTrace();
       return error("查询附件出错:" + e.getMessage());
     }
   }
 
   public String downFile()
     throws Exception
   {
     File file = null;
     InputStream in = null;
     try {
       Map map = this.service.getAttachmentFile(this.id);
       String filePath = (String)ClassHelper.convert(map.get("path"), String.class, "");
       this.fileName = new String(map.get("fileName").toString().getBytes("GBK"), "ISO8859-1");
       file = FileHelper.getFile(filePath);
       if ((file != null) && (file.exists()))
       {
         String contentType = ContentTypeHelper.getContentType(FileHelper.getFileExtName(file.getName()));
         long fileLength = ((Long)ClassHelper.convert(map.get("fileLength"), Long.class, Long.valueOf(0L))).longValue();
         long sizemax = getFileMaxSizeParameter().longValue();
         if (fileLength > sizemax) {
           String bizId = (String)ClassHelper.convert(map.get("bizId"), String.class);
           String bizCode = (String)ClassHelper.convert(map.get("bizCode"), String.class);
           if ((StringUtil.isBlank(bizId)) || (StringUtil.isBlank(bizCode))) {
             throw new ApplicationException("业务数据不完整!");
           }
           downloadByBreakpoint(getRequest(), getResponse(), file, contentType, this.fileName);
           return "none";
         }
 
         in = new FileInputStream(file);
         setContentType(contentType);
         setFileLength(Long.valueOf(file.length()));
         setInputStream(in);
       }
       else {
         throw new ApplicationException("下载的文件不存在,可能被其他用户删除或修改！");
       }
     } catch (ApplicationException ea) {
       return alert(ea.getMessage());
     } catch (Exception e) {
       LogHome.getLog(this).error("下载文件时出错", e);
       return alert("下载文件时出错,请与管理员联系！");
     }
     return "success";
   }
 
   public String downFileByTmpdir()
     throws Exception
   {
     String temp = getParameter("file");
     if (StringUtil.isBlank(temp)) {
       return alert("下载文件名为空,请与管理员联系！");
     }
     temp = StringUtil.decode(temp);
     this.fileName = StringUtil.decode(this.fileName);
     File file = null;
     String fileExt = "";
     try {
       file = new File(FileHelper.getTmpdir(), temp);
       if ((file != null) && (file.exists())) {
         fileExt = FileHelper.getFileExtName(file.getName());
         this.fileName = (System.currentTimeMillis() + "");
         this.fileName = (this.fileName + "." + fileExt);
         this.fileName = new String(this.fileName.getBytes("GBK"), "ISO8859-1");
         setContentType(ContentTypeHelper.getContentType(fileExt));
         setFileLength(Long.valueOf(file.length()));
         setInputStream(new FileInputStream(file));
       } else {
         throw new ApplicationException("下载的文件不存在,可能被其他用户删除或修改！");
       }
     } catch (ApplicationException ea) {
       ea.printStackTrace();
       LogHome.getLog(this).error(ea);
       return alert(ea.getMessage());
     } catch (Exception e) {
       e.printStackTrace();
       LogHome.getLog(this).error(e);
       return alert("下载文件时出错,请与管理员联系！");
     }
     return "success";
   }
 
   public String downFileBySavePath()
     throws Exception
   {
     String temp = getParameter("file");
     if (StringUtil.isBlank(temp)) {
       return alert("下载文件名为空,请与管理员联系！");
     }
     temp = StringUtil.decode(temp);
     this.fileName = StringUtil.decode(this.fileName);
     File file = null;
     String fileExt = "";
     try {
       file = FileHelper.getFile(temp);
       if ((file != null) && (file.exists())) {
         fileExt = FileHelper.getFileExtName(file.getName());
         this.fileName = (System.currentTimeMillis() + "");
         this.fileName = (this.fileName + "." + fileExt);
         this.fileName = new String(this.fileName.getBytes("GBK"), "ISO8859-1");
         setContentType(ContentTypeHelper.getContentType(fileExt));
         setFileLength(Long.valueOf(file.length()));
         setInputStream(new FileInputStream(file));
       } else {
         throw new ApplicationException("下载的文件不存在,可能被其他用户删除或修改！");
       }
     } catch (ApplicationException ea) {
       ea.printStackTrace();
       LogHome.getLog(this).error(ea);
       return alert(ea.getMessage());
     } catch (Exception e) {
       e.printStackTrace();
       LogHome.getLog(this).error(e);
       return alert("下载文件时出错,请与管理员联系！");
     }
     return "success";
   }
 
   public String forwardWebOffice()
   {
     WebOfficeDTO dto = new WebOfficeDTO();
     File file = null;
     try {
       Map map = this.service.getAttachmentFile(this.id);
       String filePath = (String)ClassHelper.convert(map.get("path"), String.class, "");
       String mFileName = (String)ClassHelper.convert(map.get("fileName"), String.class, "");
       file = FileHelper.getFile(filePath);
       if ((file != null) && (file.exists())) {
         dto.setEditType("1");
         dto.setRecordID(this.id.toString());
         dto.setFileName(mFileName);
         dto.setFileType("." + FileHelper.getFileExtName(file.getName()));
         dto.setUserName(getOperator().getFullName());
         dto.setDefaultParamValue();
         putAttr("webOfficeDTO", dto);
       } else {
         throw new ApplicationException("文件未找到！");
       }
     } catch (Exception e) {
       return errorPage(e);
     }
     return forward("/iWebOffice/OfficeDocument.jsp");
   }
 
   public String forwardConvertView()
   {
     File file = null;
     try {
       Map map = this.service.getAttachmentFile(this.id);
       String filePath = (String)ClassHelper.convert(map.get("path"), String.class, "");
       String mFileName = (String)ClassHelper.convert(map.get("fileName"), String.class, "");
       file = FileHelper.getFile(filePath);
       if ((file != null) && (file.exists())) {
         if ((!StringUtil.isBlank(this.bizCode)) && (this.bizId != null)) {
           List l = this.service.getAttachmentList(this.bizCode, this.bizId);
           putAttr("attachmentList", l);
         }
         putAttr("attachmentId", this.id);
         putAttr("fileName", mFileName);
         putAttr("fileSize", map.get("fileSize"));
         putAttr("attachmentKind", map.get("fileKind"));
         String convertUrl = (String)Singleton.getParameter("SYS.Convert.URL", String.class);
         putAttr("convertUrl", convertUrl);
       } else {
         throw new ApplicationException("文件不存在,可能被其他用户删除或修改！");
       }
     } catch (Exception e) {
       return errorPage(e);
     }
     return forward("/common/attachmentConvertView.jsp");
   }
 
   protected String getPagePath()
   {
     return "/system/attachmentConfig/";
   }
 
   public String forwardListAttachmentConfig()
   {
     return forward("AttachmentConfigList");
   }
 
   public String slicedQueryAttachmentConfig()
   {
     SDO sdo = getSDO();
     try {
       Map map = this.service.slicedQueryAttachmentConfig(sdo);
       return toResult(map);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String showInsertAttachmentConfig()
   {
     return forward("AttachmentConfigDetail");
   }
 
   public String saveAttachmentConfig()
   {
     SDO sdo = getSDO();
     try {
       Long id = this.service.saveAttachmentConfig(sdo);
       return success(id);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String showUpdateAttachmentConfig()
   {
     SDO sdo = getSDO();
     try {
       Map map = this.service.loadAttachmentConfig(sdo);
       return forward("AttachmentConfigDetail", map);
     } catch (Exception e) {
       return errorPage(e);
     }
   }
 
   public String deleteAttachmentConfig()
   {
     SDO sdo = getSDO();
     try {
       this.service.deleteAttachmentConfig(sdo);
     } catch (Exception e) {
       return error(e);
     }
     return success();
   }
 
   public String slicedQueryAttachmentConfigDetail()
   {
     SDO sdo = getSDO();
     try {
       Map map = this.service.slicedQueryAttachmentConfigDetail(sdo);
       return toResult(map);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String deleteAttachmentConfigDetail()
   {
     SDO sdo = getSDO();
     Long[] ids = sdo.getLongArray("ids");
     try {
       this.service.deleteAttachmentConfigDetail(ids);
     } catch (Exception e) {
       return error(e);
     }
     return success();
   }
 
   public String moveAttachmentConfig()
   {
     SDO sdo = getSDO();
     Long parentId = (Long)sdo.getProperty("parentId", Long.class);
     Long[] ids = sdo.getLongArray("ids");
     try {
       this.service.updateAttachmentConfigFolderId(ids, parentId);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
     return success();
   }
 
   public String doSaveSort()
     throws Exception
   {
     try
     {
       this.service.saveAttachmentSort(getSDO());
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String saveFTPFileList()
     throws Exception
   {
     try
     {
       this.service.saveFTPFileList(getSDO());
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String deleteFileByIds()
     throws Exception
   {
     try
     {
       this.service.deleteFileByIds(getSDO());
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String forwardFTPApplet()
   {
     SDO sdo = getSDO();
     putAttr("serverUrl", Singleton.getParameter("SYS.SERVER.URL", String.class));
     putAttr("host", Singleton.getParameter("FTP.SERVER.URL", String.class));
     putAttr("post", Singleton.getParameter("FTP.SERVER.POST", String.class));
     putAttr("userName", Singleton.getParameter("FTP.SERVER.USER", String.class));
     putAttr("password", Singleton.getParameter("FTP.SERVER.PASSWORD", String.class));
     try {
       String readonly = (String)sdo.getProperty("readonly", String.class, "false");
       putAttr("readonly", readonly);
       String canDelete = (String)sdo.getProperty("canDelete", String.class, "true");
       putAttr("canDelete", canDelete);
       String bizId = (String)sdo.getProperty("bizId", String.class);
       String bizCode = (String)sdo.getProperty("bizCode", String.class);
       if ((StringUtil.isBlank(bizId)) || (StringUtil.isBlank(bizCode))) {
         throw new ApplicationException("业务数据不完整[" + bizId + "][" + bizCode + "]");
       }
       String attachmentCode = (String)sdo.getProperty("attachmentCode", String.class);
       putAttr("bizId", bizId);
       putAttr("bizCode", bizCode);
       putAttr("attachmentCode", attachmentCode);
       String isMore = (String)sdo.getProperty("isMore", String.class, "1");
       putAttr("isMore", isMore);
       String isCheck = (String)sdo.getProperty("isCheck", String.class, "true");
       putAttr("isCheck", isCheck);
 
       String saveFilePath = getFileSavePath();
       putAttr("saveFilePath", saveFilePath);
       String fileNameExtension = (String)sdo.getProperty("fileNameExtension", String.class, "");
       if (StringUtil.isBlank(fileNameExtension)) {
         fileNameExtension = (String)Singleton.getParameter("uploadFileType", String.class);
       }
       String queryFileUrl = (String)sdo.getProperty("queryFileUrl", String.class, "");
       if (!StringUtil.isBlank(queryFileUrl)) {
         putAttr("queryFileUrl", queryFileUrl);
       }
       String saveFileFileUrl = (String)sdo.getProperty("saveFileFileUrl", String.class, "");
       if (!StringUtil.isBlank(saveFileFileUrl)) {
         putAttr("saveFileFileUrl", saveFileFileUrl);
       }
       String deleteFileUrl = (String)sdo.getProperty("deleteFileUrl", String.class, "");
       if (!StringUtil.isBlank(deleteFileUrl)) {
         putAttr("deleteFileUrl", deleteFileUrl);
       }
       putAttr("fileNameExtension", fileNameExtension);
     } catch (Exception e) {
       return errorPage(e);
     }
     return forward("/lib/ftpApplet/FTPApplet.jsp");
   }
 
   public String forwardFTPDownloadApplet()
   {
     SDO sdo = getSDO();
     putAttr("host", Singleton.getParameter("FTP.SERVER.URL", String.class));
     putAttr("post", Singleton.getParameter("FTP.SERVER.POST", String.class));
     putAttr("userName", Singleton.getParameter("FTP.SERVER.USER", String.class));
     putAttr("password", Singleton.getParameter("FTP.SERVER.PASSWORD", String.class));
     try {
       String path = (String)sdo.getProperty("path", String.class);
       String fileName = (String)sdo.getProperty("fileName", String.class);
       if ((StringUtil.isBlank(path)) && (StringUtil.isBlank(fileName))) {
         Long fileId = (Long)sdo.getProperty("id", Long.class);
         if (fileId != null) {
           Map map = this.service.getAttachmentFile(fileId);
           path = (String)ClassHelper.convert(map.get("path"), String.class);
           fileName = (String)ClassHelper.convert(map.get("fileName"), String.class);
         } else {
           throw new ApplicationException("业务数据不完整");
         }
       }
       putAttr("remoteFileName", fileName);
       putAttr("remoteFilePath", path);
     } catch (Exception e) {
       return errorPage(e);
     }
     return forward("/lib/ftpApplet/FTPDownloadApplet.jsp");
   }
 }

