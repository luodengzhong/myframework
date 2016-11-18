 package com.brc.system.imp.action;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.exception.ApplicationException;
 import com.brc.system.imp.service.ImpExcelService;
 import com.brc.system.opm.Operator;
 import com.brc.util.ClassHelper;
 import com.brc.util.FileHelper;
 import com.brc.util.LogHome;
 import com.brc.util.SDO;
 import com.brc.util.excel.ExportExcel;
 import java.io.File;
 import java.io.FileInputStream;
 import java.io.FileOutputStream;
 import java.io.Serializable;
 import java.util.HashMap;
 import java.util.List;
 import java.util.Map;
 import java.util.Random;
 import org.apache.log4j.Logger;
 
 public class ImpExcelAction extends CommonAction
 {
   private static final long serialVersionUID = 1L;
   private ImpExcelService impExcelService;
   private File upload;
   private String uploadContentType;
   private String uploadFileName;
 
   public void setImpExcelService(ImpExcelService impExcelService)
   {
     this.impExcelService = impExcelService;
   }
 
   public File getUpload()
   {
     return this.upload;
   }
 
   public void setUpload(File upload) {
     this.upload = upload;
   }
 
   public String getUploadContentType() {
     return this.uploadContentType;
   }
 
   public void setUploadContentType(String uploadContentType) {
     this.uploadContentType = uploadContentType;
   }
 
   public String getUploadFileName() {
     return this.uploadFileName;
   }
 
   public void setUploadFileName(String uploadFileName) {
     this.uploadFileName = uploadFileName;
   }
 
   protected String getPagePath() {
     return "/system/impTempl/";
   }
 
   public String forwardList()
   {
     return forward("ExpTempletList");
   }
 
   public String slicedQuery()
   {
     SDO sdo = getSDO();
     try {
       Map map = this.impExcelService.slicedQuery(sdo);
       return toResult(map);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
   }
 
   public String forwardListImpExpLog()
   {
     SDO sdo = getSDO();
     try {
       Map map = this.impExcelService.loadExpTempletByCode(sdo);
       if (map != null)
         return forward("ImpExpLogList", map);
     }
     catch (Exception e) {
       e.printStackTrace();
     }
     return forward("ImpExpLogList");
   }
 
   public String queryLogByTempletId()
   {
     SDO sdo = getSDO();
     try {
       Map map = this.impExcelService.slicedImpExpLogQuery(sdo);
       return toResult(map);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
   }
 
   public boolean filterType(String fileExt)
   {
     String allowTypes = "xls,xlsx";
     if ((allowTypes == null) || (allowTypes.equals(""))) return true;
     String[] types = allowTypes.split(",");
     for (String type : types) {
       if (fileExt.toLowerCase().endsWith(type.toLowerCase())) {
         return true;
       }
     }
     return false;
   }
 
   public String upload()
     throws Exception
   {
     Long templetId = (Long)ClassHelper.convert(getParameter("templId"), Long.class);
     Long serialId = (Long)ClassHelper.convert(getParameter("serialId"), Long.class);
     Operator operator = getOperator();
     String fileExt = FileHelper.getFileExtName(getUploadFileName());
     if (!filterType(fileExt)) {
       return blank("您要上传的文件类型不正确！");
     }
 
     String newFileName = System.getProperty("java.io.tmpdir") + FileHelper.FILE_SEPARATOR + System.currentTimeMillis() + "_" + new Random().nextInt(1000) + "." + fileExt;
 
     FileOutputStream fos = null;
     FileInputStream fis = null;
     File uploadedFile = new File(newFileName);
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
       return blank("上传文件失败。");
     } finally {
       if (fos != null) fos.close();
       if (fis != null) fis.close(); 
     }
     try
     {
       serialId = this.impExcelService.saveImpExcel(templetId, serialId, operator, newFileName);
       Long e_nur = this.impExcelService.getImpMidTableTotle(templetId, serialId, "2");
       Long s_nur = this.impExcelService.getImpMidTableTotle(templetId, serialId, "1");
 
       this.impExcelService.saveImpLog(serialId, templetId, operator, getUploadFileName(), "导入成功", e_nur, s_nur);
     }
     catch (Exception e)
     {
       Long s_nur;
       this.impExcelService.saveImpLog(serialId, templetId, operator, getUploadFileName(), "解析文件错误:" + e.getMessage(), null, null);
       LogHome.getLog(this).error("解析错误：", e);
       return blank(e.getMessage());
     } finally {
       if (uploadedFile.exists()) uploadedFile.delete();
     }
     return success(serialId);
   }
 
   public String showInsert()
   {
     return forward("ExpTempletDetail");
   }
 
   public String showUpdate() {
     SDO sdo = getSDO();
     try {
       return forward("ExpTempletDetail", this.impExcelService.loadExpTemplet(sdo));
     } catch (Exception e) {
       e.printStackTrace();
       return errorPage(e.getMessage());
     }
   }
 
   public String queryExpTempletDetail()
   {
     SDO sdo = getSDO();
     Long id = (Long)sdo.getProperty("templetId", Long.class);
     try {
       Map map = new HashMap();
       map.put("Rows", this.impExcelService.queryExpTempletByTempletId(id));
       return toResult(map);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
   }
 
   public String queryExpTempletDetailByTempletId() {
     SDO sdo = getSDO();
     Long id = (Long)sdo.getProperty("templetId", Long.class);
     try {
       Map map = new HashMap();
       map.put("Rows", this.impExcelService.queryExpTempletDetailByTempletId(id));
       return toResult(map);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
   }
 
   public String deleteTempletDetail()
   {
     SDO sdo = getSDO();
     Long[] ids = sdo.getLongArray("ids");
     try {
       this.impExcelService.deleteTempletDetail(ids);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
     return success();
   }
 
   public String insert()
   {
     SDO sdo = getSDO();
     try {
       Serializable id = this.impExcelService.insert(sdo);
       return success(id);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
   }
 
   public String insertTemplet()
   {
     SDO sdo = getSDO();
     List detailData = sdo.getList("detailData");
     try {
       Serializable id = this.impExcelService.insertTemplet(sdo, detailData);
       return success(id);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
   }
 
   public String updateTemplet()
   {
     SDO sdo = getSDO();
     List detailData = sdo.getList("detailData");
     try {
       this.impExcelService.updateTemplet(sdo, detailData);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
     return success();
   }
 
   public String moveTemplet()
   {
     SDO sdo = getSDO();
     Long parentId = (Long)sdo.getProperty("parentId", Long.class);
     Long[] ids = sdo.getLongArray("ids");
     try {
       this.impExcelService.updateTempletParentId(ids, parentId);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
     return success();
   }
 
   public String excuteUpdate()
   {
     SDO sdo = getSDO();
     try {
       Map map = this.impExcelService.load(sdo);
       return forward("ExpTempletDetail", map);
     } catch (Exception e) {
       e.printStackTrace();
       return errorPage(e.getMessage());
     }
   }
 
   public String deleteTemplet()
   {
     SDO sdo = getSDO();
     Long[] ids = sdo.getLongArray("ids");
     try
     {
       this.impExcelService.deleteTemplet(ids);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
     return success();
   }
 
   public String updateTempletStatus()
   {
     SDO sdo = getSDO();
     Integer sts = (Integer)sdo.getProperty("sts", Integer.class);
     Long[] ids = sdo.getLongArray("ids");
     try {
       this.impExcelService.updateTempletStatus(ids, sts);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
     return success();
   }
 
   public String updateTempletCompStatus()
   {
     SDO sdo = getSDO();
     Integer sts = (Integer)sdo.getProperty("sts", Integer.class);
     Long[] ids = sdo.getLongArray("ids");
     try {
       this.impExcelService.updateTempletCompStatus(ids, sts);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
     return success();
   }
 
   public String doExpTempl()
     throws Exception
   {
     SDO sdo = getSDO();
     Long templetId = (Long)sdo.getProperty("id", Long.class);
     try {
       String xml = this.impExcelService.findTemplExcelHead(templetId);
       String s = ExportExcel.createExcel(xml);
       File file = new File(s);
       if (file.exists())
         return toResult(file.getName());
     }
     catch (ApplicationException e) {
       return error(e.getMessage());
     } catch (Exception e) {
       LogHome.getLog(this).error("查询导入结果表头：", e);
       return error("程序错误，请与系统管理员联系 !");
     }
     return null;
   }
 
   public String slicedResultQuery() {
     SDO sdo = getSDO();
     try {
       Map map = this.impExcelService.slicedResultQuery(sdo);
       return toResult(map);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
   }
 
   public String forwardAssignCodeImpPage()
   {
     SDO sdo = getSDO();
     try {
       Map map = this.impExcelService.loadExpTempletByCode(sdo);
       if (map == null) {
         throw new ApplicationException("模板编码不正确，请确认!");
       }
       map.put("serialId", sdo.getProperty("serialId"));
       return forward("AssignCodeImp", map);
     } catch (Exception e) {
       return errorPage(e);
     }
   }
 
   public String deleteTempData()
   {
     SDO sdo = getSDO();
     try {
       this.impExcelService.deleteTempData(sdo);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
     return success();
   }
 }

