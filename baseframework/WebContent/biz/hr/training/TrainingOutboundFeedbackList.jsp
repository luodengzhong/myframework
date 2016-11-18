<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
	<x:base include="dialog,grid,dateTime,combox"/>
	<script src='<c:url value="/biz/hr/training/TrainingOutboundFeedback.js"/>' type="text/javascript"></script>
</head>
<body>
<div class="mainPanel">
	<div id="mainWrapperDiv">
		<x:title title="外送培训情况反馈" hideTable="queryDiv"/>
		<div class="ui-form" id="queryDiv" style="width:900px;">
		<form method="post" action="" id="queryMainForm">
				<x:hidden name="trainingOutboundFeedbackId"/>
				<x:inputL name="centreName" required="false" label="一级中心名称" maxLength="64"/>
				<x:inputL name="ognName" required="false" label="单位名称" maxLength="64"/>
				<x:inputL name="dptName" required="false" label="部门" maxLength="64"/>
				<x:inputL name="staffName" required="false" label="员工姓名" maxLength="64"/>
				<x:inputL name="course" required="false" label="培训课程" maxLength="128"/>
				<x:inputL name="teacherName" required="false" label="培训讲师" maxLength="32"/>
				<x:inputL name="orgName" required="false" label="培训机构" maxLength="128"/>
				<x:inputL name="orgContact" required="false" label="联系人" maxLength="16"/>
				<x:inputL name="orgTel" required="false" label="联系电话" maxLength="16"/>
				<x:inputL name="startTime" required="false" label="开始时间" wrapper="date" maxLength="7"/>
				<x:inputL name="endTime" required="false" label="结束时间" wrapper="date" maxLength="7"/>
				<x:inputL name="place" required="false" label="培训地点" maxLength="128"/>
				<x:inputL name="trainingType" required="false" label="培训方式" maxLength="32"/>
				<dl>
					<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
					<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
				</dl>
		</form>
		</div>
		<div class="blank_div"></div>
		<div id="maingrid"  style="margin: 2px"></div>
	</div>
</div>
</body>
</html>
