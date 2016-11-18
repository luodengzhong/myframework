<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree" />
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/biz/hr/attendance/process/AttProcUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/attendance/process/SwapRestBill.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div class="subject">换 休 申 请 单</div>
		<div class="ui-form" style="width: 100%; left: 0px; padding: 3px;">
			<form method="post" action="" id="submitForm">

				<x:hidden name="leaveId" id="leaveId" />
				<x:hidden name="organId" />
				<x:hidden name="centerId" />
				<x:hidden name="deptId" />
				<x:hidden name="positionId" />
				<x:hidden name="personMemberId" />
				<x:hidden name="positionName" />
				<x:hidden name="fullId" />
				<x:hidden name="appFlowFlag"/>
				<x:hidden name="status" value="0" />
				<table class='tableInput' style="width: 99%;">
					<x:layout proportion="10%,21%,12%,21%,10%" />
					<tr>
						<x:inputTD name="organName" disabled="true" required="false" label="公司名称" maxLength="64" />
						<x:inputTD name="billCode" disabled="true" required="false" label="单据号码" maxLength="32" />
						<x:inputTD name="fillinDate" disabled="true" required="false" label="填表日期" maxLength="7" wrapper="dateTime" />
					</tr>
					<tr>
						<x:selectTD list="leaveKindList" disabled="true" emptyOption="false" name="leaveKindId" required="true" label="请假类别" />
						<x:inputTD name="deptName" disabled="true" required="false"
								label="部门" maxLength="64" />
						<x:inputTD name="personMemberName" disabled="true"
								required="false" label="姓名" maxLength="64" />
					</tr>
					<tr>
						<x:inputTD name="startDate" required="true" label="开始时间" mask="dateTime" maxLength="7" />
						<x:inputTD name="endDate" required="true" label="结束时间" maxLength="7" mask="dateTime" />
						<td class="title"><span id="totalTimeSpan" class="labelSpan"> 合计(天数) : </span></td>
						<td class="edit" colspan="1"><x:input id="totalTime" readonly="true" name="totalTime" /></td>
					</tr>
					<tr>
						<x:select list="overtimeKindList" emptyOption="false" name="overtimeKindId"  cssStyle="display:none"/>
						<x:select list="swapKindList" emptyOption="false" name="swapKindId"  cssStyle="display:none"/>
						<x:textareaTD name="reason" required="false" label="换休原因" maxLength="200" width="744" rows="3" colspan="5">
						</x:textareaTD>
					</tr>
				</table>
				<div id='group' class="navTitle">
					<span class='group'>&nbsp;</span>&nbsp;
					<span class="titleSpan">加班单冲销明细</span>
				</div>
				<div><font id="swapMark" color="red">备注：</font></div>
				<div class="navline"></div>
				<div id="detailgrid"></div>
				<div class="blank_div"></div>
				
				
				<div id='group' class="navTitle">
					<span class='group'>&nbsp;</span>&nbsp;
					<span class="titleSpan">活动假单冲销明细</span>
				</div>
				<div class="navline"></div>
				<div id="detailgridAH"></div>
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
