package com.brc.model.fn.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.brc.exception.ApplicationException;
import com.brc.system.opm.Operator;
import com.brc.system.opm.OpmUtil;
import com.brc.system.opm.OrgUnit;
import com.brc.system.opm.domain.Org;
import com.brc.system.share.service.ServiceUtil;
import com.brc.system.util.CommonUtil;
import com.brc.system.util.Util;
import com.brc.util.Singleton;
import com.brc.util.StringUtil;

public class OrgFun {
	private ServiceUtil serviceUtil;

	public void setServiceUtil(ServiceUtil serviceUtil) {
		this.serviceUtil = serviceUtil;
	}

	public Operator getOperator() {
		return OpmUtil.getBizOperator();
	}

	private String getPDOrganId() {
		return (String) Singleton.getParameter("PDOrganId", String.class);
	}

	private String getPDOrganCode() {
		return (String) Singleton.getParameter("PDOrganCode", String.class);
	}

	private String getHQOrganId() {
		return (String) Singleton.getParameter("HQOrganId", String.class);
	}

	private static List<String> parseOrgParameter(Object org) {
		List result = new ArrayList();
		if (org == null) {
			return result;
		}

		if ((org instanceof String)) {
			if (Util.isNotEmptyString((String) org)) {
				result.add((String) org);
			}
		} else if ((org instanceof List)) {
			List<String> orgList = (List) org;
			for (String item : orgList)
				if (Util.isNotEmptyString(item))
					result.add(item);
		} else {
			result.add(new StringBuilder().append(org).append("").toString());
		}

		return result;
	}

	private String getOrgChildrenCondition(Object org, boolean includeSelf) {
		String result = "";

		List<String> orgList = parseOrgParameter(org);
		for (String item : orgList) {
			if (Util.isNotEmptyString(item)) {
				if (Util.isNotEmptyString(result))
					result = new StringBuilder().append(result).append(" or ").toString();
				String orgCriteria;
				if (Util.isEmptyString(CommonUtil.getExtOfFile(item))) {
					if (includeSelf)
						orgCriteria = new StringBuilder().append("org.full_Id like '%").append(item).append("%'")
								.toString();
					else
						orgCriteria = new StringBuilder().append("((org.full_Id like '%").append(item)
								.append("%') and (org.id <> '").append(item).append("'))").toString();
				} else {
					if (includeSelf)
						orgCriteria = new StringBuilder().append("org.full_Id like '").append(item).append("%'")
								.toString();
					else {
						orgCriteria = new StringBuilder().append("org.full_Id like '").append(item).append("/%'")
								.toString();
					}
				}
				result = new StringBuilder().append(result).append(orgCriteria).toString();
			}
		}

		if (Util.isNotEmptyString(result)) {
			result = new StringBuilder().append("(").append(result).append(")").toString();
		}

		return result;
	}

	public List<String> toFullIds(Object org) {
		List result = new ArrayList();
		List<String> orgList = parseOrgParameter(org);

		if ((orgList == null) || (orgList.isEmpty())) {
			return result;
		}

		List<String> orgIdList = new ArrayList();

		for (String s : orgList) {
			if (Util.isNotEmptyString(s)) {
				if (Util.isEmptyString(CommonUtil.getExtOfFile(s)))
					orgIdList.add(s);
				else {
					result.add(s);
				}
			}
		}

		String condition = "";

		if (!orgIdList.isEmpty()) {
			for (String s : orgIdList) {
				if (Util.isNotEmptyString(condition)) {
					condition = new StringBuilder().append(condition).append(" or ").toString();
				}
				condition = new StringBuilder().append(condition).append("(org.id='").append(s)
						.append("' or org.person_id='").append(s).append("')").toString();
			}
			result.addAll(orgUnitsToOrgFullIds(doFindOrgUnits(condition)));
		}
		return result;
	}

	public List<String> orgUnitsToOrgFullIds(List<OrgUnit> orgUnits) {
		List result = new ArrayList(orgUnits.size());
		for (OrgUnit item : orgUnits) {
			if (Util.isNotEmptyString(item.getFullId())) {
				result.add(item.getFullId());
			}
		}
		return result;
	}

	private List<OrgUnit> doFindOrgUnits(String condition) {
		String sql = "select org.full_id, org.full_name from SA_OPOrg org where org.status = 1 ";

		if (Util.isNotEmptyString(condition)) {
			sql = new StringBuilder().append(sql).append(" and (").append(condition).append(")").toString();
		}

		sql = new StringBuilder().append(sql).append(" order by org.full_sequence").toString();

		return this.serviceUtil.getEntityDao().queryToList(sql, OrgUnit.class, new Object[0]);
	}

	private List<OrgUnit> doFindPersonMember(List<OrgUnit> org) {
		if (org.isEmpty()) {
			return org;
		}

		List result = new ArrayList();
		List orgFullIds = new ArrayList();

		for (OrgUnit unit : org) {
			if (unit.getFullId().endsWith(".psm")) {
				result.add(unit);
			} else if (!orgFullIds.contains(unit.getFullId())) {
				orgFullIds.add(unit.getFullId());
			}

		}

		String orgChildrenCondition = getOrgChildrenCondition(orgFullIds, true);
		if (Util.isNotEmptyString(orgChildrenCondition)) {
			String condition = new StringBuilder().append("(").append(orgChildrenCondition)
					.append(" and (org.org_kind_id = 'psm'))").toString();
			result.addAll(doFindOrgUnits(condition));
		}

		result = distinctOrgUnitsByFullId(result);
		return result;
	}

	public static List<OrgUnit> distinctOrgUnitsByFullId(List<OrgUnit> orgUnit) {
		HashSet orgFullIds = new HashSet();
		List result = new ArrayList();
		for (OrgUnit item : orgUnit) {
			if ((Util.isNotEmptyString(item.getFullId())) && (!orgFullIds.contains(item.getFullId()))) {
				orgFullIds.add(item.getFullId());
				result.add(item);
			}
		}
		return result;
	}

	public List<OrgUnit> findPersonMembers(String orgCode, String centerCode, String deptCode, String positionCode) {
		if (StringUtil.isBlank(deptCode))
			centerCode = deptCode;
		String condition = String.format(
				" org_code = '%s' and center_code = '%s' and dept_code = '%s'  and position_code = '%s' and org_kind_id = 'psm'",
				new Object[] { orgCode, centerCode, deptCode, positionCode });

		return doFindOrgUnits(condition);
	}

	public List<OrgUnit> findCenterManagers(String orgCode, String centerCode, String manageType) {
		String sql = "select full_id from SA_OPOrg where org_code = ? and center_code = ? and org_kind_id = 'dpt' and is_center = 1";

		String orgFullId = this.serviceUtil.getEntityDao().queryToString(sql, new Object[] { orgCode, centerCode });

		if (StringUtil.isBlank(orgFullId)) {
			throw new ApplicationException("执行“findCenterManagers()”出错， 没有找到中心！");
		}

		return findManagers(orgFullId, manageType, false, null);
	}

	public List<OrgUnit> findDeptManagers(String orgCode, String centerCode, String deptCode, String manageType) {
		String sql = "select full_id from sa_oporg where org_code = ? and center_code = ? and dept_code = ? and org_kind_id = 'dpt'";
		if (StringUtil.isBlank(centerCode))
			centerCode = deptCode;

		String orgFullId = this.serviceUtil.getEntityDao().queryToString(sql,
				new Object[] { orgCode, centerCode, deptCode });

		if (StringUtil.isBlank(orgFullId)) {
			throw new ApplicationException("执行“findDeptManagers()”出错， 没有找到部门！");
		}

		return findManagers(orgFullId, manageType, true, null);
	}

	public List<OrgUnit> findManagers(Object org, String manageType, boolean includeAllParent, Object inOrg) {
		List result = new ArrayList();

		String orgChildrenCondition = getOrgChildrenCondition(inOrg, true);
		List<String> orgFullIds = toFullIds(org);

		String condition = null;

		for (String fullId : orgFullIds) {
			if (Util.isNotEmptyString(fullId)) {
				String manageOrgFullIdCriteria;
				if (includeAllParent)
					manageOrgFullIdCriteria = new StringBuilder().append("'").append(fullId)
							.append("' like m.manage_org_full_id || '%'").toString();
				else {
					manageOrgFullIdCriteria = new StringBuilder().append(" m.manage_org_full_id ='").append(fullId)
							.append("'").toString();
				}
				if (Util.isEmptyString(condition))
					condition = manageOrgFullIdCriteria;
				else {
					condition = new StringBuilder().append(condition).append(" or ").append(manageOrgFullIdCriteria)
							.toString();
				}
			}
		}

		if (Util.isEmptyString(condition)) {
			return result;
		}

		condition = new StringBuilder().append("(").append(condition).append(")").toString();

		if (Util.isNotEmptyString(orgChildrenCondition)) {
			condition = new StringBuilder().append(condition).append(" and ").append(orgChildrenCondition).toString();
		}

		if (Util.isNotEmptyString(manageType)) {
			condition = new StringBuilder().append(condition).append(" and b.code='").append(manageType).append("' ")
					.toString();
		}

		StringBuilder sbOrg = new StringBuilder();

		sbOrg.append("select org.full_id, org.full_name");
		sbOrg.append("  from sa_oporg org, sa_opbizmanagement m, sa_opbizmanagementtype a,");
		sbOrg.append("       sa_opbasemanagementtype b");
		sbOrg.append(" where org.full_id = m.org_full_id");
		sbOrg.append("   and org.status = 1");
		sbOrg.append("   and m.kind_id = 2");
		sbOrg.append("   and m.manage_type_id = a.id");
		sbOrg.append("   and b.biz_management_type_id = a.id");
		sbOrg.append(" and (");
		sbOrg.append(new StringBuilder().append(condition).append(")").toString());
		sbOrg.append(" order by org.full_sequence desc");

		List orgUnitsByOrg = this.serviceUtil.getEntityDao().queryToList(sbOrg.toString(), OrgUnit.class,
				new Object[0]);

		result.addAll(orgUnitsByOrg);

		result = distinctOrgUnitsByFullId(result);

		return result;
	}

	public List<OrgUnit> findNearestManagers(Object org, String manageType) {
		List result = new ArrayList();

		List<String> orgFullIds = toFullIds(org);

		String condition = null;

		for (String fullId : orgFullIds) {
			if (Util.isNotEmptyString(fullId)) {
				String manageOrgFullIdCriteria = new StringBuilder().append("'").append(fullId)
						.append("' like m.manage_org_full_id || '%'").toString();
				if (Util.isEmptyString(condition))
					condition = manageOrgFullIdCriteria;
				else {
					condition = new StringBuilder().append(condition).append(" or ").append(manageOrgFullIdCriteria)
							.toString();
				}
			}
		}

		if (Util.isEmptyString(condition)) {
			return result;
		}

		condition = new StringBuilder().append("(").append(condition).append(")").toString();

		if (Util.isNotEmptyString(manageType)) {
			condition = new StringBuilder().append(condition).append(" and b.code='").append(manageType).append("' ")
					.toString();
		}

		StringBuilder sb = new StringBuilder();

		sb.append("select org.full_id, org.full_name, m.manage_org_full_id");
		sb.append("  from sa_oporg org, sa_opbizmanagement m, sa_opbizmanagementtype a,");
		sb.append("       sa_opbasemanagementtype b");
		sb.append(" where org.full_id = m.org_full_id");
		sb.append("   and org.status = 1");
		sb.append("   and m.manage_type_id = a.id");
		sb.append("   and b.biz_management_type_id = a.id");
		sb.append(" and (");
		sb.append(new StringBuilder().append(condition).append(")").toString());
		sb.append(" order by m.manage_org_full_id desc, org.full_sequence");

		List<Map<String, Object>> data = this.serviceUtil.getEntityDao().queryToListMap(sb.toString(), new Object[0]);
		String manageOrgFullId;
		if (data.size() > 0) {
			manageOrgFullId = ((Map) data.get(0)).get("manageOrgFullId").toString();
			for (Map item : data) {
				if (!manageOrgFullId.equalsIgnoreCase(item.get("manageOrgFullId").toString()))
					break;
				OrgUnit orgUnit = new OrgUnit();
				orgUnit.setFullId(item.get("fullId").toString());
				orgUnit.setFullName(item.get("fullName").toString());
				result.add(orgUnit);
			}

		}

		result = distinctOrgUnitsByFullId(result);
		return result;
	}

	public List<OrgUnit> findSubordinations(Object org, String manageType, Object inOrg, Boolean includeAllParent,
			Boolean isPersonMember) {
		List result = new ArrayList();

		List orgFullIds = toFullIds(org);
		if (orgFullIds.isEmpty()) {
			return result;
		}

		String condition = null;
		String orgFullId = null;
		String orgFullIdCriteria = null;
		for (Iterator it = orgFullIds.iterator(); it.hasNext();) {
			orgFullId = (String) it.next();
			if (Util.isNotEmptyString(orgFullId)) {
				if (includeAllParent.booleanValue())
					orgFullIdCriteria = new StringBuilder().append("'").append(orgFullId)
							.append("' like m.org_Full_Id || '%'").toString();
				else {
					orgFullIdCriteria = new StringBuilder().append("m.org_Full_Id = '").append(orgFullId).append("'")
							.toString();
				}
				condition = condition == null ? "" : new StringBuilder().append(condition).append(" or ").toString();
				condition = new StringBuilder().append(condition).append(orgFullIdCriteria).toString();
			}
		}
		if (Util.isEmptyString(condition)) {
			return result;
		}

		condition = new StringBuilder().append("(").append(condition).append(")").toString();

		if (Util.isNotEmptyString(manageType)) {
			condition = new StringBuilder().append(condition).append(" and (").toString();
			String[] mts = manageType.split(",");
			for (String mt : mts) {
				if (Util.isNotEmptyString(mt)) {
					condition = new StringBuilder().append(condition).append(" b.code='").append(mt).append("' or")
							.toString();
				}
			}
			if (condition.endsWith("or")) {
				condition = condition.substring(0, condition.length() - 2);
			}
			condition = new StringBuilder().append(condition).append(")").toString();
		}

		String orgChildrenCondition = getOrgChildrenCondition(inOrg, true);
		if (Util.isNotEmptyString(orgChildrenCondition)) {
			condition = new StringBuilder().append(condition).append(" and ").append(orgChildrenCondition).toString();
		}

		StringBuilder sbOrg = new StringBuilder();
		sbOrg.append("select m.manage_org_full_id full_id, m.manage_org_full_name full_name ");
		sbOrg.append("  from sa_oporg org, sa_opbizmanagement m, sa_opbizmanagementtype a,");
		sbOrg.append("       sa_opbasemanagementtype b");
		sbOrg.append(" where org.full_id = m.org_full_id");
		sbOrg.append("   and org.status = 1");
		sbOrg.append("   and m.manage_type_id = a.id");
		sbOrg.append("   and b.biz_management_type_id = a.id");
		sbOrg.append("   and (");
		sbOrg.append(new StringBuilder().append(condition).append(")").toString());
		sbOrg.append(" order by org.full_sequence");

		List orgUnitsByOrg = this.serviceUtil.getEntityDao().queryToList(sbOrg.toString(), OrgUnit.class,
				new Object[0]);
		if (isPersonMember.booleanValue()) {
			orgUnitsByOrg = doFindPersonMember(orgUnitsByOrg);
		}

		result.addAll(orgUnitsByOrg);

		result = distinctOrgUnitsByFullId(result);
		return result;
	}

	public List<OrgUnit> findSubordinationsByOrgManageType(Object org, String manageType) {
		return findSubordinations(org, manageType, "", Boolean.valueOf(true), Boolean.valueOf(false));
	}

	public static String getOrgId(String orgIdOrFullId) {
		if (Util.isNotEmptyString(orgIdOrFullId)) {
			String orgId = null;
			if (orgIdOrFullId.contains("/"))
				orgId = orgIdOrFullId.substring(orgIdOrFullId.lastIndexOf("/") + 1);
			else {
				orgId = orgIdOrFullId;
			}

			if (orgId.endsWith(".psm")) {
				if (orgId.contains("@")) {
					return orgId.substring(0, orgId.indexOf("@"));
				}
				throw new ApplicationException(new StringBuilder().append(orgIdOrFullId)
						.append("不是合法的id或FullId, 人员成员的id或FulId要求的格式是: person id + @ + position id。").toString());
			}

			if (orgId.endsWith(".pos")) {
				return orgId.substring(0, orgId.length() - ".pos".length());
			}
			if (orgId.endsWith(".dpt")) {
				return orgId.substring(0, orgId.length() - ".dpt".length());
			}
			if (orgId.endsWith(".ogn")) {
				return orgId.substring(0, orgId.length() - ".ogn".length());
			}
			if (orgId.endsWith(".grp")) {
				return orgId.substring(0, orgId.length() - ".grp".length());
			}

			return orgIdOrFullId;
		}

		return orgIdOrFullId;
	}

	private static List<String> toIds(Object org) {
		List result = new ArrayList();
		List<String> orgList = parseOrgParameter(org);
		if ((orgList == null) || (orgList.isEmpty())) {
			return result;
		}

		for (String item : orgList) {
			String orgId = getOrgId(item);
			if (Util.isNotEmptyString(orgId)) {
				result.add(orgId);
			}
		}

		return result;
	}

	public List<OrgUnit> findPersonMembersInOrg(Object org, boolean includeAllChildren) {
		List result = new ArrayList();
		String orgChildrenCondition = "";

		if (includeAllChildren) {
			orgChildrenCondition = getOrgChildrenCondition(org, true);
		} else {
			List<String> orgFullIdList = toIds(org);
			for (String item : orgFullIdList) {
				if (Util.isNotEmptyString(item)) {
					if (Util.isNotEmptyString(orgChildrenCondition)) {
						orgChildrenCondition = new StringBuilder().append(orgChildrenCondition).append(" or ")
								.toString();
					}
					orgChildrenCondition = new StringBuilder().append(orgChildrenCondition).append(" org.parent_id ='")
							.append(item).append("'").toString();
				}
			}
		}

		if (Util.isNotEmptyString(orgChildrenCondition)) {
			orgChildrenCondition = new StringBuilder().append("((").append(orgChildrenCondition)
					.append(") and (org.org_kind_id = 'psm'))").toString();
			result = doFindOrgUnits(orgChildrenCondition);
			result = distinctOrgUnitsByFullId(result);
		}

		return result;
	}

	public Org findOrgByFullId(String fullId) {
		String sql = "select * from SA_OPOrg org where full_id = ? and status = 1";
		return (Org) this.serviceUtil.getEntityDao().queryToObject(sql, Org.class, new Object[] { fullId });
	}

	public Org findOrganByCode(String organCode) {
		if (StringUtil.isBlank(organCode)) {
			throw new ApplicationException("公司编码不能为空。");
		}
		String sql = "select * from SA_OPOrg org where code = ? and status = 1 and org_kind_id = 'ogn'";
		return (Org) this.serviceUtil.getEntityDao().queryToObject(sql, Org.class, new Object[] { organCode });
	}

	public Org findOrgById(String id) {
		String sql = "select * from SA_OPOrg org where id = ? and status = 1";
		return (Org) this.serviceUtil.getEntityDao().queryToObject(sql, Org.class, new Object[] { id });
	}

	public Boolean isHQ(String orgId) {
		return Boolean.valueOf(getHQOrganId().equalsIgnoreCase(orgId));
	}

	public String getOrgProperty(String orgId, String property) {
		StringBuilder sb = new StringBuilder();

		sb.append("select ke.value");
		sb.append("  from sa_oporgproperty t, sys_dictionary_detail k, sys_dictionary_detail ke");
		sb.append(" where t.org_id = ?");
		sb.append("   and t.property_key = k.detail_id");
		sb.append("   and t.property_value = ke.detail_id");
		sb.append("   and k.value = ?");

		return this.serviceUtil.getEntityDao().queryToString(sb.toString(), new Object[] { orgId, property });
	}

	public String getOrgAdminKindById(String organId) {
		return getOrgProperty(organId, "orgAdminKind");
	}

	private static enum TransformOrgKind {
		CURRENT_ORG, BIZ_SEGMENTATION;
	}
}
