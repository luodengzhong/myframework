 package com.brc.system.configuration.action;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.system.configuration.ConfigurationService;
 import com.brc.util.SDO;
 import java.util.List;
 import java.util.Map;
 
 public class ConfigurationAction extends CommonAction
 {
   private static final long serialVersionUID = 1850980734323650934L;
   private static final String COMMONTREEDETAILPAGE = "/common/CommonTreeDetail.jsp";
   private static final String SELECT_COMMONTREE_DIALOG_PAGE = "SelectCommonTreeDialog";
   private ConfigurationService configurationService;
 
   public void setConfigurationService(ConfigurationService configurationService)
   {
     this.configurationService = configurationService;
   }
 
   protected String getPagePath()
   {
     return "/system/cfg/";
   }
 
   public String forwardCommonTreeDetail() {
     return forward("/common/CommonTreeDetail.jsp");
   }
 
   public String insertCommonTree() {
     SDO params = getSDO();
     try {
       Long parentId = (Long)params.getProperty("parentId", Long.class);
 
       Long nextSequence = this.configurationService.getCommonTreeNextSequence(parentId);
       params.putProperty("status", Integer.valueOf(1));
       params.putProperty("sequence", nextSequence);
       Long id = this.configurationService.insertCommonTree(params);
       return success(id);
     } catch (Exception e) {
       return error(e.getMessage());
     }
   }
 
   public String updateCommonTreeSequence() {
     Map m = getSDO().getLongMap("data");
     try {
       this.configurationService.updateCommonTreeSequence(m);
       return success("移动文件夹成功!", "ok");
     } catch (Exception e) {
       return error(e.getMessage());
     }
   }
 
   public String updateCommonTree() {
     SDO params = getSDO();
     try {
       this.configurationService.updateCommonTree(params);
       return success();
     } catch (Exception e) {
       return error(e.getMessage());
     }
   }
 
   public String deleteCommonTree() {
     SDO params = getSDO();
     try {
       Long id = (Long)params.getProperty("id", Long.class);
       Integer kindId = (Integer)params.getProperty("kindId", Integer.class);
       this.configurationService.deleteCommonTree(id, kindId);
       return success("删除文件夹成功!", "ok");
     } catch (Exception e) {
       return error(e.getMessage());
     }
   }
 
   public String loadCommonTreeNode() {
     try {
       Long id = (Long)getSDO().getProperty("id", Long.class);
       SDO data = this.configurationService.loadCommonTreeNode(id);
       return forward("/common/CommonTreeDetail.jsp", data);
     } catch (Exception e) {
       return errorPage(e.getMessage());
     }
   }
 
   public String loadCommonTrees() {
     try {
       SDO data = this.configurationService.loadCommonTrees(getSDO());
       return toResult(data);
     } catch (Exception e) {
       e.printStackTrace();
       return error(e.getMessage());
     }
   }
 
   public String showCommonTreeDialog() {
     return forward("SelectCommonTreeDialog");
   }
 
   public String queryUserProcessTemplate()
   {
     SDO sdo = getSDO();
     try {
       List list = this.configurationService.queryUserProcessTemplate(sdo);
       return toResult(list);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String saveUserProcessTemplate() {
     SDO sdo = getSDO();
     try {
       this.configurationService.saveUserProcessTemplate(sdo);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String deleteUserProcessTemplate() {
     SDO sdo = getSDO();
     try {
       this.configurationService.deleteUserProcessTemplate(sdo);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String saveUserProcessTemplateDetail() {
     SDO sdo = getSDO();
     try {
       this.configurationService.saveUserProcessTemplateDetail(sdo);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 }

