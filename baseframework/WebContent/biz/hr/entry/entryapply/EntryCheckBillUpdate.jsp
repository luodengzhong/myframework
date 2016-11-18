<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox" />
<script
	src='<c:url value="/biz/hr/entry/entryapply/EntryCheckBillUpdate.js"/>'
	type="text/javascript"></script>

</head>
<body>
	<div class="ui-form" style="width: 99%;">
		<div class="subject">新员工入职手续办理</div>
		<form method="post" action="" id="submitForm">

			<div class="bill_info">
				<span style="float: left;"> 单据号码：<strong><c:out
							value="${billCode}" /></strong> &nbsp;&nbsp; 调查日期：<strong> <x:format
							name="fillinDate" type="date" /></strong>
				</span> <span style="float: right;"> 调查人：<strong><c:out
							value="${personMemberName}" /></strong>
				</span>
			</div>
			<div class="blank_div"></div>
			<table class='tableInput' id='queryTable'>
				<x:layout proportion="73px,160px,100px,160px,100px,160px" />

				<x:hidden name="id" id="entryId" />
				<x:hidden name="organId" />
				<x:hidden name="deptId" />
				<x:hidden name="positionId" />
				<x:hidden name="personMemberId" />
				<x:hidden name="fullId" />
				<x:hidden name="archivesId" />
				<x:hidden name="teacherId" />
				<x:hidden name="organName" />
				<x:hidden name="billCode" />
				<x:hidden name="deptName" />
				<x:hidden name="positionName" />
				<x:hidden name="fillinDate" type="date" />
				<x:hidden name="personMemberName" />
				<x:hidden name="taskId" />
				<tr>
					<x:inputTD name="staffName" required="false" label="入职员工"
						wrapper="select"  disabled="true"/>
					<x:inputTD name="ognName" required="false" label="入职单位"
						readonly="true" disabled="true"/>
					<x:inputTD name="centreName" required="false" label="入职中心"
						readonly="true" disabled="true"/>
				</tr>
				<tr>
					<x:hidden name="ognId" />
					<x:hidden name="centreId" />
					<x:hidden name="dptId" />


					<x:inputTD name="dptName" required="false" label="入职部门"
						readonly="true" disabled="true"/>
					<x:inputTD name="posName" required="false" label="入职岗位"
						readonly="true" disabled="true"/>
		           <x:selectTD name="staffingLevel" required="true" label="编制类别"  />	
				</tr>

				<tr>
					<x:inputTD name="entryTime" required="false" label="入职时间"
						wrapper="date" disabled="true"/>
					<x:selectTD name="isTrain" required="false" label="是否参加培训"
						dictionary="yesorno" disabled="true"/>
					<x:inputTD name="trainDate" required="false" label="培训时间"
						wrapper="date" disabled="true"/>

				</tr>
				<tr id="teacherTr">
					<x:inputTD name="proPeriod" required="false" label="试用期(月)"
						mask="nnn" disabled="true"/>
					<x:inputTD name="teacher" required="false" label="督导师姓名"
						wrapper="select" disabled="true"/>
					<td colspan="2" class="title"></td>
				</tr>
			</table>
			<x:title title="请确认以下资料是否上交" name="group" />
			<table class='tableInput' id='queryTable'>
				<x:layout proportion="73px,130px,80px,160px,100px,160px" />
				<tr>
					<x:radioTD name="healthReport" required="false" label="有无体检"
						dictionary="yesorno" value="1" />
					<x:radioTD name="idcardNoCopy" required="false" label="身份证复印件"
						dictionary="yesorno" value="1" />
					<x:radioTD name="bankCardCopy" required="false" label="银行卡复印件"
						dictionary="yesorno" value="1" />
				</tr>
				<tr id="entryNoId">
					<x:radioTD name="releaseLetter" required="false" label="离职证明"
						dictionary="yesorno" value="1" />
					<x:radioTD name="graduationCertreport" required="false"
						label="毕业证书复印件" dictionary="yesorno" value="1" />
					<td colspan="2" class="title"></td>

				</tr>
			</table>
			<x:hidden name="isComplete" />
		</form>
		<div class="blank_div"></div>
		<div id="maingrid"></div>
	</div>
</body>
</html>
