<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<title>在线帮助</title>
<link href='/f/themes/ligerUI/Aqua/css/ligerui-all.css' rel="stylesheet" type="text/css" />
<link href='<c:url value="/themes/ligerUI/ligerui-icons.css"/>' rel="stylesheet" type="text/css" />
<link href='<c:url value="/themes/ligerUI/Gray/css/layout.css"/>' rel="stylesheet" type="text/css" />
<script src='<c:url value="/lib/ligerUI/core/base.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/ligerUI/ligerui.all.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/ligerUI/plugins/ligerTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/ligerUI/plugins/ligerLayout.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquey.scrollLoad.js"/>' type="text/javascript"></script>
<script src='<c:url value="/help/help.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<x:hidden name="parentIds"/>
			<div id="layout">
				<div position="left" title="帮助导航">
					<div id='helpTab'>
						<div class="ui-tab-links">
							<ul style="left: 5px;">
								<li>目&nbsp;&nbsp;录</li>
								<li>索&nbsp;&nbsp;引</li>
							</ul>
						</div>
						<div class="ui-tab-content" style="padding: 5px;">
							<div class="layout" id="showTreeView" style="overflow-x: hidden; overflow-y: auto; width: 100%;">
								<ul id="maintree" style="height: 100%"></ul>
							</div>
							<div class="layout" id="showListView" style="overflow: hidden; width: 100%;">
								<div style="height: 25px; position: relative;top:0px;">
									<div class="ui-grid-query-div" style="width:100%; margin-top: 0px;">
										<input type="text" class="ui-grid-query-input" style="top: 0px;left:0px;width:98%;" id="ui-grid-query-input" /> 
										<span class="ui-grid-query-button" id="ui-grid-query-button" title="查询" style="top: 0px;"></span>
									</div>
								</div>
								<div id="scrollLoadDiv" style="overflow-x: hidden; overflow-y: auto; width: 100%;margin-top:2px;"></div>
							</div>
						</div>
					</div>
				</div>
				<div position="center" title="常见问题"><!--<c:url value="/help/test.htm"/>-->
					<iframe scrolling="auto" id="main_iframe" name="mainFrame" frameborder="0" src="" width="100%"
						style="width: 100%; height: 100%;" height="100%"></iframe>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
