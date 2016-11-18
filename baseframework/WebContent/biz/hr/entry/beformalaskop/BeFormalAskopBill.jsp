<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,tree,combox" />
<script
	src='<c:url value="/biz/hr/entry/beformalaskop/BeFormalAskopBill.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div class="subject">员工转正意见征求表</div>
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
				<x:layout proportion="73px,160px,100px,160px,100px,160px" />
				<x:select name="scorePersonLevel" cssStyle="display:none;"
					id="scorePersonLevel" emptyOption="false" />
				<x:hidden name="id" />
				<x:hidden name="organId" />
				<x:hidden name="deptId" />
				<x:hidden name="positionId" />
				<x:hidden name="underAssessmentId" />
				<x:hidden name="personMemberId" />
				<x:hidden name="fullId" />
				<x:hidden name="organName" />
				<x:hidden name="fillinDate" type="date" />
				<x:hidden name="billCode" />
				<x:hidden name="deptName" />
				<x:hidden name="positionName" />
				<x:hidden name="personMemberName" />
				<x:hidden name="posLevel" />
				<x:hidden name="staffingPostsRank" />
				<x:hidden name="staffingPostsRankSequence"/>
			    <x:hidden name="perFullId"/>
				<tr>
				    <x:hidden name="ognId"/>
					<x:hidden name="archivesId" />
					<x:inputTD name="staffName" required="false" label="转正员工姓名"
						readonly="true" />
					<x:hidden name="centreId" />
					<x:inputTD name="center" required="false" label="员工所属中心"
						readonly="true" />
					<x:hidden name="dptId" />
					<x:inputTD name="dept" required="false" label="员工所属部门"
						readonly="true" />
				</tr>
				<tr>
					<x:hidden name="posId" />
					<x:inputTD name="pos" required="false" label="员工岗位" readonly="true" />
					<x:inputTD name="employedDate" required="false" label="员工入职时间"
						readonly="true" wrapper="date" />
					<td colspan="2" class="title"></td>
				</tr>
			</table>
			<x:title title="领导意见" name="group" />
			<table class='tableInput' style="width: 99%;">
				<x:layout proportion="93px,140px,100px,160px,100px,160px" />
				<tr>
					<x:selectTD name="opinion" required="true" label="是否同意转正" />
					<td colspan="4" class="title"></td>
				</tr>
				<tr id="salaryOpinionTr">
					<x:selectTD name="salaryOpinion" required="true" label="工资变动意见" />
					<x:hidden name="speakPersonMemberId" />
					<x:inputTD name="speakPersonMemberName" required="true"
						label="选择转正面谈人/员工直属上级" wrapper="select" />
				</tr>
			</table>
		</form>
		<div class="blank_div"></div>
		<div id="maingrid"></div>
	</div>
</body>
</html>
