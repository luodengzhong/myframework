<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox" />
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/meeting/MeetingKind.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="会议类型管理" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;"
						id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="会议类型列表">
					<x:hidden name="parentId" id="treeParentId" />
					<x:select list="messageKindList" emptyOption="false"
						id="messageKindId" cssStyle="display:none;" />
					<x:title title="搜索" hideTable="queryDiv" />
					<form method="post" action="" id="queryMainForm">
						<div class="ui-form" id="queryDiv">
							<x:inputL name="code" label="编码" maxLength="32" labelWidth="60"/>
							<x:inputL name="name" label="名称" maxLength="64" labelWidth="60"/>
							<x:selectL name="meetingLevel" required="false" labelWidth="60" list="meetingLevelList" label="会议等级" maxLength="64"/>
							<div class="clear"></div>
							<x:selectL name="status" label="启用状态" maxLength="2" labelWidth="60" dictionary="yesorno" width="60"/>
							<x:selectL name="isSpecializedCommittee" label="专委会会议" maxLength="2" labelWidth="80" dictionary="yesorno" width="60"/>
							<dl>
								<x:button value="查 询" onclick="query(this.form)" />
								&nbsp;&nbsp;
								<x:button value="重 置" onclick="resetForm(this.form)" />
								&nbsp;&nbsp;
							</dl>
						</div>
					</form>
					<div class="blank_div"></div>
					<div id="maingrid" style="margin: 2px;"></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
