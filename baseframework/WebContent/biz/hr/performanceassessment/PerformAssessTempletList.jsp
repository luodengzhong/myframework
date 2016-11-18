<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.contextmenu.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/performanceassessment/PerformAssessTemplet.js"/>' type="text/javascript"></script>
<title>模板管理</title>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="组织树" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
						<ul id="maintree">
						</ul>
					</div>
				</div>
				<div position="center" style="margin: 0;">
					<x:hidden name="fullId" id="mainFullId"/>
					<x:hidden name="evaluationId"/>
					<x:hidden name="paType"/>
					<x:hidden name="templetId" id="mainTempletId"/>
					<x:select name="perStatus" id="perStatusQuery" list="PerStatus" cssStyle="display:none;"/>
					<div style="overflow: hidden; width: 100%; height: 100%;">
						<div id="maingrid" style="margin: 2px; float: left;"></div>
						<div id="indexgrid" style="margin: 2px; float: left;"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>