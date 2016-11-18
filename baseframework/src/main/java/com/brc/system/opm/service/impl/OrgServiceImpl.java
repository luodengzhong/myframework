package com.brc.system.opm.service.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.ApplicationEventPublisherAware;

import com.brc.exception.ApplicationException;
import com.brc.license.License;
import com.brc.license.LicenseUtil;
import com.brc.system.ValidStatus;
import com.brc.system.opm.NodeKind;
import com.brc.system.opm.Operator;
import com.brc.system.opm.OpmUtil;
import com.brc.system.opm.OrgKind;
import com.brc.system.opm.OrgUpdateEvent;
import com.brc.system.opm.OrgUtil;
import com.brc.system.opm.Person;
import com.brc.system.opm.domain.Org;
import com.brc.system.opm.domain.OrgFunBizManTypeAuthorize;
import com.brc.system.opm.domain.OrgFunction;
import com.brc.system.opm.domain.OrgFunctionAuthorize;
import com.brc.system.opm.service.AuthorizationService;
import com.brc.system.opm.service.FunctionService;
import com.brc.system.opm.service.ManagementService;
import com.brc.system.opm.service.OrgService;
import com.brc.system.share.service.GetPermission;
import com.brc.system.share.service.ServiceUtil;
import com.brc.system.util.CommonUtil;
import com.brc.system.util.NameCodeUniqueValidator;
import com.brc.system.util.Util;
import com.brc.util.ClassHelper;
import com.brc.util.DataUtil;
import com.brc.util.Md5Builder;
import com.brc.util.QueryModel;
import com.brc.util.SDO;
import com.brc.util.Singleton;
import com.brc.util.StringUtil;
import com.brc.xmlbean.EntityDocument;
import com.lowagie.text.pdf.codec.Base64;

public class OrgServiceImpl implements OrgService, ApplicationEventPublisherAware {
	private ApplicationEventPublisher publisher;
	private static int LICENSE_INDEX = 0;
	private ServiceUtil serviceUtil;
	private static final String ORG_PARENT_ID_FIELD = "parentId";
	private static final String ORG_ID_FIELD = "id";
	private static final String ORG_CODE_FIELD = "code";
	private static final String ORG_NAME_FIELD = "name";
	private static final String ORG_KIND_ID_FIELD = "orgKindId";
	private static final String ORG_HAS_CHILDREN_FIELD = "hasChildren";
	private static final String ORG_IS_EXPAND_FIELD = "isexpand";
	private static final String ORG_STATUS_FIELD = "status";
	private static final String ORG_ROOT_PARENT_ID = "null";
	private static final String ORG_ROOT_ID = "orgRoot";
	private static final String ORG_ROOT_CODE = "root";
	private static final String ORG_ROOT_NAME = "蓝光BRC";
	private static final String ORG_ROOT_KIND_ID = "root";
	private static final String PERSON_ENTITY_NAME = "person";
	private static final String OPERATE_NEW_ORG = "新建组织";
	private static final String OPERATE_DELETE_ORG = "删除组织";
	private ManagementService managementService;
	private AuthorizationService authorizationService;
	private FunctionService functionService;
	private GetPermission getPermission;

	public void setApplicationEventPublisher(ApplicationEventPublisher publisher) {
		this.publisher = publisher;
	}

	public void setGetPermission(GetPermission getPermission) {
		this.getPermission = getPermission;
	}

	public void setServiceUtil(ServiceUtil serviceUtil) {
		this.serviceUtil = serviceUtil;
	}

	public void setManagementService(ManagementService managementService) {
		this.managementService = managementService;
	}

	public void setAuthorizationService(AuthorizationService authorizationService) {
		this.authorizationService = authorizationService;
	}

	public void setFunctionService(FunctionService functionService) {
		this.functionService = functionService;
	}

	public Org loadOrgObject(String id) {
		Util.check(!StringUtil.isBlank(id), "查询组织出错，ID不能为空。");

		String sql = "select * from SA_OPOrg where id = ?";
		return (Org) this.serviceUtil.getEntityDao().queryToObject(sql, Org.class, new Object[] { id });
	}

	public Org loadEnabledOrgObject(String id) {
		Org org = loadOrgObject(id);

		Util.check(org != null, "无效的组织标识“%s”。", new Object[] { id });

		Util.check(org.getStatusEnum() == ValidStatus.ENABLED,
				String.format("组织“%s”状态为“%s”。", new Object[] { org.getName(), org.getStatusEnum().getDisplayName() }));

		return org;
	}

	public List<Org> loadOrgListByLoginName(String loginName) {
		Util.check(!StringUtil.isBlank(loginName), "查询组织出错，登陆名不能为空。");

		String sql = "select o.* from sa_OPPerson p, sa_OPOrg o  where p.id = o.person_id and p.status = 1  and o.status = 1 and upper(p.login_name) = ?";
		return this.serviceUtil.getEntityDao().queryToList(sql, Org.class, new Object[] { loginName.toUpperCase() });
	}

	public Org loadMainOrgByLoginName(String loginName) {
		Util.check(!StringUtil.isBlank(loginName), "查询组织出错，登录名不能为空。");
		String sql = "select mo.*  from SA_OPPerson p, SA_OPOrg mo  where p.main_org_id = mo.parent_id  and p.id = mo.person_id and upper(p.login_name) = ?";
		return (Org) this.serviceUtil.getEntityDao().queryToObject(sql, Org.class,
				new Object[] { loginName.toUpperCase() });
	}

	public Org loadMainOrgByName(String name) {
		Util.check(!StringUtil.isBlank(name), "查询组织出错，人员姓名不能为空。");
		String sql = "select mo.*  from SA_OPPerson p, SA_OPOrg mo  where p.main_org_id = mo.parent_id  and p.id = mo.person_id and name = ?";
		return (Org) this.serviceUtil.getEntityDao().queryToObject(sql, Org.class, new Object[] { name });
	}

	public Org loadMainOrgByPersonId(String personId) {
		Util.check(!StringUtil.isBlank(personId), "查询组织出错，人员Id不能为空。");
		String sql = "select mo.*  from SA_OPPerson p, SA_OPOrg mo  where p.main_org_id = mo.parent_id  and p.id = mo.person_id and p.id = ?";
		return (Org) this.serviceUtil.getEntityDao().queryToObject(sql, Org.class, new Object[] { personId });
	}

	public Org loadOrgObjectByFullId(String fullId) {
		Util.check(!StringUtil.isBlank(fullId), "查询组织出错，fullId不能为空。");

		String sql = "select * from SA_OPOrg where full_id = ?";
		return (Org) this.serviceUtil.getEntityDao().queryToObject(sql, Org.class, new Object[] { fullId });
	}

	public Org loadOrgObjectByFullName(String fullName) {
		Util.check(!StringUtil.isBlank(fullName), "查询组织出错，fullName不能为空。");

		String sql = "select * from SA_OPOrg where full_Name = ?";
		return (Org) this.serviceUtil.getEntityDao().queryToObject(sql, Org.class, new Object[] { fullName });
	}

	private EntityDocument.Entity getOrgEntity() {
		return this.serviceUtil.getEntity("config/domain/com/brc/system/opm/opm.xml", "org");
	}

	private EntityDocument.Entity getRTXOrgContrastEntity() {
		return this.serviceUtil.getEntity("config/domain/com/brc/system/opm/opm.xml", "rtxOrgContrast");
	}

	private EntityDocument.Entity getPersonEntity() {
		return this.serviceUtil.getEntity("config/domain/com/brc/system/opm/opm.xml", "person");
	}

	private void internalUpdateRelationOrgName(String sql, String fullId, String oldFullName, String newFullName) {
		String fullIdCriteria = new StringBuilder().append(fullId).append("%").toString();
		HashMap params = new HashMap();
		params.put("likeFullID", fullIdCriteria);
		params.put("newName", CommonUtil.getNameNoExtOfFile(newFullName));
		params.put("newFullName", newFullName);
		params.put("oldFullName", oldFullName);
		this.serviceUtil.getEntityDao().executeUpdateByMapParam(sql, params);
	}

	private void updateManagementOrgName(String fullId, String oldFullName, String newFullName) {
		String updateSql = "update SA_OPBizManagement\n   set Org_Name = :newName,\n       Org_Full_Name = :newFullName ||\n                   substr(Org_Full_Name,\n                             length(:oldFullName) + 1,\n                             length(Org_Full_Name))\n where Org_Full_ID like :likeFullID";

		internalUpdateRelationOrgName(updateSql, fullId, oldFullName, newFullName);

		String updateManageOrgName = "update SA_OPBizManagement\n   set Manage_Org_Name = :newName,\n       Manage_Org_Full_Name = :newFullName ||\n                          substr(Manage_Org_Full_Name,\n                                    length(:oldFullName) + 1,\n                                    length(Manage_Org_Full_Name))\n where Manage_Org_Full_ID like :likeFullID";

		internalUpdateRelationOrgName(updateManageOrgName, fullId, oldFullName, newFullName);
	}

	private void updateAuthorizeOrgName(String fullId, String oldFullName, String newFullName) {
		String updateSql = "update SA_OPAuthorize\n   set Org_Name = :newName,\n       Org_Full_Name = :newFullName ||\n                   substr(Org_Full_Name,\n                             length(:oldFullName) + 1,\n                             length(Org_Full_Name))\n where Org_Full_ID like :likeFullID";

		internalUpdateRelationOrgName(updateSql, fullId, oldFullName, newFullName);
	}

	private void updateAgentOrgName(String fullId, String oldFullName, String newFullName) {
		String updateSql = "update SA_OPAgent\n   set Org_Full_Name = :newFullName ||\n                   substr(Org_Full_Name,\n                             length(:oldFullName) + 1,\n                             length(Org_Full_Name))\n where Org_Full_ID like :likeFullID";

		internalUpdateRelationOrgName(updateSql, fullId, oldFullName, newFullName);
	}

	protected static String formatSequenceString(int sequence) {
		return String.format("%03d", new Object[] { Integer.valueOf(sequence) });
	}

	private void updateOrgChildrenFullSequence(String fullId, String oldParentFullSequence,
			String newParentFullSequence) {
		String fullIdCriteria = new StringBuilder().append(fullId).append("/%").toString();
		String updateSql = "update SA_OPOrg set full_sequence = :parentNewSequence ||  substr(full_sequence, length(:parentOldSequence) + 1,  length(full_sequence)), version = Seq_Id.Nextval\n where full_id like :likeFullID";

		HashMap params = new HashMap();
		params.put("parentNewSequence", newParentFullSequence);
		params.put("parentOldSequence", oldParentFullSequence);
		params.put("likeFullID", fullIdCriteria);

		this.serviceUtil.getEntityDao().executeUpdateByMapParam(updateSql, params);
	}

	private void updateOrgChildrenFullOrgKindId(String fullId, String oldParentFullOrgKindId,
			String newParentFullOrgKindId) {
		String fullIdCriteria = new StringBuilder().append(fullId).append("/%").toString();
		String updateSql = "update SA_OPOrg set full_org_kind_id = :parentNewFullOrgKindId ||  substr(full_org_kind_id,  length(:parentOldOrgKindId) + 1,  length(full_sequence)), version = Seq_Id.Nextval\n where full_id like :likeFullID";

		HashMap params = new HashMap();
		params.put("parentNewFullOrgKindId", newParentFullOrgKindId);
		params.put("parentOldOrgKindId", oldParentFullOrgKindId);
		params.put("likeFullID", fullIdCriteria);

		this.serviceUtil.getEntityDao().executeUpdateByMapParam(updateSql, params);
	}

	private void checkOrgExist(String id, String code, String name, String parentId, OrgKind orgKind) {
		String nameCriteria = OrgKind.psm.equals(orgKind) ? "" : " or upper(name) = :name ";

		StringBuilder sb = new StringBuilder(
				String.format("select code, name from SA_OPOrg where id <> :id and (upper(code) = :code %s)  ",
						new Object[] { nameCriteria }));

		if (Util.isEmptyString(parentId))
			sb.append(" and (Parent_Id is null or SA_OPOrg.Parent_Id = '') ");
		else {
			sb.append(" and (Parent_Id = :parentId) ");
		}
		HashMap params = new HashMap();
		params.put("id", id);
		params.put("code", code.toUpperCase());
		params.put("name", name.toUpperCase());
		params.put("parentId", parentId);

		Org org = (Org) this.serviceUtil.getEntityDao().queryToObjectByMapParam(sb.toString(), Org.class, params);

		if (org != null) {
			Util.check(!code.equalsIgnoreCase(org.getCode()), "同级组织编码“%s”重复！", new Object[] { code });
			Util.check(!name.equalsIgnoreCase(org.getName()), "同级组织名称“%s”重复！", new Object[] { name });
		}
	}

	private void updateOrgChildrenFullCodeAndName(String fullId, String parentOldFullCode, String parentNewFullCode,
			String parentOldFullName, String parentNewFullName) {
		String fullIdCriteria = new StringBuilder().append(fullId).append("/%").toString();
		String updateOrgChildrenFullCodeAndNameSql = "update SA_OPOrg\n   set Full_Code = :parentNewFullCode ||\n                    substr(Full_Code,\n                           length(:parentOldFullCode) + 1,\n                           length(Full_Code)),\n       Full_Name = :parentNewFullName ||\n                    substr(Full_Name,\n                           length(:parentOldFullName) + 1,\n                           length(Full_Name)), Version =Seq_Id.Nextval\n where Full_ID like :likeFullID";

		Map params = new HashMap();
		params.put("parentNewFullCode", parentNewFullCode);
		params.put("parentOldFullCode", parentOldFullCode);
		params.put("parentNewFullName", parentNewFullName);
		params.put("parentOldFullName", parentOldFullName);
		params.put("likeFullID", fullIdCriteria);
		this.serviceUtil.getEntityDao().executeUpdateByMapParam(updateOrgChildrenFullCodeAndNameSql, params);

		String selectUpdateSql = "select * from SA_OPOrg where Full_ID like :likeFullID";
		List<Org> orgs = this.serviceUtil.getEntityDao().queryToList(selectUpdateSql, Org.class,
				new Object[] { fullIdCriteria });

		List data = new ArrayList();

		StringBuilder sb = new StringBuilder();

		sb.append("update SA_OPOrg t");
		sb.append(
				"   set t.org_id = ?, t.org_code = ?, t.org_name = ?, t.center_id = ?, t.center_code = ?, t.center_name = ?,");
		sb.append("        t.dept_id = ?, t.dept_code = ?, t.dept_name = ?, t.position_id = ?, t.position_code = ?,");
		sb.append("       t.position_name = ?, t.person_member_id = ?, t.person_member_code = ?,");
		sb.append("       t.person_member_name = ?");
		sb.append(" where t.id = ?");

		for (Org org : orgs) {
			Map orgInfo = new HashMap(16);
			OpmUtil.buildOrgIdCodeNameExtInfo(org.getFullId(), org.getFullOrgKindId(), org.getFullCode(),
					org.getFullName(), orgInfo);
			Object[] obj = { orgInfo.get("orgId"), orgInfo.get("orgCode"), orgInfo.get("orgName"),
					orgInfo.get("centerId"), orgInfo.get("centerCode"), orgInfo.get("centerName"),
					orgInfo.get("deptId"), orgInfo.get("deptCode"), orgInfo.get("deptName"), orgInfo.get("positionId"),
					orgInfo.get("positionCode"), orgInfo.get("positionName"), orgInfo.get("personMemberId"),
					orgInfo.get("personMemberCode"), orgInfo.get("personMemberName"), org.getId() };

			data.add(obj);
		}
		this.serviceUtil.getEntityDao().batchUpdate(sb.toString(), data);
	}

	private void internalInsertOrgByTemplateId(Long templateParentId, String orgParentId) {
		String sql = "select a.id as template_Id, b.id as type_Id, b.code, b.name, b.org_kind_id  from SA_OPOrgTemplate a, SA_OPOrgType b where a.type_id = b.id and a.parent_id = ? order by b.sequence";
		List<Map<String, Object>> data = this.serviceUtil.getEntityDao().queryToListMap(sql,
				new Object[] { templateParentId });

		for (Map item : data) {
			Long templateId = (Long) ClassHelper.convert(item.get("templateId"), Long.class);
			Long typeId = (Long) ClassHelper.convert(item.get("typeId"), Long.class);
			String code = (String) ClassHelper.convert(item.get("code"), String.class);
			String name = (String) ClassHelper.convert(item.get("name"), String.class);
			String orgKindId = (String) ClassHelper.convert(item.get("orgKindId"), String.class);
			String sequence = getOrgNextSequence(orgParentId);

			SDO params = new SDO();
			params.putProperty("parentId", orgParentId);
			params.putProperty("typeId", typeId);
			params.putProperty("orgKindId", orgKindId);
			params.putProperty("code", code);
			params.putProperty("name", name);
			params.putProperty("sequence", sequence);
			params.putProperty("status", Integer.valueOf(ValidStatus.ENABLED.getId()));

			String parentId = insertOrg(params);

			internalInsertOrgByTemplateId(templateId, parentId);
		}
	}

	public void insertOrgByTemplateId(SDO params) {
		Long templateId = (Long) params.getProperty("templateId", Long.class);
		String parentId = (String) params.getProperty("parentId", String.class);

		String sql = "select a.id as template_Id, b.id as type_Id, b.code, b.name, b.org_kind_id from SA_OPOrgTemplate a, SA_OPOrgType b where a.type_id = b.id and a.id = ? order by b.sequence";
		Map data = this.serviceUtil.getEntityDao().queryToMap(sql, new Object[] { templateId });

		Long typeId = (Long) ClassHelper.convert(data.get("typeId"), Long.class);
		templateId = (Long) ClassHelper.convert(data.get("templateId"), Long.class);

		params.putProperty("typeId", typeId);

		parentId = insertOrg(params);
		internalInsertOrgByTemplateId(templateId, parentId);
	}

	private void buildOrgIdCodeNameExtInfo(SDO sdo, OrgKind orgKind, String fullId, String fullOrgKindId,
			String fullCode, String fullName) {
		Map orgInfo = new HashMap(4);
		OpmUtil.buildOrgIdCodeNameExtInfo(fullId, fullOrgKindId, fullCode, fullName, orgInfo);

		if (orgKind.getLevel() >= OrgKind.ogn.getLevel()) {
			sdo.putProperty("orgId", orgInfo.get("orgId"));
			sdo.putProperty("orgCode", orgInfo.get("orgCode"));
			sdo.putProperty("orgName", orgInfo.get("orgName"));
		}

		if (orgKind.getLevel() >= OrgKind.dpt.getLevel()) {
			sdo.putProperty("deptId", orgInfo.get("deptId"));
			sdo.putProperty("deptCode", orgInfo.get("deptCode"));
			sdo.putProperty("deptName", orgInfo.get("deptName"));

			sdo.putProperty("centerId", orgInfo.get("centerId"));
			sdo.putProperty("centerCode", orgInfo.get("centerCode"));
			sdo.putProperty("centerName", orgInfo.get("centerName"));
		}

		if (orgKind.getLevel() >= OrgKind.pos.getLevel()) {
			sdo.putProperty("positionId", orgInfo.get("positionId"));
			sdo.putProperty("positionCode", orgInfo.get("positionCode"));
			sdo.putProperty("positionName", orgInfo.get("positionName"));
		}

		if (orgKind.getLevel() >= OrgKind.psm.getLevel()) {
			sdo.putProperty("personMemberId", orgInfo.get("personMemberId"));
			sdo.putProperty("personMemberCode", orgInfo.get("personMemberCode"));
			sdo.putProperty("personMemberName", orgInfo.get("personMemberName"));
		}
	}

	public String insertOrg(SDO sdo) {
		String id = (String) sdo.getProperty("id", String.class);

		if (Util.isEmptyString(id)) {
			id = CommonUtil.createGUID();
			sdo.putProperty("id", id);
		}

		String code = (String) sdo.getProperty("code", String.class);
		String name = (String) sdo.getProperty("name", String.class);
		String sequence = (String) sdo.getProperty("sequence", String.class);
		String parentId = (String) sdo.getProperty("parentId", String.class);

		boolean isCenter = ((Integer) sdo.getProperty("isCenter", Integer.class, Integer.valueOf(0))).intValue() == 1;
		String orgKindId = (String) sdo.getProperty("orgKindId", String.class);
		String actualOrgKindId = orgKindId;
		if ((orgKindId.equalsIgnoreCase("dpt")) && (isCenter)) {
			actualOrgKindId = "ctr";
		}

		OrgKind orgKind = OrgKind.valueOf(orgKindId);
		ValidStatus status = ValidStatus.fromId(((Integer) sdo.getProperty("status", Integer.class)).intValue());

		Util.check(!OrgKind.psm.equals(orgKind), "新建组织失败，请使用“insertPersonMember”新建人员成员。", new Object[0]);

		OpmUtil.checkOrgId(id);
		OpmUtil.checkOrgCode(code);
		OpmUtil.checkOrgName(name);

		String checkOrgIdExistSql = "select * from SA_OPOrg  where id = ? ";
		Org org = (Org) this.serviceUtil.getEntityDao().queryToObject(checkOrgIdExistSql, Org.class,
				new Object[] { id });
		Util.check(org == null, "组织标识“%s”重复。", new Object[] { id });

		checkOrgExist(id, code, name, parentId, orgKind);

		OrgKind parentOrgKind = null;
		ValidStatus parentOrgStatus = null;
		String parentName = null;
		Org parentOrg = null;
		if (!"orgRoot".equals(parentId)) {
			String selectParentOrgSql = "select * from SA_OPOrg SA_OPOrg where id = :id ";
			parentOrg = (Org) this.serviceUtil.getEntityDao().queryToObject(selectParentOrgSql, Org.class,
					new Object[] { parentId });
			parentOrgKind = parentOrg.getOrgKindEnum();
			parentOrgStatus = parentOrg.getStatusEnum();
			parentName = parentOrg.getName();
		}

		String fullId = OpmUtil.createFileFullName(parentOrg == null ? "" : parentOrg.getFullId(), id,
				orgKind.toString());
		String fullCode = OpmUtil.createFileFullName(parentOrg == null ? "" : parentOrg.getFullCode(), code, "");
		String fullName = OpmUtil.createFileFullName(parentOrg == null ? "" : parentOrg.getFullName(), name, "");
		String fullSequence = OpmUtil.createFileFullName(parentOrg == null ? "" : parentOrg.getFullSequence(), sequence,
				"");
		String fullOrgKindId = OpmUtil.createFileFullName(parentOrg == null ? "" : parentOrg.getFullOrgKindId(),
				actualOrgKindId, "");

		status = (ValidStatus) OpmUtil.coalesce(new Object[] { status, parentOrgStatus, ValidStatus.ENABLED });
		OpmUtil.checkStatusRule(status, parentOrgStatus, name, parentName, "新建组织");
		OpmUtil.checkOrgKindRule(orgKind, parentOrgKind, name, parentName, "新建组织");

		sdo.putProperty("fullId", fullId);
		sdo.putProperty("fullCode", fullCode);
		sdo.putProperty("fullName", fullName);
		sdo.putProperty("fullSequence", fullSequence);
		sdo.putProperty("fullOrgKindId", fullOrgKindId);
		sdo.putProperty("status", Integer.valueOf(status.getId()));

		buildOrgIdCodeNameExtInfo(sdo, orgKind, fullId, fullOrgKindId, fullCode, fullName);

		String autoId = (String) this.serviceUtil.getEntityDao().insert(getOrgEntity(), sdo.getProperties());
		return autoId;
	}

	public void updateOrg(SDO sdo) {
		String id = (String) sdo.getProperty("id", String.class);
		String code = (String) sdo.getProperty("code", String.class);
		String name = (String) sdo.getProperty("name", String.class);
		String sequence = (String) sdo.getProperty("sequence", String.class);

		String oldFullCode = (String) sdo.getProperty("fullCode", String.class);
		String oldFullName = (String) sdo.getProperty("fullName", String.class);
		String oldFullSequence = (String) sdo.getProperty("fullSequence", String.class);
		String oldFullOrgKindId = (String) sdo.getProperty("fullOrgKindId", String.class);

		String longName = (String) sdo.getProperty("longName", String.class);
		boolean isCenter = ((Integer) sdo.getProperty("isCenter", Integer.class, Integer.valueOf(0))).intValue() == 1;
		String orgKindId = (String) sdo.getProperty("orgKindId", String.class);
		String actualOrgKindId = orgKindId;
		if ((orgKindId.equalsIgnoreCase("dpt")) && (isCenter)) {
			actualOrgKindId = "ctr";
		}

		String checkOrgIdExistSql = "select * from SA_OPOrg where id = :id ";
		Org org = (Org) this.serviceUtil.getEntityDao().queryToObject(checkOrgIdExistSql, Org.class,
				new Object[] { id });
		Util.check(org != null, "无效的组织标识“%s”！", new Object[] { id });

		code = (String) OpmUtil.coalesce(new Object[] { code, org.getCode() });
		name = (String) OpmUtil.coalesce(new Object[] { name, org.getName() });

		OpmUtil.checkOrgCode(code);
		OpmUtil.checkOrgName(name);
		checkOrgExist(id, code, name, org.getParentId(), org.getOrgKindEnum());

		String newFullCode = OpmUtil.createFileFullName(CommonUtil.getPathOfFile(org.getFullCode()), code, "");
		String newFullName = OpmUtil.createFileFullName(CommonUtil.getPathOfFile(org.getFullName()), name, "");
		String newFullSequence = OpmUtil.createFileFullName(CommonUtil.getPathOfFile(org.getFullSequence()), sequence,
				"");
		String newFullOrgKindId = OpmUtil.createFileFullName(CommonUtil.getPathOfFile(org.getFullOrgKindId()),
				actualOrgKindId, "");

		if (!OrgKind.psm.equals(org.getOrgKindEnum())) {
			longName = (String) OpmUtil.coalesce(new Object[] { longName, org.getLongName() });
		}

		sdo.putProperty("fullCode", newFullCode);
		sdo.putProperty("fullName", newFullName);
		sdo.putProperty("fullSequence", newFullSequence);
		sdo.putProperty("fullOrgKindId", newFullOrgKindId);
		sdo.putProperty("longName", longName);

		buildOrgIdCodeNameExtInfo(sdo, org.getOrgKindEnum(), org.getFullId(), newFullOrgKindId, newFullCode,
				newFullName);

		this.serviceUtil.getEntityDao().update(
				this.serviceUtil.getEntity("config/domain/com/brc/system/opm/opm.xml", "org"), sdo.getProperties(),
				new String[0]);

		if (!newFullSequence.equals(oldFullSequence)) {
			updateOrgChildrenFullSequence(org.getFullId(), oldFullSequence, newFullSequence);
		}
		if (!newFullOrgKindId.equalsIgnoreCase(oldFullOrgKindId)) {
			updateOrgChildrenFullOrgKindId(org.getFullId(), oldFullOrgKindId, newFullOrgKindId);
		}

		if ((!newFullCode.equals(oldFullCode)) || (!newFullName.equals(oldFullName))
				|| (!newFullOrgKindId.equalsIgnoreCase(oldFullOrgKindId))) {
			if (!newFullName.equals(oldFullName)) {
				updateManagementOrgName(org.getFullId(), oldFullName, newFullName);
				updateAuthorizeOrgName(org.getFullId(), oldFullName, newFullName);
				updateAgentOrgName(org.getFullId(), oldFullName, newFullName);
			}
			updateOrgChildrenFullCodeAndName(org.getFullId(), oldFullCode, newFullCode, oldFullName, newFullName);
		}
	}

	public void adjustOrg(String sourceOrgId, String destOrgId) {
		if (StringUtil.isBlank(sourceOrgId)) {
			throw new ApplicationException("调整源组织id不能为空。");
		}
		if (StringUtil.isBlank(destOrgId)) {
			throw new ApplicationException("调整目标组织id不能为空。");
		}

		if (sourceOrgId.equalsIgnoreCase(destOrgId)) {
			throw new ApplicationException("选择的源组织和目标组织相同。");
		}

		OrgUpdateEvent orgUpdateEvent = new OrgUpdateEvent(this);

		orgUpdateEvent.setSourceOrgId(sourceOrgId);
		orgUpdateEvent.setDestOrgId(destOrgId);
		orgUpdateEvent.setEventKind(OrgUpdateEvent.EventKind.ADJUST);

		this.publisher.publishEvent(orgUpdateEvent);
	}

	public void logicDeleteOrg(String[] ids) {
		ArrayList fromStatuses = new ArrayList(2);
		fromStatuses.add(ValidStatus.ENABLED);
		fromStatuses.add(ValidStatus.DISABLED);
		for (String id : ids)
			updateOrgStatus(id, Long.valueOf(1L), fromStatuses, ValidStatus.LOGIC_DELETE, "删除组织", true);
	}

	private void deleteBizManagement(String orgFullId, boolean isDeletePerson) {
		String orgFullIdCriteria = String.format("%s%%", new Object[] { orgFullId });
		String deleteManagementSql = "delete from SA_OPBizManagement  where Org_Full_ID like ? or Manage_Org_Full_Id like ?";
		this.serviceUtil.getEntityDao().executeUpdate(deleteManagementSql,
				new Object[] { orgFullIdCriteria, orgFullIdCriteria });
		if (isDeletePerson) {
			deleteManagementSql = "delete from SA_OPBizManagement t\n where exists (select 1\n          from SA_OPPerson person, SA_OPOrg org\n         where org.Org_Kind_ID = 'psm'\n           and person.Main_Org_ID = org.Parent_ID\n           and person.ID = org.Person_ID\n           and org.full_id like ?\n           and (t.Org_ID like person.ID || '@%%' or\n               t.Manage_Org_ID like person.ID || '@%%'))";

			this.serviceUtil.getEntityDao().executeUpdate(deleteManagementSql, new Object[] { orgFullIdCriteria });
		}
	}

	private void deleteAuthorize(String orgFullId, boolean isDeletePerson) {
		String orgFullIdCriteria = String.format("%s%%", new Object[] { orgFullId });
		String deleteAuthorizeSql = "delete from SA_OPAuthorize  where Org_Full_ID like ?";
		this.serviceUtil.getEntityDao().executeUpdate(deleteAuthorizeSql, new Object[] { orgFullIdCriteria });

		if (isDeletePerson) {
			deleteAuthorizeSql = "delete from SA_OPAuthorize t\n where exists (select 1\n          from SA_OPPerson person, SA_OPOrg org\n         where t.Org_ID like person.ID || '@%%'\n           and org.Org_Kind_ID = 'psm'\n           and person.Main_Org_ID = org.Parent_ID\n           and person.ID = org.Person_ID\n           and Org.Full_ID like ?)";

			this.serviceUtil.getEntityDao().executeUpdate(deleteAuthorizeSql, new Object[] { orgFullIdCriteria });
		}
	}

	private void deleteAgent(String orgFullId, boolean isDeletePerson) {
		String orgFullIdCriteria = String.format("%s%%", new Object[] { orgFullId });
		String deleteAgentSql = "delete from SA_OPAgent SA_OPAgent where Org_ID like ?";
		this.serviceUtil.getEntityDao().executeUpdate(deleteAgentSql, new Object[] { orgFullIdCriteria });

		if (isDeletePerson) {
			deleteAgentSql = "delete from SA_OPAgent t\n where exists (select 1\n          from SA_OPPerson person, SA_OPOrg org\n         where (person.ID = t.Agent_ID or\n               t.Org_Full_ID like '%%/' || person.ID || '@%%')\n           and org.Org_Kind_ID = 'psm'\n           and person.Main_Org_ID = org.Parent_ID\n           and person.ID = org.Person_ID\n           and org.Full_ID like ?)";

			this.serviceUtil.getEntityDao().executeUpdate(deleteAgentSql, new Object[] { orgFullIdCriteria });
		}
	}

	private void deletePerson(String orgFullId) {
		String orgFullIdCriteria = String.format("%s%%", new Object[] { orgFullId });
		String deletePersonSql = "delete from SA_OPOrg t\n where Org_Kind_ID = 'psm'\n   and exists (select person.ID\n          from SA_OPPerson person, SA_OPOrg org\n         where person.ID = t.Person_ID\n           and person.Main_Org_ID <> t.Parent_ID\n           and org.Org_Kind_ID = 'psm'\n           and person.Main_Org_ID = org.Parent_ID\n           and person.ID = org.Person_ID\n           and Full_ID like ?)";

		this.serviceUtil.getEntityDao().executeUpdate(deletePersonSql, new Object[] { orgFullIdCriteria });

		deletePersonSql = "delete from SA_OPPerson person\n where exists (select 1\n          from SA_OPOrg org\n         where org.Org_Kind_ID = 'psm'\n           and person.Main_Org_ID = org.Parent_ID\n           and person.ID = org.Person_ID\n           and Full_ID like ?)";

		this.serviceUtil.getEntityDao().executeUpdate(deletePersonSql, new Object[] { orgFullIdCriteria });
	}

	private void deleteOrgChildren(String orgFullId) {
		Util.check(!StringUtil.isBlank(orgFullId), "参数“orgFullId”不能为空。");

		String orgFullIdCriteria = String.format("%s%%", new Object[] { orgFullId });
		String deleteOrgChildrenSql = "delete from SA_OPOrg SA_OPOrg where Full_ID like ?";
		this.serviceUtil.getEntityDao().executeUpdate(deleteOrgChildrenSql, new Object[] { orgFullIdCriteria });
	}

	public void physicalDeleteOrg(String[] ids, boolean isDeletePerson) {
		for (String id : ids) {
			String selectOrgSql = "select ID, Name, Full_ID, Full_Name, Status, version, Org_Kind_ID  from SA_OPOrg  where id = ?";
			Org org = (Org) this.serviceUtil.getEntityDao().queryToObject(selectOrgSql, Org.class, new Object[] { id });

			Util.check(org != null, "无效的组织标识“%s”。", new Object[] { id });
			Util.check("psm".equalsIgnoreCase(org.getNodeKindId()),
					String.format("组织“%s”不是人员成员，不能删除。", new Object[] { org.getName() }));

			deleteBizManagement(org.getFullId(), isDeletePerson);
			deleteAuthorize(org.getFullId(), isDeletePerson);
			deleteAgent(org.getFullId(), isDeletePerson);
			if (isDeletePerson) {
				deletePerson(org.getFullId());
			}
			deleteOrgChildren(org.getFullId());
		}
	}

	public void restoreOrg(String id, Long version, boolean isEnableSubordinatePsm) {
		ArrayList fromStatuses = new ArrayList();
		fromStatuses.add(ValidStatus.LOGIC_DELETE);
		updateOrgStatus(id, version, fromStatuses, ValidStatus.ENABLED, "还原组织", isEnableSubordinatePsm);
	}

	public String formatPersonMemberID(String personId, String parentOrgId) {
		return new StringBuilder().append(personId).append("@").append(parentOrgId).toString();
	}

	private String formatFromStatusesSql(String sql, Collection<ValidStatus> fromStatuses) {
		String statusesCriteria = Util.arrayToString(fromStatuses.toArray(), "%s", ",");
		return String.format(sql, new Object[] { statusesCriteria, statusesCriteria });
	}

	private void updateSubordinatePsmStatus(String orgFullId, Collection<ValidStatus> fromStatuses,
			ValidStatus toStatus) {
		StringBuilder sb = new StringBuilder();

		sb.append("update SA_OPOrg t");
		sb.append("   set t.status = ?, t.version = Seq_Id.Nextval");
		sb.append(" where t.org_kind_id = 'psm'");
		sb.append("   and t.status in (%s)");
		sb.append("   and (select p.status from SA_OPOrg p where p.id = t.parent_id) >= ?");
		sb.append("   and exists (select person.id");
		sb.append("          from SA_OPPerson person, SA_OPOrg org");
		sb.append("         where person.status = ?");
		sb.append("           and org.org_kind_id = 'psm'");
		sb.append("           and org.status in (%s)");
		sb.append("           and org.full_id like ?");
		sb.append("           and person.main_org_id = org.parent_id");
		sb.append("           and person.id = org.person_id");
		sb.append("           and t.person_id = person.id");
		sb.append("           and t.parent_id <> person.main_org_id)");

		String fullIdCriteria = String.format("%s%%", new Object[] { orgFullId });
		String sql = formatFromStatusesSql(sb.toString(), fromStatuses);
		this.serviceUtil.getEntityDao().executeUpdate(sql, new Object[] { Integer.valueOf(toStatus.getId()),
				Integer.valueOf(toStatus.getId()), Integer.valueOf(toStatus.getId()), fullIdCriteria });
	}

	private void updateChildrenStatus(String orgFullId, Collection<ValidStatus> fromStatuses, ValidStatus toStatus) {
		StringBuilder sb = new StringBuilder();
		sb.append("update SA_OPOrg");
		sb.append("   set status = ?, version = Seq_Id.Nextval");
		sb.append(" where status in (%s)");
		sb.append("   and full_id like ?");
		sb.append("   and (org_kind_id <> 'psm' or");
		sb.append("       (select p.status from SA_OPPerson p where p.id = SA_OPOrg.person_id) >= ?)");
		String orgFullIdCriteria = String.format("%s%%", new Object[] { orgFullId });
		String sql = formatFromStatusesSql(sb.toString(), fromStatuses);
		this.serviceUtil.getEntityDao().executeUpdate(sql, new Object[] { Integer.valueOf(toStatus.getId()),
				orgFullIdCriteria, Integer.valueOf(toStatus.getId()) });
	}

	private void updateOrgStatus(String id, Long version, Collection<ValidStatus> fromStatuses, ValidStatus toStatus,
			String operateType, boolean isEnableSubordinatePsm) {
		isEnableSubordinatePsm = (isEnableSubordinatePsm)
				|| (toStatus.getId() < ((ValidStatus) fromStatuses.iterator().next()).getId());

		StringBuilder sb = new StringBuilder();
		sb.append("select Org.ID, Org.Version, Org.Name, Org.Full_ID, Org.Full_Name,");
		sb.append("       Org.Org_Kind_ID, Org.status, Org.Parent_ID,");
		sb.append("       ParentOrg.Name as parent_Name, ParentOrg.status as Parent_status,");
		sb.append("       person.Name as person_Name, person.status as person_status,");
		sb.append("       person.Main_Org_ID as person_Main_Org_ID");
		sb.append("  from SA_OPOrg Org");
		sb.append("  left join SA_OPOrg ParentOrg");
		sb.append("    on ParentOrg.ID = Org.Parent_ID");
		sb.append("  left join SA_OPPerson person");
		sb.append("    on person.ID = Org.Person_ID");
		sb.append(" where org.id = ?");

		Map orgData = this.serviceUtil.getEntityDao().queryToMap(sb.toString(), new Object[] { id });

		Util.check(orgData.size() > 0, "无效的组织标识“%s”！", new Object[] { id });

		String orgName = (String) orgData.get("name");
		OrgKind orgKind = OrgKind.valueOf((String) orgData.get("orgKindId"));
		String orgFullId = (String) orgData.get("fullId");
		ValidStatus orgStatus = ValidStatus
				.fromId(((Integer) ClassHelper.convert(orgData.get("status"), Integer.class)).intValue());
		String orgParentId = (String) orgData.get("parentId");
		String parentName = (String) orgData.get("parentName");

		Integer parentStatusId = (Integer) ClassHelper.convert(orgData.get("parentStatus"), Integer.class);
		ValidStatus parentStatus = parentStatusId == null ? null : ValidStatus.fromId(parentStatusId.intValue());
		if (orgParentId.equalsIgnoreCase(OpmUtil.getOrgRoot())) {
			parentStatus = ValidStatus.ENABLED;
		}

		String personName = (String) orgData.get("personName");

		Integer personStatusId = (Integer) ClassHelper.convert(orgData.get("personStatus"), Integer.class);
		ValidStatus personStatus = personStatusId == null ? null : ValidStatus.fromId(personStatusId.intValue());

		String personMainOrgId = (String) orgData.get("personMainOrgId");

		OpmUtil.checkStatusRule(toStatus, parentStatus, orgName, parentName, operateType);

		if ((OrgKind.psm.equals(orgKind)) && (!orgParentId.equalsIgnoreCase(personMainOrgId))) {
			Util.check(toStatus.getId() <= personStatus.getId(), "%s失败，人员“%s”的状态是“%s”！",
					new Object[] { operateType, personName, personStatus.getDisplayName() });
		}

		if (fromStatuses.contains(orgStatus)) {
			updateMainOrgPersonStatus(orgFullId, fromStatuses, toStatus);
			if (isEnableSubordinatePsm) {
				updateSubordinatePsmStatus(orgFullId, fromStatuses, toStatus);
			}
			updateChildrenStatus(orgFullId, fromStatuses, toStatus);
		} else {
			Util.check(orgStatus.equals(toStatus), "%s失败，“%s”当前的状态是“%s”！",
					new Object[] { operateType, orgName, orgStatus.getDisplayName() });
		}
	}

	public void disableOrg(String id, Long version) {
		ArrayList fromStatuses = new ArrayList(1);
		fromStatuses.add(ValidStatus.ENABLED);
		updateOrgStatus(id, version, fromStatuses, ValidStatus.DISABLED, "禁用组织", true);
	}

	private void updatePersonVersion(String id) {
		String sql = "update sa_opperson t set t.version = seq_id.nextval where t.id = ?";
		this.serviceUtil.getEntityDao().executeUpdate(sql, new Object[] { id });
	}

	public String InsertPersonMember(String personId, String code, String name, String sequence,
			ValidStatus personStatus, Org parentOrg, ValidStatus psmStatus, boolean autoEnableOldPsm) {
		if (psmStatus == null) {
			psmStatus = ValidStatus.fromId(Math.min(personStatus.getId(), parentOrg.getStatusEnum().getId()));
		}

		Util.check(psmStatus.getId() >= personStatus.getId(), "新建人员成员失败，人员“%s”的状态是“%s”！",
				new Object[] { name, personStatus.getDisplayName() });
		OpmUtil.checkStatusRule(psmStatus, parentOrg.getStatusEnum(), name, parentOrg.getName(), "新建人员成员");
		OpmUtil.checkOrgKindRule(OrgKind.psm, parentOrg.getOrgKindEnum(), name, parentOrg.getName(), "新建人员成员");

		String personMemberId = formatPersonMemberID(personId, parentOrg.getId());
		String selectPersonMemberSql = "select ID, version, Code, Name, Parent_ID, Full_ID, Full_Code, Full_Name, Sequence, Org_Kind_ID, Status, Person_ID  from SA_OPOrg  where id = :psmID";

		Org org = (Org) this.serviceUtil.getEntityDao().queryToObject(selectPersonMemberSql, Org.class,
				new Object[] { personMemberId });
		if (org != null) {
			if (autoEnableOldPsm) {
				enableOrg(personMemberId, org.getVersion(), Boolean.valueOf(false));
				return personMemberId;
			}
			Util.check(false, "人员成员“%s”已经存在，当前状态是“%s”！",
					new Object[] { org.getFullName(), org.getStatusEnum().getDisplayName() });
		}
		SDO params = new SDO();

		String fullId = OpmUtil.createFileFullName(parentOrg.getFullId(), personMemberId, OrgKind.psm.toString());
		String fullCode = OpmUtil.createFileFullName(parentOrg.getFullCode(), code, null);
		String fullName = OpmUtil.createFileFullName(parentOrg.getFullName(), name, null);
		String fullOrgKindId = OpmUtil.createFileFullName(parentOrg.getFullOrgKindId(), OrgKind.psm.toString(), null);

		if (StringUtil.isBlank(sequence)) {
			sequence = getNewSequence(parentOrg.getId(), null);
		}

		String fullSequence = OpmUtil.createFileFullName(parentOrg.getFullSequence(), sequence, null);

		buildOrgIdCodeNameExtInfo(params, OrgKind.psm, fullId, fullOrgKindId, fullCode, fullName);

		params.putProperty("parentId", parentOrg.getId());
		params.putProperty("id", personMemberId);
		params.putProperty("code", code);
		params.putProperty("name", name);
		params.putProperty("longName", name);
		params.putProperty("status", Integer.valueOf(psmStatus.getId()));
		params.putProperty("orgKindId", OrgKind.psm.toString());
		params.putProperty("nodeKindId", NodeKind.leaf.toString());
		params.putProperty("personId", personId);
		params.putProperty("fullId", fullId);
		params.putProperty("fullCode", fullCode);
		params.putProperty("fullName", fullName);
		params.putProperty("sequence", sequence);
		params.putProperty("fullSequence", fullSequence);
		params.putProperty("fullOrgKindId", fullOrgKindId);

		this.serviceUtil.getEntityDao().insert(
				this.serviceUtil.getEntity("config/domain/com/brc/system/opm/opm.xml", "org"), params.getProperties());

		updatePersonVersion(personId);

		return personMemberId;
	}

	public void insertPersonMembers(String[] personIds, String orgId, ValidStatus status, Boolean autoEnableOldPsm) {
		for (String personId : personIds) {
			Person person = loadPersonObject(personId);
			Org org = loadOrgObject(orgId);
			InsertPersonMember(personId, person.getCode(), person.getName(), null, person.getStatusEnum(), org, status,
					autoEnableOldPsm.booleanValue());
		}
	}

	private String internalInsertBizFunction(Long bizFunctionId, String code, String name, String sequence,
			Org parentOrg, ValidStatus orgStatus) {
		if (orgStatus == null) {
			orgStatus = parentOrg.getStatusEnum();
		}

		OpmUtil.checkStatusRule(orgStatus, parentOrg.getStatusEnum(), name, parentOrg.getName(), "新建业务职能角色");
		OpmUtil.checkOrgKindRule(OrgKind.fun, parentOrg.getOrgKindEnum(), name, parentOrg.getName(), "新建业务职能角色");

		String sql = "select * from sa_oporg t where t.parent_id = ? and t.type_id = ? and t.status = 1";
		Org org = (Org) this.serviceUtil.getEntityDao().queryToObject(sql, Org.class,
				new Object[] { parentOrg.getId(), bizFunctionId });
		if (org != null) {
			return org.getId();
		}

		String id = CommonUtil.createGUID();

		SDO params = new SDO();

		String fullId = OpmUtil.createFileFullName(parentOrg.getFullId(), id, OrgKind.fun.toString());
		String fullCode = OpmUtil.createFileFullName(parentOrg.getFullCode(), code, null);
		String fullName = OpmUtil.createFileFullName(parentOrg.getFullName(), name, null);
		String fullOrgKindId = OpmUtil.createFileFullName(parentOrg.getFullOrgKindId(), OrgKind.fun.toString(), null);

		if (StringUtil.isBlank(sequence)) {
			sequence = getNewSequence(parentOrg.getId(), null);
		}

		String fullSequence = OpmUtil.createFileFullName(parentOrg.getFullSequence(), sequence, null);

		buildOrgIdCodeNameExtInfo(params, OrgKind.fun, fullId, fullOrgKindId, fullCode, fullName);

		params.putProperty("parentId", parentOrg.getId());
		params.putProperty("id", id);
		params.putProperty("typeId", bizFunctionId);
		params.putProperty("code", code);
		params.putProperty("name", name);
		params.putProperty("longName", name);
		params.putProperty("status", Integer.valueOf(orgStatus.getId()));
		params.putProperty("orgKindId", OrgKind.fun.toString());
		params.putProperty("nodeKindId", NodeKind.leaf.toString());
		params.putProperty("fullId", fullId);
		params.putProperty("fullCode", fullCode);
		params.putProperty("fullName", fullName);
		params.putProperty("sequence", sequence);
		params.putProperty("fullSequence", fullSequence);
		params.putProperty("fullOrgKindId", fullOrgKindId);

		this.serviceUtil.getEntityDao().insert(
				this.serviceUtil.getEntity("config/domain/com/brc/system/opm/opm.xml", "org"), params.getProperties());

		return id;
	}

	public void insertBizFunctions(String orgId, Long[] bizFunctionIds, ValidStatus status) {
		if (StringUtil.isBlank(orgId)) {
			throw new ApplicationException("orgId参数为空。");
		}
		if (bizFunctionIds.length == 0) {
			throw new ApplicationException("bizFunctionIds参数为空。");
		}

		Org personMember = loadOrgObject(orgId);

		for (Long bizFunctionId : bizFunctionIds) {
			Map baseFunctionType = this.functionService.loadBaseFunctionType(bizFunctionId);
			if (baseFunctionType.size() > 0) {
				String code = (String) ClassHelper.convert(baseFunctionType.get("code"), String.class);
				String name = (String) ClassHelper.convert(baseFunctionType.get("name"), String.class);
				internalInsertBizFunction(bizFunctionId, code, name, null, personMember, status);
			}
		}
	}

	public void updateOrgSequence(Map<String, String> params) {
		String updateSql = "update SA_OPOrg set full_sequence = ?, sequence = ?, version = Seq_Id.Nextval where id = ?";

		for (String key : params.keySet()) {
			boolean isNum = ((String) params.get(key)).matches("^\\d{1,3}$");
			if (!isNum) {
				throw new ApplicationException("排序号必须为1到3位数字。");
			}
		}

		for (String key : params.keySet()) {
			Org org = loadOrgObject(key);
			if (org != null) {
				String sequence = CommonUtil.lpad(3, Integer.parseInt((String) params.get(key)));

				String newFullSequence = OpmUtil.createFileFullName(CommonUtil.getPathOfFile(org.getFullSequence()),
						sequence, "");
				updateOrgChildrenFullSequence(org.getFullId(), org.getFullSequence(), newFullSequence);

				this.serviceUtil.getEntityDao().executeUpdate(updateSql,
						new Object[] { newFullSequence, sequence, key });
			}
		}
	}

	private String getMaxSequence(String parentId, OrgKind orgKind, boolean isExcludeDiabled) {
		StringBuffer sb = new StringBuffer(
				"select max(Sequence) as maxSequence  from SA_OPOrg  where (Sequence is not null or Sequence <> '')");

		if (Util.isEmptyString(parentId))
			sb.append(" and (Parent_ID is null or Parent_ID = '') ");
		else {
			sb.append(" and Parent_ID = :parentID ");
		}
		if (orgKind != null) {
			sb.append(" and Org_Kind_ID = :orgKind ");
		}
		if (isExcludeDiabled) {
			sb.append(" and Status = 1 ");
		}
		HashMap params = new HashMap();
		params.put("parentID", parentId);
		if (orgKind != null) {
			params.put("orgKind", orgKind.toString());
		}

		Map sequenceData = this.serviceUtil.getEntityDao().queryToMapByMapParam(sb.toString(), params);
		String maxSequence = null;
		if (sequenceData.size() > 0) {
			maxSequence = sequenceData.get("maxsequence").toString();
			if ((Util.isEmptyString(maxSequence)) && (orgKind != null)) {
				return getMaxSequence(parentId, null, isExcludeDiabled);
			}
		}
		return maxSequence;
	}

	private String getNewSequence(String parentId, OrgKind orgKind) {
		String maxSequence = getMaxSequence(parentId, orgKind, true);
		int number = 0;
		if (!StringUtil.isBlank(maxSequence)) {
			number = Integer.parseInt(maxSequence);
		}
		String nextNumber = formatSequenceString(number + 1);
		return nextNumber;
	}

	private void internalMoveOrg(String id, Long version, Org parentOrg) {
		String parentOrgId = parentOrg.getId();

		String selectOrg = "select ID, version, Code, Name, Full_ID, Full_Code, Full_Name, Sequence,\n       Org_Kind_ID, Stauts, Parent_ID, Person_ID\n  from SA_OPOrg\n where SA_OPOrg = :id";

		Org org = (Org) this.serviceUtil.getEntityDao().queryToObject(selectOrg, Org.class, new Object[] { id });

		Util.check(org != null, "无效的组织标识“%s”！", new Object[] { id });

		OpmUtil.checkVersion(version, org.getVersion(), "移动组织", org.getName());
		checkOrgExist(id, org.getCode(), org.getName(), parentOrgId, org.getOrgKindEnum());

		OpmUtil.checkStatusRule(org.getStatusEnum(), parentOrg.getStatusEnum(), org.getName(), parentOrg.getName(),
				"移动组织");

		OpmUtil.checkOrgKindRule(org.getOrgKindEnum(), parentOrg.getOrgKindEnum(), org.getName(), parentOrg.getName(),
				"移动组织");
	}

	public void moveOrg(String id, Long version, String newParentId) {
		Org parentOrg = null;
		if (Util.isNotEmptyString(newParentId))
			parentOrg = loadOrgObject(newParentId);
		internalMoveOrg(id, version, parentOrg);
	}

	public void enableOrg(String id, Long version, Boolean isEnableSubordinatePsm) {
		ArrayList fromStatuses = new ArrayList();
		fromStatuses.add(ValidStatus.DISABLED);
		updateOrgStatus(id, version, fromStatuses, ValidStatus.ENABLED, "启用组织", isEnableSubordinatePsm.booleanValue());
	}

	public void assignPerson(String[] ids, String orgId) {
	}

	public Map<String, Object> loadOrg(String id) {
		return this.serviceUtil.getEntityDao()
				.loadById(this.serviceUtil.getEntity("config/domain/com/brc/system/opm/opm.xml", "org"), id);
	}

	private String getOrgKindIdsCriteria(String orgKindIds) {
		List orgKindList = new ArrayList();

		orgKindIds = orgKindIds == null ? "" : orgKindIds;

		if (orgKindIds.contains("ogn")) {
			orgKindList.add("ogn");
		}

		if (orgKindIds.contains("dpt")) {
			orgKindList.add("dpt");
		}

		if (orgKindIds.contains("pos")) {
			orgKindList.add("pos");
		}

		if (orgKindIds.contains("psm")) {
			orgKindList.add("psm");
		}

		if (orgKindIds.contains("fld")) {
			orgKindList.add("fld");
		}

		if (orgKindIds.contains("prj")) {
			orgKindList.add("prj");
		}

		if (orgKindIds.contains("grp")) {
			orgKindList.add("grp");
		}

		if (orgKindIds.contains("fun")) {
			orgKindList.add("fun");
		}

		if (orgKindList.size() > 0) {
			return String.format(" and org_kind_id in ( %s) ",
					new Object[] { Util.arrayToString(orgKindList.toArray(), "'%s'", ",") });
		}
		return "";
	}

	private void addPermissionFlag(String manageType, Map<String, Object> map) {
		boolean flag = true;

		if (!manageType.equals("noControlAuthority")) {
			String fullId = (String) ClassHelper.convert(map.get("fullId"), String.class);
			if (!StringUtil.isBlank(fullId)) {
				flag = this.getPermission.authenticationManageType(manageType, fullId);
			}
		}
		map.put("managerPermissionFlag", Boolean.valueOf(flag));
	}

	private void checkLicense() {
		License license = LicenseUtil.LICENSE;
		Util.check(!license.isExpired(), "License已过期。");
		LICENSE_INDEX += 1;
		if (LICENSE_INDEX % 300 == 0) {
			String sql = "select count(*) from sa_oporg";
			int orgCount = this.serviceUtil.getEntityDao().queryToInt(sql, new Object[0]);
			Util.check(orgCount < license.getOrgNodeCount(), "组织机构超过最大限制。");
			Util.check(license.getVersion() == 3, "您使用的是测试版。");
		}
		if (LICENSE_INDEX == 1000000)
			LICENSE_INDEX = 0;
	}

	public Map<String, Object> queryCustomOrgRoot(SDO params) {
		params.removeProperty("parentId");

		boolean showDisabledOrg = "1"
				.equalsIgnoreCase((String) params.getProperty("showDisabledOrg", String.class, "0"));

		StringBuilder otherConditions = new StringBuilder();

		boolean showVirtualOrg = "1".equalsIgnoreCase((String) params.getProperty("showVirtualOrg", String.class, "0"));
		String showVirtualOrgCriteria = "";
		if (!showVirtualOrg) {
			showVirtualOrgCriteria = " and nvl(Is_Virtual, 0) = 0";
			otherConditions.append(showVirtualOrgCriteria);
		}

		boolean showProjectOrg = "1".equalsIgnoreCase((String) params.getProperty("showProjectOrg", String.class, "1"));
		if (!showProjectOrg) {
			otherConditions.append(" and instr(full_org_kind_id, 'prj') = 0");
		}

		boolean showPosition = "1".equalsIgnoreCase((String) params.getProperty("showPosition", String.class, "1"));

		List statuses = new ArrayList();
		statuses.add(Integer.valueOf(1));
		if (showDisabledOrg) {
			statuses.add(Integer.valueOf(0));
		}

		String selectChildrenSqlFormatter = "select count(*) from SA_OPOrg where parent_id = ? and status in (%s) %s %s";

		if (showDisabledOrg)
			params.putProperty("status", "0,1");
		else {
			params.putProperty("status", "1");
		}

		String displayableOrgKinds = (String) params.getProperty("displayableOrgKinds", String.class);
		if (!StringUtil.isBlank(displayableOrgKinds))
			params.putProperty("orgKindId", displayableOrgKinds);
		QueryModel queryModel;
		if (!showPosition)
			queryModel = this.serviceUtil.getEntityDao().getQueryModelByName(getOrgEntity(), "selectOrgExcludePos",
					params.getProperties());
		else {
			queryModel = this.serviceUtil.getEntityDao().getQueryModel(getOrgEntity(), params.getProperties());
		}

		String filter = (String) params.getProperty("filter", String.class);

		if (otherConditions.length() > 0) {
			if (StringUtil.isBlank(filter))
				filter = otherConditions.toString();
			else {
				filter = String.format(" and %s %s", new Object[] { filter, otherConditions.toString() });
			}
		}

		if (!StringUtil.isBlank(filter)) {
			String sql = queryModel.getSql();
			sql = new StringBuilder().append(sql).append(filter).toString();
			queryModel.setSql(sql);
		}

		String manageCodes = (String) params.getProperty("manageCodes", String.class);
		if (!StringUtil.isBlank(manageCodes)) {
			queryModel.setManageType(manageCodes);
		}
		queryModel.setTreeQuery(true);
		params.putProperty("sortname", "sequence");
		params.putProperty("sortorder", "asc");

		Map data = this.serviceUtil.getSQLQuery().executeQuery(queryModel, params);
		String selectChildrenCountSql = String.format(selectChildrenSqlFormatter,
				new Object[] { Util.arrayToString(statuses.toArray(), "%s", ","),
						getOrgKindIdsCriteria(displayableOrgKinds), showVirtualOrgCriteria });

		List<Map<String, Object>> list = (List) data.get("Rows");

		for (Map item : list) {
			String manageType = (String) params.getProperty("sys_Manage_Type", String.class);
			if (!StringUtil.isBlank(manageType)) {
				addPermissionFlag(manageType, item);
			}

			String id = (String) ClassHelper.convert(item.get("id"), String.class);
			Integer childrenCount = Integer
					.valueOf(this.serviceUtil.getEntityDao().queryToInt(selectChildrenCountSql, new Object[] { id }));
			item.put("hasChildren", childrenCount);
		}
		return data;
	}

	public Map<String, Object> queryOrgs(SDO params) {
		StringBuilder otherConditions = new StringBuilder();

		String parentId = (String) params.getProperty("parentId", String.class);

		boolean showDisabledOrg = "1"
				.equalsIgnoreCase((String) params.getProperty("showDisabledOrg", String.class, "0"));

		boolean showVirtualOrg = "1".equalsIgnoreCase((String) params.getProperty("showVirtualOrg", String.class, "0"));
		String showVirtualOrgCriteria = "";
		if (!showVirtualOrg) {
			showVirtualOrgCriteria = " and nvl(Is_Virtual, 0) = 0";
			otherConditions.append(showVirtualOrgCriteria);
		}

		boolean showProjectOrg = "1".equalsIgnoreCase((String) params.getProperty("showProjectOrg", String.class, "1"));
		if (!showProjectOrg) {
			otherConditions.append(" and instr(full_org_kind_id, 'prj') = 0");
		}

		boolean showPosition = "1".equalsIgnoreCase((String) params.getProperty("showPosition", String.class, "1"));

		boolean showMasterPsm = "1".equalsIgnoreCase((String) params.getProperty("showMasterPsm", String.class, "0"));
		if ((showMasterPsm) && (showPosition)) {
			otherConditions.append(" and (org_kind_id <> 'psm' or parent_id = main_org_id )");
		}

		List statuses = new ArrayList();
		statuses.add(Integer.valueOf(1));
		if (showDisabledOrg) {
			statuses.add(Integer.valueOf(0));
		}

		String selectChildrenSqlFormatter = "select count(*) from SA_OPOrg where parent_id = ? and status in (%s) %s %s";

		if (StringUtil.isBlank(parentId)) {
			String rootOrgId = "orgRoot";
			Map rootOrg = new HashMap(8);

			rootOrg.put("parentId", "null");
			rootOrg.put("id", "orgRoot");
			rootOrg.put("code", "root");
			rootOrg.put("name", "蓝光BRC");
			rootOrg.put("orgKindId", "root");

			rootOrg.put("status", Integer.valueOf(ValidStatus.ENABLED.getId()));

			String selectChildrenCountSql = String.format(selectChildrenSqlFormatter,
					new Object[] { Util.arrayToString(statuses.toArray(), "%s", ","), "", showVirtualOrgCriteria });
			Integer childrenCount = Integer.valueOf(
					this.serviceUtil.getEntityDao().queryToInt(selectChildrenCountSql, new Object[] { rootOrgId }));

			rootOrg.put("hasChildren", childrenCount);
			rootOrg.put("isexpand", Integer.valueOf(0));

			List data = new ArrayList(1);
			data.add(rootOrg);

			Map rows = new HashMap();
			rows.put("Rows", data);
			return rows;
		}

		boolean customDefineRoot = "1"
				.equalsIgnoreCase((String) params.getProperty("customDefineRoot", String.class, "0"));

		if (customDefineRoot)
			params.removeProperty("parentId");
		else {
			params.removeProperty("id");
		}

		if (showDisabledOrg)
			params.putProperty("status", "0,1");
		else {
			params.putProperty("status", "1");
		}

		String displayableOrgKinds = (String) params.getProperty("displayableOrgKinds", String.class);
		if (!StringUtil.isBlank(displayableOrgKinds))
			params.putProperty("orgKindId", displayableOrgKinds);
		QueryModel queryModel;
		if (!showPosition)
			queryModel = this.serviceUtil.getEntityDao().getQueryModelByName(getOrgEntity(), "selectOrgExcludePos",
					params.getProperties());
		else {
			queryModel = this.serviceUtil.getEntityDao().getQueryModel(getOrgEntity(), params.getProperties());
		}

		String filter = (String) params.getProperty("filter", String.class);

		if (otherConditions.length() > 0) {
			if (StringUtil.isBlank(filter))
				filter = otherConditions.toString();
			else {
				filter = String.format(" and %s %s", new Object[] { filter, otherConditions.toString() });
			}
		}

		if (!StringUtil.isBlank(filter)) {
			String sql = queryModel.getSql();
			sql = new StringBuilder().append(sql).append(filter).toString();
			queryModel.setSql(sql);
		}

		String manageCodes = (String) params.getProperty("manageCodes", String.class);
		if (!StringUtil.isBlank(manageCodes)) {
			queryModel.setManageType(manageCodes);
		}
		queryModel.setTreeQuery(true);
		params.putProperty("sortname", "sequence");
		params.putProperty("sortorder", "asc");

		Map data = this.serviceUtil.getSQLQuery().executeQuery(queryModel, params);
		String selectChildrenCountSql = String.format(selectChildrenSqlFormatter,
				new Object[] { Util.arrayToString(statuses.toArray(), "%s", ","),
						getOrgKindIdsCriteria(displayableOrgKinds), showVirtualOrgCriteria });

		List<Map<String, Object>> list = (List) data.get("Rows");

		for (Map item : list) {
			String manageType = (String) params.getProperty("sys_Manage_Type", String.class);
			if (!StringUtil.isBlank(manageType)) {
				addPermissionFlag(manageType, item);
			}

			String id = (String) ClassHelper.convert(item.get("id"), String.class);
			Integer childrenCount = Integer
					.valueOf(this.serviceUtil.getEntityDao().queryToInt(selectChildrenCountSql, new Object[] { id }));
			item.put("hasChildren", childrenCount);
		}
		return data;
	}

	public Map<String, Object> slicedQueryOrgs(SDO params) {
		String showDisabledOrg = (String) params.getProperty("showDisabledOrg", String.class, "0");
		String showAllChildrenOrg = (String) params.getProperty("showAllChildrenOrg", String.class, "0");

		boolean rtxOrgContrast = "1".equalsIgnoreCase((String) params.getProperty("rtxOrgContrast", String.class, "0"));

		if ("1".equalsIgnoreCase(showDisabledOrg))
			params.putProperty("status", "0,1");
		else {
			params.putProperty("status", "1");
		}

		String displayableOrgKinds = (String) params.getProperty("displayableOrgKinds", String.class);
		if (!StringUtil.isBlank(displayableOrgKinds)) {
			params.putProperty("orgKindId", displayableOrgKinds);
		}

		if ("1".equalsIgnoreCase(showAllChildrenOrg))
			params.removeProperty("parentId");
		else
			params.removeProperty("fullId");
		QueryModel queryModel;
		if (rtxOrgContrast)
			queryModel = this.serviceUtil.getEntityDao().getQueryModelByName(getOrgEntity(), "selectRTXOrgContrast",
					params.getProperties());
		else {
			queryModel = this.serviceUtil.getEntityDao().getQueryModelByName(getOrgEntity(), "selectOrg",
					params.getProperties());
		}
		String paramValue = (String) params.getProperty("paramValue", String.class);
		StringBuffer sb = null;

		if (!StringUtil.isBlank(paramValue)) {
			sb = new StringBuffer(queryModel.getSql());
			sb.append(" and (");
			String[] values = paramValue.split(" ");
			int i = 0;
			for (String v : values) {
				if (!StringUtil.isBlank(v)) {
					sb.append(" (upper(t.code) like upper(:paramValue").append(i).append(")");
					sb.append(" or t.name like :paramValue").append(i).append(") ");
					sb.append("or");
					queryModel.putLikeParam(new StringBuilder().append("paramValue").append(i).toString(), v);
				}
				i++;
			}
			if (sb.lastIndexOf("or") == sb.length() - 2) {
				sb.replace(sb.length() - 2, sb.length(), "");
			}
			sb.append(")");
		}

		boolean showVirtualOrg = "1".equalsIgnoreCase((String) params.getProperty("showVirtualOrg", String.class, "0"));
		if (!showVirtualOrg) {
			if (sb == null) {
				sb = new StringBuffer(queryModel.getSql());
			}
			sb.append(" and nvl(Is_Virtual, 0) = 0");
		}

		boolean showProjectOrg = "1".equalsIgnoreCase((String) params.getProperty("showProjectOrg", String.class, "1"));
		if (!showProjectOrg) {
			sb.append(" and instr(full_org_kind_id, 'prj') = 0");
		}
		if (sb != null) {
			queryModel.setSql(sb.toString());
		}

		return this.serviceUtil.getSQLQuery().executeSlicedQuery(queryModel, params);
	}

	public String getOrgNextSequence(String parentId) {
		return getNewSequence(parentId, null);
	}

	private void checkPersonConstraints(SDO params) {
		String id = (String) params.getProperty("id", String.class);
		String code = (String) params.getProperty("code", String.class);
		String loginName = (String) params.getProperty("loginName", String.class);
		String idCard = (String) params.getProperty("idCard", String.class);
		checkPersonExist(id, code, loginName, idCard, true);
	}

	private void checkPersonExist(String id, String code, String loginName, String idCard, boolean isCheckLogicDelete) {
		if (Util.isEmptyString(loginName))
			loginName = code;
		String idCardCriteria = Util.isEmptyString(idCard) ? "" : " or upper(SA_OPPerson.ID_Card) = :idCard ";

		String sql = String.format(
				new StringBuilder()
						.append("select id, code, name, login_name, id_card from SA_OPPerson where id <> :id and ")
						.append(isCheckLogicDelete ? "" : " (status <> -1) and ").append(" (upper(code) = :code %s ")
						.append(" or (upper(coalesce(login_name, code)) = :loginName)) ").toString(),
				new Object[] { idCardCriteria });

		Map params = new HashMap();
		params.put("id", id);
		params.put("code", code.toUpperCase());
		params.put("loginName", loginName.toUpperCase());
		if (Util.isNotEmptyString(idCard)) {
			params.put("idCard", idCard.toUpperCase());
		}

		Map person = this.serviceUtil.getEntityDao().queryToMapByMapParam(sql, params);
		if (person.size() > 0) {
			String personName = (String) ClassHelper.convert(person.get("name"), String.class, "");
			String personCode = (String) ClassHelper.convert(person.get("code"), String.class, "");
			String personLoginName = (String) ClassHelper.convert(person.get("login_name"), String.class, "");
			String personIdCard = (String) ClassHelper.convert(person.get("id_card"), String.class, "");

			Util.check(!code.equalsIgnoreCase(personCode), "人员编码“%s”与“%s”的编码重复！", new Object[] { code, personName });
			Util.check(!loginName.equalsIgnoreCase(personLoginName), "人员登录名“%s”与“%s”的登录名或编码重复！",
					new Object[] { loginName, personName });
			if (Util.isNotEmptyString(idCard))
				Util.check(!idCard.equalsIgnoreCase(personIdCard), "人员身份证“%s”与“%s”的身份证重复！",
						new Object[] { idCard, personName });
		}
	}

	public String getPersonIdByIdCard(String idCard) {
		if (StringUtil.isBlank(idCard)) {
			return null;
		}
		String sql = "SELECT t.id FROM sa_opperson t where t.id_card=?";
		return this.serviceUtil.getEntityDao().queryToString(sql, new Object[] { idCard });
	}

	public String insertPerson(SDO params) {
		String id = CommonUtil.createGUID();

		params.putProperty("id", id);
		String code = (String) params.getProperty("code", String.class);
		String name = (String) params.getProperty("name", String.class);
		String mainOrgId = (String) params.getProperty("mainOrgId", String.class);
		String idCard = (String) params.getProperty("idCard", String.class);

		Integer status = (Integer) params.getProperty("status", Integer.class);

		Util.check(Util.isNotEmptyString(mainOrgId), "新建人员'%s'失败，必须有对应的组织！", new Object[] { name });

		OpmUtil.checkOrgCode(code);
		OpmUtil.checkOrgName(name);

		checkPersonConstraints(params);

		String selectOrgSql = "select id, code, name, status, org_kind_id, full_id, full_code, full_name, full_sequence, full_org_kind_id from SA_OPOrg where id = ?";
		Org org = (Org) this.serviceUtil.getEntityDao().queryToObject(selectOrgSql, Org.class,
				new Object[] { mainOrgId });
		Util.check(org != null, "组织%s'失败", new Object[] { mainOrgId });

		if (status == null) {
			status = org.getStatus();
			params.putProperty("status", org.getStatus());
		}
		params.putProperty("password", OrgUtil.getDefaultEncryptPassword());
		String payPassword = OrgUtil.getDefaultEncryptPassword();
		if (idCard.length() > 6) {
			payPassword = Util.MD5(idCard.substring(idCard.length() - 6));
		}
		params.putProperty("payPassword", payPassword);

		params.putProperty("isOperator", Integer.valueOf(0));

		this.serviceUtil.getEntityDao().insert(
				this.serviceUtil.getEntity("config/domain/com/brc/system/opm/opm.xml", "person"),
				params.getProperties());

		InsertPersonMember(id, code, name, null, ValidStatus.fromId(status.intValue()), org, org.getStatusEnum(),
				false);
		return id;
	}

	public void updatePersonSimple(SDO params) {
		String personId = (String) params.getProperty("id", String.class);
		updateOrgVersionByPersonId(personId);

		this.serviceUtil.getEntityDao().update(
				this.serviceUtil.getEntity("config/domain/com/brc/system/opm/opm.xml", "person"),
				params.getProperties(), new String[0]);
	}

	public void updatePerson(SDO params) {
		String id = (String) params.getProperty("id", String.class);
		String code = (String) params.getProperty("code", String.class);
		String name = (String) params.getProperty("name", String.class);
		String loginName = (String) params.getProperty("loginName", String.class);
		String idCard = (String) params.getProperty("idCard", String.class);

		String selectPersonSql = "select * from SA_OPPerson where id = ?";
		Person person = (Person) this.serviceUtil.getEntityDao().queryToObject(selectPersonSql, Person.class,
				new Object[] { id });
		Util.check(person != null, "无效的人员标识“%s”！", new Object[] { id });

		code = (String) OpmUtil.coalesce(new Object[] { code, person.getCode() });
		name = (String) OpmUtil.coalesce(new Object[] { name, person.getName() });
		loginName = (String) OpmUtil.coalesce(new Object[] { loginName, person.getLoginName() });
		idCard = (String) OpmUtil.coalesce(new Object[] { idCard, person.getIdCard() });

		OpmUtil.checkOrgCode(code);
		OpmUtil.checkOrgName(name);

		params.putProperty("code", code);
		params.putProperty("name", name);
		params.putProperty("loginName", loginName);
		params.putProperty("idCard", idCard);

		checkPersonConstraints(params);

		this.serviceUtil.getEntityDao().update(getPersonEntity(), params.getProperties(), new String[0]);

		String selectOrgSql = "select * from SA_OPOrg where person_id = :personId";
		Map sqlParams = new HashMap(1);
		sqlParams.put("personId", id);
		List<Map<String, Object>> orgs = this.serviceUtil.getEntityDao().queryToMapListByMapParam(selectOrgSql,
				sqlParams);

		SDO updateOrgParams = new SDO();

		for (Map item : orgs) {
			item.put("code", code);
			item.put("name", name);
			updateOrgParams.setProperties(item);
			updateOrg(updateOrgParams);
		}
	}

	public void updatePersonContactInfo(SDO params) {
		this.serviceUtil.getEntityDao().update(getPersonEntity(), params.getProperties(), new String[0]);
	}

	public void disablePerson(String id, Long version) {
		ArrayList fromStatuses = new ArrayList();
		fromStatuses.add(ValidStatus.ENABLED);
		updatePersonStatus(id, version, fromStatuses, ValidStatus.DISABLED, "禁用人员", true);
	}

	public void enablePerson(String id, Long version, boolean isEnableSubordinatePsm) {
		ArrayList fromStatuses = new ArrayList();
		fromStatuses.add(ValidStatus.DISABLED);
		updatePersonStatus(id, version, fromStatuses, ValidStatus.ENABLED, "启用人员", isEnableSubordinatePsm);
	}

	public void changePersonMainOrg(String id, Long version, String personMemberId, boolean isDisableOldMasterPsm) {
		Org newOrg = loadOrgObject(personMemberId);
		Util.check(newOrg != null, "设置主人员成员失败，无效的人员成员标识“%s”！", new Object[] { personMemberId });

		StringBuilder sb = new StringBuilder();
		sb.append("select p.id, p.name, p.main_org_id, p.version, p.status, o.id as psm_id,");
		sb.append("       o.version as psm_version, o.status as psmstatus");
		sb.append("  from sa_opperson p, sa_oporg o");
		sb.append(" where o.org_kind_id = 'psm'");
		sb.append("   and o.parent_id = p.main_org_id");
		sb.append("   and o.person_id = p.id");
		sb.append("   and p.id = :id");
		Map personData = this.serviceUtil.getEntityDao().queryToMap(sb.toString(), new Object[] { id });
		Util.check(personData.size() > 0, "设置主人员成员失败，无效的人员标识“%s”！", new Object[] { id });

		String personName = (String) personData.get("name");
		ValidStatus personStatus = ValidStatus
				.fromId(((Integer) ClassHelper.convert(personData.get("status"), Integer.class)).intValue());
		ValidStatus orgStauts = newOrg.getStatusEnum();
		Util.check(personStatus.equals(orgStauts), "设置“%s”主人员成员失败，人员成员的状态与人员状态不一致！", new Object[] { personName });

		String psmId = (String) personData.get("psmId");
		Long psmVersion = (Long) ClassHelper.convert(personData.get("psmVersion"), Long.class);
		String updateMainOrgIdSql = "update sa_opperson t set t.main_org_id = ?,  t.version = seq_id.nextval where t.id = ?";
		this.serviceUtil.getEntityDao().executeUpdate(updateMainOrgIdSql, new Object[] { newOrg.getParentId(), id });

		if ((isDisableOldMasterPsm) && (!personMemberId.equals(psmId)))
			disableOrg(psmId, psmVersion);
	}

	public String adjustPersonOrgStructure(String personMemberId, String positionId, boolean isDisableOldPsm,
			boolean isUpdateMainPosition) {
		Org personMember = loadOrgObject(personMemberId);
		Util.check(personMember != null, "调整人员组织失败，无效的人员成员标识“%s”！", new Object[] { personMemberId });

		Org parentOrg = loadOrgObject(positionId);
		Util.check(personMember != null, "调整人员组织失败，无效的岗位标识“%s”！", new Object[] { positionId });

		String newPersonMemberId = InsertPersonMember(personMember.getPersonId(), personMember.getCode(),
				personMember.getName(), null, personMember.getStatusEnum(), parentOrg, parentOrg.getStatusEnum(), true);

		if (isUpdateMainPosition) {
			changePersonMainOrg(personMember.getPersonId(), personMember.getVersion(), newPersonMemberId,
					isDisableOldPsm);
		}

		return newPersonMemberId;
	}

	public void logicDeletePerson(String id, Long version) {
		List fromStatuses = new ArrayList();
		fromStatuses.add(ValidStatus.ENABLED);
		fromStatuses.add(ValidStatus.DISABLED);
		updatePersonStatus(id, version, fromStatuses, ValidStatus.LOGIC_DELETE, "删除人员", true);
	}

	public void physicalDeletePerson(String id, Long version) {
		String selectPersonSql = "select P.ID, P.Name, P.Status, P.Version, O.ID as psmID,\n       O.Version as psmVersion\n  from SA_OPPerson P\n  left join SA_OPOrg O\n    on O.Org_Kind_ID = 'psm'\n   and O.Parent_ID = P.Main_Org_ID\n   and O.Person_ID = P.ID\n where P.ID = ?";

		Map personData = this.serviceUtil.getEntityDao().queryToMap(selectPersonSql, new Object[] { id });
		Util.check(personData.size() > 0, "无效的人员标识“%s”！", new Object[] { id });

		ValidStatus personStatus = ValidStatus.valueOf((String) personData.get("Status"));
		String personName = (String) personData.get("Name");
		Util.check(personStatus.equals(ValidStatus.LOGIC_DELETE), "%s失败，“%s”当前的状态是“%s”！",
				new Object[] { "清除人员", personName, personStatus.getDisplayName() });

		String psmId = (String) personData.get("psmId");
		if (!Util.isNotEmptyString(psmId)) {
			deletePerson(id);
		}
	}

	private void updateMainOrgPersonStatus(String id, Collection<ValidStatus> fromStatuses, ValidStatus toStatus) {
		StringBuilder baseSql = new StringBuilder();
		baseSql.append(" where (p.Status in (%s))");
		baseSql.append("   and exists (select 1");
		baseSql.append("          from SA_OPOrg o");
		baseSql.append("         where (o.Org_Kind_Id = 'psm')");
		baseSql.append("           and (p.Main_Org_Id = o.Parent_Id)");
		baseSql.append("           and (p.ID = o.Person_Id)");
		baseSql.append("           and (o.Status in (%s))");
		baseSql.append("           and (o.Full_Id like ?))");

		String statusesCriteria = Util.arrayToString(fromStatuses.toArray(), "%s", ",");
		String baseSqlString = String.format(baseSql.toString(), new Object[] { statusesCriteria, statusesCriteria });
		String fullIdCriteria = String.format("%s%%", new Object[] { id });

		this.serviceUtil.getEntityDao().executeUpdate(
				new StringBuilder().append("update SA_OPPerson p set p.Status = ?, p.Version = Seq_Id.Nextval ")
						.append(baseSqlString).toString(),
				new Object[] { Integer.valueOf(toStatus.getId()), fullIdCriteria });
	}

	private void updatePersonStatus(String id, Long version, Collection<ValidStatus> fromStatuses, ValidStatus toStatus,
			String operateType, boolean isEnableSubordinatePsm) {
		StringBuilder sb = new StringBuilder();
		sb.append("select p.ID as person_Id, p.Name, p.version, o.ID as psm_Id,");
		sb.append("       o.version as psm_version, o.full_name");
		sb.append("  from SA_OPPerson p, SA_OPOrg o");
		sb.append(" where o.Parent_ID = P.Main_Org_ID");
		sb.append("   and o.Person_ID = P.ID");
		sb.append("   and o.Org_Kind_ID = 'psm'");
		sb.append("   and p.id = ?");

		Map personData = this.serviceUtil.getEntityDao().queryToMap(sb.toString(), new Object[] { id });
		Util.check(personData.size() > 0, "无效的人员标识“%s”！", new Object[] { id });

		String personName = (String) personData.get("name");
		String psmId = (String) personData.get("psmId");
		Util.check(Util.isNotEmptyString(psmId), "%s失败，人员“%s”没有所属的组织或者没有有效的主人员成员！",
				new Object[] { operateType, personName });
		updateOrgStatus(psmId, version, fromStatuses, toStatus, operateType, isEnableSubordinatePsm);
	}

	public void restorePerson(String id, Long version, boolean isRestoreSubordinatePsm) {
		ArrayList fromStatuses = new ArrayList();
		fromStatuses.add(ValidStatus.LOGIC_DELETE);
		updatePersonStatus(id, version, fromStatuses, ValidStatus.ENABLED, "还原人员", isRestoreSubordinatePsm);
	}

	public void resetPassword(String id) {
		String selectPersonPasswordSql = "select ID, Name, Password, PasswordModifyTime, Version from SA_OPPerson where ID = ?";
		Person person = (Person) this.serviceUtil.getEntityDao().queryToObject(selectPersonPasswordSql, Person.class,
				new Object[] { id });
		Util.check(person != null, "重置人员密码失败，无效的人员标识“%s”！", new Object[] { id });
		String updatePersonSql = "Update SA_OPPerson set Password = ? ,PasswordModifyTime = ? where ID = ? ";
		this.serviceUtil.getEntityDao().executeQuery(updatePersonSql,
				new Object[] { "123456", CommonUtil.getCurrentDate(), id });
	}

	public Map<String, Object> loadPerson(String id) {
		return this.serviceUtil.getEntityDao()
				.loadById(this.serviceUtil.getEntity("config/domain/com/brc/system/opm/opm.xml", "person"), id);
	}

	public Person loadPersonObject(String id) {
		String sql = "select * from SA_OPPerson where id = ?";
		Person person = (Person) this.serviceUtil.getEntityDao().queryToObject(sql, Person.class, new Object[] { id });
		return person;
	}

	public Person loadPersonObjectByLoginName(String loginName) {
		String sql = "select * from SA_OPPerson where upper(login_name) = ?";
		Person person = (Person) this.serviceUtil.getEntityDao().queryToObject(sql, Person.class,
				new Object[] { loginName.toUpperCase() });
		return person;
	}

	public Map<String, Object> loadPersons(SDO params) {
		return null;
	}

	public List<Map<String, Object>> queryPersonMembersByPersonId(String personId) {
		String sql = " select t.id, t.org_name, t.center_name, t.position_name, t.full_id, full_name from sa_oporg t where t.person_id = ? and t.status = 1";
		return this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[] { personId });
	}

	public String loadArchivesPictureByPersonId(String personId) {
		String sql = "select t.path from hr_archives_picture t,hr_archives a where t.archives_id=a.archives_id and a.person_id=?";
		return this.serviceUtil.getEntityDao().queryToString(sql, new Object[] { personId });
	}

	public void updatePassword(SDO sdo) {
		Operator operator = sdo.getOperator();

		Person person = loadPersonObjectByLoginName(operator.getLoginName());
		Util.check(person != null, "没有找到“%s”对应的人员。", new Object[] { operator.getLoginName() });
		boolean isOperator = person.getIsOperator().intValue() == 1;

		String newPassword = new String(Base64.decode((String) sdo.getProperty("newPsw", String.class)));
		String oldPassword = new String(Base64.decode((String) sdo.getProperty("psw", String.class)));

		Util.check((!StringUtil.isBlank(newPassword)) && (!StringUtil.isBlank(oldPassword)), "密码为空。");

		String md5NewPassword = Md5Builder.getMd5(newPassword);
		String md5OldPassword = Md5Builder.getMd5(oldPassword);

		String passwordType = (String) sdo.getProperty("passwordType", String.class, "1");

		Util.check(md5OldPassword.equals(person.getPassword()), "旧密码错误。");
		String sql = "update SA_OPPerson set password=? where id=?";
		this.serviceUtil.getEntityDao().executeUpdate(sql, new Object[] { md5NewPassword, person.getId() });

	}

	public void updatePersonIsOperator(String personId, Boolean isOperator) {
		Person person = loadPersonObject(personId);
		Util.check(person != null, "更新人员的操作员属性出错，没有找到对应的人员。");
		person.checkEnabledStatus();

		String sql = this.serviceUtil.getEntityDao().getSqlByName(getPersonEntity(), "updateIsOperatorSql");
		Integer isOperatorValue = Integer.valueOf(isOperator.booleanValue() ? 1 : 0);
		this.serviceUtil.getEntityDao().executeUpdate(sql, new Object[] { personId, isOperatorValue });
	}

	public void quoteAuthorizationAndBizManagement(String sourceOrgId, String destOrgId) {
		this.authorizationService.quoteAuthorize(sourceOrgId, destOrgId);
		this.managementService.quoteBizManagement(sourceOrgId, destOrgId);
	}

	private String getOrgDn(String fullNameInDb) {
		String rootDn = (String) Singleton.getParameter("adUserRootDn", String.class);
		String childDn = doParseFullNameToOuPath(fullNameInDb);
		return new StringBuilder().append(childDn).append(",").append(rootDn).toString();
	}

	private String doParseFullNameToOuPath(String fullNameInDb) {
		StringBuilder dn = new StringBuilder();
		String[] orgs = fullNameInDb.substring(1).split("/");

		for (int i = orgs.length - 2; i >= 1; i--) {
			dn.append(new StringBuilder().append("OU=").append(orgs[i]).toString());
			if (i > 1) {
				dn.append(",");
			}
		}
		return dn.toString();
	}

	private EntityDocument.Entity getOrgFunctionEntity() {
		return this.serviceUtil.getEntity("config/domain/com/brc/system/opm/opm.xml", "orgFunction");
	}

	private String[] buildFullIdAndName(Long parentId, Long id, String name) {
		Map parentData = loadOrgFunction(parentId);
		Util.check(parentData.size() > 0, "没有找到父节点。");

		String[] result = new String[2];
		String parentFullId = (String) ClassHelper.convert(parentData.get("fullId"), String.class);
		String parentFullName = (String) ClassHelper.convert(parentData.get("fullName"), String.class);

		result[0] = CommonUtil.createFileFullName(parentFullId == null ? "" : parentFullId, id.toString(), "");
		result[1] = CommonUtil.createFileFullName(parentFullName == null ? "" : parentFullName, name, "");
		return result;
	}

	private void checkOrgFunctionConstraints(SDO params) {
		Long parentId = (Long) params.getProperty("parentId", Long.class);
		NameCodeUniqueValidator
				.newInstance(getOrgFunctionEntity(), params, "id", "checkOrgFunctionExistSql", "parent_Id", parentId)
				.validate();
	}

	public Long insertOrgFunction(SDO params) {
		checkOrgFunctionConstraints(params);

		Long parentId = (Long) params.getProperty("parentId", Long.class);
		String name = (String) params.getProperty("name", String.class);

		Long id = this.serviceUtil.getEntityDao().getSequence("SEQ_ID");

		String[] fullInfo = buildFullIdAndName(parentId, id, name);
		params.putProperty("fullId", fullInfo[0]);
		params.putProperty("fullName", fullInfo[1]);

		return (Long) this.serviceUtil.getEntityDao().insert(getOrgFunctionEntity(), params.getProperties());
	}

	public void updateOrgFunction(SDO params) {
		checkOrgFunctionConstraints(params);
		this.serviceUtil.getEntityDao().update(getOrgFunctionEntity(), params.getProperties(), new String[0]);
	}

	public void deleteOrgFunction(Long[] ids) {
		String selectChildrenCountSql = this.serviceUtil.getEntityDao().getSqlByName(getOrgFunctionEntity(),
				"selectChildrenCountSql");

		for (Long id : ids) {
			int count = this.serviceUtil.getEntityDao().queryToInt(selectChildrenCountSql, new Object[] { id });
			if (count > 0) {
				OrgFunction OrgFunction = loadOrgFunctionObject(id);
				throw new ApplicationException(String.format("组织职能”%s(%s)“下已建立子节点，不能删除。",
						new Object[] { OrgFunction.getName(), OrgFunction.getCode() }));
			}
		}
		this.serviceUtil.getEntityDao().deleteByIds(getOrgFunctionEntity(), ids);
	}

	public Long getOrgFunctionNextSequence(Long parentId) {
		return this.serviceUtil.getNextSequence("config/domain/com/brc/system/opm/opm.xml", "orgFunction", "parent_id",
				parentId);
	}

	public void updateOrgFunctionSequence(Map<Long, Long> params) {
		this.serviceUtil.updateSequence("config/domain/com/brc/system/opm/opm.xml", "orgFunction", params);
	}

	public void moveOrgFunction(Long[] ids, Long parentId) {
		OrgFunction parentOrgFunction = loadOrgFunctionObject(parentId);

		String moveSql = this.serviceUtil.getEntityDao().getSqlByName(getOrgFunctionEntity(), "move");

		for (Long id : ids) {
			Map OrgFunction = loadOrgFunction(id);

			String fullId = CommonUtil.createFileFullName(
					parentOrgFunction.getFullId() == null ? "" : parentOrgFunction.getFullId(), id.toString(), "");

			OrgFunction.put("parentId", parentId);
			OrgFunction.put("fullId", fullId);

			this.serviceUtil.getEntityDao().executeUpdate(moveSql, new Object[] { parentId, fullId, id });
		}
	}

	public Map<String, Object> loadOrgFunction(Long id) {
		return this.serviceUtil.getEntityDao().loadById(getOrgFunctionEntity(), id);
	}

	public OrgFunction loadOrgFunctionObject(Long id) {
		String sql = this.serviceUtil.getEntityDao().getSqlByName(getOrgFunctionEntity(), "selectObjectSql");
		return (OrgFunction) this.serviceUtil.getEntityDao().queryToObject(sql, OrgFunction.class, new Object[] { id });
	}

	public Map<String, Object> queryOrgFunctions(SDO params) {
		QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModel(getOrgFunctionEntity(),
				params.getProperties());
		Map data = this.serviceUtil.getSQLQuery().executeQuery(queryModel, params);
		return data;
	}

	public Map<String, Object> slicedQueryOrgFunctions(SDO params) {
		QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModel(getOrgFunctionEntity(),
				params.getProperties());
		return this.serviceUtil.getSQLQuery().executeSlicedQuery(queryModel, params);
	}

	private EntityDocument.Entity getOrgFunBizManTypeAuthorizeEntity() {
		return this.serviceUtil.getEntity("config/domain/com/brc/system/opm/opm.xml", "orgFunBizManTypeAuthorize");
	}

	public void insertOrgFunBizManTypeAuthorize(Long orgFunctionId, Long[] bizManagementTypeIds) {
		List list = new ArrayList(bizManagementTypeIds.length);
		OrgFunBizManTypeAuthorize orgFunBizManTypeAuthorize = null;
		String selectByOrgFunctionTypeIdSql = this.serviceUtil.getEntityDao()
				.getSqlByName(getOrgFunBizManTypeAuthorizeEntity(), "selectByOrgFunctionTypeIdSql");

		for (Long bizManagementTypeId : bizManagementTypeIds) {
			Map item = new HashMap();
			orgFunBizManTypeAuthorize = (OrgFunBizManTypeAuthorize) this.serviceUtil.getEntityDao().queryToObject(
					selectByOrgFunctionTypeIdSql, OrgFunBizManTypeAuthorize.class,
					new Object[] { orgFunctionId, bizManagementTypeId });

			if (orgFunBizManTypeAuthorize == null) {
				item.put("orgFunctionId", orgFunctionId);
				item.put("bizManagementTypeId", bizManagementTypeId);
				item.put("organKindId", Integer.valueOf(OrgFunBizManTypeAuthorize.OrganKind.PUBLIC.getId()));
				list.add(item);
			}
		}

		if (list.size() > 0)
			this.serviceUtil.getEntityDao().batchInsert(getOrgFunBizManTypeAuthorizeEntity(), list);
	}

	public void updateOrgFunBizManTypeAuthorize(SDO params) {
		DataUtil.saveSingleTable(this.serviceUtil, params, "id", getOrgFunBizManTypeAuthorizeEntity());
	}

	public void deleteOrgFunBizManTypeAuthorize(Long[] ids) {
		this.serviceUtil.getEntityDao().deleteByIds(getOrgFunBizManTypeAuthorizeEntity(), ids);
	}

	public Map<String, Object> slicedQueryOrgFunBizManTypeAuthorizes(SDO params) {
		QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModel(getOrgFunBizManTypeAuthorizeEntity(),
				params.getProperties());
		return this.serviceUtil.getSQLQuery().executeSlicedQuery(queryModel, params);
	}

	private EntityDocument.Entity getOrgFunctionAuthorizeEntity() {
		return this.serviceUtil.getEntity("config/domain/com/brc/system/opm/opm.xml", "orgFunctionAuthorize");
	}

	public void saveOrgFunctionAuthorize(String orgId, Long[] orgFunctionIds) {
		List list = new ArrayList(orgFunctionIds.length);
		OrgFunctionAuthorize OrgFunctionAuthorize = null;
		String selectByOrgAndOrgFunctionIdSql = this.serviceUtil.getEntityDao()
				.getSqlByName(getOrgFunctionAuthorizeEntity(), "selectByOrgAndOrgFunctionIdSql");
		for (Long orgFunctionId : orgFunctionIds) {
			Map item = new HashMap(2);
			OrgFunctionAuthorize = (OrgFunctionAuthorize) this.serviceUtil.getEntityDao().queryToObject(
					selectByOrgAndOrgFunctionIdSql, OrgFunctionAuthorize.class, new Object[] { orgId, orgFunctionId });

			if (OrgFunctionAuthorize == null) {
				item.put("orgId", orgId);
				item.put("orgFunctionId", orgFunctionId);
				list.add(item);
			}
		}

		if (list.size() > 0)
			this.serviceUtil.getEntityDao().batchInsert(getOrgFunctionAuthorizeEntity(), list);
	}

	public void deleteOrgFunctionAuthorize(Long[] ids) {
		this.serviceUtil.getEntityDao().deleteByIds(getOrgFunctionAuthorizeEntity(), ids);
	}

	public Map<String, Object> slicedQueryOrgFunctionAuthorizes(SDO params) {
		QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModel(getOrgFunctionAuthorizeEntity(),
				params.getProperties());
		return this.serviceUtil.getSQLQuery().executeSlicedQuery(queryModel, params);
	}

	public Map<String, Object> queryDeltaOrg(Long version) {
		version = Long.valueOf(9223372036854775807L);
		String sql = this.serviceUtil.getEntityDao().getSqlByName(getOrgEntity(), "selectDeltaData");
		List data = this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[] { version });
		Map result = new HashMap(1);
		result.put("Rows", data);
		return result;
	}

	public Map<String, Object> slicedQueryDeltaOrg(SDO params) {
		QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModelByName(getOrgEntity(),
				"slicedSelectDeltaData", params.getProperties());
		return this.serviceUtil.getSQLQuery().executeSlicedQuery(queryModel, params);
	}

	public Map<String, Object> queryDeltaPerson(Long version) {
		version = Long.valueOf(9223372036854775807L);
		String sql = this.serviceUtil.getEntityDao().getSqlByName(getPersonEntity(), "selectDeltaData");
		List data = this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[] { version });
		Map result = new HashMap(1);
		result.put("Rows", data);
		return result;
	}

	public Map<String, Object> slicedQueryDeltaPerson(SDO params) {
		QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModelByName(getPersonEntity(),
				"slicedSelectDeltaData", params.getProperties());
		return this.serviceUtil.getSQLQuery().executeSlicedQuery(queryModel, params);
	}

	public Boolean isPersonSynToAD(String personId) {
		// ADService adService = new ADServiceImpl();
		// return adService.isUserCreated(personId);
		return true;
	}

	private void updateOrgVersionByPersonId(String personId) {
		String sql = "update sa_oporg set version = seq_id.nextval where person_id = ?";
		this.serviceUtil.getEntityDao().executeUpdate(sql, new Object[] { personId });
	}

	public void updateOperator(SDO params) {
		// ADService adService = new ADServiceImpl();
		updatePerson(params);
		Integer isOperator = (Integer) params.getProperty("isOperator", Integer.class);
		if (isOperator.intValue() == 1) {
			String personId = (String) params.getProperty("id", String.class);
			if (!isPersonSynToAD(personId).booleanValue()) {
				String loginName = (String) params.getProperty("loginName", String.class);

				String sql = "select code, name from sa_opperson where id <> ? and  upper(login_name) = ? and rownum = 1";
				Map map = this.serviceUtil.getEntityDao().queryToMap(sql,
						new Object[] { personId, loginName.toUpperCase() });

				if (map.size() > 0) {
					String personName = (String) ClassHelper.convert(map.get("name"), String.class);
					Util.check(false, "登录名与人员“%s”重复！", new Object[] { personName });
				}
				// try {
				// adService.createUser(personId);
				// updateOrgVersionByPersonId(personId);
				// } catch (NamingException e) {
				// throw new ApplicationException(e.getMessage());
				// }
			}
		}
	}

	public void compareAD(String personId) {
		Util.check(!StringUtil.isBlank(personId), "人员id不能为空。");
		Person person = loadPersonObject(personId);
		Util.check(person != null, "未找到人员id“%s”对应的人员。", new Object[] { personId });

		// ADService adService = new ADServiceImpl();

		// boolean isUserCreated =
		// adService.isUserCreated(personId).booleanValue();
		// Util.check(!isUserCreated, "人员已建立对照关系。");

		String filter = new StringBuilder().append("(&(sAMAccountName=").append(person.getLoginName())
				.append(")(objectClass=user))").toString();
		// UserEntry userEntry = adService.findUser("DC=brc,DC=com,DC=cn",
		// filter);
		// Util.check(userEntry != null, "AD中未找到人员“%s”。", new Object[] {
		// person.getLoginName() });

		String sql = "insert into syn_ad_record(id, kind_id, name, ad_code) values(?,?,?,?)";
		this.serviceUtil.getEntityDao().executeUpdate(sql,
				new Object[] { person.getId(), "psn", person.getName(), person.getLoginName() });

		sql = "update sa_opperson p set p.is_operator = 1, p.version = seq_id.nextval where p.id = ?";
		this.serviceUtil.getEntityDao().executeUpdate(sql, new Object[] { person.getId() });
	}

	public List<Org> queryProjectOrgByPersonId(String personId) {
		String sql = this.serviceUtil.getEntityDao().getSqlByName(getOrgEntity(), "selectProjectOrgByPersonId");
		return this.serviceUtil.getEntityDao().queryToList(sql, Org.class, new Object[] { personId });
	}

	public Org loadCompanyByOrgId(String orgId) {
		String sql = new StringBuilder()
				.append("select *\n  from sa_oporg so\n where so.Org_Kind_Id = 'ogn'\n   and rownum = 1\n start with so.id = '")
				.append(orgId).append("'\n").append("connect by prior so.parent_id = so.id\n")
				.append(" order by FULL_ID desc").toString();

		return (Org) this.serviceUtil.getEntityDao().queryToObject(sql, Org.class, new Object[0]);
	}

	public void saveRtxOrgContrast(SDO params) {
		List details = params.getList("data");
		Util.check(details.size() > 0, "参数data不能为空。");

		List inserted = new ArrayList();
		List updated = new ArrayList();

		List ids = new ArrayList(details.size());
		for (Iterator i$ = details.iterator(); i$.hasNext();) {
			Object item = i$.next();

			Map itemMap = (Map) item;
			itemMap.put("orgId", itemMap.get("id"));
			String rtxDeptFullName = (String) ClassHelper.convert(itemMap.get("rtxDeptFullName"), String.class, "");

			if ((!StringUtil.isBlank(rtxDeptFullName)) && (rtxDeptFullName.length() > 0)) {
				char firstChar = rtxDeptFullName.charAt(0);
				char lastChar = rtxDeptFullName.charAt(rtxDeptFullName.length() - 1);
				Util.check((firstChar == '/') && (lastChar != '/'),
						String.format("RTX组织“%s”格式错误。", new Object[] { rtxDeptFullName }));
			}

			if (((String) ClassHelper.convert(itemMap.get("orgContrastId"), String.class, "")).equals(""))
				inserted.add(itemMap);
			else {
				updated.add(itemMap);
			}

			ids.add(ClassHelper.convert(itemMap.get("id"), String.class));
		}

		if (inserted.size() > 0) {
			this.serviceUtil.getEntityDao().batchInsert(getRTXOrgContrastEntity(), inserted);
		}
		if (updated.size() > 0) {
			this.serviceUtil.getEntityDao().batchUpdate(getRTXOrgContrastEntity(), updated, new String[0]);
		}

		StringBuilder sb = new StringBuilder();
		sb.append(
				"update sa_oporg set version =  seq_id.nextval where id in (select c.id from sa_oporg p, sa_oporg c where c.full_id like p.full_id || '%' and p.id in (");

		for (int i = 0; i < ids.size(); i++) {
			if (i == ids.size() - 1)
				sb.append("?)");
			else {
				sb.append("?,");
			}
		}
		sb.append(")");

		this.serviceUtil.getEntityDao().executeUpdate(sb.toString(), ids.toArray());
	}

	public void deleteRtxOrgContrast(Long[] ids) {
		Util.check(ids.length > 0, "ids参数不能为空。");

		StringBuilder sb = new StringBuilder();
		sb.append(
				"update sa_oporg set version =  seq_id.nextval where id in (select c.id from rtx_org_contrast t, sa_oporg p, sa_oporg c where p.id = t.org_id and c.full_id like p.full_id || '%' and Org_Contrast_Id in (");

		for (int i = 0; i < ids.length; i++) {
			if (i == ids.length - 1)
				sb.append("?)");
			else {
				sb.append("?,");
			}
		}
		sb.append(")");
		this.serviceUtil.getEntityDao().executeUpdate(sb.toString(), ids);

		this.serviceUtil.getEntityDao().deleteByIds(getRTXOrgContrastEntity(), ids);
	}
}
