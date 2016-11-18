<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox,tree,layout" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/talentschosen/talentschosendemand/CompetitionPositionList.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="组织机构" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;"
						id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="竞聘岗位列表">
					<x:hidden name="parentId" id="treeParentId" />
					<x:title title="竞聘岗位列表" hideTable="queryDiv" />
					<div class="ui-form" id="queryDiv" style="width: 900px;">
						<form method="post" action="" id="queryMainForm">
							<x:hidden name="competePositionId" />
							<x:hidden name="queryType" />
							<x:inputL name="chosenOrganName" required="false" label="单位名称"
								maxLength="64" />
							<x:inputL name="chosenCenterName" required="false" label="中心名称"
								maxLength="64" />
							<x:inputL name="chosenDeptName" required="false" label="部门名称"
								maxLength="64" />
							<x:inputL name="chosenPosName" required="false" label="竞聘岗位名称"
								maxLength="64" />
							<x:selectL name="status" required="false" label="状态"
								list="#{'1':'启用','-1':'禁用','0':'草稿'}" />
							<x:inputL name="chosenNum" required="false" label="拟选拨人数"
								maxLength="22" />
							<dl>
								<x:button value="查 询" onclick="query(this.form)" />
								&nbsp;&nbsp;
								<x:button value="重 置" onclick="resetForm(this.form)" />
								&nbsp;&nbsp;
							</dl>
					</div>
					</form>
					<div class="blank_div"></div>
					<div id="maingrid" style="margin: 2px"></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
