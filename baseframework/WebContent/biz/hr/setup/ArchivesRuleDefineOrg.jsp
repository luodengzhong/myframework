<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,layout,grid,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/biz/hr/setup/ArchivesRuleDefineOrg.js"/>'
	type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="组织机构">
					<div
						style="overflow-x: hidden; overflow-y: auto; width: 100%; height: 250px;">
						<div style="margin: 2px; padding-left: 20px;">
							<a href="javascript:onFolderTreeNodeClick()" class="GridStyle">默认规则</a>
						</div>
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="计算规则">
					<form method="post" action="" id="submitForm">
						<x:hidden name="detailId" />
						<x:hidden name="id" />
						<x:hidden name="organId" />
						<x:textarea name="ruleContent" label="计算规则" rows="17"/>
					</form>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
