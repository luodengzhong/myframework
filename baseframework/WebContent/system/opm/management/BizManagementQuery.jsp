<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/management/BizManagementQuery.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/management/BizManagementOrgFilterCondition.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="组织机构树" id="mainmenu">
					<c:import url="BizManagementOrgFilterCondition.jsp"/>
					<x:title title="组织机构" name="group"/>
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;"
						id="divTreeArea">
						<ul id="orgTree">
						</ul>
					</div>
				</div>
				<div position="center" title="权限管理" id="bizManagementList">
					<div id="layout2" style="margin: 2px; margin-right: 3px;">
						<div position="left" title="业务权限">
							<div id="bizManagementType" style="margin: 2px;"></div>
						</div>
						<div position="center" title="权限列表">
							<div id="maingrid" style="margin: 2px;"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>