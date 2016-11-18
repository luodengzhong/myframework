 package com.brc.system.opm.domain;
 
 import com.brc.system.ValidStatus;
 import com.brc.system.opm.OrgKind;
 import com.brc.system.util.Util;
 import com.brc.util.StringUtil;
 
 public class Org
 {
   private String id;
   private String typeId;
   private String code;
   private String name;
   private String longName;
   private String fullId;
   private String fullCode;
   private String fullName;
   private String parentId;
   private String personId;
   private String orgKindId;
   private String nodeKindId;
   private int isCenter;
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
   private Integer status;
   private String sequence;
   private String fullSequence;
   private String fullOrgKindId;
   private Long version;
 
   public Org()
   {
   }
 
   public Org(String id)
   {
     Util.check(Util.isNotEmptyString(id), "组织标识不能为空！", new Object[0]);
     this.id = id;
   }
 
   public boolean equals(Object obj) {
     return (obj != null) && ((obj instanceof Org)) && (((Org)obj).getId().equals(this.id));
   }
 
   public String toString() {
     return this.id;
   }
 
   public int hashCode() {
     return this.id.hashCode();
   }
 
   public String getId() {
     return this.id;
   }
 
   public void setId(String id) {
     this.id = id;
   }
 
   public String getTypeId() {
     return this.typeId;
   }
 
   public void setTypeId(String typeId) {
     this.typeId = typeId;
   }
 
   public Long getVersion() {
     return this.version;
   }
 
   public void setVersion(Long version) {
     this.version = version;
   }
 
   public String getCode() {
     return this.code;
   }
 
   public void setCode(String code) {
     this.code = code;
   }
 
   public String getName() {
     return this.name;
   }
 
   public void setName(String name) {
     this.name = name;
   }
 
   public String getLongName() {
     return this.longName;
   }
 
   public void setLongName(String longName) {
     this.longName = longName;
   }
 
   public String getFullId() {
     return this.fullId;
   }
 
   public void setFullId(String fullId) {
     this.fullId = fullId;
   }
 
   public String getFullCode() {
     return this.fullCode;
   }
 
   public void setFullCode(String fullCode) {
     this.fullCode = fullCode;
   }
 
   public String getFullName() {
     return this.fullName;
   }
 
   public void setFullName(String fullName) {
     this.fullName = fullName;
   }
 
   public String getSequence() {
     if (StringUtil.isBlank(this.sequence)) {
       return "10";
     }
     return this.sequence;
   }
 
   public void setSequence(String sequence)
   {
     this.sequence = sequence;
   }
 
   public String getFullSequence() {
     return this.fullSequence;
   }
 
   public void setFullSequence(String fullSequence) {
     this.fullSequence = fullSequence;
   }
 
   public String getFullOrgKindId() {
     return this.fullOrgKindId;
   }
 
   public void setFullOrgKindId(String fullOrgKindId) {
     this.fullOrgKindId = fullOrgKindId;
   }
 
   public String getParentId() {
     return this.parentId;
   }
 
   public void setParentId(String parentId) {
     this.parentId = parentId;
   }
 
   public String getPersonId() {
     return this.personId;
   }
 
   public void setPersonId(String personId) {
     this.personId = personId;
   }
 
   public String getOrgKindId() {
     return this.orgKindId;
   }
 
   public void setOrgKindId(String orgKindId) {
     this.orgKindId = orgKindId;
   }
 
   public OrgKind getOrgKindEnum() {
     return OrgKind.valueOf(this.orgKindId);
   }
 
   public void setOrgKindEnum(OrgKind orgKind) {
     this.orgKindId = orgKind.toString();
   }
 
   public String getNodeKindId() {
     return this.nodeKindId;
   }
 
   public void setNodeKindId(String nodeKindId) {
     this.nodeKindId = nodeKindId;
   }
 
   public int getIsCenter() {
     return this.isCenter;
   }
 
   public void setIsCenter(int isCenter) {
     this.isCenter = isCenter;
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
 
   public void setPersonMemberId(String personMemberId) {
     this.personMemberId = personMemberId;
   }
 
   public String getPersonMemberCode() {
     return this.personMemberCode;
   }
 
   public void setPersonMemberCode(String personMemberCode) {
     this.personMemberCode = personMemberCode;
   }
 
   public String getPersonMemberName() {
     return this.personMemberName;
   }
 
   public void setPersonMemberName(String personMemberName) {
     this.personMemberName = personMemberName;
   }
 
   public Integer getStatus() {
     return this.status;
   }
 
   public void setStatus(Integer status) {
     this.status = status;
   }
 
   public ValidStatus getStatusEnum() {
     return ValidStatus.fromId(this.status.intValue());
   }
 
   public void setStatusEnum(ValidStatus orgKind) {
     this.status = Integer.valueOf(orgKind.getId());
   }
 
   public void checkEnabledStatus()
   {
     Util.check(getStatusEnum() == ValidStatus.ENABLED, String.format("组织“%s”状态为“%s”。", new Object[] { getName(), getStatusEnum().getDisplayName() }));
   }
 }

