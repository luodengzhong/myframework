<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,combox,tree" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>'   type="text/javascript"></script>
<script src='<c:url value="/system/opm/authorization/Authorization.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="组织机构树" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
						<ul id="maintree">
						</ul>
					</div>
				</div>
				<div position="center" id='tabPage' style="margin: 0; border: 0">
					<div class="ui-tab-links">
						<ul style="left: 10px;">
							<li id="menuRoleAuthorize">角色授权</li>
							<li id="menuPermissionQuery">权限查询</li>
						</ul>
					</div>
					<div class="ui-tab-content" style="border: 0; padding: 2px;">
						<div class="layout" id="roleAuthorize" style="height: 100%;">
							<x:title title="搜索" hideTable="queryTable" id="navTitle01"/>
							<form method="post" action="" id="queryRoleForm">
								<div class='ui-form' id='queryTable'>
									<x:inputL name="roleCode" required="false" label="编码" readonly="false" labelWidth="60" />
									<x:inputL name="roleName" required="false" label="名称" labelWidth="60" />
									&nbsp;&nbsp;
									<x:button value="查 询" id="queryRoleFormBtn" />
									&nbsp;&nbsp;
									<x:button value="重 置" id="resetRoleFormBtn" />
									&nbsp;&nbsp;
								</div>
							</form>
							<div class="blank_div"></div>
							<div id="maingrid" style="margin: 2px;"></div>
						</div>
						<div class="layout" id="permissionQuery" style="height: 100%;">
							<x:title title="搜索" hideTable="queryPermissionTable" id="navTitle02"/>
							<form method="post" action="" id="queryPermissionMainForm">
								<div class='ui-form' id='queryPermissionTable'>
									<x:inputL name="funName" required="false" label="名称" labelWidth="60" />
									<x:selectL name="permissionKind" label="类别" maxLength="50" labelWidth="60"/>
									&nbsp;&nbsp;
									<x:button value="查 询" id="queryPermissionMainBtn" />
									&nbsp;&nbsp;
									<x:button value="重 置" id="resetPermissionMainBtn" />
									&nbsp;&nbsp;
								</div>
							</form>
							<div class="blank_div"></div>
							<div id="permissiongrid" style="margin: 2px;"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>