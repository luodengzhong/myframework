<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox,tree,layout" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/talentschosen/speechscoreresult/SpeechScoreResultList.js"/>' type="text/javascript"></script>
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
				<div position="center" title="竞聘候选人演讲分数列表">
					<x:hidden name="parentId" id="treeParentId" />
					<x:title title="竞聘候选人演讲分数列表" hideTable="queryDiv" />
					<div class="ui-form" id="queryDiv" style="width: 900px;">
					<form method="post" action="" id="queryMainForm">
							<x:hidden name="resultId" />
							<x:hidden name="resultAduitId" />
							<x:hidden name="candidateAduitId" />
							<x:hidden name="formId" />
							<x:hidden name="archivesId" />
							<x:hidden name="speechType" />

							<x:inputL name="staffName" required="false" label="员工姓名"
								maxLength="32" />
							<x:inputL name="posName" required="false" label="岗位"
								maxLength="64" />
							<x:inputL name="ognName" required="false" label="机构名称"
								maxLength="64" />
							<x:inputL name="chosenPosName" required="false" label="选拨岗位"
								maxLength="64" />
							<x:inputL name="chosenOrganName" required="false" label="选拨机构"
								maxLength="64" />
							<x:inputL name="chosenCenterName" required="false" label="选拨中心"
								maxLength="64" />
							<dl>
								<x:button value="查 询" onclick="query(this.form)" />
								&nbsp;&nbsp;
								<x:button value="重 置" onclick="resetForm(this.form)" />
								&nbsp;&nbsp;
							</dl>
					</form>
					</div>
					<div class="blank_div"></div>
					<div id="maingrid" style="margin: 2px"></div>
				</div>
			</div>
		</div>
</body>
</html>
