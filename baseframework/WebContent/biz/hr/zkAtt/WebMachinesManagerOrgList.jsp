<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,layout,grid,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/zkAtt/WebMachinesManagerOrg.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<x:hidden name="macSnId"/>
		<div id="mainWrapperDiv">
			<div id="maingrid"></div>
		</div>
	</div>
</body>
</html>
