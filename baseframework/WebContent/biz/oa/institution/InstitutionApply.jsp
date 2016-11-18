<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox,attachment" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.contextmenu.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/lib/ligerUI/plugins/ligerTree.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/biz/oa/institution/InstitutionApply.js"/>'
	type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div class="subject">制 度 修 订 申 请 单</div>
			<div class="ui-form" style="width: 100%; left: 0px; padding: 3px;">
				<form method="post" action="" id="submitForm">
					<x:hidden name="institutionRootId"/>
					<x:hidden name="institutionProcessId" id="institutionProcessId" />
					<x:hidden name="organId" />
					<x:hidden name="deptId" />
					<x:hidden name="positionId" />
					<x:hidden name="positionName" />
					<x:hidden name="personMemberId" />
					<x:hidden name="fullId" />
					<x:hidden name="status" value="0" />
					<table class='tableInput' style="width: 99%;">
						<x:layout proportion="10%,21%,12%,21%,10%" />
						<tr>
							<x:inputTD name="organName" readonly="true" disabled="true"
								label="公司名称" maxLength="128" labelWidth="100"/>
							<x:inputTD name="fillinDate" label="填单日期" disabled="true"
								readonly="true" maxLength="7" wrapper="dateTime" labelWidth="100"/>
							<x:inputTD name="billCode" label="单据编号" labelWidth="100" disabled="true"
								maxLength="128" />
						</tr>
						<tr>
							<x:inputTD name="deptName" readonly="true" labelWidth="100" disabled="true"
								label="部门名称" maxLength="128" />
							<x:inputTD name="personMemberName" readonly="true"
								disabled="true" label="申请人" labelWidth="100" maxLength="128" />
							<td class="title">&nbsp;&nbsp;&nbsp;修订意见：</td>
							<td class="title">
								<x:button id="reviseAdviceCollect" value="修订意见征集"></x:button>
								<x:button id="readCollectedAdvice" value="反馈意见查看"></x:button>
							</td>
						</tr>
					</table>
					<x:fileList bizCode="OAInstReviseBody" bizId="institutionProcessId" id="instReviseBody" isClass="true"  proportion="10%,33%,57%,0%,0%,0%"/>
					<div id="textBody" style="display:none">
						<x:title name="group" title="修订详情" hideTable="#editDetail"/>
		    			<div id="editDetail"></div>
	    			</div>
	    			<x:title name="group" title="修订文件查看" hideTable="#fileListGrid"/>
	    			<div id="fileListGrid" style="display:none"></div>
				</form>

				<table border=0 cellspacing=0 cellpadding=0 style="width: 99%;height: 350px">
					<tr>
						<td width="225px"><x:title title="制度结构树" name="lastgroup" /></td>
						<td><x:title title="制度修订项" name="newInfo" />
						</td>
					</tr>
					<tr>
						<td valign="top">
							<div style="overflow-x: auto; overflow-y: auto; width: 225px;height: 325px">
								<ul id="maintree"></ul>
							</div>
						</td>
						<td valign="top">
							<div id="reviseInstitutionGrid"></div>
						</td>
					</tr>
				</table>
				<form method="post" action="" id="submitWfForm">
					<div style="width: 99%;" id="approverList">
						<x:taskExecutionList procUnitId="Approve" defaultUnitId="Approve"
							bizId="bizId" />
					</div>
				
				</form>
			</div>
		</div>
	</div>
</body>
</html>
