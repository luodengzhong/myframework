<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/pa/pautil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/pa/projectdata/projectVariable.js"/>' type="text/javascript"></script>
</head>
<body>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="项目变量树" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
						<ul id="maintree">
						</ul>
					</div>
				</div>
				<div position="center" title="项目变量列表">
					<x:title title="搜索" hideTable="queryTable" />
					<form method="post" action="" id="queryMainForm">
						<div class='ui-form' id='queryTable'>
							<x:inputL name="variableCode" id="variableCode" required="false" label="编码" labelWidth="50" />
							&nbsp;&nbsp;
							<x:inputL name="variableName" id="variableName" required="false" label="名称" labelWidth="50" />
							&nbsp;&nbsp;
							<x:button value="查 询" id="btnQuery" />
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
