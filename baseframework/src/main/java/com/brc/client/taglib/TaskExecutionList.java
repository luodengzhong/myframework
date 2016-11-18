package com.brc.client.taglib;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.components.UIBean;
import org.apache.struts2.views.annotations.StrutsTag;
import org.apache.struts2.views.annotations.StrutsTagAttribute;

import com.brc.system.opm.Operator;
import com.brc.util.ClassHelper;
import com.brc.util.SpringBeanFactory;
import com.brc.util.StringUtil;
import com.opensymphony.xwork2.util.ValueStack;

@StrutsTag(name = "TaskExecutionList", tldTagClass = "com.brc.client.taglib.TaskExecutionList", description = "TaskExecutionList")
public class TaskExecutionList extends UIBean {
	private String procUnitId;
	private String bizId;
	private String proportion;
	private String average;
	private String defaultUnitId;
	private String hasResult;
	private String taskId;

	@StrutsTagAttribute(description = "procUnitId", type = "String")
	public void setProcUnitId(String procUnitId) {
		this.procUnitId = procUnitId;
	}

	@StrutsTagAttribute(description = "bizId", type = "String")
	public void setBizId(String bizId) {
		this.bizId = bizId;
	}

	@StrutsTagAttribute(description = "proportion", type = "String")
	public void setProportion(String proportion) {
		this.proportion = proportion;
	}

	@StrutsTagAttribute(description = "average", type = "String")
	public void setAverage(String average) {
		this.average = average;
	}

	@StrutsTagAttribute(description = "defaultUnitId", type = "String")
	public void setDefaultUnitId(String defaultUnitId) {
		this.defaultUnitId = defaultUnitId;
	}

	@StrutsTagAttribute(description = "hasResult", type = "Boolean", defaultValue = "true")
	public void setHasResult(String hasResult) {
		this.hasResult = hasResult;
	}

	@StrutsTagAttribute(description = "taskId", type = "String")
	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	public TaskExecutionList(ValueStack vs, HttpServletRequest req, HttpServletResponse res) {
		super(vs, req, res);
	}

	protected String getDefaultTemplate() {
		return "taskExecutionList";
	}

	protected void evaluateExtraParams() {
		super.evaluateExtraParams();

		boolean hiddenTaskExecutionList = ((Boolean) ClassHelper
				.convert(this.request.getAttribute("hiddenTaskExecutionList"), Boolean.class, Boolean.valueOf(false)))
						.booleanValue();
		if (hiddenTaskExecutionList) {
			return;
		}
		boolean isReadOnly = ((Boolean) ClassHelper.convert(this.request.getParameter("isReadOnly"), Boolean.class,
				Boolean.valueOf(false))).booleanValue();
		addParameter("isReadOnly", Boolean.valueOf(isReadOnly));

		Long bid = (Long) ClassHelper.convert(this.request.getParameter("bizId"), Long.class, new Long(-1L));
		if (bid.compareTo(new Long(0L)) <= 0) {
			bid = findValue(this.bizId) != null ? (Long) ClassHelper.convert(findValue(this.bizId), Long.class)
					: (Long) ClassHelper.convert(this.bizId, Long.class, new Long(-1L));
		}

		String currentProcUnitId = (String) ClassHelper.convert(this.request.getParameter("procUnitId"), String.class,
				"");
		this.taskId = ((String) ClassHelper.convert(this.request.getParameter("taskId"), String.class, ""));

		String pid = StringUtil.isBlank(this.defaultUnitId) ? currentProcUnitId : this.defaultUnitId;
		if (pid.equals("")) {
			pid = findValue(this.procUnitId) != null
					? (String) ClassHelper.convert(findValue(this.procUnitId), String.class) : this.procUnitId;
		}

		if (pid.equals("procUnitId")) {
			pid = "Approve";
		}
		if (null != bid) {
			if (bid.compareTo(new Long(0L)) > 0) {
				List list = queryProcUnitHandler(bid, pid, currentProcUnitId);
				if ((null != list) && (list.size() > 0)) {
					addParameter("taskExecutionList", list);
				}
			}
			addParameter("bizId", bid);
		}
		if (null != pid) {
			addParameter("procUnitId", pid);
		}

		if (null != this.hasResult) {
			addParameter("hasResult", findValue(this.hasResult, Boolean.class));
		}
		String[] proportions = null;
		if ((null == this.proportion) || (this.proportion.trim().equals(""))) {
			if ((null == this.average) || (this.average.trim().equals(""))) {
				proportions = "10%,10%,20%,10%,20%,10%,20%".split(",");
			} else {
				Integer avg = Integer.valueOf(this.average);
				if (avg.intValue() < 100) {
					int i = 100 / avg.intValue();
					proportions = new String[avg.intValue()];
					for (int j = 0; j < avg.intValue(); j++)
						proportions[j] = (String.valueOf(i) + "%");
				}
			}
		} else {
			proportions = this.proportion.split(",");
		}
		addParameter("proportions", proportions);
	}

	private List<Map<String, Object>> queryProcUnitHandler(Long bizId, String approvalProcUnitId, String procUnitId) {
		Operator operator = (Operator) this.request.getSession().getAttribute("sessionOperatorAttribute");
		if (operator == null) {
			return null;
		}
		// ProcUnitHandlerService service =
		// (ProcUnitHandlerService)SpringBeanFactory.getBean(this.request.getSession().getServletContext(),
		// "procUnitHandlerService", ProcUnitHandlerService.class);

		// List group = service.groupProcUnitHandler(bizId, approvalProcUnitId,
		// procUnitId, this.taskId, operator.getId());

		return new ArrayList<Map<String, Object>>();
	}
}
