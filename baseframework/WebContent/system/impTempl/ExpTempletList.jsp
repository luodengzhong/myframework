<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,combox,layout,tree" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/impTempl/ExpTemplet.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="模板分类" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="模板列表">
					 <x:hidden name="parentId"   id="treeParentId"/>
					<x:title title="模板表" hideTable="queryDiv" />
					<form method="post" action="" id="queryMainForm">
						<div class="ui-form" id="queryDiv" style="width: 900px;">
							<x:hidden name="id" />
							<x:inputL name="templetName" required="false" label="模板名称"
								maxLength="50" labelWidth="80" />
							<x:inputL name="templetCode" required="false" label="模板编码"
								maxLength="16" labelWidth="80" />
							<x:inputL name="tableName" required="false" label="中间表名称"
								maxLength="50" labelWidth="80" />
							<x:inputL name="procedureName" required="false" label="存储名称"
								maxLength="50" labelWidth="80" />
							<x:selectL name="sts" label="状态" maxLength="50" labelWidth="80"
								list="#{'-1':'停用','0':'草稿','1':'启用'}" />
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
	<iframe name="imp_main_iframe" style="display: none;" id='imp_main_iframe_id'></iframe>
</body>
</html>
