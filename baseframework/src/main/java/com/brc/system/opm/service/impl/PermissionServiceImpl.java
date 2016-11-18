package com.brc.system.opm.service.impl;

import com.brc.exception.ApplicationException;
import com.brc.license.License;
import com.brc.license.LicenseUtil;
import com.brc.system.data.EntityParserDao;
import com.brc.system.opm.Operator;
import com.brc.system.opm.OpmUtil;
import com.brc.system.opm.domain.Function;
import com.brc.system.opm.domain.RoleKind;
import com.brc.system.opm.service.PermissionService;
import com.brc.system.share.service.GetPermission;
import com.brc.system.share.service.SQLQuery;
import com.brc.system.share.service.ServiceUtil;
import com.brc.system.util.CommonUtil;
import com.brc.system.util.Util;
import com.brc.util.ClassHelper;
import com.brc.util.QueryModel;
import com.brc.util.SDO;
import com.brc.util.StringUtil;
import com.brc.util.ThreadLocalUtil;
import com.brc.xmlbean.EntityDocument;
import com.brc.xmlbean.EntityDocument.Entity;
import java.io.Serializable;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public class PermissionServiceImpl implements PermissionService {
	private int LICENSE_INDEX = 0;
	private ServiceUtil serviceUtil;
	private GetPermission getPermission;

	public void setServiceUtil(ServiceUtil serviceUtil) {
		this.serviceUtil = serviceUtil;
	}

	public void setGetPermission(GetPermission getPermission) {
		this.getPermission = getPermission;
	}

	private EntityDocument.Entity getPermissionQueryEntity() {
		return this.serviceUtil.getEntity("config/domain/com/brc/system/opm/permission.xml", "permissionQuery");
	}

	private void checkLicense() {
		License license = LicenseUtil.LICENSE;
		Util.check(!license.isExpired(), "License已过期。");
		this.LICENSE_INDEX += 1;
		if (this.LICENSE_INDEX % 300 == 0) {
			String sql = "select count(*) from sa_opfunction";
			int taskCount = this.serviceUtil.getEntityDao().queryToInt(sql, new Object[0]);
			Util.check(taskCount < license.getTaskCount(), "功能数超过最大限制。");
			Util.check(license.getVersion() == 3, "您使用的是测试版。");
		}
		if (this.LICENSE_INDEX == 1000000)
			this.LICENSE_INDEX = 0;
	}

	private void checkFunctionExist(SDO params) {
		Long parentId = (Long) params.getProperty("parentId", Long.class);
		Long id = (Long) params.getProperty("id", Long.class, Long.valueOf(0L));
		String code = (String) params.getProperty("code", String.class);
		String name = (String) params.getProperty("name", String.class);
		String sql = "select code, name from SA_OPFunction where id <> ?  and upper(code) = ?";
		Map data = this.serviceUtil.getEntityDao().queryToMap(sql, new Object[] { id, code.toUpperCase() });
		if (data.size() > 0) {
			String dbCode = (String) ClassHelper.convert(data.get("code"), String.class, "");
			Util.check(!code.equalsIgnoreCase(dbCode), "功能编码“%s”重复！", new Object[] { code });
		}
		sql = "select code, name from SA_OPFunction where parent_id  = :parentId and id <> :id  and upper(name) = :name";
		data = this.serviceUtil.getEntityDao().queryToMap(sql, new Object[] { parentId, id, name.toUpperCase() });
		if (data.size() > 0) {
			String dbName = (String) ClassHelper.convert(data.get("name"), String.class, "");
			Util.check(!name.equalsIgnoreCase(dbName), "同级功能名称“%s”重复！", new Object[] { name });
		}
	}

	private void bulidFunctionFullName(SDO params) {
		Long parentId = (Long) params.getProperty("parentId", Long.class);
		String name = (String) params.getProperty("name", String.class);
		Function parentFunction = loadFunctionObject(parentId);
		String fullName = null;
		if (parentFunction == null)
			fullName = "";
		else
			fullName = OpmUtil.createFileFullName(
					parentFunction.getId().longValue() == 1L ? "" : parentFunction.getFullName(), name, "");
		params.putProperty("fullName", fullName);
	}

	public Long insertFunction(SDO params) {
		checkFunctionExist(params);

		bulidFunctionFullName(params);

		return (Long) this.serviceUtil.getEntityDao().insert(
				this.serviceUtil.getEntity("config/domain/com/brc/system/opm/permission.xml", "function"),
				params.getProperties());
	}

	public void updateFunction(SDO params) {
		checkFunctionExist(params);

		bulidFunctionFullName(params);

		this.serviceUtil.getEntityDao().update(
				this.serviceUtil.getEntity("config/domain/com/brc/system/opm/permission.xml", "function"),
				params.getProperties(), new String[0]);
	}

	public void deleteFunction(Long[] ids) {
		String selectFunctionSql = "select name from SA_OPFunction where id = ?";
		String selectFunctionChildrenSql = "select  code, name from SA_OPFunction where parent_id = ?";
		String selectRoleRefSql = "select r.code, r.name from SA_OPRole r, SA_OPPermission p where r.id = p.role_id and p.function_id = ? and rownum = 1";
		String selectFunctionFieldGroupSql = "SELECT * FROM sa_opfunction_field_group t where t.function_id=? and rownum = 1";

		Map data = null;
		String functionName = null;
		String roleName = null;
		for (Long id : ids) {
			data = this.serviceUtil.getEntityDao().queryToMap(selectFunctionSql, new Object[] { id });
			if (data.size() > 0) {
				functionName = (String) ClassHelper.convert(data.get("name"), String.class, "");

				data = this.serviceUtil.getEntityDao().queryToMap(selectFunctionChildrenSql, new Object[] { id });
				Util.check(data.size() == 0, "功能名称“%s”已创建子功能，不能删除！", new Object[] { functionName });

				data = this.serviceUtil.getEntityDao().queryToMap(selectRoleRefSql, new Object[] { id });
				if (data.size() > 0) {
					roleName = (String) ClassHelper.convert(data.get("name"), String.class, "");
					Util.check(Util.isEmptyString(roleName), "功能名称“%s”已被角色“%s”使用，不能删除！",
							new Object[] { functionName, roleName });
				}

				data = this.serviceUtil.getEntityDao().queryToMap(selectFunctionFieldGroupSql, new Object[] { id });
				if (data.size() > 0) {
					roleName = (String) ClassHelper.convert(data.get("name"), String.class, "");
					Util.check(Util.isEmptyString(roleName), "功能名称“%s”存在字段权限，不能删除！",
							new Object[] { functionName, roleName });
				}
			}
		}
		this.serviceUtil.getEntityDao().deleteByIds(
				this.serviceUtil.getEntity("config/domain/com/brc/system/opm/permission.xml", "function"), ids);
	}

	public void addOftenUse(Long[] ids) {
		String sql = this.serviceUtil.getEntityDao().getSqlByName(
				this.serviceUtil.getEntity("config/domain/com/brc/system/opm/permission.xml", "oftenUseFunction"),
				"checkCountSql");
		for (Long id : ids) {
			int count = this.serviceUtil.getEntityDao().queryToInt(sql, new Object[] { id });
			if (count == 0) {
				Map map = new HashMap();
				map.put("functionId", id);
				map.put("sequence", Integer.valueOf(0));
				this.serviceUtil.getEntityDao().insert(this.serviceUtil
						.getEntity("config/domain/com/brc/system/opm/permission.xml", "oftenUseFunction"), map);
			}
		}
	}

	public Map<String, Object> slicedQueryOftenUse(SDO params) {
		QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModel(
				this.serviceUtil.getEntity("config/domain/com/brc/system/opm/permission.xml", "oftenUseFunction"),
				params.getProperties());
		Map data = this.serviceUtil.getSQLQuery().executeSlicedQuery(queryModel, params);
		return data;
	}

	public void deleteOftenUse(Long[] ids) {
		for (Long id : ids)
			this.serviceUtil.getEntityDao().deleteById(
					this.serviceUtil.getEntity("config/domain/com/brc/system/opm/permission.xml", "oftenUseFunction"),
					id);
	}

	public void updateOftenUseSequence(Map<Long, Long> params) {
		this.serviceUtil.updateSequence("config/domain/com/brc/system/opm/permission.xml", "oftenUseFunction",
				"OFTEN_USE_FUNCTION_ID", params);
	}

	public void moveFunction(Long[] ids, Long parentId) {
		String sql = String.format("update %s set parent_Id = ? where id = ?", new Object[] {
				this.serviceUtil.getEntityTableName("config/domain/com/brc/system/opm/permission.xml", "function") });

		List params = new ArrayList();
		for (Long id : ids) {
			params.add(new Object[] { parentId, id });
		}

		this.serviceUtil.getEntityDao().batchUpdate(sql, params);
	}

	public Long getFunctionNextSequence(Long parentId) {
		return this.serviceUtil.getNextSequence("config/domain/com/brc/system/opm/permission.xml", "function",
				"parent_id", parentId);
	}

	public void updateFunctionSequence(Map<Long, Long> params) {
		this.serviceUtil.updateSequence("config/domain/com/brc/system/opm/permission.xml", "function", params);
	}

	public Map<String, Object> loadFunction(Long id) {
		Map data = this.serviceUtil.getEntityDao().loadById(
				this.serviceUtil.getEntity("config/domain/com/brc/system/opm/permission.xml", "function"), id);
		return data;
	}

	public Function loadFunctionObject(Long id) {
		String sql = this.serviceUtil.getEntityDao().getSqlByName(
				this.serviceUtil.getEntity("config/domain/com/brc/system/opm/permission.xml", "function"),
				"selectFunctionById");
		return (Function) this.serviceUtil.getEntityDao().queryToObject(sql, Function.class, new Object[] { id });
	}

	public Map<String, Object> queryFunctions(SDO params) {
		boolean customDefineRoot = "1"
				.equalsIgnoreCase((String) params.getProperty("customDefineRoot", String.class, "0"));

		if (customDefineRoot)
			params.removeProperty("parentId");
		else {
			params.removeProperty("id");
		}

		QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModel(
				this.serviceUtil.getEntity("config/domain/com/brc/system/opm/permission.xml", "function"),
				params.getProperties());
		Map data = this.serviceUtil.getSQLQuery().executeQuery(queryModel, params);
		return data;
	}

	public Map<String, Object> slicedQueryFunctions(SDO params) {
		QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModel(
				this.serviceUtil.getEntity("config/domain/com/brc/system/opm/permission.xml", "function"),
				params.getProperties());
		Map data = this.serviceUtil.getSQLQuery().executeSlicedQuery(queryModel, params);
		return data;
	}

	private void checkRoleExist(SDO params) {
		Long folderId = (Long) params.getProperty("folderId", Long.class);
		Long id = (Long) params.getProperty("id", Long.class, new Long(0L));
		String code = (String) params.getProperty("code", String.class);
		String name = (String) params.getProperty("name", String.class);

		String sql = "select code name from SA_OPRole where folder_id = :folderId and id <> :id and (code = :code or name = :name)";
		Map sqlParams = new HashMap(4);
		sqlParams.put("folderId", folderId);
		sqlParams.put("id", id);
		sqlParams.put("code", code);
		sqlParams.put("name", name);
		Map data = this.serviceUtil.getEntityDao().queryToMapByMapParam(sql, sqlParams);

		if (data.size() > 0) {
			String dbCode = (String) ClassHelper.convert(data.get("code"), String.class, "");
			String dbName = (String) ClassHelper.convert(data.get("name"), String.class, "");
			Util.check(!code.equalsIgnoreCase(dbCode), "同级角色编码“%s”重复！", new Object[] { code });
			Util.check(!name.equalsIgnoreCase(dbName), "同级角色名称“%s”重复！", new Object[] { name });
		}
	}

	public Long insertRole(SDO params) {
		checkRoleExist(params);
		return (Long) this.serviceUtil.getEntityDao().insert(
				this.serviceUtil.getEntity("config/domain/com/brc/system/opm/permission.xml", "role"),
				params.getProperties());
	}

	public void updateRole(SDO params) {
		checkRoleExist(params);
		this.serviceUtil.getEntityDao().update(
				this.serviceUtil.getEntity("config/domain/com/brc/system/opm/permission.xml", "role"),
				params.getProperties(), new String[0]);
	}

	public void deleteRole(Long[] ids) {
		String selectRoleSql = "select name from SA_OPRole where id = ?";
		String selectRoleRefSql = "select f.code, f.name from SA_OPFunction f, SA_OPPermission P where f.id = p.function_id and p.role_id = ? and rownum = 1";
		String selectParentRoleSql = "select r.code, r.name from SA_OPParentrole rp, SA_OProle r where rp.role_id = r.id and rp.parent_role_id = ? and rownum = 1";
		String selectRoleRemidSql = "select r.code, r.name from sa_opremind t, sys_message_remind r where t.remind_id = r.remind_id and t.role_id= ? and rownum =1";

		Map data = null;
		String functionName = null;
		String roleName = null;
		for (Long id : ids) {
			data = this.serviceUtil.getEntityDao().queryToMap(selectRoleSql, new Object[] { id });
			if (data.size() > 0) {
				roleName = (String) ClassHelper.convert(data.get("name"), String.class, "");

				data = this.serviceUtil.getEntityDao().queryToMap(selectParentRoleSql, new Object[] { id });
				if (data.size() > 0) {
					String childRoleName = (String) ClassHelper.convert(data.get("name"), String.class, "");
					Util.check(Util.isEmptyString(roleName), "角色名称“%s”已为“%s”父角色，不能删除！",
							new Object[] { roleName, childRoleName });
				}

				data = this.serviceUtil.getEntityDao().queryToMap(selectRoleRefSql, new Object[] { id });
				if (data.size() > 0) {
					roleName = (String) ClassHelper.convert(data.get("name"), String.class, "");
					Util.check(Util.isEmptyString(roleName), "角色名称“%s”已分配了功能“%s”，不能删除！",
							new Object[] { roleName, functionName });
				}

				data = this.serviceUtil.getEntityDao().queryToMap(selectRoleRemidSql, new Object[] { id });
				if (data.size() > 0) {
					roleName = (String) ClassHelper.convert(data.get("name"), String.class, "");
					Util.check(Util.isEmptyString(roleName), "角色名称“%s”已分配了提醒“%s”，不能删除！",
							new Object[] { roleName, functionName });
				}
			}

		}

		Map params = new HashMap(1);
		// 以下代码应该是没有再用了
/*		for (Long id : ids) {
			params.put("roleId", id);
			this.serviceUtil.getEntityDao().deleteByCondition(
					this.serviceUtil.getEntity("config/domain/com/brc/system/opm/permission.xml", "parentRole"),
					params);
		}*/
		this.serviceUtil.getEntityDao().deleteByIds(
				this.serviceUtil.getEntity("config/domain/com/brc/system/opm/permission.xml", "role"),
				(Serializable[]) ids);
	}

	public Long getRoleNextSequence(Long folderId) {
		return this.serviceUtil.getNextSequence("config/domain/com/brc/system/opm/permission.xml", "role", "folder_id",
				folderId);
	}

	public void updateRoleSequence(Map<Long, Long> params) {
		this.serviceUtil.updateSequence("config/domain/com/brc/system/opm/permission.xml", "role", params);
	}

	public void moveRole(Long[] ids, Long folderId) throws SQLException {
		String sql = String.format("update %s set folder_Id = ? where id = ?", new Object[] {
				this.serviceUtil.getEntityTableName("config/domain/com/brc/system/opm/permission.xml", "role") });

		List params = new ArrayList();
		for (Long id : ids) {
			params.add(new Object[] { folderId, id });
		}
		this.serviceUtil.getEntityDao().batchUpdate(sql, params);
	}

	public Map<String, Object> getRoleDescendant(Long id, boolean isIncludeAllDescendant, boolean isIncludeSelf,
			boolean IsExcludeDisabled) {
		return null;
	}

	public Map<String, Object> getRoleAncestor(Long id, boolean isIncludeAllAncestor, boolean isIncludeSelf,
			Boolean IsExcludeDisabled) {
		return null;
	}

	public Map<String, Object> loadRole(Long id) {
		return this.serviceUtil.getEntityDao()
				.loadById(this.serviceUtil.getEntity("config/domain/com/brc/system/opm/permission.xml", "role"), id);
	}

	public Map<String, Object> slicedQueryRoles(SDO params) {
		QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModel(
				this.serviceUtil.getEntity("config/domain/com/brc/system/opm/permission.xml", "role"),
				params.getProperties());
		Map data = this.serviceUtil.getSQLQuery().executeSlicedQuery(queryModel, params);
		return data;
	}

	public Map<String, Object> queryRoleKinds(SDO params) {
		Long parentId = (Long) params.getProperty("parentId", Long.class, Long.valueOf(0L));

		Operator operator = (Operator) ThreadLocalUtil.getVariable("operator", Operator.class);
		List psmFullIds = operator.getPersonMemberFullIds();

		StringBuilder sb = new StringBuilder();
		List data;
		if (parentId.longValue() == 0L) {
			Object[] queryParams = new Object[psmFullIds.size()];
			sb.append("select t.*, 0 isexpand, (");
			sb.append("select count(0)");
			sb.append("  from sys_commontree c, SA_OPOrgRoleAuthorize orgRoleAuthorize, SA_OpOrg o");
			sb.append(" where c.parent_id = t.id");
			sb.append("   and c.id = orgRoleAuthorize.Role_Kind_Id");
			sb.append("   and orgRoleAuthorize.Org_Id = o.id");
			sb.append(" and (");
			for (int i = 0; i < psmFullIds.size(); i++) {
				if (i == 0)
					sb.append(" ? like o.full_id|| '%' ");
				else {
					sb.append(" or ? like o.full_id|| '%' ");
				}
				queryParams[i] = psmFullIds.get(i);
			}
			sb.append(")");

			sb.append(" )as has_children ");
			sb.append("  from sys_commontree t");
			sb.append(" where t.parent_id = 0 and kind_id = 4");
			data = this.serviceUtil.getEntityDao().queryToListMap(sb.toString(), queryParams);
		} else {
			Object[] queryParams = new Object[psmFullIds.size() * 2 + 1];

			sb = new StringBuilder();
			sb.append("select t.*, 0 isexpand, (");
			sb.append("select count(0)");
			sb.append("  from sys_commontree c, SA_OPOrgRoleAuthorize orgRoleAuthorize, SA_OpOrg o");
			sb.append(" where c.parent_id = t.id");
			sb.append("   and c.id = orgRoleAuthorize.Role_Kind_Id");
			sb.append("   and orgRoleAuthorize.Org_Id = o.id");
			sb.append(" and (");
			for (int i = 0; i < psmFullIds.size(); i++) {
				if (i == 0)
					sb.append(" ? like o.full_id|| '%' ");
				else {
					sb.append(" or ? like o.full_id|| '%' ");
				}
				queryParams[i] = psmFullIds.get(i);
			}
			sb.append(")");
			sb.append(" )as has_children ");

			sb.append("  from sys_commontree t");
			sb.append(" where t.parent_id = ? and kind_id = 4");
			sb.append("   and exists");
			sb.append(" (select 1");
			sb.append("          from SA_OPOrgRoleAuthorize orgRoleAuthorize, sys_commontree i, SA_OpOrg o");
			sb.append("         where orgRoleAuthorize.role_kind_Id = i.id");
			sb.append("           and orgRoleAuthorize.org_Id = o.id");
			sb.append(" and (");

			int size = psmFullIds.size();

			queryParams[(size++)] = parentId;

			for (int i = 0; i < psmFullIds.size(); i++) {
				if (i == 0)
					sb.append(" ? like o.full_id|| '%' ");
				else {
					sb.append(" or ? like o.full_id|| '%' ");
				}
				queryParams[(size + i)] = psmFullIds.get(i);
			}
			sb.append(")");

			sb.append("           and t.full_id like i.full_id || '%')");

			data = this.serviceUtil.getEntityDao().queryToListMap(sb.toString(), queryParams);
		}
		Map result = new HashMap(1);
		result.put("Rows", data);
		return result;
	}

	public List<Map<String, Object>> queryFunctionsForAssign(SDO params) {
		Long parentId = (Long) params.getProperty("parentId", Long.class);
		String sql = this.serviceUtil.getEntityDao().getSqlByName(
				this.serviceUtil.getEntity("config/domain/com/brc/system/opm/permission.xml", "function"),
				"queryFunctionsForAssign");
		return this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[] { parentId });
	}

	public void assignFunPermission(List<Object> functionIds, Long roleId, Long parentId) {
		if ((roleId == null) || (parentId == null)) {
			throw new ApplicationException("roleId或 parentId不能为空。");
		}
		String sql = this.serviceUtil.getEntityDao().getSqlByName(
				this.serviceUtil.getEntity("config/domain/com/brc/system/opm/permission.xml", "permission"),
				"deletePermissionByRoleAndParentFunction");

		this.serviceUtil.getEntityDao().executeUpdate(sql, new Object[] { roleId, parentId });
		List list = new ArrayList(functionIds.size() + 1);
		for (Iterator i$ = functionIds.iterator(); i$.hasNext();) {
			Object obj = i$.next();
			Map fun = (Map) obj;
			Map item = new HashMap(3);
			item.put("roleId", roleId);
			item.put("functionId", fun.get("functionId"));
			item.put("permissionKind", fun.get("permissionKind"));
			list.add(item);
		}
		if (list.size() > 0) {
			Map item = new HashMap(6);
			item.put("roleId", roleId);
			item.put("functionId", parentId);
			item.put("permissionKind", "fun");

			OpmUtil.fillCreatorInfo(item);

			list.add(item);
			this.serviceUtil.getEntityDao().batchInsert(
					this.serviceUtil.getEntity("config/domain/com/brc/system/opm/permission.xml", "permission"), list);
		}

		this.getPermission.removeCacheByKind("PermissionFieldByFunction");
	}

	public void deletePermission(SDO sdo) {
		Long roleId = (Long) sdo.getProperty("roleId", Long.class);
		Long[] funcIds = sdo.getLongArray("funcIds");

		String sql = this.serviceUtil.getEntityDao().getSqlByName(
				this.serviceUtil.getEntity("config/domain/com/brc/system/opm/permission.xml", "permission"),
				"deletePermissionByRoleAndParentFunction");

		for (Long funcId : funcIds) {
			this.serviceUtil.getEntityDao().executeUpdate(sql, new Object[] { roleId, funcId });
		}

		this.getPermission.removeCacheByKind("PermissionFieldByFunction");
	}

	public List<Map<String, Object>> queryPermissionsForAssignByRoleId(SDO params) {
		Long parentId = (Long) params.getProperty("parentId", Long.class);
		Long roleId = (Long) params.getProperty("roleId", Long.class);
		String sql = this.serviceUtil.getEntityDao().getSqlByName(
				this.serviceUtil.getEntity("config/domain/com/brc/system/opm/permission.xml", "permission"),
				"queryFunctionsForAssign");
		return this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[] { roleId, parentId });
	}

	public Map<String, Object> queryPermissionsByRoleId(SDO params) {
		String roleKindId = (String) ClassHelper.convert(params.getProperty("roleKindId"), String.class,
				RoleKind.FUN.getId());
		QueryModel queryModel = null;
		if (RoleKind.FUN.isSpecifiedKind(roleKindId))
			queryModel = this.serviceUtil.getEntityDao().getQueryModel(
					this.serviceUtil.getEntity("config/domain/com/brc/system/opm/permission.xml", "permission"),
					params.getProperties());
		else if (RoleKind.REMIND.isSpecifiedKind(roleKindId)) {
			queryModel = this.serviceUtil.getEntityDao().getQueryModel(
					this.serviceUtil.getEntity("config/domain/com/brc/system/opm/permission.xml", "opremind"),
					params.getProperties());
		}
		Map data = this.serviceUtil.getSQLQuery().executeSlicedQuery(queryModel, params);
		return data;
	}

	public void saveRoleRemind(SDO sdo) {
		Long roleId = (Long) sdo.getProperty("roleId", Long.class);
		Long[] remindIds = sdo.getLongArray("remindIds");
		if (roleId == null) {
			return;
		}
		String checkSql = "select count(0) from sa_opremind t where t.role_id=? and t.remind_id=?";
		List list = new ArrayList(remindIds.length);
		int count = 0;
		for (Long remindId : remindIds) {
			count = this.serviceUtil.getEntityDao().queryToInt(checkSql, new Object[] { roleId, remindId });
			if (count == 0) {
				Map map = new HashMap(2);
				map.put("roleId", roleId);
				map.put("remindId", remindId);
				list.add(map);
			}
		}
		if (list.size() > 0)
			this.serviceUtil.getEntityDao().batchInsert(
					this.serviceUtil.getEntity("config/domain/com/brc/system/opm/permission.xml", "opremind"), list);
	}

	public void deleteRoleRemind(Long[] ids) {
		this.serviceUtil.getEntityDao().deleteByIds(
				this.serviceUtil.getEntity("config/domain/com/brc/system/opm/permission.xml", "opremind"), ids);
	}

	public List<Map<String, Object>> loadRootFunction() {
		String sql = "select t.id, t.name, t.code from sa_opfunction t where t.parent_id = 1 order by t.sequence asc";
		return this.serviceUtil.getEntityDao().queryToListMap(sql, new Object[0]);
	}

	private Map<String, Object> internalQueryForPermission(String sqlName, Object[] params) {
		String sql = this.serviceUtil.getEntityDao().getSqlByName(getPermissionQueryEntity(), sqlName);
		List data = this.serviceUtil.getEntityDao().queryToListMap(sql, params);
		Map result = new HashMap(1);
		result.put("Rows", data);
		return result;
	}

	public Map<String, Object> queryRolesByFunctionId(Long functionId) {
		return internalQueryForPermission("selectRolesByFunctionIdSql", new Object[] { functionId });
	}

	public Map<String, Object> queryRolesByOrgFullId(String orgFullId) {
		return internalQueryForPermission("selectRolesByOrgFullIdSql", new Object[] { orgFullId });
	}

	public Map<String, Object> queryOrgsByFunctionId(Long roleId, Long functionId, String inOrgId, String filter) {
		String sql = this.serviceUtil.getEntityDao().getSqlByName(getPermissionQueryEntity(),
				"selectOrgsByFunctionIdSql");
		List params = new ArrayList(4);
		String roleCondition;
		if (roleId.longValue() == 0L) {
			roleCondition = "";
		} else {
			roleCondition = " and r.id = ?";
			params.add(roleId);
		}

		params.add(functionId);

		StringBuilder sb = new StringBuilder();
		if (!StringUtil.isBlank(inOrgId)) {
			String[] splits = inOrgId.split(",");
			int i = 0;
			int len = splits.length;
			sb = new StringBuilder();
			if (len > 0) {
				sb.append(" and exists ( select 1 from sa_oporg i where i.id in (");
				for (; i < len; i++) {
					if (i == 0)
						sb.append("?");
					else {
						sb.append(",?");
					}
					params.add(splits[i]);
				}
				sb.append(") and o.full_id like i.full_id || '%')");
			}
		}
		String fullNameCondition;
		if (StringUtil.isBlank(filter)) {
			fullNameCondition = "";
		} else {
			fullNameCondition = " and o.full_name like ?";
			params.add(String.format("%%%s%%", new Object[] { filter }));
		}

		sql = String.format(sql, new Object[] { roleCondition, sb.toString(), fullNameCondition });

		List data = this.serviceUtil.getEntityDao().queryToListMap(sql, params.toArray());

		Map result = new HashMap(1);
		result.put("Rows", data);
		return result;
	}

	public Map<String, Object> queryFunctionsByOrgFullId(Long roleId, String orgFullId, String inOrgId, Long functionId,
			String filter) {
		String sql = this.serviceUtil.getEntityDao().getSqlByName(getPermissionQueryEntity(),
				"selectFunctionsByOrgFullIdSql");

		List params = new ArrayList(4);
		String roleCondition;
		if (roleId.longValue() == 0L) {
			roleCondition = "";
		} else {
			roleCondition = " and r.id = ?";
			params.add(roleId);
		}

		params.add(orgFullId);

		StringBuilder sb = new StringBuilder();
		if (!StringUtil.isBlank(inOrgId)) {
			String[] splits = inOrgId.split(",");
			int i = 0;
			int len = splits.length;
			sb = new StringBuilder();
			if (len > 0) {
				sb.append(" and exists ( select 1 from sa_oporg i where i.id in (");
				for (; i < len; i++) {
					if (i == 0)
						sb.append("?");
					else {
						sb.append(",?");
					}
					params.add(splits[i]);
				}
				sb.append(") and o.full_id like i.full_id || '%')");
			}
		}

		if (!CommonUtil.isLongNull(functionId)) {
			sb.append(" and f.full_name like (select full_name || '%' from sa_opfunction fun where fun.id = ?) ");
			params.add(functionId);
		}
		String fullNameCondition;
		if (StringUtil.isBlank(filter)) {
			fullNameCondition = "";
		} else {
			fullNameCondition = " and f.full_name like ?";
			params.add(String.format("%%%s%%", new Object[] { filter }));
		}

		sql = String.format(sql, new Object[] { roleCondition, sb.toString(), fullNameCondition });

		List data = this.serviceUtil.getEntityDao().queryToListMap(sql, params.toArray());

		Map result = new HashMap(1);
		result.put("Rows", data);
		return result;
	}

	public Map<String, Object> queryRoles(SDO params) {
		QueryModel queryModel = this.serviceUtil.getEntityDao().getQueryModelByName(getPermissionQueryEntity(),
				"selectRoleSql", params.getProperties());
		return this.serviceUtil.getSQLQuery().executeQuery(queryModel, params);
	}

	public Map<String, Object> queryOrgsByRoleId(Long roleId, String inOrgId) {
		return internalQueryForPermission("selectOrgsByRoleIdSql", new Object[] { roleId });
	}

	public Map<String, Object> queryFunctionsByRoleId(Long roleId, String inFunctionFullId) {
		return internalQueryForPermission("selectFunctionsByRoleIdSql", new Object[] { roleId });
	}
}
