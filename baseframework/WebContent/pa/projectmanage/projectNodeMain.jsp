<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox,attachment" />

<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/pa/pautil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/pa/paFunctionDefine.js"/>' type="text/javascript"></script>
<script src='<c:url value="/pa/projectmanage/projectNodeMain.js"/>'
	type="text/javascript"></script>
<title>项目管理</title>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="divProjectName" class="ProcTitleStyle"
				style="line-height: 25px; font-size: 18px; font-weight: bold;">
			</div>
			<div id="divTitle" class="ProcTitleStyle"
				style="line-height: 25px; font-size: 18px; font-weight: bold;">
			</div>
			<div style="clear: both;"></div>
			<div id="divDocumentPanel">
				<div class="navbar" style="width: 100%;">
					<div class="navbar-l"></div>
					<div class="navbar-r"></div>
					<div class="navbar-icon">
						<img src="themes/default/images/milestone.gif">
					</div>
					<div class="navbar-inner">
						<b>资料文档</b>
					</div>
				</div>
				<div id="tdDocument"></div>
			</div>
			<div class="l-clear"></div>
			<div id="divFunctionPanel">
				<div class="navbar" style="width: 100%;">
					<div class="navbar-l"></div>
					<div class="navbar-r"></div>
					<div class="navbar-icon">
						<img src="themes/default/images/milestone.gif">
					</div>
					<div class="navbar-inner">
						<b>功能导航</b>
					</div>
				</div>
				<div class="l-clear"></div>
				<div id="divFunctionList"></div>
			</div>
			<div class="l-clear"></div>
			<div id="divRemarkPanel">
				<div class="navbar" style="width: 100%;">
					<div class="navbar-l"></div>
					<div class="navbar-r"></div>
					<div class="navbar-icon">
						<img src="themes/default/images/milestone.gif">
					</div>
					<div class="navbar-inner">
						<b>描述</b>
					</div>
				</div>
				<div id="divProjectNodeRemark" style="line-height: 150%;"></div>
			</div>
			<div class="l-clear"></div>

		</div>
	</div>
</body>
</html>