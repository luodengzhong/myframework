<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox" />
<script src='<c:url value="/biz/hr/entry/teacherscore/TeacherScoreList.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<x:title title="督导师评分列表" hideTable="queryDiv" />
			<form method="post" action="" id="queryMainForm">
				<div class="ui-form" id="queryDiv" style="width: 900px;">
					<x:hidden name="teacherScoreId" />
					<x:inputL name="staffName" required="false" label="员工姓名" maxLength="32" />
					<x:inputL name="teacher" required="false" label="督导师" maxLength="32" />
					<dl>
						<x:button value="查 询" onclick="query(this.form)" />
						&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)" />
						&nbsp;&nbsp;
					</dl>
				</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div>
	</div>
</body>
</html>
