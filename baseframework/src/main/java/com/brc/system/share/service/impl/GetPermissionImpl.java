 package com.brc.system.share.service.impl;
 
 import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.brc.model.fn.impl.OrgFun;
import com.brc.system.opm.Operator;
import com.brc.system.opm.OrgUnit;
import com.brc.system.opm.service.PermissionFieldService;
import com.brc.system.share.service.GetPermission;
import com.brc.util.ClassHelper;
import com.brc.util.LogHome;
import com.brc.util.SDO;
import com.brc.util.StringUtil;
import com.brc.util.ThreadLocalUtil;

import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;
 
 public class GetPermissionImpl
   implements GetPermission
 {
   private Cache cache;
   private PermissionFieldService permissionFieldService;
   private OrgFun orgFun;
//   private WorkflowService workflowService;
 
   public void setCache(Cache cache)
   {
     this.cache = cache;
   }
 
   public void setOrgFun(OrgFun orgFun) {
     this.orgFun = orgFun;
   }
 
   public void setPermissionFieldService(PermissionFieldService permissionFieldService) {
     this.permissionFieldService = permissionFieldService;
   }
 
//   public void setWorkflowService(WorkflowService workflowService) {
//     this.workflowService = workflowService;
//   }
// 
   public List<OrgUnit> getPermissionOrgUnit(String personId, List<String> fullIds, String manageType)
   {
     if (StringUtil.isBlank(personId)) {
       return null;
     }
     List list = null;
     String cacheKey = "ManagementType|" + personId + "|" + manageType;
     Element element = null;
     try {
       element = this.cache.get(cacheKey);
       if (element == null) {
         list = this.orgFun.findSubordinationsByOrgManageType(fullIds, manageType);
         element = new Element(cacheKey, list);
         this.cache.put(element);
       }
       return (List)element.getValue();
     }
     catch (Exception e)
     {
       LogHome.getLog(this).error("获取数据权限", e);
     }
     return null;
   }
 
   public List<OrgUnit> getPermissionOrgUnit(String manageType)
   {
     Operator operator = (Operator)ThreadLocalUtil.getVariable("operator", Operator.class);
     if (operator == null) return null;
     return getPermissionOrgUnit(operator.getId(), operator.getPersonMemberFullIds(), manageType);
   }
 
   public void removeCache()
   {
     this.cache.removeAll();
   }
 
   public void removeCacheByKind(String kind)
   {
     List l = this.cache.getKeys();
     for (Iterator i$ = l.iterator(); i$.hasNext(); ) { Object o = i$.next();
       String key = (String)ClassHelper.convert(o, String.class);
       if ((!StringUtil.isBlank(key)) && (key.startsWith(kind)))
         this.cache.remove(o);
     }
   }
 
   public SDO getPermissionSql(String sql, String manageType)
   {
     SDO sdo = new SDO();
     Operator operator = (Operator)ThreadLocalUtil.getVariable("operator", Operator.class);
     if ((operator == null) || (StringUtil.isBlank(operator.getFullId()))) {
       sdo.putProperty("sql", sql);
       return sdo;
     }
     if (manageType.equals("noControlAuthority")) {
       sdo.putProperty("sql", sql);
       return sdo;
     }
     StringBuffer sb = new StringBuffer();
     sb.append("select * from (").append(sql).append(")");
     sb.append(" where 1=1 ");
     if (StringUtil.hasField(sql, "full_id")) {
       List list = getPermissionOrgUnit(operator.getId(), operator.getPersonMemberFullIds(), manageType);
       if ((list != null) && (list.size() > 0)) {
         int length = list.size();
         Map map = new HashMap(length + 2);
         sb.append(" and (");
         if (StringUtil.hasField(sql, "person_member_id")) {
           sb.append(" person_member_id like :authorityPersonId");
           map.put("authorityPersonId", operator.getId() + "%");
           sb.append(" or ");
         } else if (StringUtil.hasField(sql, "person_id")) {
           sb.append(" person_id = :authorityPersonId");
           map.put("authorityPersonId", operator.getId());
           sb.append(" or ");
         }
         for (int i = 0; i < length; i++) {
           OrgUnit ou = (OrgUnit)list.get(i);
           sb.append(" full_id like :authorityFullId").append(i);
           map.put("authorityFullId" + i, ou.getFullId() + "%");
           if (i < length - 1) {
             sb.append(" or ");
           }
         }
         sb.append(")");
         sdo.putProperty("param", map);
       } else {
         Map map = new HashMap(3);
         sb.append(" and ");
         if (StringUtil.hasField(sql, "person_member_id")) {
           sb.append(" person_member_id like :authorityPersonId");
           map.put("authorityPersonId", operator.getId() + "%");
         } else if (StringUtil.hasField(sql, "person_id")) {
           sb.append(" person_id = :authorityPersonId");
           map.put("authorityPersonId", operator.getId());
         } else {
           sb.append(" full_id like :authorityFullId");
           map.put("authorityFullId", "%" + operator.getId() + "%");
         }
         sdo.putProperty("param", map);
       }
     }
     sdo.putProperty("sql", sb.toString());
     return sdo;
   }
 
   public SDO getPermissionSql(String sql, String alias, String manageType)
   {
     SDO sdo = new SDO();
     Operator operator = (Operator)ThreadLocalUtil.getVariable("operator", Operator.class);
     if ((operator == null) || (StringUtil.isBlank(operator.getFullId()))) {
       sdo.putProperty("sql", sql);
       return sdo;
     }
     StringBuffer sb = new StringBuffer(sql);
     List list = getPermissionOrgUnit(operator.getId(), operator.getPersonMemberFullIds(), manageType);
     if ((list != null) && (list.size() > 0)) {
       int length = list.size();
       Map map = new HashMap(length + 2);
       sb.append(" and (");
       for (int i = 0; i < length; i++) {
         OrgUnit ou = (OrgUnit)list.get(i);
         sb.append(alias).append(".full_id like :authorityFullId").append(i);
         map.put("authorityFullId" + i, ou.getFullId() + "%");
         if (i < length - 1) {
           sb.append(" or ");
         }
       }
       sb.append(")");
       sdo.putProperty("param", map);
     }
     sdo.putProperty("sql", sb.toString());
     return sdo;
   }
 
   public SDO getTreePermissionSql(String sql, String manageType)
   {
     SDO sdo = new SDO();
     Operator operator = (Operator)ThreadLocalUtil.getVariable("operator", Operator.class);
     if ((operator == null) || (StringUtil.isBlank(operator.getFullId()))) {
       sdo.putProperty("sql", sql);
       return sdo;
     }
     if (manageType.equals("noControlAuthority")) {
       sdo.putProperty("sql", sql);
       return sdo;
     }
     StringBuffer sb = new StringBuffer();
     sb.append("select * from (").append(sql).append(")");
     sb.append(" where 1=1 ");
     List list = getPermissionOrgUnit(operator.getId(), operator.getPersonMemberFullIds(), manageType);
     if (StringUtil.hasField(sql, "full_id")) {
       if ((null != list) && (list.size() > 0)) {
         int length = list.size();
         Map map = new HashMap(length);
         sb.append(" and (");
         for (int i = 0; i < length; i++) {
           OrgUnit ou = (OrgUnit)list.get(i);
           sb.append(" full_id like :authorityFullId").append(i);
           sb.append(" or ");
           sb.append(":authorityFullId").append(i).append(" like full_id ||'%'");
           map.put("authorityFullId" + i, ou.getFullId() + "%");
           if (i < length - 1) {
             sb.append(" or ");
           }
         }
         sb.append(")");
         sdo.putProperty("param", map);
       } else {
         sb.append(" and (");
         sb.append(" full_id like :authorityPersonFullId");
         sb.append(" or ");
         sb.append(":authorityPersonFullId").append(" like full_id ||'%'");
         sb.append(")");
         Map map = new HashMap(1);
         map.put("authorityPersonFullId", operator.getFullId());
         sdo.putProperty("param", map);
       }
     }
     sdo.putProperty("sql", sb.toString());
     return sdo;
   }
 
   public List<Map<String, Object>> getOperatorPermissionFieldByFunction(String function, Operator operator, boolean isId)
   {
     if (operator == null) {
       return null;
     }
     String cacheKey = "PermissionFieldByFunction|" + function + "|" + operator.getFullId() + "|" + String.valueOf(isId);
     Element element = null;
     List list = null;
     try {
       element = this.cache.get(cacheKey);
       if (element == null) {
         list = this.permissionFieldService.getOperatorPermissionFieldByFunction(function, operator, isId);
         element = new Element(cacheKey, list);
         this.cache.put(element);
       }
       return (List)element.getValue();
     }
     catch (Exception e)
     {
       LogHome.getLog(this).error("获取数据权限", e);
     }
     return null;
   }
 
   public List<Map<String, Object>> queryAuthorityByProcUnitHandlerId(String id)
   {
     if (StringUtil.isBlank(id)) {
       return null;
     }
     String cacheKey = "PermissionFieldByProcUnitHandlerId|" + id;
     Element element = null;
     List list = null;
     try {
       element = this.cache.get(cacheKey);
       if (element == null) {
//         list = this.workflowService.queryAuthorityByProcUnitHandlerId((Long)ClassHelper.convert(id, Long.class));
         element = new Element(cacheKey, list);
         this.cache.put(element);
       }
       return (List)element.getValue();
     }
     catch (Exception e)
     {
       LogHome.getLog(this).error("获取数据权限", e);
     }
     return null;
   }
 
   public boolean authenticationManageType(String manageType, String fullId)
   {
     if (manageType.equals("noControlAuthority")) {
       return true;
     }
     Operator operator = (Operator)ThreadLocalUtil.getVariable("operator", Operator.class);
     if (operator == null) {
       return false;
     }
     List<OrgUnit> list = getPermissionOrgUnit(operator.getId(), operator.getPersonMemberFullIds(), manageType);
     if ((list != null) && (list.size() > 0)) {
       for (OrgUnit orgUnit : list) {
         if (fullId.indexOf(orgUnit.getFullId()) != -1) {
           return true;
         }
       }
     }
 
     if (fullId.indexOf("/" + operator.getId() + "@") != -1) {
       return true;
     }
     return false;
   }
 }

