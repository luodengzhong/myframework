<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox" />

<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/pa/pautil.js"/>' type="text/javascript"></script>
<script
	src='<c:url value="/pa/projectmanage/projectImplementation.js"/>'
	type="text/javascript"></script>
<title>项目执行进展</title>
</head>
<body>
	<div class="mainPanel" style="padding: 0px 0px 0px 2px;">
		<div id="mainWrapperDiv" >
			<x:title title="搜索" hideTable="queryTable" />
			<form method="post" action="" id="queryMainForm">
				<div class='ui-form' id='queryTable'>
					<x:inputL name="operName" id="operName" required="false" label="姓名"
						labelWidth="50" />
					&nbsp;&nbsp;
					<x:inputL name="content" id="content" required="false" label="内容"
						labelWidth="50" />
					&nbsp;&nbsp;
					<x:button value="查 询" id="btnQuery" />
				</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid" style="margin: 0px;"></div>
		</div>
	</div>
</body>
</html>