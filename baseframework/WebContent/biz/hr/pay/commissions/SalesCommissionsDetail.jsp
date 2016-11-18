<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,tree,combox,attachment" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/pay/PayPublic.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/pay/commissions/SalesCommissionsDetail.js"/>' type="text/javascript"></script>
</head>
<body>
<div class="mainPanel">
	<div class="subject">销售提成审批表</div>
	<form method="post" action="" id="submitForm">
		<table class='tableInput' style="width: 99%;">
			<x:layout />
			<x:hidden name="auditId" />
			<x:hidden name="organId" />
			<x:hidden name="deptId" />
			<x:hidden name="positionId" />
			<x:hidden name="personMemberId" />
			<x:hidden name="fullId" />
			<tr>
				<x:inputTD name="organName" required="false" disabled="true" label="公司名称" maxLength="64" />
				<x:inputTD name="billCode" required="false" disabled="true" label="单据号码" maxLength="32" />
				<x:inputTD name="fillinDate" required="false" disabled="true" label="填表日期" mask="date" />
			</tr>
			<tr>
				<x:inputTD name="deptName" required="false" disabled="true" label="部门" maxLength="64" />
				<x:inputTD name="positionName" required="false" disabled="true" label="岗位" maxLength="64" />
				<x:inputTD name="personMemberName" required="false" disabled="true" label="制表人" maxLength="64" />
			</tr>
		</table>
	</form>
	<div class="blank_div"></div>
	<x:fileList bizCode="SalesCommissions" bizId="auditId" id="salesCommissionsFileList"/>
	<div class="blank_div"></div>
	<div id="maingrid"></div>
</div>
</body>
</html>