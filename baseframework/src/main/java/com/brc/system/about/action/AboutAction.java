 package com.brc.system.about.action;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.system.about.service.AboutService;
 import com.brc.util.FileHelper;
 import com.brc.util.LogHome;
 import com.brc.util.SDO;
 import java.io.File;
 import java.io.Serializable;
 import java.util.HashMap;
 import java.util.List;
 import java.util.Map;
 import javax.servlet.ServletOutputStream;
 import javax.servlet.http.HttpServletResponse;
 import org.apache.log4j.Logger;
 
 public class AboutAction extends CommonAction
 {
   private static final long serialVersionUID = 1L;
   private AboutService aboutService;
 
   public void setAboutService(AboutService aboutService)
   {
     this.aboutService = aboutService;
   }
 
   protected String getPagePath() {
     return "/system/about/";
   }
 
   public String forwardEditHelp()
   {
     return forward("editHelp");
   }
 
   public String loadTrees()
   {
     SDO sdo = getSDO();
     try {
       Map map = this.aboutService.loadTrees(sdo);
       return toResult(map);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String help()
   {
     SDO sdo = getSDO();
     try {
       String ids = this.aboutService.queryParentIds(sdo);
       putAttr("parentIds", ids);
     } catch (Exception e) {
       LogHome.getLog(this).error(e);
     }
     return forward("/help/help.jsp");
   }
 
   public String saveHelp()
   {
     SDO sdo = getSDO();
     try {
       Serializable id = this.aboutService.saveHelp(sdo);
       return success(id);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String loadHelp()
   {
     SDO sdo = getSDO();
     try {
       Map map = this.aboutService.loadHelp(sdo);
       return toResult(map);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String deleteHelp()
   {
     SDO sdo = getSDO();
     try {
       this.aboutService.deleteHelp(sdo);
     } catch (Exception e) {
       return error(e);
     }
     return success();
   }
 
   public String slicedQueryHelpDetail()
   {
     SDO sdo = getSDO();
     try {
       Map map = this.aboutService.slicedQueryHelpDetail(sdo);
       return toResult(map);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String deleteHelpDetail()
   {
     SDO sdo = getSDO();
     Long[] ids = sdo.getLongArray("ids");
     try {
       this.aboutService.deleteHelpDetail(ids);
     } catch (Exception e) {
       return error(e);
     }
     return success();
   }
 
   public String updateHelpDetailStatus()
   {
     SDO sdo = getSDO();
     Integer status = (Integer)sdo.getProperty("status", Integer.class);
     Long[] ids = sdo.getLongArray("ids");
     try {
       this.aboutService.updateHelpDetailStatus(ids, status.intValue());
     } catch (Exception e) {
       return error(e);
     }
     return success();
   }
 
   public String loadHelpByCode()
   {
     SDO sdo = getSDO();
     try {
       List list = this.aboutService.loadHelpByCode(sdo);
       boolean flag = this.aboutService.hasModifPermissions(sdo);
       Map data = new HashMap(2);
       data.put("hasModifPermissions", Boolean.valueOf(flag));
       data.put("rows", list);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String indexHelp()
   {
     SDO sdo = getSDO();
     try {
       List list = this.aboutService.queryHelpByKeyWork(sdo);
       return toResult(list);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String saveHelpById()
   {
     SDO sdo = getSDO();
     try {
       this.aboutService.saveHelpById(sdo);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String showHelp()
   {
     SDO sdo = getSDO();
     try {
       String html = this.aboutService.getHelpFileByHelpId(sdo);
       return blank(html);
     } catch (Exception e) {
       return blank(e.getMessage());
     }
   }
 
   public String viewImages()
   {
     HttpServletResponse response = null;
     ServletOutputStream out = null;
     String filePath = getParameter("img");
     File file = FileHelper.getHelpFile(filePath);
     try {
       if ((file != null) && (file.exists())) {
         response = getResponse();
         response.setContentType("multipart/form-data");
         out = response.getOutputStream();
         out.write(FileHelper.readFileToByteArray(file));
         out.flush();
       }
     } catch (Exception e) {
       e.printStackTrace();
     } finally {
       if (out != null) {
         try {
           out.close();
         } catch (Exception e) {
           e.printStackTrace();
         }
       }
     }
     return null;
   }
 }

