 package com.brc.system.share.service.impl;
 
 import com.brc.system.data.JDBCDao;
 import com.brc.system.share.service.GetPermission;
 import com.brc.system.share.service.TreeViewService;
 import com.brc.system.share.treeview.model.TreeModel;
 import com.brc.util.ClassHelper;
 import com.brc.util.SDO;
 import com.brc.util.StringUtil;
 import java.util.ArrayList;
 import java.util.List;
 import java.util.Map;
 
 public class TreeViewServiceImpl
   implements TreeViewService
 {
   private JDBCDao jdbcDao;
   private GetPermission getPermission;
 
   public void setJdbcDao(JDBCDao jdbcDao)
   {
     this.jdbcDao = jdbcDao;
   }
 
   public void setGetPermission(GetPermission getPermission) {
     this.getPermission = getPermission;
   }
 
   public List<Map<String, Object>> treeBuilder(TreeModel model, Map<String, Object> param)
     throws Exception
   {
     String sql = model.getRootSql();
     String manageType = model.getManageType();
     if (!StringUtil.isBlank(manageType)) {
       SDO parm = this.getPermission.getTreePermissionSql(sql, manageType);
       sql = (String)parm.getProperty("sql", String.class);
       if (parm.getProperty("param") != null) {
         param.putAll((Map)parm.getProperty("param", Map.class));
       }
     }
     List<Map<String,Object>> root = addPermissionFlag(this.jdbcDao.queryToMapListByMapParam(sql, param), manageType);
     if (!model.isAjax()) {
       for (Map m : root) {
         int num = ((Integer)ClassHelper.convert(m.get("hasChildren"), Integer.class, Integer.valueOf(0))).intValue();
         if (num > 0) {
           List children = treeBuilderChildren(m.get(StringUtil.getHumpName(model.getPrimarykey())).toString(), model, param);
           m.put("children", children);
         }
       }
     }
     return root;
   }
 
   public List<Map<String, Object>> treeBuilderChildren(String id, TreeModel model, Map<String, Object> param)
     throws Exception
   {
     String sql = model.getChildrenSql();
     String manageType = model.getManageType();
     if (!StringUtil.isBlank(manageType)) {
       SDO parm = this.getPermission.getTreePermissionSql(sql, manageType);
       sql = (String)parm.getProperty("sql", String.class);
       if (parm.getProperty("param") != null) {
         param.putAll((Map)parm.getProperty("param", Map.class));
       }
     }
     param.put("treeParentId", id);
     List<Map<String,Object>> list = addPermissionFlag(this.jdbcDao.queryToMapListByMapParam(sql, param), manageType);
     if (!model.isAjax()) {
       for (Map m : list) {
         int num = ((Number)m.get("hasChildren")).intValue();
         if (num > 0) {
           List children = treeBuilderChildren(m.get(StringUtil.getHumpName(model.getPrimarykey())).toString(), model, param);
           m.put("children", children);
         }
       }
     }
     return list;
   }
 
   private List<Map<String, Object>> addPermissionFlag(List<Map<String, Object>> list, String manageType)
   {
     List l = new ArrayList(list.size());
     if (StringUtil.isBlank(manageType)) {
       return list;
     }
     boolean flag = true;
     String fullId = null;
     for (Map m : list) {
       flag = true;
       if (!manageType.equals("noControlAuthority")) {
         fullId = (String)ClassHelper.convert(m.get("fullId"), String.class);
         if (!StringUtil.isBlank(fullId)) {
           flag = this.getPermission.authenticationManageType(manageType, fullId);
         }
       }
       m.put("managerPermissionFlag", Boolean.valueOf(flag));
       l.add(m);
     }
     return l;
   }
 }

