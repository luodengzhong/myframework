 package com.brc.client.action;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.exception.ApplicationException;
 import com.brc.system.opm.Operator;
 import com.brc.system.share.service.TreeViewService;
 import com.brc.system.share.treeview.model.TreeModel;
 import com.brc.system.share.treeview.model.TreeViewMappingModel;
 import com.brc.util.LogHome;
 import com.brc.util.SDO;
 import com.brc.util.StringUtil;
 import com.brc.util.ThreadLocalUtil;
 import com.brc.util.XmlLoadManager;
 import java.io.IOException;
 import java.util.HashMap;
 import java.util.List;
 import java.util.Map;
 import javax.servlet.ServletException;
 import org.apache.log4j.Logger;
 
 public class TreeViewAction extends CommonAction
 {
   private String configPath;
   private XmlLoadManager<TreeViewMappingModel> treeViewManager;
   private TreeViewService treeViewService;
 
   public void setTreeViewManager(XmlLoadManager<TreeViewMappingModel> treeViewManager)
   {
     this.treeViewManager = treeViewManager;
   }
 
   public void setTreeViewService(TreeViewService treeViewService) {
     this.treeViewService = treeViewService;
   }
 
   public void setConfigPath(String configPath) {
     this.configPath = configPath;
   }
 
   private TreeModel getTreeModel(SDO sdo) throws ApplicationException {
     TreeModel model = null;
     String name = (String)sdo.getProperty("treeViewMappingName", String.class);
     try {
       if (StringUtil.isBlank(name)) {
         throw new ApplicationException("treeViewMappingName不能为空！");
       }
       TreeViewMappingModel mappingModel = (TreeViewMappingModel)this.treeViewManager.loadConfigFile(this.configPath);
       if (null != mappingModel) {
         model = mappingModel.getTreeModel(name);
         if (model == null)
           throw new ApplicationException("未找到名字为" + name + "的配置！");
       }
       else {
         throw new ApplicationException("未找到类别为" + this.configPath + "的查询配置！");
       }
     } catch (Exception e) {
       throw new ApplicationException(e);
     }
     return model;
   }
 
   public String root()
     throws Exception
   {
     SDO sdo = getSDO();
     try {
       TreeModel model = getTreeModel(sdo);
       model.setSearchQueryCondition((String)sdo.getProperty("searchQueryCondition", String.class));
       model.setManageType((String)sdo.getProperty("sys_Manage_Type", String.class));
       Operator operator = getOperator();
       if ((operator != null) && (operator.getLoginPerson() != null)) {
         ThreadLocalUtil.addVariable("operator", operator);
       }
       List list = this.treeViewService.treeBuilder(model, sdo.getProperties());
       Map map = new HashMap(2);
       map.put("Rows", list);
       map.put("isAjax", Boolean.valueOf(model.isAjax()));
       map.put("idFieldName", StringUtil.getHumpName(model.getPrimarykey()));
       map.put("parentIDFieldName", StringUtil.getHumpName(model.getConnectby()));
       map.put("textFieldName", StringUtil.getHumpName(model.getLabel()));
       return toResult(map);
     } catch (Exception e) {
       e.printStackTrace();
       LogHome.getLog(this).error(e);
       return error(e.getMessage());
     }
   }
 
   public String children()
     throws ServletException, IOException
   {
     SDO sdo = getSDO();
     Operator operator = getOperator();
     if ((operator != null) && (operator.getLoginPerson() != null))
       ThreadLocalUtil.addVariable("operator", operator);
     try
     {
       TreeModel model = getTreeModel(sdo);
       String id = (String)sdo.getProperty("treeParentId", String.class);
       List list = this.treeViewService.treeBuilderChildren(id, model, sdo.getProperties());
       return toResult(list);
     } catch (Exception e) {
       e.printStackTrace();
       LogHome.getLog(this).error(e);
       return error(e.getMessage());
     }
   }
 }

