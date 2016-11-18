<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime" />
<script src='<c:url value="/biz/hr/recruit/personnelquota/personOrganNumberList.js"/>' type="text/javascript"></script>

</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
					<x:title title="人员快报" hideTable="queryDiv" />
					<form method="post" action="" id="queryMainForm">
						<div class="ui-form" id="queryDiv" style="width: 900px;">
                           <x:hidden name="year"/>
                           <x:hidden name="month"/>
						</div>
					</form>
					<div class="blank_div"></div>
					<div id="maingrid" style="margin: 2px;"></div>
				</div>
			</div>
</body>
</html>
