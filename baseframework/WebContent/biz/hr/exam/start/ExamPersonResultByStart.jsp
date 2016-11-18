<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,layout,grid,date,tree,combox" />
<script src='<c:url value="/biz/hr/exam/start/ExamPersonResultUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/exam/start/ExamPersonResultByStart.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<form method="post" action="" id="queryMainForm">
				<div class="ui-form" id="queryDiv" style="width: 900px;">
					<x:hidden name="examStartId" />
					<x:inputL name="examSubject"  label="考试主题"	wrapper="select" width="250" required="true"/>	
					<x:inputL name="archivesName" required="false" label="姓名" maxLength="64" />
					<dl>
						<x:button value="查 询" onclick="query(this.form)" />&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)" />&nbsp;&nbsp;
					</dl>
				</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid" style="margin: 2px;"></div>
		</div>
	</div>
</body>
</html>
