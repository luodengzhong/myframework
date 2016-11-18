<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/system/configtool/segmentation/BizSegmentationAuthorize.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>'
	type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="组织机构树" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;"
						id="divTreeArea">
						<ul id="orgTree">
						</ul>
					</div>
				</div>

				<div position="center" title="业务段授权" id="bizManagementList">
					<div id="layout2" style="margin: 2px; margin-right: 3px;">
						<div position="left" title="基础段类别">
							<div id="baseSegmentationType" style="margin: 2px;"></div>
						</div>
						<div position="center" title="业务段列表">
							<div id="maingrid" style="margin: 2px;"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>