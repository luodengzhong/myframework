 package com.brc.system.opm;
 
 import com.brc.system.ValidStatus;
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.opm.domain.Org;
 import com.brc.system.opm.service.AuthenticationService;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.system.util.CommonUtil;
 import com.brc.system.util.Util;
 import com.brc.util.SpringBeanFactory;
 import com.brc.util.StringUtil;
 import com.brc.util.ThreadLocalUtil;
 import java.util.Date;
 import java.util.List;
 import java.util.Map;
 import org.apache.struts2.ServletActionContext;
 
 public class OpmUtil
 {
   public static final String HQ_ORG_CODE = "SCLGHJ";
   public static final String HQ_TZFZZX_CENTER_CODE = "TZFZZX";
   public static final String BIZ_OPERATOR_PSM_FIELD_NAME = "_BizOprPsm_";
   public static final String BIZ_OPERATOR_KEY = "_BizOpr_";
   public static final String BIZ_MANAGE_ORG_ID_FIELD_NAME = "manageOrganId";
 
   public static String getOrgRoot()
   {
     return "orgRoot";
   }
 
   public static Object coalesce(Object[] objs)
   {
     for (Object item : objs) {
       if (item != null) {
         return item;
       }
     }
     return null;
   }
 
   public static void checkOrgId(String id)
   {
     Util.check(Util.isNotEmptyString(id), "标识不能为空！", new Object[0]);
     Util.check((id.indexOf(47) < 0) && (id.indexOf(64) < 0) && (id.indexOf(46) < 0) && (id.indexOf(37) < 0), "无效的标识“%s”，不能包含字符“/”、“@”、“.”、“%%”！", new Object[] { id });
   }
 
   public static void checkOrgCode(String code)
   {
     Util.check(Util.isNotEmptyString(code), "编码“%s”不能为空！", new Object[] { code });
     Util.check((code.indexOf(47) < 0) && (code.indexOf(37) < 0) && (code.indexOf(44) < 0), "无效的编码“%s”，不能包含字符“/”、“%%”、“,”！", new Object[] { code });
   }
 
   public static void checkOrgName(String name)
   {
     Util.check(Util.isNotEmptyString(name), "名称“%s”不能为空！", new Object[] { name });
     Util.check((name.indexOf(47) < 0) && (name.indexOf(37) < 0) && (name.indexOf(44) < 0), "无效的名称“%s”，不能包含字符“/”、“%%”、“,”！", new Object[] { name });
   }
 
   public static void checkStatusRule(ValidStatus orgStatus, ValidStatus parentOrgStatus, String orgName, String parentOrgName, String type)
   {
     if (parentOrgStatus != null)
       Util.check(orgStatus.getId() <= parentOrgStatus.getId(), "%s失败，“上级组织：%s”的状态是“%s”，“下级组织：%s”的状态不能是“%s”！", new Object[] { type, parentOrgName, parentOrgStatus.getDisplayName(), orgName, orgStatus.getDisplayName() });
   }
 
   public static void checkOrgKindRule(OrgKind orgKind, OrgKind parentOrgKind, String orgName, String parentOrgName, String operateKind)
   {
     if (parentOrgKind != null)
     {
       Util.check(orgKind.getLevel() >= parentOrgKind.getLevel(), "%s失败，“%s”的上级组织不能是“%s”！", new Object[] { operateKind, orgKind.getDisplayName(), parentOrgKind.getDisplayName() });
 
       if (OrgKind.ogn.equals(parentOrgKind)) {
         Util.check((OrgKind.ogn.equals(orgKind)) || (OrgKind.dpt.equals(orgKind)) || (OrgKind.fld.equals(orgKind)), "%s失败，机构下不能建“%s”。", new Object[] { operateKind, orgKind.getDisplayName() });
       }
       else if (OrgKind.dpt.equals(parentOrgKind)) {
         Util.check((OrgKind.dpt.equals(orgKind)) || (OrgKind.pos.equals(orgKind)), "%s失败，部门下不能建“%s”。", new Object[] { operateKind, orgKind.getDisplayName() });
       }
       else if (OrgKind.pos.equals(parentOrgKind)) {
         Util.check(OrgKind.psm.equals(orgKind), "%s失败，岗位下不能建“%s”。", new Object[] { operateKind, orgKind.getDisplayName() });
       }
       else if (OrgKind.fld.equals(parentOrgKind)) {
         Util.check((OrgKind.fld.equals(orgKind)) || (OrgKind.prj.equals(orgKind)), "%s失败，项目组织分类下不能建“%s”。", new Object[] { operateKind, orgKind.getDisplayName() });
       }
       else if (OrgKind.prj.equals(parentOrgKind)) {
         Util.check((OrgKind.grp.equals(orgKind)) || (OrgKind.stm.equals(orgKind)), "%s失败，项目组织下不能建“%s”。", new Object[] { operateKind, orgKind.getDisplayName() });
       }
       else if (OrgKind.stm.equals(parentOrgKind)) {
         Util.check(OrgKind.dpt.equals(orgKind), "%s失败，项目组织下不能建“%s”。", new Object[] { operateKind, orgKind.getDisplayName() });
       }
       else if (OrgKind.grp.equals(parentOrgKind)) {
         Util.check(OrgKind.psm.equals(orgKind), "%s失败，分组下不能建“%s”。", new Object[] { operateKind, orgKind.getDisplayName() });
       }
       else if (OrgKind.psm.equals(parentOrgName))
         Util.check(OrgKind.fun.equals(orgKind), "%s失败，人员下不能建“%s”。", new Object[] { operateKind, orgKind.getDisplayName() });
     }
     else {
       Util.check(OrgKind.ogn.equals(orgKind), "%s失败，只有“%s”才能作为组织的根。", new Object[] { operateKind, OrgKind.ogn.getDisplayName() });
     }
   }
 
   public static String createFileFullName(String path, String fileName, String fileKind)
   {
     return CommonUtil.createFileFullName(path, fileName, fileKind);
   }
 
   public static void checkVersion(Long version, Long dbVersion, String type, String id) {
     Util.check((dbVersion == null) || (dbVersion.equals(Long.valueOf(version.longValue()))), "%s失败，“%s”的数据已经被其他人修改，请刷新后重新操作！", new Object[] { type, id });
   }
 
   public static void buildOrgIdCodeNameExtInfo(ServiceUtil serviceUtil, String orgId, Map<String, Object> orgInfo) {
     Util.check(Util.isNotEmptyString(orgId), "调用“buildOrgIdCodeNameExtInfo”出错，“orgId”不能为空！", new Object[0]);
 
     String sql = "select id from (select t.id, t.code, t.name, t.org_kind_id, t.full_id, t.is_center from sa_oporg t  where t.status = 1 and t.is_center = 1 connect by prior t.parent_id = t.id start with t.id = ? order by t.full_id desc) where rownum = 1";
     List<Org> orgs = serviceUtil.getEntityDao().queryToList(sql, Org.class, new Object[] { orgId });
     int centerCount = 0; int deptCount = 0;
 
     for (Org org : orgs) {
       OrgKind orgKind = org.getOrgKindEnum();
       switch (orgKind.getLevel()) {
       case 1:
         orgInfo.put("orgId", org.getId());
         orgInfo.put("orgCode", org.getCode());
         orgInfo.put("orgName", org.getName());
         break;
       case 2:
         if (org.getIsCenter() == 1) {
           centerCount++;
           orgInfo.put("centerId", org.getId());
           orgInfo.put("centerCode", org.getCode());
           orgInfo.put("centerName", org.getName());
         } else {
           deptCount++;
           orgInfo.put("deptId", org.getId());
           orgInfo.put("deptCode", org.getCode());
           orgInfo.put("deptName", org.getName());
         }
         break;
       case 3:
         orgInfo.put("posId", org.getId());
         orgInfo.put("posCode", org.getCode());
         orgInfo.put("posName", org.getName());
         break;
       case 4:
         orgInfo.put("personMemberId", org.getId());
         orgInfo.put("personMemberCode", org.getCode());
         orgInfo.put("personMemberName", org.getName());
       }
 
     }
 
     if ((centerCount > 0) || (deptCount > 0)) {
       if (centerCount == 0) {
         orgInfo.put("centerId", orgInfo.get("deptId"));
         orgInfo.put("centerCode", orgInfo.get("deptCode"));
         orgInfo.put("centerName", orgInfo.get("deptName"));
       }
       if (deptCount == 0) {
         orgInfo.put("deptId", orgInfo.get("centerId"));
         orgInfo.put("deptCode", orgInfo.get("centerCode"));
         orgInfo.put("deptName", orgInfo.get("centerName"));
       }
     }
   }
 
   public static void buildOrgIdCodeNameExtInfo(String fullId, String fullOrgKindId, String fullCode, String fullName, Map<String, Object> orgInfo)
   {
     Util.check(Util.isNotEmptyString(fullId), "调用“buildOrgIdCodeNameExtInfo”出错，“fullId”不能为空。");
     Util.check(Util.isNotEmptyString(fullOrgKindId), "调用“buildOrgIdCodeNameExtInfo”出错，“fullOrgKindId”不能为空。");
     Util.check(Util.isNotEmptyString(fullCode), "调用“buildOrgIdCodeNameExtInfo”出错，“fullCode”不能为空。");
     Util.check(Util.isNotEmptyString(fullName), "调用“buildOrgIdCodeNameExtInfo”出错，“fullName”不能为空。");
 
     String[] orgKindIds = fullOrgKindId.substring(1).split("/");
     String[] orgIds = fullId.substring(1).split("/");
     String[] orgCodes = fullCode.substring(1).split("/");
     String[] orgNames = fullName.substring(1).split("/");
 
     Util.check(orgIds.length == orgNames.length, "调用“buildOrgIdNameExtInfo”出错，“fullId”与“fullName”长度不等。");
     int deptLevel = 0;
     int ctrLevel = 0;
     int orgLevel = 0;
 
     boolean isProjectOrg = fullId.contains(".prj");
 
     if (isProjectOrg) {
       for (int i = orgIds.length - 1; i >= 0; i--) {
         if (orgIds[i].endsWith("ogn")) {
           orgLevel++;
           if (orgLevel == 1) {
             orgInfo.put("orgId", orgIds[i].replace(".ogn", ""));
             orgInfo.put("orgCode", orgCodes[i]);
             orgInfo.put("orgName", orgNames[i]);
           }
         } else if (orgIds[i].endsWith("prj")) {
           orgInfo.put("centerId", orgIds[i].replace(".prj", ""));
           orgInfo.put("centerCode", orgCodes[i]);
           orgInfo.put("centerName", orgNames[i]);
           if (!fullId.contains(".grp")) {
             orgInfo.put("deptId", orgInfo.get("centerId"));
             orgInfo.put("deptCode", orgInfo.get("centerCode"));
             orgInfo.put("deptName", orgInfo.get("centerName"));
           }
         } else if (orgIds[i].endsWith("grp")) {
           orgInfo.put("deptId", orgIds[i].replace(".grp", ""));
           orgInfo.put("deptCode", orgCodes[i]);
           orgInfo.put("deptName", orgNames[i]);
         } else if (orgIds[i].endsWith("pos")) {
           orgInfo.put("positionId", orgIds[i].replace(".pos", ""));
           orgInfo.put("positionCode", orgCodes[i]);
           orgInfo.put("positionName", orgNames[i]);
         } else if (orgIds[i].endsWith("psm")) {
           orgInfo.put("personMemberId", orgIds[i].replace(".psm", ""));
           orgInfo.put("personMemberCode", orgCodes[i]);
           orgInfo.put("personMemberName", orgNames[i]);
         }
       }
       return;
     }
 
     for (int i = orgIds.length - 1; i >= 0; i--)
       if (orgIds[i].endsWith("ogn")) {
         orgLevel++;
         if (orgLevel == 1) {
           orgInfo.put("orgId", orgIds[i].replace(".ogn", ""));
           orgInfo.put("orgCode", orgCodes[i]);
           orgInfo.put("orgName", orgNames[i]);
         }
       } else if (orgKindIds[i].equalsIgnoreCase("ctr")) {
         ctrLevel++;
         if (ctrLevel == 1)
         {
           if (deptLevel == 0)
           {
             orgInfo.put("deptId", orgIds[i].replace(".dpt", ""));
             orgInfo.put("deptCode", orgCodes[i]);
             orgInfo.put("deptName", orgNames[i]);
           }
           orgInfo.put("centerId", orgIds[i].replace(".dpt", ""));
           orgInfo.put("centerCode", orgCodes[i]);
           orgInfo.put("centerName", orgNames[i]);
         }
       } else if (orgKindIds[i].equalsIgnoreCase("dpt")) {
         deptLevel++;
         if (deptLevel == 1)
         {
           if (ctrLevel == 0) {
             orgInfo.put("centerId", orgIds[i].replace(".dpt", ""));
             orgInfo.put("centerCode", orgCodes[i]);
             orgInfo.put("centerName", orgNames[i]);
 
             orgInfo.put("deptId", orgIds[i].replace(".dpt", ""));
             orgInfo.put("deptCode", orgCodes[i]);
             orgInfo.put("deptName", orgNames[i]);
           }
         }
       } else if (orgIds[i].endsWith("pos")) {
         orgInfo.put("positionId", orgIds[i].replace(".pos", ""));
         orgInfo.put("positionCode", orgCodes[i]);
         orgInfo.put("positionName", orgNames[i]);
       } else if (orgIds[i].endsWith(".psm")) {
         orgInfo.put("personMemberId", orgIds[i].replace(".psm", ""));
         orgInfo.put("personMemberCode", orgCodes[i]);
         orgInfo.put("personMemberName", orgNames[i]);
       }
   }
 
   public static void buildOrgIdNameExtInfo(String fullId, String fullName, Map<String, Object> orgInfo)
   {
     Util.check(Util.isNotEmptyString(fullId), "调用“buildOrgIdNameExtInfo”出错，“fullId”不能为空。");
     Util.check(Util.isNotEmptyString(fullName), "调用“buildOrgIdNameExtInfo”出错，“fullName”不能为空。");
 
     String[] orgIds = fullId.substring(1).split("/");
     String[] orgNames = fullName.substring(1).split("/");
 
     Util.check(orgIds.length == orgNames.length, "调用“buildOrgIdNameExtInfo”出错，“fullId”与“fullName”长度不等。");
 
     for (int i = 0; i < orgIds.length; i++)
       if (orgIds[i].endsWith("ogn")) {
         orgInfo.put("orgId", orgIds[i].replace(".ogn", ""));
         orgInfo.put("orgName", orgNames[i]);
       } else if (orgIds[i].endsWith("dpt")) {
         orgInfo.put("deptId", orgIds[i].replace(".dpt", ""));
         orgInfo.put("deptName", orgNames[i]);
       } else if (orgIds[i].endsWith("pos")) {
         orgInfo.put("posId", orgIds[i].replace(".pos", ""));
         orgInfo.put("posName", orgNames[i]);
       } else if (orgIds[i].endsWith(".psm")) {
         orgInfo.put("psmId", orgIds[i].replace(".psm", ""));
         orgInfo.put("psmName", orgNames[i]);
       }
   }
 
   public static String getPersonMemberIdFromFullId(String fullId)
   {
     String[] split = fullId.substring(1).split("/");
     for (int i = split.length - 1; i >= 0; i--) {
       if (split[i].endsWith("psm")) {
         return split[i].replace(".psm", "");
       }
     }
     return null;
   }
 
   public static String getPersonIdFromFullId(String fullId)
   {
     Util.check(Util.isNotEmptyString(fullId), "调用“getPersonIdFromFullId”出错，“fullId”不能为空！", new Object[0]);
 
     String personMemberId = getPersonMemberIdFromFullId(fullId);
     return getPersonIdFromPersonMemberId(personMemberId);
   }
 
   public static String getPersonIdFromPersonMemberId(String personMemberId)
   {
     Util.check(Util.isNotEmptyString(personMemberId), "调用“getPersonIdFromPersonMemberId”出错，“personMemberId”不能为空！", new Object[0]);
     if (personMemberId.indexOf("@") > -1) {
       String[] split = personMemberId.split("@");
       return split[0];
     }
     return personMemberId;
   }
 
   public static Operator getBizOperator()
   {
     String psmIdOrFullId = (String)ThreadLocalUtil.getVariable("_BizOprPsm_", String.class);
     boolean isChangeOperator = !StringUtil.isBlank(psmIdOrFullId);
     Operator operator;
     if (isChangeOperator) {
       operator = (Operator)ThreadLocalUtil.getVariable("_BizOpr_", Operator.class);
       if (operator == null) {
         AuthenticationService authenticationService = (AuthenticationService)SpringBeanFactory.getBean(ServletActionContext.getServletContext(), "authenticationService", AuthenticationService.class);
 
         operator = authenticationService.getOperatorByPsmIdOrFullId(psmIdOrFullId);
         Util.check(operator != null, "没有找到psmIdOrFullId对应的操作员。");
         ThreadLocalUtil.addVariable("_BizOpr_", operator);
       }
     } else {
       operator = (Operator)ThreadLocalUtil.getVariable("operator", Operator.class);
     }
 
     return operator;
   }
 
   public static void fillCreatorInfo(Map<String, Object> data) {
     Operator operator = (Operator)ThreadLocalUtil.getVariable("operator", Operator.class);
     Util.check(operator != null, "无操作员环境信息。");
     data.put("creatorId", operator.getId());
     data.put("creatorName", operator.getName());
     data.put("createDate", new Date());
   }
 }

