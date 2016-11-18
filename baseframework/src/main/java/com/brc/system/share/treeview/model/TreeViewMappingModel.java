 package com.brc.system.share.treeview.model;
 
 import com.brc.util.ConfigFileVersions;
import com.brc.xmlbean.AjaxDocument;
 import com.brc.xmlbean.AjaxDocument.Ajax;
import com.brc.xmlbean.DataModelDocument;
 import com.brc.xmlbean.DataModelDocument.DataModel;
import com.brc.xmlbean.TreeDocument;
 import com.brc.xmlbean.TreeDocument.Tree;
import com.brc.xmlbean.TreeMappingDocument;
 import com.brc.xmlbean.TreeMappingDocument.TreeMapping;
 import java.io.Serializable;
 import java.util.HashMap;
 import java.util.Map;
 
 public class TreeViewMappingModel
   implements Serializable, ConfigFileVersions
 {
   private static final long serialVersionUID = 173704882069216812L;
   private Map<String, TreeModel> trees;
   private Long versions;
   private String configFilePath;
 
   public TreeViewMappingModel(TreeMappingDocument.TreeMapping mapping)
   {
     this.trees = new HashMap(mapping.getTreeArray().length);
     for (TreeDocument.Tree tree : mapping.getTreeArray())
       this.trees.put(tree.getName(), parseTreeModel(tree));
   }
 
   private TreeModel parseTreeModel(TreeDocument.Tree tree)
   {
     TreeModel model = new TreeModel();
     model.setName(tree.getName());
     model.setDesc(tree.getDesc());
     model.setAjax((tree.getAjax() != null) && (tree.getAjax() == AjaxDocument.Ajax.TRUE));
 
     DataModelDocument.DataModel dataModel = tree.getDataModel();
     model.setTable(dataModel.getTable());
     model.setPrimarykey(dataModel.getPrimaryKey());
     model.setConnectby(dataModel.getConnectBy());
     model.setLabel(dataModel.getLabel());
     model.setRoot(dataModel.getRoot());
     model.setHiddencol(dataModel.getHiddenCol());
     model.setCondition(dataModel.getCondition());
     model.setOrderby(dataModel.getOrderby());
     model.setOrder(dataModel.getOrder());
     return model;
   }
 
   public TreeModel getTreeModel(String name) {
     return (TreeModel)this.trees.get(name);
   }
 
   public Long getVersions() {
     return this.versions;
   }
 
   public void setVersions(Long versions) {
     this.versions = versions;
   }
 
   public String getConfigFilePath() {
     return this.configFilePath;
   }
 
   public void setConfigFilePath(String configFilePath) {
     this.configFilePath = configFilePath;
   }
 }

