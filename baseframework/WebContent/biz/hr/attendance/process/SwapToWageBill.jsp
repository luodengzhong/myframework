<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree" />
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/biz/hr/attendance/process/SwapToWageBill.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div class="subject">换休转工资申请单</div>
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
						<x:hidden name="periodId"/>
						<x:inputTD name="year" required="true" label="业务年" maxLength="64" />
						<x:inputTD name="periodName" label="业务期间" required="true" wrapper="combo" />
						<td class="title" colspan="2"></td>
					</tr>
					<tr>
						<x:select list="overtimeKindList" emptyOption="false" name="overtimeKindId"  cssStyle="display:none"/>
						<x:textareaTD name="reason" required="false" label="原因" maxLength="200" width="744" rows="3" colspan="5">
						</x:textareaTD>
					</tr>
				</table>
				<div id='group' class="navTitle">
					<span class='group'>&nbsp;</span>&nbsp;
					<span class="titleSpan">加班单冲销明细</span>
				</div>
				<div class="navline"></div>
				<div id="detailgrid"></div>
				<div class="blank_div"></div>
				<div style="width: 99%;" id="approverList">
					<x:taskExecutionList procUnitId="Approve" defaultUnitId="Approve" bizId="bizId" />
				</div>
			</form>
		</div>
	</div>
</body>
</html>
