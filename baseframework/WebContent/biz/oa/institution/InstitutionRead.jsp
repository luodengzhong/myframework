<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox,attachment" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<link href='<c:url value="/biz/oa/institution/InstitutionView.css"/>' rel="stylesheet" type="text/css" />
<script src='<c:url value="/lib/jquery/jquery.tooltip.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/institution/InstitutionRead.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="制度树" >
					<div style="overflow-x: hidden; overflow-y: auto;width: 100%;" id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="模块详细信息"  style="overflow: auto;">
					<div id="institutionInfo"></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>