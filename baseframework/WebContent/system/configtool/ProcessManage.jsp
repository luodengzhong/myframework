<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
	<x:base include="layout,dialog,grid,dateTime,tree,combox"/>
	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
	<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
	<script src='<c:url value="/system/bpm/BpmUtil.js"/>' type="text/javascript"></script>
	<script src='<c:url value="/system/configtool/ProcessManage.js"/>' type="text/javascript"></script>
</head>
<body>
<div class="mainPanel">
	<div id="mainWrapperDiv">
		<div id="layout">
			<div position="left" title="流程分类树" id="mainmenu">
				<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
					<ul id="maintree"></ul>
				</div>
			</div>
			<div position="center" title="流程列表">
				<x:title title="搜索" hideTable="queryDiv"/>
				<form method="post" action="" id="queryMainForm">
					<div class="ui-form" id="queryDiv" style="width: 900px;">

						<x:inputL name="code" required="false" label="编码" maxLength="60" labelWidth="50"/>
						<x:inputL name="name" required="false" label="名称" maxLength="60" labelWidth="50"/>
						<x:button value="查 询" onclick="query(this.form)"/>
						&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)"/>
						&nbsp;&nbsp;
					</div>
				</form>
				<div class="blank_div"></div>
				<div id="maingrid" style="margin: 2px;"></div>
			</div>
		</div>
	</div>
</div>
</body>
</html>