<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox,attachment" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/biz/oa/institution/InstitutionConfig.js"/>'
	type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<x:hidden name="institutionId"/>
				<x:hidden name="institutionName"/>
				<x:hidden name="fullName"/>
				<div position="left" title="制度树" >
					<div style="overflow-x: hidden; overflow-y: auto;width: 100%;" id="oaInstitution">
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="详细信息">
					<div id="institutionConfigGrid"></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>