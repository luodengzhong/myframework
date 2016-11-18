package com.brc.system.opm.action;

import com.brc.client.action.base.CommonAction;
import com.brc.exception.ApplicationException;
import com.brc.model.fn.ExpressManager;
import com.brc.model.fn.impl.OrgFun;
import com.brc.system.ValidStatus;
import com.brc.system.opm.Operator;
import com.brc.system.opm.OrgKind;
import com.brc.system.opm.domain.Org;
import com.brc.system.opm.domain.OrgFunBizManTypeAuthorize;
import com.brc.system.opm.domain.OrgFunBizManTypeAuthorize.OrganKind;
import com.brc.system.opm.service.OrgPropertyService;
import com.brc.system.opm.service.OrgService;
import com.brc.system.util.Util;
import com.brc.util.ClassHelper;
import com.brc.util.SDO;
import com.brc.util.SpringBeanFactory;
import com.brc.util.StringUtil;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.struts2.ServletActionContext;

public class OrgAction extends CommonAction {
	private static final long serialVersionUID = 1L;
	private static final String ORG_PAGE = "Org";
	private static final String ORG_DETAIL_PAGE = "OrgDetail";
	private static final String PERSON_DETAIL_PAGE = "PersonDetail";
	private static final String SELECT_ORG_DIALOG = "SelectOrgDialog";
	private static final String ADJUST_ORG_DIALOG = "ShowAdjustOrganDialog";
	private static final String ORG_FUNCTION_PAGE = "OrgFunction";
	private static final String ORG_FUNCTION_DETAIL_PAGE = "OrgFunctionDetail";
	private static final String SELECT_ORG_FUNCTION_DIALOG = "SelectOrgFunctionDialog";
	private static final String ORG_FUNCTION_AUTHORIZE_PAGE = "OrgFunctionAuthorize";
	private static final String RTX_ORG_CONTRAST_PAGE = "RtxOrgContrast";
	private OrgService orgService;
	private OrgPropertyService orgPropertyService;

	public void setOrgService(OrgService orgService) {
		this.orgService = orgService;
	}

	public void setOrgPropertyService(OrgPropertyService orgPropertyService) {
		this.orgPropertyService = orgPropertyService;
	}

	protected String getPagePath() {
		return "/system/opm/organization/";
	}

	public String forwardOrg() {
		return forward("Org");
	}

	public String forwardOrgAD() {
		return forward("/system/opm/ad/Org.jsp");
	}

	private String getParentPath(String parentId) {
		String parentFullName = "/";
		Org parentOrg = this.orgService.loadOrgObject(parentId);
		if (parentOrg != null) {
			parentFullName = parentOrg.getFullName();
		}
		return parentFullName;
	}

	private String getOrgKindDisplayName(String orgKindId) {
		OrgKind orgKind = OrgKind.valueOf(orgKindId);
		return orgKind.getDisplayName();
	}

	public String showOrgDetail() {
		Map params = getSDO().getProperties();

		String orgKindId = (String) ClassHelper.convert(params.get("orgKindId"), String.class, "");
		String parentId = (String) ClassHelper.convert(params.get("parentId"), String.class, "");
		String nextSequence = this.orgService.getOrgNextSequence(parentId);

		params.put("parentFullName", getParentPath(parentId));
		params.put("orgKindName", getOrgKindDisplayName(orgKindId));
		params.put("sequence", nextSequence);
		params.put("status", Integer.valueOf(ValidStatus.ENABLED.getId()));

		return forward("OrgDetail", params);
	}

	public String insertOrgByTemplate() {
		SDO params = getSDO();
		try {
			params.putProperty("status", Integer.valueOf(ValidStatus.ENABLED.getId()));
			this.orgService.insertOrgByTemplateId(params);
			this.orgPropertyService.batchInsertProperties(params);
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

	public String loadOrg() {
		SDO params = getSDO();
		try {
			String id = (String) params.getProperty("id", String.class);

			Map data = this.orgService.loadOrg(id);

			String parentId = (String) ClassHelper.convert(data.get("parentId"), String.class);
			String orgKindId = (String) ClassHelper.convert(data.get("orgKindId"), String.class);
			data.put("parentFullName", getParentPath(parentId));
			data.put("orgKindName", getOrgKindDisplayName(orgKindId));

			return forward("OrgDetail", data);
		} catch (Exception e) {
			return errorPage(e.getMessage());
		}
	}

	public String insertOrg() {
		SDO params = getSDO();
		try {
			String id = this.orgService.insertOrg(params);
			params.putProperty("id", id);

			this.orgPropertyService.batchInsertProperties(params);
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

	public String updateOrg() {
		SDO params = getSDO();
		try {
			this.orgService.updateOrg(params);
			this.orgPropertyService.batchInsertProperties(params);
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

	public String showAdjustOrgDialog() {
		return forward("ShowAdjustOrganDialog");
	}

	public String adjustOrg() {
		SDO params = getSDO();
		try {
			String sourceOrgId = (String) params.getProperty("sourceOrgId", String.class);
			String destOrgId = (String) params.getProperty("destOrgId", String.class);
			this.orgService.adjustOrg(sourceOrgId, destOrgId);
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

	public String logicDeleteOrg() {
		SDO params = getSDO();
		try {
			String[] ids = params.getStringArray("ids");
			this.orgService.logicDeleteOrg(ids);
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

	public String deleteOrg() {
		SDO params = getSDO();
		try {
			String[] ids = params.getStringArray("ids");
			this.orgService.physicalDeleteOrg(ids, true);
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

	public String enableOrg() {
		SDO params = getSDO();
		try {
			String id = (String) params.getProperty("id", String.class);
			Long version = (Long) params.getProperty("version", Long.class, Integer.valueOf(1));
			this.orgService.enableOrg(id, version, Boolean.valueOf(false));
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

	public String enableSubordinatePsm() {
		SDO params = getSDO();
		try {
			String id = (String) params.getProperty("id", String.class);
			String personId = (String) params.getProperty("personId", String.class);
			if (Util.isEmptyString(personId)) {
				personId = id.substring(0, id.indexOf(64));
			}

			Long version = (Long) params.getProperty("version", Long.class, Integer.valueOf(1));

			this.orgService.enablePerson(personId, version, false);
			this.orgService.enableOrg(id, version, Boolean.valueOf(false));
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

	public String disableOrg() {
		SDO params = getSDO();
		try {
			String id = (String) params.getProperty("id", String.class);
			Long version = (Long) params.getProperty("version", Long.class, Integer.valueOf(1));
			this.orgService.disableOrg(id, version);
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

	public String queryOrgs() {
		try {
			SDO params = getSDO();
			Map data = this.orgService.queryOrgs(params);
			return toResult(data);
		} catch (Exception e) {
			return error(e);
		}
	}

	public String changePersonMainOrg() {
		try {
			SDO params = getSDO();
			String personId = (String) params.getProperty("personId", String.class);
			String personMemberId = (String) params.getProperty("personMemberId", String.class);
			this.orgService.changePersonMainOrg(personId, Long.valueOf(0L), personMemberId, false);
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

	public String slicedQueryOrgs() {
		SDO params = getSDO();
		try {
			Map data = this.orgService.slicedQueryOrgs(params);
			return toResult(data);
		} catch (Exception e) {
			return error(e);
		}
	}

	public String queryPersonMembersByPersonId() {
		SDO params = getSDO();
		try {
			String personId = params.getOperator().getId();
			List data = this.orgService.queryPersonMembersByPersonId(personId);
			return toResult(data);
		} catch (Exception e) {
			return error(e);
		}
	}

	public String updateOrgSequence() {
		try {
			Map m = getSDO().getObjectMap("data");

			Map params = new HashMap(m.size());
			Set<String> set = m.keySet();
			for (String item : set) {
				params.put(ClassHelper.convert(item, String.class), ClassHelper.convert(m.get(item), String.class));
			}

			this.orgService.updateOrgSequence(params);
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

	public String showPersonDetail() {
		Map params = getSDO().getProperties();

		String mainOrgId = (String) ClassHelper.convert(params.get("mainOrgId"), String.class, "");
		params.put("parentFullName", getParentPath(mainOrgId));
		params.put("status", Integer.valueOf(ValidStatus.ENABLED.getId()));

		return forward("PersonDetail", params);
	}

	public String insertPerson() {
		SDO params = getSDO();
		try {
			this.orgService.insertPerson(params);
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

	public String insertPersonMembers() {
		SDO params = getSDO();
		try {
			String[] personIds = params.getStringArray("personIds");
			String orgId = (String) params.getProperty("orgId", String.class);

			this.orgService.insertPersonMembers(personIds, orgId, ValidStatus.ENABLED, Boolean.valueOf(false));
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

	public String insertBizFunctions() {
		SDO params = getSDO();
		try {
			Long[] bizFunctionIds = params.getLongArray("bizFunctionIds");
			String orgId = (String) params.getProperty("orgId", String.class);

			this.orgService.insertBizFunctions(orgId, bizFunctionIds, ValidStatus.ENABLED);
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

	public String updatePerson() {
		SDO params = getSDO();
		try {
			this.orgService.updatePerson(params);
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

	public String updateOperator() {
		SDO params = getSDO();
		try {
			this.orgService.updateOperator(params);
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

	public String compareAD() {
		SDO params = getSDO();
		try {
			String personId = (String) params.getProperty("personId", String.class);
			this.orgService.compareAD(personId);
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

	public String loadPerson() {
		SDO params = getSDO();
		try {
			String id = (String) params.getProperty("id", String.class);
			Map data = this.orgService.loadPerson(id);

			String mainOrgId = (String) ClassHelper.convert(data.get("mainOrgId"), String.class);
			data.put("parentFullName", getParentPath(mainOrgId));

			String picturePath = this.orgService.loadArchivesPictureByPersonId(id);
			putAttr("picturePath", StringUtil.encode(picturePath));

			return forward("PersonDetail", data);
		} catch (Exception e) {
			return errorPage(e.getMessage());
		}
	}

	public String loadPersonAD() {
		SDO params = getSDO();
		try {
			String id = (String) params.getProperty("id", String.class);
			Map data = this.orgService.loadPerson(id);

			String mainOrgId = (String) ClassHelper.convert(data.get("mainOrgId"), String.class);
			data.put("parentFullName", getParentPath(mainOrgId));

			String picturePath = this.orgService.loadArchivesPictureByPersonId(id);
			putAttr("picturePath", StringUtil.encode(picturePath));

			putAttr("isPersonSynToAD", this.orgService.isPersonSynToAD(id));

			return forward("/system/opm/ad/PersonDetail.jsp", data);
		} catch (Exception e) {
			return errorPage(e.getMessage());
		}
	}

	public String showSelectOrgDialog() {
		return forward("SelectOrgDialog", getSDO().getProperties());
	}

	public String forwardOrgFuncExample() {
		return forward("OrgFunExample", getSDO().getProperties());
	}

	public String slicedQueryOrgProperty() {
		try {
			Map map = this.orgPropertyService.slicedQueryOrgProperty(getSDO());
			return toResult(map);
		} catch (Exception e) {
			return error(e);
		}
	}

	public String queryChildProperties() {
		try {
			Map map = this.orgPropertyService.queryChildProperties(getSDO());
			return toResult(map);
		} catch (Exception e) {
			return error(e);
		}
	}

	public String deleteProperties() {
		try {
			Long[] ids = getSDO().getLongArray("ids");
			this.orgPropertyService.deleteProperty(ids);
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

	public String updatePassword() throws Exception {
		SDO sdo = getSDO();
		try {
			String password = (String) sdo.getProperty("newPsw", String.class);
			if (StringUtil.isBlank(password)) {
				throw new ApplicationException("输入密码不能为空。");
			}
			this.orgService.updatePassword(sdo);
			return success("密码修改成功。");
		} catch (Exception e) {
			return error(e);
		}
	}

	public String quoteAuthorizationAndBizManagement() {
		SDO sdo = getSDO();
		try {
			String sourceOrgId = (String) sdo.getProperty("sourceOrgId", String.class);
			String destOrgId = (String) sdo.getProperty("destOrgId", String.class);
			if ((StringUtil.isBlank(sourceOrgId)) || (StringUtil.isBlank(destOrgId))) {
				throw new ApplicationException("被引用或者引用组织为空。");
			}
			this.orgService.quoteAuthorizationAndBizManagement(sourceOrgId, destOrgId);
			return success("您已成功引用权限。");
		} catch (Exception e) {
			return error(e);
		}
	}

	public String testOrgFunc() throws Exception {
		SDO params = getSDO();
		List result = (List) ExpressManager.evaluate((String) params.getProperty("callFunc", String.class, ""));
		return toResult(result);
	}

	public String forwardOrgFunction() {
		putAttr("organKindList", OrgFunBizManTypeAuthorize.OrganKind.getData());
		return forward("OrgFunction");
	}

	public String showOrgFunctionDetail() {
		SDO params = getSDO();
		Long parentId = (Long) params.getProperty("parentId", Long.class);
		Long sequence = this.orgService.getOrgFunctionNextSequence(parentId);
		params.putProperty("sequence", sequence);
		params.putProperty("version", Integer.valueOf(1));

		return forward("OrgFunctionDetail", params);
	}

	public String showSelectOrgFunctionDialog() {
		return forward("SelectOrgFunctionDialog", getSDO().getProperties());
	}

	public String loadOrgFunction() {
		SDO params = getSDO();
		try {
			Long id = (Long) params.getProperty("id", Long.class);
			Map data = this.orgService.loadOrgFunction(id);
			return forward("OrgFunctionDetail", data);
		} catch (Exception e) {
			return errorPage(e);
		}
	}

	public String insertOrgFunction() {
		SDO params = getSDO();
		try {
			Long id = this.orgService.insertOrgFunction(params);
			Map result = new HashMap(1);
			result.put("id", id);
			return success(result);
		} catch (Exception e) {
			return error(e);
		}
	}

	public String updateOrgFunction() {
		SDO params = getSDO();
		try {
			this.orgService.updateOrgFunction(params);
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

	public String deleteOrgFunction() {
		SDO params = getSDO();
		try {
			Long[] ids = params.getLongArray("ids");
			this.orgService.deleteOrgFunction(ids);
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

	public String updateOrgFunctionSequence() {
		SDO params = getSDO();
		try {
			Map OrgFunctions = params.getLongMap("data");
			this.orgService.updateOrgFunctionSequence(OrgFunctions);
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

	public String moveOrgFunction() {
		SDO params = getSDO();
		try {
			Long parentId = (Long) params.getProperty("parentId", Long.class);
			Long[] ids = params.getLongArray("ids");
			this.orgService.moveOrgFunction(ids, parentId);
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

	public String queryOrgFunctions() {
		SDO params = getSDO();
		try {
			Map data = this.orgService.queryOrgFunctions(params);
			return toResult(data);
		} catch (Exception e) {
			return error(e);
		}
	}

	public String slicedQueryOrgFunctions() {
		SDO params = getSDO();
		try {
			Map data = this.orgService.slicedQueryOrgFunctions(params);
			return toResult(data);
		} catch (Exception e) {
			return error(e);
		}
	}

	public String insertOrgFunBizManTypeAuthorize() {
		SDO sdo = getSDO();
		try {
			Long orgFunctionId = (Long) sdo.getProperty("orgFunctionId", Long.class);
			Long[] bizManagementTypeIds = getSDO().getLongArray("bizManagementTypeIds");

			this.orgService.insertOrgFunBizManTypeAuthorize(orgFunctionId, bizManagementTypeIds);
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

	public String updateOrgFunBizManTypeAuthorize() {
		SDO sdo = getSDO();
		try {
			this.orgService.updateOrgFunBizManTypeAuthorize(sdo);
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

	public String deleteOrgFunBizManTypeAuthorize() {
		try {
			Long[] ids = getSDO().getLongArray("ids");
			this.orgService.deleteOrgFunBizManTypeAuthorize(ids);
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

	public String slicedQueryOrgFunBizManTypeAuthorizes() {
		SDO sdo = getSDO();
		try {
			Map data = this.orgService.slicedQueryOrgFunBizManTypeAuthorizes(sdo);
			return toResult(data);
		} catch (Exception e) {
			return error(e);
		}
	}

	public String forwardOrgFunctionAuthorize() {
		return forward("OrgFunctionAuthorize");
	}

	public String saveOrgFunctionAuthorize() {
		SDO sdo = getSDO();
		try {
			String orgId = (String) sdo.getProperty("orgId", String.class);
			Long[] orgFunctionIds = getSDO().getLongArray("orgFunctionIds");

			this.orgService.saveOrgFunctionAuthorize(orgId, orgFunctionIds);
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

	public String deleteOrgFunctionAuthorize() {
		try {
			Long[] ids = getSDO().getLongArray("ids");
			this.orgService.deleteOrgFunctionAuthorize(ids);
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

	public String slicedQueryOrgFunctionAuthorizes() {
		SDO sdo = getSDO();
		try {
			Map data = this.orgService.slicedQueryOrgFunctionAuthorizes(sdo);
			return toResult(data);
		} catch (Exception e) {
			return error(e);
		}
	}

	public String forwardRtxOrgContrast() {
		return forward("/system/opm/rtx/RtxOrgContrast.jsp");
	}

	public String saveRtxOrgContrast() {
		SDO sdo = getSDO();
		try {
			this.orgService.saveRtxOrgContrast(sdo);
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

	public String deleteRtxOrgContrast() {
		try {
			Long[] ids = getSDO().getLongArray("ids");
			this.orgService.deleteRtxOrgContrast(ids);
			return success();
		} catch (Exception e) {
			return error(e);
		}
	}

}
