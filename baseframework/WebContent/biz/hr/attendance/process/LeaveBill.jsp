<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,attachment" />
<script src='<c:url value="/biz/hr/attendance/process/AttProcUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/attendance/process/LeaveBill.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div class="subject">请 假 申 请 单</div>
		<div class="ui-form" style="width: 100%; left: 0px; padding: 3px;">
			<form method="post" action="" id="submitForm">

				<x:hidden name="leaveId" id="leaveId" />
				<x:hidden name="organId" />
				<x:hidden name="centerId" />
				<x:hidden name="centerName" />
				<x:hidden name="deptId" />
				<x:hidden name="positionId" />
				<x:hidden name="personMemberId" />
				<x:hidden name="positionName" />
				<x:hidden name="fullId" />
				<x:hidden name="status" value="0" />
                <x:hidden name="appFlowFlag"/>
				<x:hidden name="deputyIdTemp" />
				<x:hidden name="deputyFullIdTemp" />
				<x:hidden name="deputyNameTemp" />
				<table class='tableInput' style="width: 99%;">
					<x:layout proportion="10%,21%,12%,21%,10%" />
					<tr>
						<x:inputTD name="organName" disabled="true" required="false" label="公司名称" maxLength="64" />
						<x:inputTD name="billCode" disabled="true" required="false" label="单据号码" maxLength="32" />
						<x:inputTD name="fillinDate" disabled="true" required="false" label="填表日期" maxLength="7" wrapper="dateTime" />
					</tr>
					<tr>
						<x:inputTD name="personMemberName" required="false" label="姓名" maxLength="32" wrapper="select" />
						<x:inputTD name="deptName" required="false" label="部门" maxLength="32" />
						<x:inputTD name="deputyName" required="false" label="代填人" maxLength="32" readonly="true"/>
					</tr>
					<tr>
						<x:selectTD list="leaveKindList" emptyOption="false" name="leaveKindId" required="true" label="请假类别" />
						<x:inputTD name="startDate" required="true" label="开始时间" mask="dateTime" maxLength="7" />
						<x:inputTD name="endDate" required="true" label="结束时间" maxLength="7" mask="dateTime" />
					</tr>
					<tr>
						<td class="title"><span id="totalTimeSpan" class="labelSpan"> 合计(天数) : </span></td>
						<td class="edit" colspan="1"><x:input id="totalTime" readonly="true" name="totalTime" /></td>
						<td class="title"><span id="funeralLeaveSpan" class="labelSpan"> 丧假事由 : </span></td>
						<td class="edit"><span id="funeralLeaveReasonSpan"><x:select id="funeralLeaveReason" name="funeralLeaveReason" /></span></td>
						<td class="title" colspan="2"></td>
					</tr>
					<tr>
						<x:textareaTD name="reason" required="true" label="请假原因" maxLength="200" width="744" rows="3" colspan="5">
						</x:textareaTD>
					</tr>
					<!--  
					<tr>
						<x:textareaTD name="memo" required="false" label="备注" width="744" rows="2" colspan="5">
						</x:textareaTD>
					</tr>
					-->
				</table>
				<x:fileList bizCode="HRLeave" bizId="leaveId" id="leaveFileList" isClass="true" proportion="10%,21%,12%,21%,10%,26%"/>
				<div id="fileListTitle" style="display:none;padding-left:20px;color:red;"></div>
				<div class="blank_div"></div>
				
				<div style="width: 99%;" id="approverList">
					<x:taskExecutionList procUnitId="Approve" defaultUnitId="Approve" bizId="bizId" />
				</div>
				<div class="blank_div"></div>
				<table class='tableInput' style="width: 99%;">
					<tr>
						<x:textareaTD name="verificationReason" required="false" label="核销不一致原因" rows="2" width="744" colspan="5" maxlength="200"></x:textareaTD>
					</tr>
					<tr>
						<x:inputTD name="verificationStartDate" required="false" label="核销开始时间" maxLength="7" mask="dateTime" />
						<x:inputTD name="verificationEndDate" required="false" label="核销结束时间" maxLength="7" mask="dateTime" />
						<td class="title"><span id="verificationTotalTimeSpan" class="labelSpan"> 合计(天数) : </span></td>
						<td class="edit" colspan="1"><x:input id="verificationTotalTime" readonly="true" name="verificationTotalTime" /></td>
				</table>
				<div class="blank_div"></div>
				<div style="width: 99%;" id="checkerList">
					<x:taskExecutionList procUnitId="Check" defaultUnitId="Check" bizId="bizId" />
				</div>
				<div class="blank_div"></div>
			</form>

		</div>
	</div>
</body>
</html>
