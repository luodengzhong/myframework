 package com.brc.system.opm;
 
 import com.brc.system.util.Util;
 import java.io.Serializable;
 import java.util.Date;
 import java.util.List;
 import java.util.Map;
 
 public class Operator
   implements Serializable
 {
   private static final long serialVersionUID = -4620852653286742649L;
   private Long logId;
   private Person loginPerson = null;
 
   private Date loginDate = null;
   private String fullId;
   private String fullName;
   private String fullCode;
   private String orgId;
   private String orgCode;
   private String orgName;
   private String centerId;
   private String centerCode;
   private String centerName;
   private String deptId;
   private String deptCode;
   private String deptName;
   private String positionId;
   private String positionCode;
   private String positionName;
   private String personMemberId;
   private String personMemberCode;
   private String personMemberName;
   private String ip;
   private Object[] ondutyTime;
   private String orgAdminKind;
   private String deptKind;
   private String areaKind;
   private String positionRank;
   private Long personalPasswordTimeLimit;
 
   public String getFullCode()
   {
     return this.fullCode;
   }
 
   public void setFullCode(String fullCode) {
     this.fullCode = fullCode;
   }
 
   public String getFullId() {
     return this.fullId;
   }
 
   public void setFullId(String fullId) {
     this.fullId = fullId;
   }
 
   public String getFullName() {
     return this.fullName;
   }
 
   public void setFullName(String fullName) {
     this.fullName = fullName;
   }
 
   public String getOrgId() {
     return this.orgId;
   }
 
   public void setOrgId(String orgId) {
     this.orgId = orgId;
   }
 
   public String getOrgCode() {
     return this.orgCode;
   }
 
   public void setOrgCode(String orgCode) {
     this.orgCode = orgCode;
   }
 
   public String getOrgName() {
     return this.orgName;
   }
 
   public void setOrgName(String orgName) {
     this.orgName = orgName;
   }
 
   public String getCenterId() {
     return this.centerId;
   }
 
   public void setCenterId(String centerId) {
     this.centerId = centerId;
   }
 
   public String getCenterCode() {
     return this.centerCode;
   }
 
   public void setCenterCode(String centerCode) {
     this.centerCode = centerCode;
   }
 
   public String getCenterName() {
     return this.centerName;
   }
 
   public void setCenterName(String centerName) {
     this.centerName = centerName;
   }
 
   public String getDeptId() {
     return this.deptId;
   }
 
   public void setDeptId(String deptId) {
     this.deptId = deptId;
   }
 
   public String getDeptCode() {
     return this.deptCode;
   }
 
   public void setDeptCode(String deptCode) {
     this.deptCode = deptCode;
   }
 
   public String getDeptName() {
     return this.deptName;
   }
 
   public void setDeptName(String deptName) {
     this.deptName = deptName;
   }
 
   public String getPositionId() {
     return this.positionId;
   }
 
   public void setPositionId(String positionId) {
     this.positionId = positionId;
   }
 
   public String getPositionCode() {
     return this.positionCode;
   }
 
   public void setPositionCode(String positionCode) {
     this.positionCode = positionCode;
   }
 
   public String getPositionName() {
     return this.positionName;
   }
 
   public void setPositionName(String positionName) {
     this.positionName = positionName;
   }
 
   public String getPersonMemberId() {
     return this.personMemberId;
   }
 
   public void setPersonMemberId(String personId) {
     this.personMemberId = personId;
   }
 
   public String getPersonMemberName() {
     return this.personMemberName;
   }
 
   public void setPersonMemberName(String personName) {
     this.personMemberName = personName;
   }
 
   public String getPersonMemberCode() {
     return this.personMemberCode;
   }
 
   public void setPersonMemberCode(String personMemberCode) {
     this.personMemberCode = personMemberCode; } 

   public String getFullDisplayName() {
			return fullName;
			}
     //   0: aload_0
     //   1: getfield 3	com/brc/system/opm/Operator:fullName	Ljava/lang/String;
     //   4: iconst_1
     //   5: invokevirtual 19	java/lang/String:substring	(I)Ljava/lang/String;
     //   8: astore_1
     //   9: aload_1
     //   10: ldc 20
     //   12: ldc 21
     //   14: invokevirtual 22	java/lang/String:replaceAll	(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
     //   17: areturn
     //   18: astore_1
     //   19: ldc 24
     //   21: iconst_2
     //   22: anewarray 25	java/lang/Object
     //   25: dup
     //   26: iconst_0
     //   27: aload_0
     //   28: getfield 12	com/brc/system/opm/Operator:deptName	Ljava/lang/String;
     //   31: aastore
     //   32: dup
     //   33: iconst_1
     //   34: aload_0
     //   35: getfield 17	com/brc/system/opm/Operator:personMemberName	Ljava/lang/String;
     //   38: aastore
     //   39: invokestatic 26	java/lang/String:format	(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;
     //   42: areturn
     //
     // Exception table:
     //   from	to	target	type
     //   0	17	18	java/lang/Exception } 
   public Operator() {  } 
   public Operator(Person loginPerson, Date loginDate) { Util.check(loginPerson != null, "登陆的loginPerson不能为空！");
     this.loginPerson = loginPerson;
     this.loginDate = loginDate;
   }
 
   public String getCode()
   {
     return this.loginPerson.getCode();
   }
 
   public String getId()
   {
     return this.loginPerson.getId();
   }
 
   public String getName()
   {
     return this.loginPerson.getName();
   }
 
   public void setOrgAdminKind(String orgAdminKind) {
     this.orgAdminKind = orgAdminKind;
   }
 
   public String getOrgAdminKind() {
     return this.orgAdminKind;
   }
 
   public String getDeptKind() {
     return this.deptKind;
   }
 
   public void setDeptKind(String deptKind) {
     this.deptKind = deptKind;
   }
 
   public String getAreaKind() {
     return this.areaKind;
   }
 
   public void setAreaKind(String areaKind) {
     this.areaKind = areaKind;
   }
 
   public Date getLoginDate() {
     return this.loginDate;
   }
 
   public Person getLoginPerson() {
     return this.loginPerson;
   }
 
   public void fillPersonMemberFullIds(List<Map<String, Object>> orgUnits) {
     List personMemberFullIds = this.loginPerson.getPersonMemberFullIds();
     for (Map org : orgUnits)
       personMemberFullIds.add(org.get("fullId").toString());
   }
 
   public List<String> getPersonMemberFullIds()
   {
     return this.loginPerson.getPersonMemberFullIds();
   }
 
   public void fillRoleIds(List<Map<String, Object>> roles) {
     List roleIds = this.loginPerson.getRoleIds();
     for (Map role : roles)
       roleIds.add(Long.valueOf(Long.parseLong(role.get("id").toString())));
   }
 
   public List<Long> getRoleIds()
   {
     return this.loginPerson.getRoleIds();
   }
 
   public String getIp() {
     return this.ip;
   }
 
   public void setIp(String ip) {
     this.ip = ip;
   }
 
   public Long getLogId() {
     return this.logId;
   }
 
   public void setLogId(Long logId) {
     this.logId = logId;
   }
 
   public String getOndutyTime() {
     if ((this.ondutyTime != null) && (this.ondutyTime.length > 0)) {
       StringBuffer sb = new StringBuffer();
       int l = this.ondutyTime.length;
       for (int i = 0; i < l; i++) {
         sb.append(this.ondutyTime[i].toString());
         if (i < l - 1) {
           sb.append(",");
         }
       }
       return sb.toString();
     }
     return "";
   }
 
   public void setOndutyTime(Object[] ondutyTime)
   {
     this.ondutyTime = ondutyTime;
   }
 
   public Long getPersonalPasswordTimeLimit() {
     return this.personalPasswordTimeLimit;
   }
 
   public void setPersonalPasswordTimeLimit(Long personalPasswordTimeLimit) {
     this.personalPasswordTimeLimit = personalPasswordTimeLimit;
   }
 
   public void setLoginPerson(Person loginPerson) {
     this.loginPerson = loginPerson;
   }
 
   public String getLoginName() {
     return this.loginPerson.getLoginName();
   }
 
   public String getPositionRank() {
     return this.positionRank;
   }
 
   public void setPositionRank(String positionRank) {
     this.positionRank = positionRank;
   }
 }

