package com.brc.client.action;

import com.brc.client.action.base.CommonAction;
import com.brc.exception.ApplicationException;
import com.brc.system.share.easysearch.EasySearchDTO;
import com.brc.system.share.easysearch.model.EasySearchMappingModel;
import com.brc.system.share.easysearch.model.QuerySchemeModel;
import com.brc.system.share.service.EasySearchService;
import com.brc.util.ClassHelper;
import com.brc.util.DictUtil;
import com.brc.util.LogHome;
import com.brc.util.SDO;
import com.brc.util.XmlLoadManager;
import java.util.HashMap;
import java.util.Map;
import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;

public class EasySearchAction extends CommonAction {
	private static final String EASY_SEARCH_DATA = "EASY_SEARCH_DATA";
	private XmlLoadManager<EasySearchMappingModel> easySearchManager;
	private EasySearchService easySearchService;

	public void setEasySearchManager(XmlLoadManager<EasySearchMappingModel> easySearchManager) {
		this.easySearchManager = easySearchManager;
	}

	public void setEasySearchService(EasySearchService easySearchService) {
		this.easySearchService = easySearchService;
	}

	private EasySearchDTO getQuerySchemeModel(SDO sdo) throws ApplicationException {
		EasySearchDTO dto = null;
		String configType = (String) sdo.getProperty("configType", String.class);
		String queryName = (String) sdo.getProperty("queryName", String.class);
		try {
			EasySearchMappingModel model = (EasySearchMappingModel) this.easySearchManager.loadConfigFile(configType);
			if (null != model) {
				QuerySchemeModel querySchemeModel = model.getQuerySchemeModel(queryName);
				if (querySchemeModel == null) {
					throw new ApplicationException("未找到名字为" + queryName + "的查询配置！");
				}
				dto = new EasySearchDTO();
				dto.setServletContext(ServletActionContext.getServletContext());
				ClassHelper.copyProperties(querySchemeModel, dto);
				dto.setSdo(sdo);
			} else {
				throw new ApplicationException("未找到类别为" + configType + "的查询配置！");
			}
		} catch (Exception e) {
			throw new ApplicationException(e);
		}
		return dto;
	}

	public String execute() throws Exception {
		SDO sdo = getSDO();
		try {
			EasySearchDTO dto = getQuerySchemeModel(sdo);
			dto.setPageSize((Integer) sdo.getProperty("pageSize", Integer.class));
			dto.setIntPage((Integer) sdo.getProperty("intPage", Integer.class));
			dto.setParams((String) sdo.getProperty("paramValue", String.class));
			dto.setCondition((String) sdo.getProperty("searchQueryCondition", String.class));
			this.easySearchService.search(dto, sdo);
			Map map = new HashMap();
			map.put("intPage", Integer.valueOf(dto.getIntPage()));
			map.put("sumPage", Integer.valueOf(dto.getSumPage()));
			map.put("count", Integer.valueOf(dto.getCount()));
			map.put("headLength", Integer.valueOf(dto.getHeadLength()));
			map.put("width", dto.getWidth());
			map.put("headList", dto.getHeadList());
			map.put("datas", dto.getDatas());
			putAttr("EASY_SEARCH_DATA", map);
			putAttr("isMultipleSelect", sdo.getProperty("isMultipleSelect", Boolean.class));
		} catch (Exception e) {
			putAttr("message", e.getMessage());
			LogHome.getLog(this).error("快捷查询错误;", e);
			return "error";
		}
		return forward("/common/easySearch.jsp");
	}

	public String getComboDialogConfig() throws Exception {
		SDO sdo = getSDO();
		try {
			EasySearchDTO dto = getQuerySchemeModel(sdo);
			sdo.putProperty("kindId", dto.getFolderKindId());
			sdo.putProperty("columns", dto.getHeadList());
			return toResult(sdo);
		} catch (Exception e) {
			return error("选择对话框" + e.getMessage());
		}
	}

	public String comboGridSearch() throws Exception {
		SDO sdo = getSDO();
		try {
			EasySearchDTO dto = getQuerySchemeModel(sdo);
			dto.setParams((String) sdo.getProperty("paramValue", String.class));
			dto.setFolderId((String) sdo.getProperty("folderId", String.class));
			dto.setCondition((String) sdo.getProperty("searchQueryCondition", String.class));
			Map map = this.easySearchService.comboGridSearch(dto, sdo);
			return toResult(map);
		} catch (Exception e) {
			e.printStackTrace();
			return error("选择对话框" + e.getMessage());
		}
	}

	public String dictionary() throws Exception {
		SDO sdo = getSDO();
		String dictionary = (String) sdo.getProperty("dictionary", String.class);
		String filter = (String) sdo.getProperty("filter", String.class);
		Map map = DictUtil.getDictionary(dictionary, filter);
		if ((map == null) || (map.size() == 0)) {
			return error("未找到对应数据字典值!");
		}
		return toResult(map);
	}
}
