<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/extendedfield/extendedFieldDefine.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="扩展字段类别" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;"
						id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="扩展字段列表">
					<x:hidden name="parentId" id="treeParentId" />
					<x:title title="搜索" hideTable="queryTable" />
					<form method="post" action="" id="queryMainForm">
						<div class="ui-form" id="queryTable">
							<x:inputL name="fieldEname" label="字段英文名称" maxLength="30" />
							<x:inputL name="fieldCname" label="字段中文名称" maxLength="64" />
							&nbsp;&nbsp;
							<x:button value="查 询" onclick="query(this.form)" />
							&nbsp;&nbsp; &nbsp;&nbsp;
							<x:button value="重 置" onclick="resetForm(this.form)" />
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
