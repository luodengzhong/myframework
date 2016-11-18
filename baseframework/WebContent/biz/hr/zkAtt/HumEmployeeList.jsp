<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox" />
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/zkAtt/HumEmployee.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<x:title title="人员信息表" hideTable="queryDiv" />
			<x:hidden name="otherOrgId" id="mainOtherOrgId"/>
			<form method="post" action="" id="queryMainForm">
				<div class="ui-form" id="queryDiv" style="width: 900px;">
					<x:inputL name="empNo" required="false" label="人员编号" maxLength="32" />
					<x:inputL name="empName" required="false" label="人员名称" maxLength="32" />
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
