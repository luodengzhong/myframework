<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,combox,tree" />
<script src='<c:url value="/biz/hr/evaluate/setup/EvaluateOrgList.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<x:title title="搜索" hideTable="queryDiv" />
			<form method="post" action="" id="queryMainForm">
				<div class="ui-form" id="queryDiv" style="width: 900px;">
					<x:inputL name="orgUtilName" required="false" label="组织名称" maxLength="10" />
					<x:selectL name="evaluateOrgKind" required="false" label="类别"  labelWidth="50"/>
					<dl>
						<x:button value="查 询" onclick="query(this.form)" />&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)" />&nbsp;&nbsp;
					</dl>
				</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div>
	</div>
</body>
</html>
