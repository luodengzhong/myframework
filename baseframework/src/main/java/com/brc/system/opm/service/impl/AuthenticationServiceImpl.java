 package com.brc.system.opm.service.impl;
 
 import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.brc.exception.ApplicationException;
import com.brc.model.fn.impl.OrgFun;
import com.brc.system.ValidStatus;
import com.brc.system.opm.LoginStatus;
import com.brc.system.opm.Operator;
import com.brc.system.opm.Person;
import com.brc.system.opm.domain.Org;
import com.brc.system.opm.service.AuthenticationService;
import com.brc.system.opm.service.OrgService;
import com.brc.system.share.service.GetPermission;
import com.brc.system.share.service.ServiceUtil;
import com.brc.system.util.Util;
import com.brc.util.ClassHelper;
import com.brc.util.Md5Builder;
import com.brc.util.SDO;
import com.brc.util.Singleton;
import com.brc.util.StringUtil;
import com.lowagie.text.pdf.codec.Base64;
 
 public class AuthenticationServiceImpl
   implements AuthenticationService
 {
   private ServiceUtil serviceUtil;
   private GetPermission getPermission;
   private OrgFun orgFun;
   private OrgService orgService;
   private String NOT_CHECK_PASSWORD = "_._not_check_password_.";
 
   private String queryUserInfoSQL = "select mo.id org_Id, mo.full_id, mo.full_name, mo.full_code, p.id person_id, p.name person_name, p.code person_code, p.id_card,p.num, p.login_name, p.password, p.password_time_limit, p.status from SA_OPPerson p, SA_OPOrg mo where p.main_org_id = mo.parent_id and p.id = mo.person_id and upper(p.login_name) = ? ";
 
   private String loginSQL = "select mo.id org_Id, mo.full_id, mo.full_name, mo.full_code, p.id person_id, p.name person_name, p.code person_code, p.id_card,p.num, p.login_name, p.password, p.password_time_limit, p.status from SA_OPPerson p, SA_OPOrg mo where p.main_org_id = mo.parent_id and p.id = mo.person_id and upper(p.login_name) = ?";
 
   public void setServiceUtil(ServiceUtil serviceUtil) {
     this.serviceUtil = serviceUtil;
   }
 
   public void setGetPermission(GetPermission getPermission) {
     this.getPermission = getPermission;
   }
 
   public void setOrgFun(OrgFun orgFun) {
     this.orgFun = orgFun;
   }
 
   public void setOrgService(OrgService orgService) {
     this.orgService = orgService;
   }
 
   public Operator createOperator(Map<String, Object> data)
   {
     Map personData = (Map)data.get("data");
 
     String id = (String)ClassHelper.convert(personData.get("personId"), String.class);
     String code = (String)ClassHelper.convert(personData.get("personCode"), String.class);
     String name = (String)ClassHelper.convert(personData.get("personName"), String.class);
     String mainOrgId = (String)ClassHelper.convert(personData.get("orgId"), String.class);
     String mainOrgFullId = (String)ClassHelper.convert(personData.get("fullId"), String.class);
     String mainOrgFullName = (String)ClassHelper.convert(personData.get("fullName"), String.class);
     String mainOrgFullCode = (String)ClassHelper.convert(personData.get("fullCode"), String.class);
     String loginName = (String)ClassHelper.convert(personData.get("loginName"), String.class);
 
     Person person = new Person(id, name, code, loginName, mainOrgId, mainOrgFullId, mainOrgFullName, mainOrgFullCode);
     Operator operator = new Operator(person, new Date());
     return operator;
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
 
     String orgAdminKind = this.orgFun.getOrgAdminKindById(org.getOrgId());
     opr.setOrgAdminKind(orgAdminKind);
 
     String deptKind = this.orgFun.getOrgProperty(org.getCenterId(), "deptKind");
     opr.setDeptKind(deptKind);
 
     String areaKind = this.orgFun.getOrgProperty(org.getOrgId(), "orgAreaKind");
     opr.setAreaKind(areaKind);
 
     StringBuilder sb = new StringBuilder();
     sb.append("select ad.staffing_posts_rank");
     sb.append("  from hr_archives ad, sa_oporg sa");
     sb.append(" where sa.person_id = ad.person_id");
     sb.append("   and sa.person_member_id = ?");
     String positionRank = this.serviceUtil.getEntityDao().queryToString(sb.toString(), new Object[] { opr.getPersonMemberId() });
     opr.setPositionRank(positionRank);
 
     List personMembers = this.orgService.queryPersonMembersByPersonId(org.getPersonId());
     opr.fillPersonMemberFullIds(personMembers);
     Object[] ondutyTime = loadOndutyTime(org.getOrgId());
     opr.setOndutyTime(ondutyTime);
     List roles = loadRole(org.getPersonId());
     opr.fillRoleIds(roles);
   }
 
   public Operator getOperatorByPsmIdOrFullId(String psmIdOrFullId)
   {
     Util.check(!StringUtil.isBlank(psmIdOrFullId), "参数psmIdOrFullId不能为空。");
 
     StringBuilder sb = new StringBuilder();
 
     sb.append("select mo.id org_Id, mo.full_id, mo.full_name, mo.full_code, p.id person_id,");
     sb.append(" p.name person_name, p.code person_code, p.id_card, p.num,");
     sb.append(" p.login_name, p.password, p.password_time_limit, p.status");
     sb.append(" from SA_OPPerson p, SA_OPOrg mo");
     sb.append(" where p.id = mo.person_id");
     sb.append(" and (mo.full_id = ? or mo.id = ?)");
 
     Map data = this.serviceUtil.getEntityDao().queryToMap(sb.toString(), new Object[] { psmIdOrFullId, psmIdOrFullId });
     if (data.size() == 0) {
       return null;
     }
 
     Map operatorData = new HashMap(1);
     operatorData.put("data", data);
 
     Operator operator = createOperator(operatorData);
     setOperatorOrgInfo(operator, operator.getLoginPerson().getMainOrgId());
 
     return operator;
   }
 
   public Map<String, Object> ssoLogin(String userName)
   {
     Map data = this.serviceUtil.getEntityDao().queryToMap(this.queryUserInfoSQL, new Object[] { userName.toUpperCase() });
 
     Map result = new HashMap(4);
     LoginStatus loginStatus = LoginStatus.UNKOWN_ERROR;
     if (data.size() == 0) {
       loginStatus = LoginStatus.USER_NOT_EXIST;
     } else {
       Integer personIntStatus = (Integer)ClassHelper.convert(data.get("status"), Integer.class, Integer.valueOf(0));
       ValidStatus personStatus = ValidStatus.fromId(personIntStatus.intValue());
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
 
     result.put("status", Integer.valueOf(loginStatus.toId()));
     result.put("message", loginStatus.getMessage());
 
     if (loginStatus == LoginStatus.SUCCESS) {
       result.put("data", data);
     }
 
     return result;
   }
 
   public Map<String, Object> loginFromErp(String userName)
   {
     return loginFromErp(userName, this.NOT_CHECK_PASSWORD);
   }
 
   public Map<String, Object> loginFromErp(String userName, String password)
   {
     LoginStatus loginStatus = LoginStatus.UNKOWN_ERROR;
     Map data = this.serviceUtil.getEntityDao().queryToMap(this.loginSQL, new Object[] { userName.toUpperCase() });
 
     Map result = new HashMap(4);
     if (data.size() == 0) {
       loginStatus = LoginStatus.USER_NOT_EXIST;
     } else {
       Integer personIntStatus = (Integer)ClassHelper.convert(data.get("status"), Integer.class, Integer.valueOf(0));
       ValidStatus personStatus = ValidStatus.fromId(personIntStatus.intValue());
       String personPassword = (String)ClassHelper.convert(data.get("password"), String.class, "");
       if ((!this.NOT_CHECK_PASSWORD.equals(password)) && (!password.equalsIgnoreCase(personPassword)))
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
 
   public Map<String, Object> switchOperator(String psmId)
   {
     Operator operator = getOperatorByPsmIdOrFullId(psmId);
     return null;
   }
 
   public Map<String, Object> login(String userName, String password)
   {
     String decodedPassword = new String(Base64.decode(password));
     boolean isOperator = false;
     try {
       Person person = this.orgService.loadPersonObjectByLoginName(userName);
 
       if (person == null) {
         Map result = new HashMap();
         LoginStatus loginStatus = LoginStatus.USER_NOT_EXIST;
         result.put("status", Integer.valueOf(loginStatus.toId()));
         result.put("message", loginStatus.getMessage());
         return result;
       }
 
       isOperator = person.getIsOperator().equals(Integer.valueOf(1));
       String md5Password = Md5Builder.getMd5(decodedPassword);
       return loginFromErp(userName, md5Password);
     }
     catch (Exception ex) {
       Map result = new HashMap();
       LoginStatus loginStatus = LoginStatus.PASSWORD_ERROR;
       result.put("status", Integer.valueOf(loginStatus.toId()));
       result.put("message", loginStatus.getMessage());
       return result;
     }
   }
 
   public List<Map<String, Object>> loadPersonFunPermissions(String personId, Long parentId)
   {
     StringBuilder sb = new StringBuilder();
     sb.append("select id, parent_id, code, description, name, full_name, node_kind_id, key_code, url,");
     sb.append("icon, remark, depth, status, sequence, version,operation_map_id,");
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
 
   public boolean checkPersonFunPermissions(String personId, String funcCode)
   {
     StringBuilder sb = new StringBuilder();
     sb.append("select count(0)");
     sb.append("  from SA_OPFunction f");
     sb.append(" where f.id in");
     sb.append("       (select p.function_id");
     sb.append("          from SA_OPOrg o, SA_OPAuthorize a, SA_OPRole r, SA_OPPermission p");
     sb.append("         where o.person_id = ?");
     sb.append("           and o.status = 1");
     sb.append("           and o.org_kind_id = 'psm'");
     sb.append("           and o.full_id like a.org_full_id || '%'");
     sb.append("           and r.status = 1");
     sb.append("           and a.role_id = r.id");
     sb.append("           and p.role_id = r.id");
     sb.append("           and p.permission_kind = 'fun')");
     sb.append("   and f.status = 1");
     sb.append("   and f.code = ?");
     int count = this.serviceUtil.getEntityDao().queryToInt(sb.toString(), new Object[] { personId, funcCode });
     return count > 0;
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
     String manageType = (String)sdo.getProperty("manageType", String.class);
     String fullId = (String)sdo.getProperty("fullId", String.class);
     return this.getPermission.authenticationManageType(manageType, fullId);
   }
 
 
   public void authenticationPersonalPassword(SDO sdo)
   {
     String personId = sdo.getOperator().getId();
     String password = (String)sdo.getProperty("password", String.class);
     if (StringUtil.isBlank(password)) {
       throw new ApplicationException("请输入访问密码!");
     }
     password = Md5Builder.getMd5(password);
     String sql = "select p.pay_password from sa_opperson p where p.id=?";
     String payPassword = this.serviceUtil.getEntityDao().queryToString(sql, new Object[] { personId });
     if (StringUtil.isBlank(payPassword)) {
       throw new ApplicationException("请设置访问密码!");
     }
     if (!payPassword.equals(password)) {
       sdo.getOperator().setPersonalPasswordTimeLimit(null);
       throw new ApplicationException("访问密码输入错误,请重新输入!");
     }
     Integer parameterTimeLimit = (Integer)Singleton.getParameter("personalPasswordTimeLimit", Integer.class);
     parameterTimeLimit = Integer.valueOf(parameterTimeLimit == null ? 5 : parameterTimeLimit.intValue());
 
     Long time = Long.valueOf(System.currentTimeMillis() + parameterTimeLimit.intValue() * 60 * 1000);
     sdo.getOperator().setPersonalPasswordTimeLimit(time);
   }
 }

