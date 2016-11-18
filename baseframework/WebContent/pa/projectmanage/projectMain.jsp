<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox" />

<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/pa/pautil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/pa/projectmanage/projectMain.js"/>'
	type="text/javascript"></script>
<title>项目管理</title>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div class="controlPanel">
				<div style="padding: 0px; float: right; margin-top: -5px;">
					<span class="ui-button"><span class="ui-button-left"></span><span
						class="ui-button-right"></span> <input id="btnStop" type="button"
						class="ui-button-inner" value="中止" /> </span> <span class="ui-button"><span
						class="ui-button-left"></span><span class="ui-button-right"></span>
						<input id="btnContinue" type="button" class="ui-button-inner"
						value="恢复" /> </span> <span class="ui-button"><span
						class="ui-button-left"></span><span class="ui-button-right"></span>
						<input id="btnPause" type="button" class="ui-button-inner"
						value="暂停" /></span> <span class="ui-button"><span
						class="ui-button-left"></span><span class="ui-button-right"></span>
						<input id="btnReset" type="button" class="ui-button-inner"
						value="重置" /></span> <span class="ui-button"><span
						class="ui-button-left"></span><span class="ui-button-right"></span>
						<input id="btnReStart" type="button" class="ui-button-inner"
						value="重启" /> </span>
				</div>
				<div class="projectTitle" id="divProjectTitle"></div>
			</div>
			<div class="detailPanel">
				<div style="float: left;">
					<a href="javascript:void(null);" title="点击查看项目详情" id="btnShow"
						style="color: Blue; text-decoration: none;">查看项目详情 </a>
				</div>
				<div style="float: right; padding-right: 15px;">
					<div class="projectNodeStatus_3">已处理</div>
					<div class="projectNodeStatus_2">处理中</div>
					<div class="projectNodeStatus_1">未处理</div>
				</div>
			</div> 
			<div id="divProjectNode"></div>
			<div class="l-clear"></div>
			<div id="divProjectImplementationPanel">
				<div class="navbar" style="width: 100%;">
					<div class="navbar-l"></div>
					<div class="navbar-r"></div>
					<div class="navbar-icon">
						<img src="themes/default/images/milestone.gif">
					</div>
					<div class="navbar-inner">
						<a onclick="showProjectImplemetationMore()"
							href="javascript:void(null);"><b>项目执行进展情况</b> </a>
					</div>
				</div>
				<div id="divProjectImplementation" style="line-height: 150%;">
				</div>
			</div>
		</div>
	</div>
</body>
</html>