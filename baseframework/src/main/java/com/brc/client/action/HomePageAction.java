package com.brc.client.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.brc.client.action.base.CommonAction;
import com.brc.client.service.HomePageService;
import com.brc.system.interfaceType.InfoPromulgateService;
import com.brc.system.interfaceType.PlanTaskQueryService;
import com.brc.system.opm.service.AuthenticationService;
import com.brc.system.remind.service.MessageRemindService;
import com.brc.util.LogHome;
import com.brc.util.SDO;

public class HomePageAction extends CommonAction {
	private static final long serialVersionUID = 1L;
	// private WorkflowService workflowService;
	private AuthenticationService authenticationService;
	private MessageRemindService messageRemindService;
//	private InfoPromulgateService infoPromulgateService;
	private HomePageService homePageService;
//	private PlanTaskQueryService planTaskQueryService;

	// public void setWorkflowService(WorkflowService workflowService)
	// {
	// this.workflowService = workflowService;
	// }

	public void setAuthenticationService(AuthenticationService authenticationService) {
		this.authenticationService = authenticationService;
	}

	public void setMessageRemindService(MessageRemindService messageRemindService) {
		this.messageRemindService = messageRemindService;
	}

//	public void setInfoPromulgateService(InfoPromulgateService infoPromulgateService) {
//		this.infoPromulgateService = infoPromulgateService;
//	}

	public void setHomePageService(HomePageService homePageService) {
		this.homePageService = homePageService;
	}

//	public void setPlanTaskQueryService(PlanTaskQueryService planTaskQueryService) {
//		this.planTaskQueryService = planTaskQueryService;
//	}

	public String execute() throws Exception {
		SDO sdo = getSDO();
		boolean infoPermissions = this.authenticationService.checkPersonFunPermissions(getOperator().getId(),
				"infoPromulgates");
		putAttr("infoPermissions", Boolean.valueOf(infoPermissions));
		List list = new ArrayList();
		SDO queryTask = new SDO();
		queryTask.setProperties(sdo.getProperties());
		queryTask.setOperator(getOperator());
		queryTask.putProperty("toDoTaskKind", "needTiming");
		// Map data = queryTasks(queryTask);
		// List list = (List) data.get("Rows");
		putAttr("needTimingTasks", list);
		putAttr("needTimingTasksCount", 0);

		queryTask = new SDO();
		queryTask.setProperties(sdo.getProperties());
		queryTask.setOperator(getOperator());
		queryTask.putProperty("toDoTaskKind", "notNeedTiming");
		// data = queryTasks(queryTask);
		// list = (List) data.get("Rows");
		
		putAttr("notNeedTimingTasks", list);
		try {
			// list = this.messageRemindService.queryRemindByPersonId(getSDO());
			putAttr("reminds", list);
		} catch (Exception e) {
			LogHome.getLog(this).error(e);
		}

		queryTask = new SDO();
		queryTask.setProperties(sdo.getProperties());
		queryTask.setOperator(getOperator());
		// list = queryTrackingTasks(queryTask);
		 putAttr("trackingTasks", list);

		if (infoPermissions) {
			SDO queryInfo = new SDO();
			queryInfo.setProperties(sdo.getProperties());
			queryInfo.setOperator(getOperator());
			try {
				list = queryInfoPromulgate(queryInfo);
				putAttr("infos", list);
			} catch (Exception e) {
				LogHome.getLog(this).error(e);
			}

		}

		SDO querySDO = new SDO();
		querySDO.setProperties(sdo.getProperties());
		querySDO.setOperator(getOperator());
		querySDO.putProperty("dateRange", Integer.valueOf(4));
		try {
			Map map = queryOATaskPlanByOperator(querySDO);
			putAttr("OATaskPlan", map);
		} catch (Exception e) {
			LogHome.getLog(this).error(e);
		}

		return "HomePage";
	}
	//
	// private Map<String, Object> queryTasks(SDO sdo)
	// {
	// sdo.putProperty("queryCategory", "myTransaction");
	// sdo.putProperty("viewTaskKindList", "1");
	// sdo.putProperty("pagesize", sdo.getProperty("pagesize", String.class,
	// "15"));
	// sdo.putProperty("page", "1");
	// sdo.putProperty("sortname", "startTime");
	// sdo.putProperty("sortorder", "desc");
	// Map data = this.workflowService.queryTasks(sdo);
	// return data;
	// }

	// public String queryTasks()
	// {
	// try
	// {
	// Map data = queryTasks(getSDO());
	// return toResult(data);
	// } catch (Exception e) {
	// e.printStackTrace();
	// return error(e.getMessage());
	// }
	// }

	public String queryOtherSystemTasks() {
		try {
			Map data = this.homePageService.queryOtherSystemTasks(getSDO());
			return toResult(data);
		} catch (Exception e) {
		}
		return toResult("");
	}

	public String queryRemindByPersonId() {
		try {
			List list = this.messageRemindService.queryRemindByPersonId(getSDO());
			return toResult(list);
		} catch (Exception e) {
			e.printStackTrace();
			return error(e.getMessage());
		}
	}

	// private List<?> queryTrackingTasks(SDO sdo)
	// {
	// sdo.putProperty("pagesize", "15");
	// sdo.putProperty("page", "1");
	// sdo.putProperty("sortname", "startTime");
	// sdo.putProperty("sortorder", "desc");
	// Map data = this.workflowService.queryTrackingTasks(sdo);
	// return (List)data.get("Rows");
	// }

	// public String queryTrackingTasks()
	// {
	// try
	// {
	// List list = queryTrackingTasks(getSDO());
	// return toResult(list);
	// } catch (Exception e) {
	// e.printStackTrace();
	// return error(e.getMessage());
	// }
	// }

	private List<?> queryInfoPromulgate(SDO sdo) {
		sdo.putProperty("pagesize", "10");
		sdo.putProperty("page", "1");
		sdo.putProperty("sortname", "");
		sdo.putProperty("sortorder", "");
//		Map data = this.infoPromulgateService.slicedQueryInfoPromulgate(sdo);
//		return (List) data.get("Rows");
		return new ArrayList<Map<String,Object>>();
	}

	public String queryInfoPromulgate() {
		try {
			List list = queryInfoPromulgate(getSDO());
			return toResult(list);
		} catch (Exception e) {
			e.printStackTrace();
			return error(e.getMessage());
		}
	}

	private Map<String, Object> queryOATaskPlanByOperator(SDO sdo) {
//		Map data = this.planTaskQueryService.queryTaskPlanByOperator(sdo);
//		return data;
		return new HashMap<String,Object>();
	}

	public String queryOATaskPlanByOperator() {
		try {
			Map map = queryOATaskPlanByOperator(getSDO());
			return toResult(map);
		} catch (Exception e) {
			return error(e);
		}
	}

	public String forwardPortals() throws Exception {
		SDO sdo = getSDO();

		// SDO queryTask = new SDO();
		// queryTask.setProperties(sdo.getProperties());
		// queryTask.setOperator(getOperator());
		// queryTask.putProperty("toDoTaskKind", "needTiming");
		// queryTask.putProperty("pagesize", "10");
		// Map data = queryTasks(queryTask);
		// List list = (List)data.get("Rows");
		// putAttr("needTimingTasks", list);
		// putAttr("needTimingTasksCount", data.get("Total"));

		// SDO queryInfo = new SDO();
		// queryInfo.setProperties(sdo.getProperties());
		// queryInfo.setOperator(getOperator());
		// try {
		// list = queryInfoPromulgate(queryInfo);
		// putAttr("infos", list);
		// } catch (Exception e) {
		// LogHome.getLog(this).error(e);
		// }
		//
		// queryTask = new SDO();
		// queryTask.setProperties(sdo.getProperties());
		// queryTask.setOperator(getOperator());
		// list = queryTrackingTasks(queryTask);
		// putAttr("trackingTasks", list);

		SDO querySDO = new SDO();
		querySDO.setProperties(sdo.getProperties());
		querySDO.setOperator(getOperator());
		querySDO.putProperty("dateRange", Integer.valueOf(4));
		try {
			Map map = queryOATaskPlanByOperator(querySDO);
			putAttr("OATaskPlan", map);
		} catch (Exception e) {
			LogHome.getLog(this).error(e);
		}

		return forward("/portals/main.jsp");
	}

	public String queryPortalsTask() {
		SDO sdo = getSDO();
		String taskKind = (String) sdo.getProperty("viewTaskKindList", String.class);
		try {
			Map map = new HashMap();
			if (taskKind.equals("tracking")) {
				// map = this.workflowService.queryTrackingTasks(sdo);
			} else {
				if (taskKind.equals("notNeedTiming")) {
					sdo.putProperty("viewTaskKindList", Integer.valueOf(1));
					sdo.putProperty("toDoTaskKind", "notNeedTiming");
				}
				// map = this.workflowService.queryTasks(sdo);
			}
			return toResult(map);
		} catch (Exception e) {
			return error(e);
		}
	}
}
