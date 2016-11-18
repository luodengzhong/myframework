<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox" />
<script src='<c:url value="/pa/pautil.js"/>' type="text/javascript"></script>
<script
	src='<c:url value="/pa/projectmanage/showTransactionHandle.js"/>'
	type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel" style="padding: 0px 0px 0px 2px;">
		<div id="mainWrapperDiv">
			<x:title title="搜索" hideTable="queryTable" />
			<form method="post" action="" id="queryMainForm">
				<div class='ui-form' id='queryTable'>
					<x:inputL name="name" id="code" required="false" label="事务名称"
						labelWidth="60" />
					&nbsp;&nbsp;
					<x:inputL name="content" id="content" required="false" label="内容"
						labelWidth="36" />
					&nbsp;&nbsp;
					<x:button value="查 询" id="btnQuery" />
				</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div>
	</div>
</body>
</html>
