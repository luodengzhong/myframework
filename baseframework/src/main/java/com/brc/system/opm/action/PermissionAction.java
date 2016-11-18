 package com.brc.system.opm.action;
 
 import com.brc.client.action.base.CommonAction;
 import com.brc.system.ValidStatus;
 import com.brc.system.opm.service.PermissionService;
 import com.brc.util.FileHelper;
 import com.brc.util.SDO;
 import com.brc.util.Singleton;
 import com.brc.util.StringUtil;
 import java.io.File;
 import java.io.FilenameFilter;
 import java.util.ArrayList;
 import java.util.Arrays;
 import java.util.Comparator;
 import java.util.List;
 import java.util.Map;
 
 public class PermissionAction extends CommonAction
 {
   private static final long serialVersionUID = -2893242364932944570L;
   private PermissionService permissionService;
   private static final String SELECT_ROLE_DIALOG = "SelectRoleDialog";
   private static final String QUERY_PERMISSON_FOR_FUNCTION_PAGE = "QueryPermissonForFunction";
   private static final String QUERY_PERMISSON_FOR_ORG_PAGE = "QueryPermissonForOrg";
   private static final String QUERY_PERMISSON_FOR_ROLE_PAGE = "QueryPermissonForRole";
 
   public void setPermissionService(PermissionService permissionService)
   {
     this.permissionService = permissionService;
   }
 
   protected String getPagePath()
   {
     return "/system/opm/permission/";
   }
 
   public String forwardRole()
     throws Exception
   {
     return forward("Role");
   }
 
   public String showRoleDetail() {
     SDO params = getSDO();
     try {
       Long folderId = (Long)params.getProperty("folderId", Long.class);
       Long nextSequence = this.permissionService.getRoleNextSequence(folderId);
       params.putProperty("status", Integer.valueOf(ValidStatus.ENABLED.getId()));
       params.putProperty("sequence", nextSequence);
       params.putProperty("version", Integer.valueOf(1));
       return forward("RoleDetail", params);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String loadRole() {
     SDO params = getSDO();
     try {
       Long id = (Long)params.getProperty("id", Long.class);
       Map data = this.permissionService.loadRole(id);
       return forward("RoleDetail", data);
     } catch (Exception e) {
       return errorPage(e.getMessage());
     }
   }
 
   public String insertRole() {
     SDO sdo = getSDO();
     try {
       this.permissionService.insertRole(sdo);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String updateRole() {
     SDO sdo = getSDO();
     try {
       this.permissionService.updateRole(sdo);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String deleteRole() {
     try {
       Long[] ids = getSDO().getLongArray("ids");
       this.permissionService.deleteRole(ids);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String moveRole() {
     SDO params = getSDO();
     try {
       Long folderId = (Long)params.getProperty("folderId", Long.class);
       Long[] ids = params.getLongArray("ids");
       this.permissionService.moveRole(ids, folderId);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String updateRoleSequence() {
     Map functions = getSDO().getLongMap("data");
     try {
       this.permissionService.updateRoleSequence(functions);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String slicedQueryRoles() {
     SDO sdo = getSDO();
     try {
       excludeRootCriteria(sdo.getProperties(), "folderId");
       Map data = this.permissionService.slicedQueryRoles(sdo);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String queryRoleKinds() {
     SDO sdo = getSDO();
     try {
       Map data = this.permissionService.queryRoleKinds(sdo);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String showSelectRoleDialog() {
     return forward("SelectRoleDialog", getSDO().getProperties());
   }
 
   public String getFunctionImgList()
     throws Exception
   {
     SDO sdo = getSDO();
     String dirName = (String)sdo.getProperty("dirName", String.class);
     StringBuffer imgPath = new StringBuffer();
     imgPath.append(Singleton.getRealPath());
     imgPath.append(FileHelper.FILE_SEPARATOR).append("desktop");
     imgPath.append(FileHelper.FILE_SEPARATOR).append("images");
     imgPath.append(FileHelper.FILE_SEPARATOR).append("functions");
     if (!StringUtil.isBlank(dirName)) {
       imgPath.append(FileHelper.FILE_SEPARATOR).append(dirName);
     }
     File path = new File(imgPath.toString());
     int size = 20;
 
     String s = getParameter("total");
     int total = Integer.parseInt(s);
     if ((path.exists()) && (path.isDirectory()))
     {
       String[] imgs = path.list(new FilenameFilter() {
         public boolean accept(File dir, String fname) {
           if ((fname.toLowerCase().endsWith(".gif")) || (fname.toLowerCase().endsWith(".jpg")) || (fname.toLowerCase().endsWith(".png"))) {
             return true;
           }
           return false;
         }
       });
       Arrays.sort(imgs, new Comparator() {
         public int compare(Object o11, Object o22) {
					String o1 = String.valueOf(o11);
					String o2 = String.valueOf(o22);
           return o1.compareTo(o2);
         }
       });
       int length = imgs.length;
       length = length > total + size ? size : length - total;
       if (length > 0) {
         String[] retrunimgs = new String[length];
         System.arraycopy(imgs, total, retrunimgs, 0, length);
         List l = Arrays.asList(retrunimgs);
         return toResult(l);
       }
       return toResult(new ArrayList(0));
     }
 
     return error("获取文件异常，请联系管理员!");
   }
 
   public String forwardFunction() throws Exception {
     return forward("Function");
   }
 
   public String showFunctionDetail() {
     SDO params = getSDO();
     try {
       Long parentId = (Long)params.getProperty("parentId", Long.class);
       Long nextSequence = this.permissionService.getFunctionNextSequence(parentId);
       params.putProperty("status", Integer.valueOf(ValidStatus.ENABLED.getId()));
       params.putProperty("sequence", nextSequence);
       params.putProperty("version", Integer.valueOf(1));
       return forward("FunctionDetail", params);
     } catch (Exception e) {
       return errorPage(e);
     }
   }
 
   public String loadFunction() {
     SDO params = getSDO();
     try {
       Long id = (Long)params.getProperty("id", Long.class);
       Map data = this.permissionService.loadFunction(id);
       return forward("FunctionDetail", data);
     } catch (Exception e) {
       return errorPage(e);
     }
   }
 
   public String insertFunction() {
     SDO sdo = getSDO();
     try {
       this.permissionService.insertFunction(sdo);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String updateFunction() {
     SDO sdo = getSDO();
     try {
       this.permissionService.updateFunction(sdo);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String deleteFunction() {
     try {
       Long[] ids = getSDO().getLongArray("ids");
       this.permissionService.deleteFunction(ids);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String moveFunction() {
     SDO sdo = getSDO();
     try {
       Long[] ids = sdo.getLongArray("ids");
       Long parentId = (Long)sdo.getProperty("parentId", Long.class);
       this.permissionService.moveFunction(ids, parentId);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String addOftenUse() {
     try {
       Long[] ids = getSDO().getLongArray("ids");
       this.permissionService.addOftenUse(ids);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String deleteOftenUse() {
     try {
       Long[] ids = getSDO().getLongArray("ids");
       this.permissionService.deleteOftenUse(ids);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String updateOftenUseSequence() {
     try {
       Map map = getSDO().getLongMap("data");
       this.permissionService.updateOftenUseSequence(map);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String slicedQueryOftenUse() {
     SDO sdo = getSDO();
     try {
       Map data = this.permissionService.slicedQueryOftenUse(sdo);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String updateFunctionSequence() {
     try {
       Map functions = getSDO().getLongMap("data");
       this.permissionService.updateFunctionSequence(functions);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String queryFunctions() {
     try {
       Map data = this.permissionService.queryFunctions(getSDO());
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String showAssignFunctionDialog() {
     try {
       List list = this.permissionService.loadRootFunction();
       putAttr("rootFunction", list);
     } catch (Exception e) {
       return errorPage(e);
     }
     return forward("AssignFunction", getSDO().getProperties());
   }
 
   public String queryFunctionsForAssign() {
     try {
       List list = this.permissionService.queryFunctionsForAssign(getSDO());
       return toResult(list);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String assignFunPermission() {
     SDO params = getSDO();
     try {
       Long roleId = (Long)params.getProperty("roleId", Long.class);
       Long parentId = (Long)params.getProperty("parentId", Long.class);
       List functionIds = params.getList("functionIds");
 
       this.permissionService.assignFunPermission(functionIds, roleId, parentId);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String queryPermissionsForAssignByRoleId() {
     try {
       List list = this.permissionService.queryPermissionsForAssignByRoleId(getSDO());
       return toResult(list);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String queryPermissionsByRoleId() {
     try {
       Map data = this.permissionService.queryPermissionsByRoleId(getSDO());
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String saveRoleRemind() {
     try {
       this.permissionService.saveRoleRemind(getSDO());
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String deleteRolePermission() {
     try {
       this.permissionService.deletePermission(getSDO());
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String deleteRoleRemind() {
     try {
       Long[] ids = getSDO().getLongArray("ids");
       this.permissionService.deleteRoleRemind(ids);
       return success();
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String forwardQueryPermissionForFunction() throws Exception {
     return forward("QueryPermissonForFunction");
   }
 
   public String forwardQueryPermissionForOrg() throws Exception {
     return forward("QueryPermissonForOrg");
   }
 
   public String forwardQueryPermissionForRole() throws Exception {
     return forward("QueryPermissonForRole");
   }
 
   public String queryRolesByFunctionId() {
     SDO params = getSDO();
     try {
       Long functionId = (Long)params.getProperty("functionId", Long.class);
       Map data = this.permissionService.queryRolesByFunctionId(functionId);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String queryRolesByOrgFullId() {
     SDO params = getSDO();
     try {
       String orgFullId = (String)params.getProperty("orgFullId", String.class);
       Map data = this.permissionService.queryRolesByOrgFullId(orgFullId);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String queryOrgsByFunctionId() {
     SDO params = getSDO();
     try {
       Long roleId = (Long)params.getProperty("roleId", Long.class);
       Long functionId = (Long)params.getProperty("functionId", Long.class);
       String inOrgFullId = (String)params.getProperty("inOrgFullId", String.class);
       String filter = (String)params.getProperty("filter", String.class);
       Map data = this.permissionService.queryOrgsByFunctionId(roleId, functionId, inOrgFullId, filter);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String queryFunctionsByOrgFullId() {
     SDO params = getSDO();
     try {
       Long roleId = (Long)params.getProperty("roleId", Long.class);
       String orgFullId = (String)params.getProperty("orgFullId", String.class);
       String inOrgFullId = (String)params.getProperty("inOrgFullId", String.class);
       Long functionId = (Long)params.getProperty("functionId", Long.class);
       String filter = (String)params.getProperty("filter", String.class);
       Map data = this.permissionService.queryFunctionsByOrgFullId(roleId, orgFullId, inOrgFullId, functionId, filter);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String queryRoles() {
     SDO params = getSDO();
     try {
       Map data = this.permissionService.queryRoles(params);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String queryOrgsByRoleId() {
     SDO params = getSDO();
     try {
       Long roleId = (Long)params.getProperty("roleId", Long.class);
       String inOrgFullId = (String)params.getProperty("inOrgFullId", String.class);
       Map data = this.permissionService.queryOrgsByRoleId(roleId, inOrgFullId);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 
   public String queryFunctionsByRoleId() {
     SDO params = getSDO();
     try {
       Long roleId = (Long)params.getProperty("roleId", Long.class);
       String inFunctionFullId = (String)params.getProperty("inFunctionFullId", String.class);
       Map data = this.permissionService.queryFunctionsByRoleId(roleId, inFunctionFullId);
       return toResult(data);
     } catch (Exception e) {
       return error(e);
     }
   }
 }

