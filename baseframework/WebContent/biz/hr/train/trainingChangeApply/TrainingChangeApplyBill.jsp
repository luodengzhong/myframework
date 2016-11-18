<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/train/trainingChangeApply/TrainingChangeApplyBill.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
	<div class="subject">培训变更申请表</div>
	<div class="ui-form" style="width: 100%; left: 0px; padding: 3px;">
    <form method="post" action="" id="submitForm">
		<table class='tableInput' style="width: 99%;">
		<x:layout/>
		     <tr>
			<x:hidden name="changeApplyId"/>
			<x:hidden name="fullId"/>
			<x:hidden name="personMemberId"/>
			<x:hidden name="positionId"/>
			<x:hidden name="deptId"/>
			<x:hidden name="organId"/>
			<x:hidden name="status"/>
			<x:hidden name="trainingSpecialClassId"/>
		
		    <x:inputTD name="organName" disabled="true" required="false" label="公司名称" maxLength="64" />
			<x:inputTD name="billCode" disabled="true" required="false" label="单据号码" maxLength="32" />
			<x:inputTD name="fillinDate" disabled="true" required="false" label="填表日期" maxLength="7" wrapper="dateTime" />
			</tr>
			<tr>
			<x:inputTD name="personMemberName" required="false" label="姓名" maxLength="32" disabled="true"/>
			<x:inputTD name="deptName" required="false" label="部门" maxLength="32" disabled="true"/>
			<x:inputTD name="positionName" required="false" label="岗位" maxLength="32" disabled="true"/>
			</tr>
			<tr>
		    <x:textareaTD name="changeReason" required="true" label="变更原因" maxLength="512"  rows="3"  colspan="5"/>		
			</tr>
		</table>
	</form>
    <div class="blank_div"></div>
    <x:title title="变更前课程信息"  name="group"/>
	<div id="maingrid"  style="margin: 2px"></div>
	<div class="blank_div"></div>
    <x:title title="变更后课程信息"  name="group"/>
	<div id="afterMaingrid"  style="margin: 2px"></div>
</div>
</div>
</body>
</html>
