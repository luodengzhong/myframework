<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox,attachment" />
<script src='<c:url value="/javaScript/PersonalPasswordAuth.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/pay/master/PayMasterList.js"/>' type="text/javascript"></script>

</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv" style="width:99%;">
			<div class="subject"><c:out value="${orgUnitName}"/><c:out value="${year}"/>年<c:out value="${month}"/>月[<c:out value="${payStaffTypeTextView}"/>]工资表</div>
			<div class="bill_info">
				<span style="float:left;">
					单据号码：<strong><c:out value="${billCode}"/></strong>
					&nbsp;&nbsp;
					制表日期：<strong><c:out value="${fillinDate}"/></strong>
				</span>
				<span style="float:right;">
					制表人：<strong><c:out value="${organName}" />.<c:out value="${deptName}" />.<c:out value="${positionName}" />.<c:out value="${personMemberName}" /></strong>
				</span>
			</div>
			<form method="post" action="" id="submitForm">
				<x:hidden name="id" id="mainId"/>
				<x:hidden name="periodId" id="mainPeriodId"/>
				<x:hidden name="organId" />
				<x:hidden name="deptId" />
				<x:hidden name="positionId" />
				<x:hidden name="personMemberId" />
				<x:hidden name="fullId" />
				<x:hidden name="organName" />
				<x:hidden name="fillinDate" type="date"/>
				<x:hidden name="billCode" />
				<x:hidden name="deptName" />
				<x:hidden name="positionName" />
				<x:hidden name="personMemberName" />
				<x:hidden name="orgUnitId" />
				<x:hidden name="orgUnitName" />
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div>
	</div>
</body>
</html>
