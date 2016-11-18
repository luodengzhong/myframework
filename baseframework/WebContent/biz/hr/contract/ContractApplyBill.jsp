<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox,tree" />
<script src='<c:url value="/biz/hr/contract/ContractApplyBill.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div class="subject">劳动合同续签意见征求表</div>
		<form method="post" action="" id="submitForm">
			<div class="bill_info">
				<span style="float: left;"> 单据号码：<strong><c:out
							value="${billCode}" /></strong> &nbsp;&nbsp; 申请日期：<strong> <x:format
							name="fillinDate" type="date" /></strong>
				</span> <span style="float: right;"> 申请人：<strong><c:out
							value="${personMemberName}" /></strong>
				</span>
			</div>
			<div class="blank_div"></div>
			<table class='tableInput' style="width: 99%;">
				<x:layout proportion="73px,160px,80px,160px,80px,160px" />
				<x:hidden name="contractApplyId" id="contractApplyId" />
				<x:hidden name="deptId" />
				<x:hidden name="positionId" />
				<x:hidden name="fullId" />
				<x:hidden name="positionId" />
				<x:hidden name="personMemberId" />
				<x:hidden name="organId" />
				<x:hidden name="deptRenewId" />
				<x:hidden name="archivesId" />
				<x:hidden name="organName" />
				<x:hidden name="perFullId"/>
				<x:hidden name="billCode" />
				<x:hidden name="fillinDate" type="date" />
				<x:hidden name="deptName" />
				<x:hidden name="positionName" />
				<x:hidden name="personMemberName" />
				<x:hidden name="centerRenewId"/>
				<x:hidden name="centerRenewName"/>
				<tr>
					<x:inputTD name="archivesName" required="false" label="续签员工姓名"
						maxLength="32" />
					<x:inputTD name="idCardNo" required="false" label="身份证号"
						maxLength="18" />
					<x:inputTD name="contracEndDate" required="false" label="合同到期时间"
						wrapper="date" />
				</tr>
				<tr>
				    <x:inputTD name="organRenewName" required="false" label="续签单位"
						maxLength="32" />
					<x:inputTD name="deptRenewName" required="false" label="续签部门"
						maxLength="32" />
					<x:inputTD name="posRenewName" required="false" label="续签岗位"
						maxLength="32" />
				</tr>
				<tr>
					<x:selectTD name="staffKind" required="false" label="人员类别" />
					<x:selectTD name="staffingLevel" required="false" label="编制状态" />
					<x:selectTD name="contractKind" required="false" label="合同种类" />
				</tr>
				<tr>
					<x:selectTD name="renewType" required="false" label="续签类型" />
					<td colspan="4" class="title">&nbsp;</td>
				</tr>
				<tr id="renewTimeTr">
					<x:inputTD name="renewTime" required="false" label="续签时间(/月)"  mask="nnnn"/>
					<td colspan="4" class="title">&nbsp;</td>
				</tr>
			</table>
		</form>
	</div>
</body>
</html>
