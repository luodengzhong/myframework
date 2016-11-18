<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,tree,combox,attachment" />
<script src='<c:url value="/lib/jquery/jquery.extendedField.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>'  type="text/javascript"></script>
<script src='<c:url value="/biz/oa/task/taskEditUtil.js"/>'  type="text/javascript"></script>
<script src='<c:url value="/biz/oa/task/addTaskDetail.js"/>' type="text/javascript"></script>
<style>html{overflow-x:hidden;}</style>
</head>
<body>
	<div class="mainPanel">
		<div class="blank_div"></div>
		<form method="post" action="" id="submitForm">
			<table class='tableInput' style="width: 99.9%;">
				<tr>
					<x:hidden name="indexId" />
					<x:hidden name="owningObjectId" />
					<x:hidden name="managerType" />
					<x:hidden name="taskId" />
					<x:hidden name="copyTaskId" />
					<x:hidden name="auditId" />
					<x:hidden name="parentTaskId" />
					<x:hidden name="sequence" />
					<x:select name="taskReportingWork" cssStyle="display:none;" id="mainTaskReportingWork" emptyOption="false" />
					<x:inputTD name="taskName" required="true" label="计划名称" maxLength="100" colspan="4" />
					<x:hidden name="taskKindId" />
					<x:hidden name="businessCode" />
				</tr>
				<tr>
					<x:inputTD name="taskKindName" required="false" label="计划类别" wrapper="tree" />
					<x:selectTD name="taskLevel" label="计划级别" required="true" list="taskLevelKind" />
					<td  class="title" style="padding-left: 10px;"><x:checkbox name="summary" label="标记为摘要任务" /></td>
				</tr>
				<tr>
					<x:inputTD name="startDate" label="计划开始时间" required="true" wrapper="date" />
					<x:inputTD name="finishDate" label="计划完成时间" required="true" mask="date" />
					<td class="title" style="padding-left: 10px;"><x:checkbox name="critical" label="标记为关键任务" /></td>
				</tr>
				<tr>
					<x:selectTD name="planningCycle" label="计划周期" required="false" />
					<x:inputTD name="taskReportKindId" label="汇报类型" required="false" />
					<td  class="title" style="padding-left: 10px;"><x:checkbox name="milestone" label="标记为里程碑" /></td>
					
				</tr>
				<%-- <tr>
					<x:hidden name="dutyDeptId" />
					<x:inputTD name="dutyDeptName" label="责任部门" required="true" wrapper="tree" />
					<x:hidden name="ownerId" />
					<x:inputTD name="ownerName" label="责任人" required="true"	wrapper="tree" />
					<td  class="title" style="padding-left: 10px;"><x:checkbox name="summary" label="标记为摘要任务" /></td>
				</tr> --%>
				<tr>
					<x:selectTD name="constraintType" label="任务限制类型" />
					<x:inputTD name="constraintDate" label="限制日期" wrapper="date" />
					<%-- <td  class="title" style="padding-left: 10px;"><x:checkbox name="isPrivate" label="标记为秘密计划" /></td> --%>
					<td></td>
				</tr>
				<tr>
				
					<x:inputTD name="parameter" label="参数变量" required="false" />
					
					<x:selectTD name="planPrivateKind" value = "3"  label="计划公开类型" />
					<td  class="title" style="padding-left: 10px;"><x:checkbox name="earlyFinishBonus" label="标记为提前奖励" /></td>
					
			
				</tr>
				<tr>
					<x:textareaTD name="remark" label="计划说明" colspan="4" rows="3" maxlength="170" />
				</tr>
				<tr>
					<x:textareaTD name="finishStandard" label="完成标准" colspan="4" rows="3" maxlength="170" />
				</tr>
				
				<tr>
					<x:hidden name="dutyDeptId" />
					<x:hidden name="dutyDeptName" />
					<td class='title'><span class="labelSpan">最新责任部门&nbsp;:</span></td>
					<td class="title" colspan="4"><div id="deptShowDiv" style="min-height:25px;line-height:25px;"></div></td>
					
					<!-- <td class="title">
						<a href='##' id="GridStylehref1"  class="GridStyle"  onclick='showChooseDeptDialog()'>选择</a>&nbsp;&nbsp;
						<a href='##' id="GridStylehref2"  class="GridStyle" onclick='clearChooseArray("dutyDeptName")'>清空</a>
					</td> -->
				</tr>
				
				<tr>
					<x:hidden name="ownerId" /><x:hidden name="ownerName" />
					<td class='title'><span class="labelSpan">最新责任人&nbsp;<font color="#FF0000">*</font>:</span></td>
					<td class="title" colspan="3"><div id="ownerShowDiv"  required="true"	 style="min-height:25px;line-height:25px;"></div></td>
					
					<td class="title">
						<a href='##' id="GridStylehref5"  class="GridStyle"  onclick='showChooseOwnerDialog()'>选择</a>&nbsp;&nbsp;
						<a href='##' id="GridStylehref6"  class="GridStyle" onclick='clearChooseArray("owner")'>清空</a>
					</td>
				</tr>
				<tr>
					<td class='title'><span class="labelSpan">执&nbsp;行&nbsp;人:</span></td>
					<td class="title" colspan="3"><div id="executorShowDiv" style="min-height:25px;line-height:25px;"></div></td>
					<td class="title">
						<a href='##' class="GridStyle"  onclick='showChooseExecutorDialog()'>选择</a>&nbsp;&nbsp;
						<a href='##' class="GridStyle"  onclick='clearChooseArray("executor")'>清空</a>
					</td>
				</tr>
				<tr>
					<td class='title'><span class="labelSpan">下游评价人&nbsp;<font color="#FF0000">*</font>:</span></td>
					<td class="title" colspan="3"><div id="managerShowDiv"  required="true"	 style="min-height:25px;line-height:25px;"></div></td>
					<td class="title">
						<a href='##' class="GridStyle"  onclick='showChooseManagerDialog()'>选择</a>&nbsp;&nbsp;
						<a href='##' class="GridStyle" onclick='clearChooseArray("manager")'>清空</a>
					</td>
				</tr>
				
			</table>
		</form>
		<div id="taskExtendedField"></div>
		<div class="blank_div"></div>
		<x:fileList bizCode="oaTask" bizId="taskId"	id="planAuditDetailFileList" />
	</div>
</body>
</html>
