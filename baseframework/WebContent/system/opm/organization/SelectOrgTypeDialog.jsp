<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree" />
<script src='<c:url value="/system/opm/organization/SelectOrgTypeDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/cfg/CommonTree.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<x:hidden name="orgKindId" />
			<x:hidden name="isMultipleSelect" />
			<div id="orgTypeLayout">
				<div position="left" title="组织类型树" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
						<ul id="maintree">
						</ul>
					</div>
				</div>
				<div position="center" title="列表">
					<x:title title="搜索" hideTable="queryTable" />
					<form method="post" action="" id="queryMainForm">
						<div class="ui-form" id="queryTable">
							<x:inputL name="code" required="false" label="编码" readonly="false" labelWidth="50" width="100" />
							<x:inputL name="name" required="false" label="名称" labelWidth="50" width="120" />
							&nbsp;&nbsp;
							<x:button value="查 询" id="btnQuery" />
						</div>
					</form>
					<div class="blank_div"></div>
					<div id="orgTypeGrid" style="margin: 2px;"></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>