<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/permission/Role.js"/>' type="text/javascript"></script>
<title>角色管理</title>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="角色树" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;"
						id="divTreeArea">
						<ul id="maintree">
						</ul>
					</div>
				</div>
				<div position="center" style="margin:0;">
					<x:hidden name="mainRoleId"/>
					<x:hidden name="mainrRoleKindId"/>
					<div style="overflow: hidden; width: 100%; height: 100%;">
						<div id="maingrid" style="margin: 2px; float: left;"></div>
						<div id="permissiongrid" style="margin: 2px; float: left;"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>