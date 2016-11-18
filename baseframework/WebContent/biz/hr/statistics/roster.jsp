<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,layout,grid,tree,combox,date" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.contextmenu.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/javaScript/PersonalPasswordAuth.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/statistics/roster.js"/>' type="text/javascript"></script>
<style>
.l-link{ display:block; line-height:20px; height:20px; padding-left:10px;border:1px solid white; margin:2px;text-decoration: none;color: #000000}
.b-link{ display:block; line-height:20px; height:20px; padding-left:10px;background:#F5fafe; border:1px solid #bed5f3; margin:2px;text-decoration: none;color: #000000}
.l-link:hover,.b-link:hover{ background:#FFEEAC; border:1px solid #DB9F00;}
.b-link-select{background:#d9e8fb; border:1px solid #DB9F00;}
</style>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="pageLayout" style="margin-right:2px;">
				 	<div position="top">
				 		<div class="ui-panelBar" id='toolBar' checkAccess="false" style="border-width:0;"></div>
				 		<x:select name="tempArchivesState" list="archivesState" cssStyle="display:none;"/>
				 	</div>
		            <div position="center" id="pageCenter" style="overflow-x: hidden; overflow-y: auto;">
		            	<div id="rosterMainGrid" style="margin: 2px;"></div>
		            </div>
		    </div>
		</div>
	</div>
</body>
</html>
