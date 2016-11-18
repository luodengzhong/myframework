<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
	<x:base include="dialog,grid,dateTime,combox"/>
	<script src='<c:url value="/biz/hr/training/TrainingStudentGroup.js"/>' type="text/javascript"></script>
</head>
<body>
<div class="mainPanel">
	<div id="mainWrapperDiv">
		<x:title title="学员分组" hideTable="queryDiv"/>
		<form method="post" action="" id="queryMainForm">
			<div class="ui-form" id="queryDiv" style="width:900px;">
				<x:hidden name="trainingStudentGroupId"/>
				<x:hidden name="trainingSpecialClassId"/>
				<x:inputL name="name" required="false" label="组名" maxLength="32"/>
				<x:inputL name="slogan" required="false" label="口号" maxLength="64"/>
				<x:inputL name="leader" required="false" label="组长" maxLength="16"/>
				<dl>
					<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
					<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
				</dl>
			</div>
		</form>
		<div class="blank_div"></div>
		<div id="maingrid" style="margin: 2px"></div>
	</div>
</div>
</body>
</html>
