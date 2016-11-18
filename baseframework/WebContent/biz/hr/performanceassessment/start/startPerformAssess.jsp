<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/performanceassessment/start/startPerformAssess.js"/>' type="text/javascript"></script>
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
				<div position="center" title="被考核人">
					<x:hidden name="fullId" id="mainFullId" />
					<x:hidden name="paType"/>
					<form method="post" action="" id="queryMainForm">
						<div class="ui-form" id="queryDiv" style="width: 900px;">
							<x:selectL name="periodCode" id="periodMapQuery" list="periodMap" label="类别" emptyOption="false" required="true" labelWidth="70"/>
							<x:inputL name="personName" required="false" label="条件" labelWidth="70"/>
							<dl>
								<x:button value="查 询" onclick="query(this.form)" />
							</dl>
						</div>
					</form>
					<div class="blank_div"></div>
					<div id="maingrid" style="margin: 2px; float: left;"></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>