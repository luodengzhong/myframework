<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,layout,grid,date,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/pay/PayPublic.js"/>' type="text/javascript"></script>
<script src='<c:url value="/javaScript/PersonalPasswordAuth.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/pay/change/PayChangeAuditDetailList.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="组织机构" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="薪酬变动明细">
					<x:title title="搜索" hideTable="queryDiv" />
					<form method="post" action="" id="queryMainForm">
						<div class="ui-form" id="queryDiv" style="width: 900px;">
							<x:inputL name="billCode" required="false" label="单据号码" maxLength="32"/>
							<x:inputL name="fillinBeginDate" required="false" label="填表日期起" wrapper="date"/>	
							<x:inputL name="fillinEndDate" required="false" label="填表日期止" wrapper="date"/>
							<x:inputL name="personMemberName" required="false" label="制单人" maxLength="64" />
							<x:hidden name="archivesId"/>
							<x:inputL name="archivesName" required="false" label="变化人员" maxLength="64" wrapper="select"/>
							<x:selectL name="isEffect" label="是否生效" dictionary="yesorno"/>
							<x:inputL name="executionBeginTime" required="false" label="生效日期起" wrapper="date"/>	
							<x:inputL name="executionEndTime" required="false" label="生效日期止" wrapper="date"/>
							<x:select name="wageChangeKindList" label="薪酬变动类别" cssStyle="display:none" dictionary="wageChangeKind"/>
							<x:inputL name="wageChangeKind" required="false" label="薪酬变动类别" />
							<%-- <x:selectL name="oldWageKind" label="原薪酬类别" dictionary="wageKind"/>
							<x:selectL name="newWageKind" label="调整后薪酬类别" dictionary="wageKind"/> --%>
							<x:selectL list="oldWageKindList" id="oldWageKind" name="oldWageKind" label="原薪酬类别" />
							<x:selectL list="newWageKindList" id="newWageKind" name="newWageKind" label="调整后薪酬类别" />
							<dl>
								<dd style="width:120px;">
									<x:checkbox name="isArchivesCheck" label="按档案查询"/>
								</dd>
								<x:button value="查 询" onclick="query(this.form)" />&nbsp;&nbsp;
								<x:button value="重 置" onclick="resetForm(this.form)" />&nbsp;&nbsp;
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
