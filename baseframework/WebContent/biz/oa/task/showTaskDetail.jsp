<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,tree,combox,attachment" />
<script src='<c:url value="/lib/jquery/jquery.extendedField.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/task/taskEditUtil.js"/>'  type="text/javascript"></script>
<script src='<c:url value="/biz/oa/task/showTaskDetail.js"/>'type="text/javascript"></script>
<style>html{overflow-x:hidden;}</style>
</head>
<body>
	<div class="mainPanel">	
	<div position="top">
 		<div class="ui-panelBar" id='toolBar' checkAccess="false"></div>
 	</div>			
	<!-- <div class="ui-panelBar" id='taskBar'>
		<ul>
			<li id="supervisePlan"><a href="javascript:void(0);" class="edit"><span>督办</span></a></li>
			<li id="unSupervisePlan"><a href="javascript:void(0);" class="edit"><span>取消督办</span></a></li>
			<li id="attentionPlan"><a href="javascript:void(0);" class="edit"><span>关注</span></a></li>
			<li id="unAattentionPlan"><a href="javascript:void(0);" class="edit"><span>取消关注</span></a></li>
			<li id="collectionPlan"><a href="javascript:void(0);" class="edit"><span>收藏</span></a></li>
			<li id="unCollectionPlan"><a href="javascript:void(0);" class="edit"><span>取消收藏</span></a></li>
			<li class="line"></li>
		</ul>
	</div> -->
		<div class="subject" style="height:30px;">计划执行台账</div>
		<form method="post" action="" id="submitForm">
			<x:hidden name="owningObjectId" />
			<x:hidden name="parameter" />
			<x:hidden name="managerType"/>
			<x:hidden name="bizTaskId"/>
			<x:hidden name="auditId"/>
			<x:hidden name="needTiming"/>
			<div id='mainInfoTab'>
				<div class="ui-tab-links">
					<ul style="left:10px">
						<li>基本信息</li>
						<li id="showExtendedField">高&nbsp;&nbsp;级</li>
					</ul>
				</div>
				<div class="ui-tab-content">
					<div class="layout" >
						<table class='tableInput' style="width: 99.9%;">
							<x:layout />
							<tr>
								<x:hidden name="taskId" />
								<x:hidden name="businessCode" />
								<x:hidden name="taskKindId" />
								<x:hidden name="pageType" />
								<x:hidden name="isPlanningSpecialist" />
								<x:hidden name="isDutyPerson" />
								<x:select name="taskReportingWork" cssStyle="display:none;" id="mainTaskReportingWork" emptyOption="false"/>
								<x:inputTD name="taskName"  disabled="true" label="计划名称"  colspan="3"/>
								<x:selectTD name="planningCycle"  label="计划周期" disabled="true"/>
							</tr>
							<c:if test="${requestScope.hasAdjustData=='true'}">
							<tr>
								<x:inputTD name="oldTaskName"  disabled="true" label="原计划名称"  colspan="3"/>
								<x:selectTD name="oldPlanningCycle"  label="原计划周期" dictionary="planningCycle" disabled="true"/>
							</tr>
							</c:if>
							<tr>
								<x:inputTD name="fullName"  disabled="true" label="计划路径"  colspan="3"/>
								<x:inputTD name="adjustNumber"  disabled="true" label="调整次数" />
							</tr>
							<tr>
								<x:selectTD name="managerType" disabled="true"  label="计划模块" />	
								<%-- <x:inputTD name="taskKindName"  disabled="true" label="计划类别"/> --%>
								<x:inputTD name="percentComplete"  label="完成进度(%)"  disabled="true"/>
								<x:selectTD name="status" label="状态" disabled="true" list="taskStatusKind"/>
							</tr>
							<tr>
								<x:selectTD name="taskLevel"  label="最新级别" disabled="true" list="taskLevelList"/>
								
							<c:if test="${taskKindId=='-111'}">								
								<x:inputTD name="startDate"  label="最新计划开始时间"  mask="date"  wrapper="date"/>
								<x:inputTD name="finishDate"  label="最新计划结束时间"  mask="date"  wrapper="date"/>
							
							</c:if>
							<c:if test="${taskKindId!='-111'}">								
								<x:inputTD name="startDate"  label="最新计划开始时间" disabled="true" mask="date"/>
								<x:inputTD name="finishDate"  label="最新计划结束时间" disabled="true" mask="date"/>
							
							</c:if>
							</tr>
							<c:if test="${requestScope.hasAdjustData=='true'}">
							<tr>
								<x:selectTD name="oldTaskLevel"  label="原级别" disabled="true" list="taskLevelList"/>
								<x:inputTD name="oldStartDate"  label="原计划开始时间" disabled="true" mask="date"/>
								<x:inputTD name="oldFinishDate"  label="原计划结束时间" disabled="true" mask="date"/>
							</tr>
							</c:if>
							<tr>
								<x:inputTD name="actualStart"  label="实际开始时间" disabled="true" wrapper="date"/>
								<x:inputTD name="actualFinish"  label="实际结束时间" disabled="true" wrapper="date"/>
								<x:inputTD name="estimatedFinish"  label="预计完成时间" disabled="true" wrapper="date"/>
							</tr>
							<c:if test="${requestScope.hasAdjustData=='true'}">
							<tr>
								<x:inputTD name="oldDutyDeptName"  label="原责任部门" disabled="true"/>
								<x:inputTD name="oldOwnerName"  label="原责任人" disabled="true"/>
								<x:inputTD name="changeDate"  label="调整时间"  disabled="true" mask="date"/>
							</tr>
							</c:if>
							<tr>
								<x:hidden name="dutyDeptId" />
								<x:hidden name="dutyDeptName" />
								<td class='title'><span class="labelSpan">最新责任部门&nbsp;:</span></td>
								<td class="title" colspan="3"><div id="deptShowDiv" style="min-height:25px;line-height:25px;"></div></td>
								
								<x:inputTD name="taskReportKindId"  label="汇报类型" />
								<!-- <td class="title">
									<a href='##' id="GridStylehref1"  class="GridStyle"  onclick='showChooseDeptDialog()'>选择</a>&nbsp;&nbsp;
									<a href='##' id="GridStylehref2"  class="GridStyle" onclick='clearChooseArray("dutyDeptName")'>清空</a>
								</td> -->
							</tr>
							
							<tr>
								<x:hidden name="ownerId" /><x:hidden name="ownerName" />
								<td class='title'><span class="labelSpan">最新责任人&nbsp;:</span></td>
								<td class="title" colspan="4"><div id="ownerShowDiv" style="min-height:25px;line-height:25px;"></div></td>
								
								<td class="title">
									<a href='##' id="GridStylehref5"  class="GridStyle"  onclick='showChooseOwnerDialog()'>选择</a>&nbsp;&nbsp;
									<a href='##' id="GridStylehref6"  class="GridStyle" onclick='clearChooseArray("owner")'>清空</a>
								</td>
							</tr>
							<%-- <tr>
								<x:hidden name="dutyDeptId" />
								<x:inputTD name="dutyDeptName"  label="最新责任部门"  wrapper="select"/>
								<x:hidden name="ownerId" />
								<x:inputTD name="ownerName"  label="最新责任人" wrapper="select"/>
								<x:inputTD name="taskReportKindId"  label="汇报类型" />
							</tr> --%>
							<!-- <tr>
								<td class='title'><span class="labelSpan">下游评价人&nbsp;:</span></td>
								<td class="title" colspan="5"><div id="managerShowDiv" style="min-height:25px;line-height:25px;"></div></td>
							</tr>
							<tr>
								<td class='title'><span class="labelSpan">执&nbsp;行&nbsp;人:</span></td>
								<td class="title" colspan="5"><div id="executorShowDiv" style="min-height:25px;line-height:25px;"></div></td>
							</tr> -->
				<tr>
					<td class='title'><span class="labelSpan">下游评价人&nbsp;:</span></td>
					<td class="title" colspan="4"><div id="managerShowDiv" style="min-height:25px;line-height:25px;"></div></td>
					<td class="title">
						<a href='##' id="GridStylehref1"  class="GridStyle"  onclick='showChooseManagerDialog()'>选择</a>&nbsp;&nbsp;
						<a href='##' id="GridStylehref2"  class="GridStyle" onclick='clearChooseArray("manager")'>清空</a>
					</td>
				</tr>
				<tr>
					<td class='title'><span class="labelSpan">执&nbsp;行&nbsp;人:</span></td>
					<td class="title" colspan="4"><div id="executorShowDiv" style="min-height:25px;line-height:25px;"></div></td>
					<td class="title">
						<a href='##' id="GridStylehref3"  class="GridStyle"  onclick='showChooseExecutorDialog()'>选择</a>&nbsp;&nbsp;
						<a href='##' id="GridStylehref4"  class="GridStyle"  onclick='clearChooseArray("executor")'>清空</a>
					</td>
				</tr>
						</table>
					</div>
					<div class="layout">
						<table class='tableInput' style="width: 99.9%;">
							<x:layout />
							<tr>
								<x:selectTD name="constraintType"  label="任务限制类型"  disabled="true"/>
								<x:inputTD name="constraintDate"  label="限制日期"  disabled="true" mask="date"/>
								<x:inputTD name="parameter" label="参数变量" 
									required="false" />
							</tr>
							<tr>
								<x:inputTD name="adjustNumber" label="调整次数" disabled="true" />
								<%-- <td colspan="2" class="title"
									style="text-align: center; min-height: 22px; line-height: 22px;">
									<x:checkbox name="isPrivate" label="秘密计划" disabled="true" />
								</td> --%>
								<x:selectTD name="planPrivateKind" disabled="true"  label="计划公开类型" />
								<td colspan="2" class="title"
									style="text-align: center; min-height: 22px; line-height: 22px;"><x:checkbox
										name="earlyFinishBonus" label="提前奖励" disabled="true" /></td>
							</tr>
							<tr>
								<td colspan="2" class="title" style="text-align: center;min-height:22px;line-height:22px;"><x:checkbox name="milestone" label="里程碑" disabled="true"/></td>
								<td colspan="2" class="title" style="text-align: center;min-height:22px;line-height:22px;"><x:checkbox name="summary" label="摘要任务"  disabled="true"/></td>
								<td colspan="2" class="title" style="text-align: center;min-height:22px;line-height:22px;"><x:checkbox name="critical" label="关键任务"  disabled="true"/></td>
							</tr>
							<tr>
								<x:textareaTD name="remark" label="备注" disabled="true" colspan="5" rows="4" maxlength="170"/>
							</tr>
							<tr>
								<x:textareaTD name="finishStandard" label="完成标准"  colspan="5" rows="4" maxlength="170"/>
							</tr>
						</table>
						<div id="taskExtendedField"></div>
					</div>
				</div>
			</div>
		</form>	
		<div id='detailTab'>
				<div class="ui-tab-links">
					<ul style="left:10px">
						<li id="showFileList">相关文档</li>
						<li id="taskReportList">进度报告</li>
						<li id="taskauditList">制定记录</li>
						<li id="taskadjustList">调整记录</li>
					<li id="docGuideList">成果指引</li>
					<li id="previousTaskList">前置任务</li>
					</ul>
				</div>
				<div class="ui-tab-content">
					<div class="layout">
						<x:fileList bizCode="tempTask" bizId="taskDetailFileListId" id="taskDetailFileList" isWrap="false"/>
					<div class="blank_div"></div>
					<c:forEach items="${documentList}" var="planDocument">
						<c:if
							test="${not empty planDocument && not empty planDocument['planDocumentId']  }">
					成果文档:${planDocument['name'] }
					<div class="blank_div"></div>
							<x:fileList bizCode="${planDocument['planDocumentId'] }"
								bizId="taskId" id="${planDocument['planDocumentId'] }" />
							<div class="blank_div"></div>
						</c:if>
					</c:forEach>
				</div>
				<div class="layout">
					<div id="taskReportGrid"></div>
				</div>
				<div class="layout">
					<div id="taskAddAuditGrid"></div>
				</div>
				
				<div class="layout">
					<div id="taskAdjustGrid"></div>
				</div>
				<div class="layout">
					<table style="width: 99.9%;">
						<tr>
							<td>
								<li>成果信息</li>
							</td>
							<td>
								<li>指引信息</li>
							</td>
						</tr>
						<tr>
							<td>
								<div id="docGrid"></div>
							</td>
							<td>
								<div id="guideGrid"></div>
							</td>
						</tr>
					</table>
				</div>
				<div class="layout">
					<div id="previousTaskGrid"></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>