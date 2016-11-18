<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
	<x:base include="layout,dialog,grid,dateTime,tree,combox"/>
	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
	<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
	<script src='<c:url value="/system/bpm/BpmUtil.js"/>' type="text/javascript"></script>
	<script src='<c:url value="/system/configtool/approvalRule/ApprovalRule.js"/>' type="text/javascript"></script>
	<script src='<c:url value="/system/configtool/approvalRule/ApprovalRuleUtil.js"/>' type="text/javascript"></script>
	<script src='<c:url value="/system/configtool/approvalRule/ApprovalHandlerDetailConfig.js"/>' type="text/javascript"></script>
	<script src='<c:url value="/system/opm/js/OpmUtil.js"/>'	type="text/javascript"></script>
</head>
<body>
<div class="mainPanel">
	<div id="mainWrapperDiv">
		<div id="layout">
			<div position="left" title="组织机构" id="mainmenu">
				<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divOrgTreeArea">
					<ul id="orgTree">
					</ul>
				</div>
			</div>
			<div position="center" id="layoutProc" style="margin: 2px; margin-right: 3px;">
				<div position="left" title="流程树">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divProcTreeArea">
						<ul id="maintree">
						</ul>
					</div>
				</div>
				<div position="center"  id="layoutApprovalRule" style="overflow-y: auto;">
					<div position="left" title="流程审批规则树">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divApprovalRuleTreeArea">
						<ul id="approvalRuleTree">
						</ul>
					</div>
				    </div>
					<div position="center">
						<div position="top" style="margin: 2px; margin-right: 3px;">
						   <div id="toolBar" ></div>
					    </div>
						<x:hidden name="approvalRuleId"/>
						<x:title name="group" title="审批规则" hideTable="#queryTable"/>
						<table class='tableInput' id='queryTable'style="margin: 2px;width:99%;">
							<x:layout proportion="12%,21%,12%,21%,12%,21%"/>
							<tr>
								<x:radioTD name="nodeKindId" list="nodeKindList" id="approvalRuleNodeKindId"
										   required="false" label="类别" maxLength="22"/>
								<x:radioTD name="status" list="statusList" id="approvalRuleStatus" required="false"
										   label="状态" maxLength="22"/>
								<x:inputTD name="priority" required="false" id="approvalRulePriority" label="优先级"
										   maxLength="22" readonly="true"/>
							</tr>
							<tr>
								<x:inputTD name="createTime" label="创建时间" readonly="true" wrapper="dateTime"/>
								<x:inputTD name="creatorName" label="创建人" readonly="true"/>
								<x:inputTD name="lastUpdateTime" label="修改时间" readonly="true" wrapper="dateTime"/>
							</tr>
							<tr>
								<x:inputTD name="lastUpdaterName" label="修改人" readonly="true"/>
								<x:inputTD name="scopeNames" label="适用范围" readonly="true" colspan="3"/>
							</tr>
							<tr>
								<x:textareaTD name="remark" required="false" id="approvalRuleRemark" label="备注"
											  rows="2" colspan="5" readonly="true"></x:textareaTD>
							</tr>
						</table>
						<div id="elementGrid" style="clear: both; margin: 2px;"></div>
						<div id="handlerGrid" style="clear: both; margin: 2px;"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<x:select name="fieldType" dictionary="fieldType" emptyOption="false" style="display:none;"/>
<x:select name="fieldAuthority" dictionary="fieldAuthority" emptyOption="false" style="display:none;"/>
<x:select list="operatorKindList" emptyOption="false" id="operatorKindId" cssStyle="display:none;"/>
<x:hidden name="procKey" id="approvalRuleProcKey"/>
<x:hidden name="procUnitId" id="approvalRuleProcUnitId"/>
<x:hidden name="procName" id="approvalRuleProcName"/>
<x:hidden name="procUnitName" id="approvalRuleProcUnitName"/>
<x:hidden name="name" id="approvalRuleName"/>
</body>
</html>
