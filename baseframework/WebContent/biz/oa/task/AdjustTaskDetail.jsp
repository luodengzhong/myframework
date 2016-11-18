<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,tree,combox,attachment" />
    <script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.contextmenu.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/task/taskEditUtil.js"/>'  type="text/javascript"></script>
<script src='<c:url value="/biz/oa/task/AdjustTaskDetail.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/task/PlanAddDetailUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/common/FileUpUtil.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
				
				<div class="ui-panelBar" style="display:none;"  id='taskBar'>
						<ul>
							<li id="updateInstitutionTree"><a href="javascript:void(0);"
															   class="edit"><span>保存</span></a></li>
							<li class="line"></li>
						</ul>
					</div>
					
					
					
		<div class="subject" style="height: 30px;">计划任务变更</div>
		<div class="bill_info">
			<span style="float: left; margin-left: 10px;">
				 单据号码：<strong><c:out value="${billCode}" /></strong> &nbsp;&nbsp; 
				 制单日期：<strong><x:format name="fillinDate" type="date" /></strong>
			</span> 
			<span style="float: right; margin-right: 10px;">
			 调整人：<strong><c:out value="${organName}" />.<c:out value="${deptName}" />.<c:out value="${positionName}" />.<c:out value="${personMemberName}" /></strong>
			</span>
		</div>
		<form method="post" action="" id="submitForm">
			<table class='tableInput' style="width: 99.9%;">
				<x:layout proportion="10%,50%,10%,10%,10%,10%"/>
				<tr>
					<x:hidden name="adjustAskId" />
					<x:hidden name="planTaskId" />
					<x:hidden name="parentTaskId" />
					<x:hidden name="organId" />
					<x:hidden name="deptId" />
					<x:hidden name="positionId" />
					<x:hidden name="personMemberId" />
					<x:hidden name="fullId" />
					<x:hidden name="organName" />
					<x:hidden name="fillinDate" type="date" />
					<x:hidden name="billCode" />
					<x:hidden name="deptName" />
					<x:hidden name="positionName" />
					<x:hidden name="personMemberName" />
					<x:hidden name="owningObjectId" />
					<x:hidden name="unusualPlanTask" />
					<x:hidden name="managerType"/>
					<x:hidden name="critical"/>
					<x:hidden name="parameter"/>
					<x:hidden name="adjustNumber"/>
					<x:hidden name="isPlanningSpecialist"/>
					<x:hidden name="iscreate"/>
					<x:hidden name="isBreakCritical"/>
					<x:hidden name="pageType" value = "1"/> 
					<x:inputTD name="subject" required="true" label="主题" colspan="3"  maxLength="42" />
					<%-- <x:inputTD name="managerTypeName" disabled="true" label="任务计划模块" maxLength="60"/> --%>
					<x:selectTD name="adjustTaskKind"   label="调整类型" required="true" />
					<%-- <x:radioTD list="#{'0':'计划调整','1':'终止计划'}" name="isAborted" required="true"  label="计划处理" /> --%>
				</tr>
				<tr>
					<td class="title"><span class="labelSpan">计划路径&nbsp;:</span></td>
					<td colspan="3">
						<a href='##' class="GridStyle"  id="openPlanDetail"  onclick='openPlanDetail()'>${fullName}</a>&nbsp;&nbsp;
					</td>	
					<x:selectTD name="status" required="false" label="审核状态" disabled="true"  maxLength="10"  />
				</tr>
				<tr>
					<x:selectTD name="managerType" disabled="true" label="任务计划模块" />
					<x:inputTD name="adjustNumber" required="true" label="调整次数" maxLength="42"  disabled="true"/>
					<c:if test="${isPlanningSpecialist=='1'}">
						<td colspan="2" class="title" style="text-align: center; min-height: 22px; line-height: 22px;"><x:checkbox name="iscelerity" label="是否快速流程"  /></td>
					</c:if>
					<c:if test="${isPlanningSpecialist=='0'}">
						<td colspan="2" class="title" style="text-align: center; min-height: 22px; line-height: 22px;"><x:checkbox name="iscelerity" label="是否快速流程" disabled="true"  /></td>
					
						<!-- <td class="disable">
						</td>
						<td class="disable">
						</td> -->
					</c:if>
				</tr>
				<tr>
					<x:textareaTD name="adjustReason" required="true"  label="调整原因" colspan="5" rows="3" maxlength="200"/>
				</tr>
			</table>
			<x:title name="group" title="调整计划信息"  needLine="false"/>
			<div id="adjustTaskShowDiv">
			<table class='tableInput' style="width: 99.9%;">
				<x:layout proportion="20%,30%,20%,30%"/>
				<tr>
					<td class="disable" colspan="2">
						<input type="hidden" name="oldStartDate" id="oldStartDate" value="2015-05-22">
						<div class = "center" ><x:title name="adjust" title="申请调整前计划信息"  needLine="false"/></div></td>
						
					<td class="disable" colspan="2">
						<input type="hidden" name="oldStartDate" id="oldStartDate" value="2015-05-22">
						<div ><x:title name="adjust" title="调整后计划信息"  needLine="false"/></div></td>
				</tr>
				<tr>
					<x:textareaTD name="oldTaskName" label="计划名称" rows="2" maxlength="100"   disabled="true"/>
					<%-- <x:inputTD name="oldTaskName" disabled="true" label="计划名称"   title="${oldTaskName}" maxLength="100"  rows="3"  /> --%>
					<x:textareaTD name="taskName" label="计划名称"    rows="2" maxlength="100"/>
					<%-- 
					<x:inputTD name="taskName" required="true" label="计划名称" title="${taskName}" maxLength="100" rows="3"/> --%>
				</tr>
				<tr>
					<x:selectTD name="oldTaskLevel" label="原级别" disabled="true"  list="taskLevelKind" />
					<x:selectTD name="taskLevel" label="最新级别" required="true"  list="taskLevelKind" />
				</tr>
				<tr>					
					<x:inputTD name="oldStartDate"  label="原计划开始时间" disabled="true"  mask="date"/>
					<x:inputTD name="startDate" label="最新计划开始时间" required="true"	wrapper="date" />
				</tr>
				<tr>					
					<x:inputTD name="oldFinishDate" label="原计划结束时间"  disabled="true" mask="date"/>
					<x:inputTD name="finishDate" label="最新计划结束时间" required="true"  wrapper="date" />
				</tr>
				<tr>
					<x:hidden name="oldDutyDeptId" />
					<x:inputTD name="oldDutyDeptName" label="原责任部门" disabled="true" />								
					<x:hidden name="oldOwnerId" />
					<x:inputTD name="oldOwnerName" label="原责任人" disabled="true" />
				</tr>
				<tr>
					
					<x:selectTD name="oldPlanningCycle"  label="计划周期"  dictionary="planningCycle" disabled="true"/>
					<x:selectTD name="planningCycle"  label="计划周期" />
				</tr>
<%-- 				<tr>		
					<x:hidden name="dutyDeptId" />
					<x:inputTD name="dutyDeptName" label="最新责任部门" required="true" wrapper="select"/>
					<x:hidden name="ownerId" />
					<x:inputTD name="ownerName" label="最新责任人" required="true" wrapper="select"/>
				</tr> --%>
				<tr>
					<x:hidden name="dutyDeptId" />
					<x:hidden name="dutyDeptName" />
					<td class='title'><span class="labelSpan">最新责任部门&nbsp;:</span></td>
					<td class="title" colspan="3"><div id="deptShowDiv" style="min-height:25px;line-height:25px;"></div></td>					
				</tr>
				
				<tr>
					<x:hidden name="ownerId" /><x:hidden name="ownerName" />
					<td class='title'><span class="labelSpan">最新责任人&nbsp;:</span></td>
					<td class="title" colspan="2"><div id="ownerShowDiv" style="min-height:25px;line-height:25px;"></div></td>
					
					<td class="title">
						<a href='##' id="GridStylehref5"  class="GridStyle"  onclick='showChooseOwnerDialog()'>选择</a>&nbsp;&nbsp;
						<a href='##' id="GridStylehref6"  class="GridStyle" onclick='clearChooseArray("owner")'>清空</a>
					</td>
				</tr>
				<tr>
					<x:textareaTD name="remark" label="计划说明" colspan="3" rows="3" maxlength="200"/>
				</tr>
				<tr>
					<td class='title'><span class="labelSpan">下游评价人&nbsp;:</span></td>
					<td class="title" colspan="2"><div id="managerShowDiv" style="min-height:25px;line-height:25px;"></div></td>
					<td class="title">
						<a href='##' class="GridStyle"  onclick='showChooseManagerDialog()'>选择</a>&nbsp;&nbsp;
						<a href='##' class="GridStyle" onclick='clearChooseArray("manager")'>清空</a>
					</td>
				</tr>
				<tr>
					<td class='title'><span class="labelSpan">执&nbsp;行&nbsp;人:</span></td>
					<td class="title" colspan="2"><div id="executorShowDiv" style="min-height:25px;line-height:25px;"></div></td>
					 <td class="title">
						<a href='##' class="GridStyle"  onclick='showChooseExecutorDialog()'>选择</a>&nbsp;&nbsp;
						<a href='##' class="GridStyle"  onclick='clearChooseArray("executor")'>清空</a>
					</td>
				</tr>
			</table>
			</div>
		</form>
		<div class="blank_div"></div>
		<x:fileList bizCode="oaTask" bizId="planTaskId" id="taskDetailFileList"/>
		
		<input type="file" id="upload" name="upload" style="display:none"/>
		<%-- 计划专员判断"${templateType=='safty'}" --%>
		<%-- <c:if test="${isPlanningSpecialist==1 ||iscreate == 1}"> --%>
		<div class="blank_div"></div>
			<span style="float: left; margin-left: 10px;">
			关联调整任务：
			</span> 
		<br/>
		<div id="relationGrid"></div>
		<%-- </c:if>
		
		<c:if test="${isPlanningSpecialist==1}"> --%>
		<div class="blank_div"></div>
			<span style="float: left; margin-left: 10px;">
			新增、未完新增任务：
			</span> 
			
		<br/>
		<div id="addmaingrid"></div>
		<%-- </c:if> --%>
		
	</div>
</body>
</html>
