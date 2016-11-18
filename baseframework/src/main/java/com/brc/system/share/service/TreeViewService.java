package com.brc.system.share.service;

import com.brc.system.share.treeview.model.TreeModel;
import java.util.List;
import java.util.Map;

public abstract interface TreeViewService
{
  public abstract List<Map<String, Object>> treeBuilder(TreeModel paramTreeModel, Map<String, Object> paramMap)
    throws Exception;

  public abstract List<Map<String, Object>> treeBuilderChildren(String paramString, TreeModel paramTreeModel, Map<String, Object> paramMap)
    throws Exception;
}

