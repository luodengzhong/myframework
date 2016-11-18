<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/dictionary/Dictionary.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="系统字典分类" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;"
						id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="系统字典列表">
					<x:hidden name="parentId" id="treeParentId" />
					<x:title title="搜索" hideTable="queryDiv" />
					<form method="post" action="" id="queryMainForm">
						<div class="ui-form" id="queryDiv">
							<x:inputL name="code" label="编码" maxLength="50" labelWidth="60"/>
							<x:inputL name="name" label="名称" maxLength="50" labelWidth="60"/>
							<div class="clear"></div>
							<x:selectL name="kind" label="类别" maxLength="50" labelWidth="60" list="#{'0':'系统','1':'用户'}"/>
							<x:selectL name="status" label="状态" maxLength="50" labelWidth="60" list="#{'-1':'禁用','0':'草稿','1':'启用'}"/>
							<dl>
								<x:button value="查 询" onclick="query(this.form)" />
								&nbsp;&nbsp;
								<x:button value="重 置" onclick="resetForm(this.form)" />
								&nbsp;&nbsp;
							</dl>
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
