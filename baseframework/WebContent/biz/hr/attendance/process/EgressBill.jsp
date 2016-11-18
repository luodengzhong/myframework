<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree" />
<script src='<c:url value="/biz/hr/attendance/process/EgressBill.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div class="subject">公 出 申 请 单</div>
		<div class="ui-form" style="width: 100%; left: 0px; padding: 3px;">
			<form method="post" action="" id="submitForm">
				<div style="margin: 0 auto;">
					<x:hidden name="egressId" />
					<x:hidden name="fullId" />
					<x:hidden name="organId" />
					<x:hidden name="centerId" />
					<x:hidden name="centerName" />
					<x:hidden name="deptId" />
					<x:hidden name="positionId" />
					<x:hidden name="personMemberId" />
					<x:hidden name="positionName" />
					<x:hidden name="status" value="0" />
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
							<%-- <x:inputTD name="personMemberName" disabled="true" required="false" label="姓名" maxLength="64" /> --%>
						<x:inputTD name="personMemberName" required="false" label="姓名" maxLength="32" wrapper="select" />
							<x:inputTD name="deptName" disabled="true" required="false" label="部门" maxLength="64" />
							<x:inputTD name="positionName" disabled="true" required="false" label="岗位" maxLength="64" />
						</tr>
					<tr>
						<x:inputTD name="deputyName" required="false" label="代填人" maxLength="32" readonly="true"/>
						<td class="title" colspan="4"></td>
					</tr>
					</table>
				</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"></div>
			<div class="blank_div"></div>
			<div style="width: 99%;" id="approverList">
				<x:taskExecutionList procUnitId="Approve" defaultUnitId="Approve" bizId="bizId" />
			</div>
			<div style="width: 99%;" id="checkerList">
				<x:taskExecutionList procUnitId="Check" defaultUnitId="Check" bizId="bizId" />
			</div>
		</div>
	</div>
</body>
</html>
