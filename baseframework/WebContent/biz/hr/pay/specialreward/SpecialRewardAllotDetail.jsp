<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,date,combox,attachment" />
<script src='<c:url value="/biz/hr/pay/PayPublic.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/pay/specialreward/SpecialRewardAllotDetail.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div class="subject">奖罚分配表</div>
			<form method="post" action="" id="submitForm">
				<table class='tableInput' style="width: 99%;">
					<x:layout />
					<x:hidden name="auditId" />
					<x:hidden name="allotParentId" />
					<x:hidden name="firstAuditId" />
					<tr>
						<x:inputTD name="organName" required="false" disabled="true" label="公司名称" maxLength="64" />
						<x:inputTD name="billCode" required="false" disabled="true" label="单据号码" maxLength="32" />
						<x:inputTD name="fillinDate" required="false" disabled="true" label="填表日期" mask="date" />
					</tr>
					<tr>
						<x:inputTD name="personMemberName" required="false" disabled="true" label="制表人" maxLength="64" />
						<x:selectTD name="rewardApplyKind" required="false" label="类别" id="mainRewardApplyKind"  disabled="true" />
						<x:inputTD name="allAmount" required="false" label="总金额" mask="money"  disabled="true" />
					</tr>
					<tr>
						<x:inputTD name="title" required="false" label="奖罚事由" maxLength="64" colspan="5"  disabled="true" />
					</tr>
				</table>
			</form>
			<div class="blank_div"></div>
			<x:fileList bizCode="SpecialReward" bizId="firstAuditId" id="specialRewardFileList" />
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div>
	</div>
</body>
</html>