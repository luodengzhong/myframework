
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,layout,grid,dateTime,tree,combox,attachment" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>'
	type="text/javascript"></script>
<script
	src='<c:url value="/biz/oa/task/PlanPrevious.js"/>'
	type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<%-- <div position="left" title="查询">
				<x:layout />
					<x:hidden name="indexId" />
					<x:hidden name="owningObjectId" />
					<x:hidden name="taskId" />
					<x:hidden name="copyTaskId" />
					<x:hidden name="auditId" />
					<x:hidden name="parentTaskId" />
					<x:hidden name="sequence" />
					<x:selectL name="taskReportingWork" cssStyle="display:none;" disabled="true"  id="mainTaskReportingWork" emptyOption="false" />
					<x:inputL name="taskName" required="true" label="计划名称" disabled="true"  maxLength="100" colspan="3" />
					<x:hidden name="taskKindId" />
					<x:hidden name="businessCode" />
					<x:inputL name="taskKindName" required="true"  disabled="true"  label="计划类别" wrapper="tree" />

					<x:selectL name="taskLevel" label="计划级别" required="true" disabled="true"  list="taskLevelKind" />
					<x:inputL name="startDate" label="计划开始时间" required="true" disabled="true"  wrapper="date" />
					<x:inputL name="finishDate" label="计划完成时间" disabled="true" required="true" mask="date" wrapper="date" />

					<x:selectL name="planningCycle" label="计划周期" disabled="true"  required="true" />
					<x:inputL name="taskReportKindId" label="汇报类型" disabled="true"  required="false" />
					<x:checkbox name="milestone" label="标记为里程碑" />

					<x:hidden name="dutyDeptId" />
					<x:inputL name="dutyDeptName" label="责任部门" disabled="true"  required="true" wrapper="tree" />
					<x:hidden name="ownerId" />
					<x:inputL name="ownerName" label="责任人" required="true"	disabled="true"  wrapper="tree" />
					<x:checkbox name="summary" label="标记为摘要任务" />

					<x:selectL name="constraintType" disabled="true"  label="任务限制类型" />
					<x:inputL name="constraintDate"   disabled="true"  label="限制日期" wrapper="date" />
					<x:checkbox name="critical" disabled="true"  label="标记为关键任务" />


				</div> --%>

			<div position="left" id="layoutplan" title="计划设置"
				style="overflow-y: auto;">
				<form method="post" action="" id="queryMainForm">
					<x:hidden name="taskId" />
					<x:hidden name="owningObjectId" />
					<x:hidden name="taskName" />
				</form>
				<div class="ui-form" id="queryDiv" >
					<%-- <x:inputL name="previousTypeId" required="false" label="前置类型"
									maxLength="22" /> --%>
					<table>
						<tr>
							<td>
								<div id="maingrid" style="margin: 2px;"></div>
							</td>
						</tr>

						<tr>
							<td>
								<div id="maingriddocument" style="margin: 2px;"></div>
							</td>
						</tr>
						<tr>
							<td>
								<div id="maingridguide" style="margin: 2px;"></div>
							</td>
						</tr>
					</table>

				</div>
			</div>
		</div>
	</div>
</body>
</html>
