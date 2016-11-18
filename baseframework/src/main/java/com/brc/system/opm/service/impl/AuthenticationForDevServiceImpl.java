 package com.brc.system.opm.service.impl;
 
 import com.brc.model.fn.ExpressManager;
 import com.brc.system.ValidStatus;
 import com.brc.system.data.EntityParserDao;
 import com.brc.system.opm.LoginStatus;
 import com.brc.system.opm.Operator;
 import com.brc.system.opm.OrgUnit;
 import com.brc.system.opm.domain.Org;
 import com.brc.system.opm.service.AuthenticationForDevService;
 import com.brc.system.opm.service.OrgService;
 import com.brc.system.share.service.GetPermission;
 import com.brc.system.share.service.ServiceUtil;
 import com.brc.util.ClassHelper;
 import com.brc.util.SDO;
 import java.util.HashMap;
 import java.util.List;
 import java.util.Map;
 
 public class AuthenticationForDevServiceImpl
   implements AuthenticationForDevService
 {
   private ServiceUtil serviceUtil;
   private GetPermission getPermission;
   private OrgService orgService;
   private String queryUserInfoSQL = "select mo.id org_Id, mo.full_id, mo.full_name, mo.full_code, p.id person_id, p.name person_name, p.code person_code, p.id_card,p.num, p.login_name, p.password, p.password_time_limit, p.status from SA_OPPerson p, SA_OPOrg mo where p.main_org_id = mo.parent_id and p.id = mo.person_id and upper(p.login_name) = ?";
 
   public void setOrgService(OrgService orgService)
   {
     this.orgService = orgService;
   }
 
   public void setServiceUtil(ServiceUtil serviceUtil)
   {
     this.serviceUtil = serviceUtil;
   }
 
   public void setGetPermission(GetPermission getPermission) {
     this.getPermission = getPermission;
   }
 
   public Map<String, Object> login(String userName, String password)
   {
     LoginStatus loginStatus = LoginStatus.UNKOWN_ERROR;
     Map data = this.serviceUtil.getEntityDao().queryToMap(this.queryUserInfoSQL, new Object[] { userName.toUpperCase() });
 
     Map result = new HashMap(4);
     if (data.size() == 0) {
       loginStatus = LoginStatus.USER_NOT_EXIST;
     }
     else {
       Integer personIntStatus = (Integer)ClassHelper.convert(data.get("status"), Integer.class, Integer.valueOf(0));
       ValidStatus personStatus = ValidStatus.fromId(personIntStatus.intValue());
       String personPassword = (String)ClassHelper.convert(data.get("password"), String.class, "");
       if (!password.equalsIgnoreCase(personPassword))
         loginStatus = LoginStatus.PASSWORD_ERROR;
       else {
         switch (personStatus.getId()) {
         case 1:
           loginStatus = LoginStatus.SUCCESS;
           break;
         case 2:
           loginStatus = LoginStatus.USER_DSIABLED;
           break;
         case 3:
           loginStatus = LoginStatus.USER_LOGIC_DELETE;
         }
       }
 
     }
 
     result.put("status", Integer.valueOf(loginStatus.toId()));
     result.put("message", loginStatus.getMessage());
 
     if (loginStatus == LoginStatus.SUCCESS) {
       result.put("data", data);
     }
 
     return result;
   }
 
   public List<Map<String, Object>> loadPersonFunPermissions(String personId, Long parentId)
   {
     StringBuilder sb = new StringBuilder();
     sb.append("select id, parent_id, code, description, name, full_name, node_kind_id, key_code, url,");
     sb.append("icon, remark, depth, status, sequence, version,");
     sb.append(" (select count(*) from SA_OPFunction i where i.parent_id = f.id) as Has_Children,");
     sb.append(" 0 as isexpand ");
     sb.append("from SA_OPFunction f ");
     sb.append("where f.id in ");
     sb.append("(select p.function_id ");
     sb.append("from SA_OPOrg o, SA_OPAuthorize a, SA_OPRole r, SA_OPPermission p ");
     sb.append("where o.person_id = :personId ");
 
     sb.append("and o.status = 1 and o.org_kind_id = 'psm' and o.full_id like a.org_full_id || '%' ");
     sb.append("and r.status = 1 and a.role_id = r.id and p.role_id = r.id and p.permission_kind='fun') ");
     sb.append("and f.status = 1 and f.parent_id = :parentId ");
     sb.append(" order by sequence asc");
     Map params = new HashMap(2);
     params.put("personId", personId);
     params.put("parentId", parentId);
     List result = this.serviceUtil.getEntityDao().queryToMapListByMapParam(sb.toString(), params);
 
     return result;
   }
 
   public List<Map<String, Object>> loadPersonMembers(String personId)
   {
     String sql = " select t.full_id, full_name from sa_oporg t where t.person_id = ? and t.status = 1";
     return this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[] { personId });
   }
 
   public Object[] loadOndutyTime(String orgnId)
   {
     StringBuffer sb = new StringBuffer();
     sb.append("select h.am_start_time, h.am_end_time, h.pm_start_time, h.pm_end_time");
     sb.append("  from hr_att_onduty_time h");
     sb.append(" where sysdate between start_date and end_date");
     sb.append("   and organ_id = ?");
     List list = this.serviceUtil.getEntityDao().executeQuery(sb.toString(), new Object[] { orgnId });
     if ((list != null) && (list.size() > 0)) {
       return (Object[])list.get(0);
     }
     return null;
   }
 
   public List<Map<String, Object>> loadRole(String personId)
   {
     StringBuilder sb = new StringBuilder();
     sb.append("select distinct r.id");
     sb.append("  from SA_OPOrg o, SA_OPAuthorize a, SA_OPRole r");
     sb.append(" where o.person_id = ?");
     sb.append("   and o.status = 1");
     sb.append("   and o.org_kind_id = 'psm'");
     sb.append("   and o.full_id like a.org_full_id || '%'");
     sb.append("   and r.status = 1");
     sb.append("   and a.role_id = r.id");
     return this.serviceUtil.getEntityDao().queryToListMap(sb.toString(), new Object[] { personId });
   }
 
   public boolean authenticationManageType(SDO sdo)
   {
     Operator operator = sdo.getOperator();
     String manageType = (String)sdo.getProperty("manageType", String.class);
     String fullId = (String)sdo.getProperty("fullId", String.class);
     List<OrgUnit> list = this.getPermission.getPermissionOrgUnit(operator.getId(), operator.getPersonMemberFullIds(), manageType);
     if ((list != null) && (list.size() > 0)) {
       for (OrgUnit orgUnit : list) {
         if (orgUnit.getFullId().equals(fullId)) {
           return true;
         }
       }
     }
     return false;
   }
 
   public void setOperatorOrgInfo(Operator opr, String orgId)
   {
     Org org = this.orgService.loadOrgObject(orgId);
     opr.setFullId(org.getFullId());
     opr.setFullName(org.getFullName());
     opr.setFullCode(org.getFullCode());
 
     opr.setOrgId(org.getOrgId());
     opr.setOrgCode(org.getOrgCode());
     opr.setOrgName(org.getOrgName());
 
     opr.setCenterId(org.getCenterId());
     opr.setCenterCode(org.getCenterCode());
     opr.setCenterName(org.getCenterName());
 
     opr.setDeptId(org.getDeptId());
     opr.setDeptCode(org.getDeptCode());
     opr.setDeptName(org.getDeptName());
 
     opr.setPositionId(org.getPositionId());
     opr.setPositionCode(org.getPositionCode());
     opr.setPositionName(org.getPositionName());
 
     opr.setPersonMemberId(org.getId());
     opr.setPersonMemberCode(org.getPersonMemberCode());
     opr.setPersonMemberName(org.getPersonMemberName());
 
     String express = String.format("getOrgAdminKindById('" + org.getOrgId() + "')", new Object[0]);
     try
     {
       String orgAdminKind = (String)ExpressManager.evaluate(express);
       opr.setOrgAdminKind(orgAdminKind);
     }
     catch (Exception e)
     {
     }
     express = String.format("getOrgProperty('" + org.getCenterId() + "','deptKind')", new Object[0]);
     try
     {
       String deptKind = (String)ExpressManager.evaluate(express);
       opr.setDeptKind(deptKind);
     }
     catch (Exception e)
     {
     }
 
     express = String.format("getOrgProperty('" + org.getOrgId() + "','orgAreaKind')", new Object[0]);
     try {
       String areaKind = (String)ExpressManager.evaluate(express);
       opr.setAreaKind(areaKind);
     }
     catch (Exception e)
     {
     }
 
     StringBuilder sb = new StringBuilder();
     sb.append("select ad.staffing_posts_rank");
     sb.append("  from hr_archives ad, sa_oporg sa");
     sb.append(" where sa.person_id = ad.person_id");
     sb.append("   and sa.person_member_id = ?");
     String positionRank = this.serviceUtil.getEntityDao().queryToString(sb.toString(), new Object[] { opr.getPersonMemberId() });
     opr.setPositionRank(positionRank);
 
     List personMembers = loadPersonMembers(org.getPersonId());
     opr.fillPersonMemberFullIds(personMembers);
     Object[] ondutyTime = loadOndutyTime(org.getOrgId());
     opr.setOndutyTime(ondutyTime);
     List roles = loadRole(org.getPersonId());
     opr.fillRoleIds(roles);
   }
 }

