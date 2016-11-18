<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/system/opm/agent/Agent.js"/>'
	type="text/javascript"></script>
</head>
<div class="mainPanel">
	<div id="mainWrapperDiv">
		<x:title title="搜索" hideTable="queryTable" />
		<form method="post" action="" id="queryMainForm">
			<div class='ui-form' id='queryTable'>
				<x:inputL name="beginDate" required="false" label="开始日期" readonly="false"
					labelWidth="60" wrapper="date"/>
				<x:inputL name="endDate" required="false" label="结束日期" labelWidth="60"   wrapper="date"/>
				&nbsp;&nbsp;
				<x:button value="查 询" id="btnQuery" />
				<x:button value="重 置" id="btnReset" />
				&nbsp;&nbsp;
			</div>
		</form>
		<div class="blank_div"></div>
		<div id="maingrid" style="margin: 2px;"></div>
	</div>
</div>
</body>
</html>