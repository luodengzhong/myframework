 package com.brc.system.opm;
 
 import com.brc.system.ValidStatus;
 import com.brc.system.util.Util;
 import java.io.Serializable;
 import java.util.ArrayList;
 import java.util.List;
 
 public class Person
   implements Serializable
 {
   private static final long serialVersionUID = -8236082848260757366L;
   public static final int AGENT_ACTIVE = 1;
   public static final int AGENT_NO_ACTIVE = 0;
   public static final int VALUE_IS_OPERATOR = 1;
   public static final int VALUE_IS_NOT_OPERATOR = 0;
   private String id;
   private String name;
   private String code;
   private String mainOrgId;
   private String mainOrgFullId;
   private String mainOrgFullName;
   private String mainOrgFullCode;
   private OrgNode mainOrg;
   private String loginName;
   private Integer status;
   private String idCard;
   private Integer isOperator;
   private Integer IsHidden;
   private String password;
   private String payPassword;
   private List<String> personMemberFullIds = new ArrayList();
 
   private List<Long> roleIds = new ArrayList();
 
   public String getIdCard()
   {
     return this.idCard;
   }
 
   public void setIdCard(String idCard) {
     this.idCard = idCard;
   }
 
   public String getMainOrgFullId() {
     return this.mainOrgFullId;
   }
 
   public void setMainOrgFullId(String mainOrgFullId) {
     this.mainOrgFullId = mainOrgFullId;
   }
 
   public String getMainOrgFullName() {
     return this.mainOrgFullName;
   }
 
   public void setMainOrgFullName(String mainOrgFullName) {
     this.mainOrgFullName = mainOrgFullName;
   }
 
   public String getMainOrgFullCode() {
     return this.mainOrgFullCode;
   }
 
   public void setMainOrgFullCode(String mainOrgFullCode) {
     this.mainOrgFullCode = mainOrgFullCode;
   }
 
   public Integer getStatus() {
     return this.status;
   }
 
   public ValidStatus getStatusEnum() {
     return ValidStatus.fromId(this.status.intValue());
   }
 
   public void setStatus(Integer status) {
     this.status = status;
   }
 
   public void setId(String id) {
     this.id = id;
   }
 
   public void setName(String name) {
     this.name = name;
   }
 
   public void setCode(String code) {
     this.code = code;
   }
 
   public void setMainOrgId(String mainOrgId) {
     this.mainOrgId = mainOrgId;
   }
 
   public void setMainOrg(OrgNode mainOrg) {
     this.mainOrg = mainOrg;
   }
 
   public void setLoginName(String loginName) {
     this.loginName = loginName;
   }
 
   public void setPersonMemberFullIds(List<String> personMemberFullIds) {
     this.personMemberFullIds = personMemberFullIds;
   }
 
   public Person()
   {
   }
 
   public Person(String id, String name, String code)
   {
     this.id = id;
     this.name = name;
     this.code = code;
   }
 
   public Person(String id, String name, String code, String mainOrgId) {
     this.id = id;
     this.name = name;
     this.code = code;
     this.mainOrgId = mainOrgId;
   }
 
   public Person(String id, String name, String code, String loginName, String mainOrgId, String mainOrgFullId, String mainOrgFullName, String mainOrgFullCode) {
     this.id = id;
     this.code = code;
     this.name = name;
     this.loginName = loginName;
     this.mainOrgId = mainOrgId;
     this.mainOrgFullId = mainOrgFullId;
     this.mainOrgFullName = mainOrgFullName;
     this.mainOrgFullCode = mainOrgFullCode;
   }
 
   public String getMainOrgId() {
     return this.mainOrgId;
   }
 
   public OrgNode getMainOrg() {
     return this.mainOrg;
   }
 
   public String getId() {
     return this.id;
   }
 
   public String getName() {
     return this.name;
   }
 
   public String getCode() {
     return this.code;
   }
 
   public String getLoginName() {
     return this.loginName;
   }
 
   public List<String> getPersonMemberFullIds() {
     return this.personMemberFullIds;
   }
 
   public List<Long> getRoleIds() {
     return this.roleIds;
   }
 
   public void checkEnabledStatus()
   {
     Util.check(getStatusEnum() == ValidStatus.ENABLED, String.format("人员“%s”状态为“%s”。", new Object[] { getName(), getStatusEnum().getDisplayName() }));
   }
 
   public Integer getIsOperator() {
     return this.isOperator;
   }
 
   public void setIsOperator(Integer isOperator) {
     this.isOperator = isOperator;
   }
 
   public Integer getIsHidden() {
     return this.IsHidden;
   }
 
   public void setIsHidden(Integer isHidden) {
     this.IsHidden = isHidden;
   }
 
   public String getPassword() {
     return this.password;
   }
 
   public void setPassword(String password) {
     this.password = password;
   }
 
   public String getPayPassword() {
     return this.payPassword;
   }
 
   public void setPayPassword(String payPassword) {
     this.payPassword = payPassword;
   }
 }

