<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,layout,grid,dateTime,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/pay/performance/initUi.js"/>' type="text/javascript"></script>
<script src='<c:url value="/javaScript/PersonalPasswordAuth.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/pay/performance/PayPerformanceDetailList.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="组织机构" id="mainmenu">
					<x:hidden name="myOrganId" />
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="绩效奖金列表">
					<x:title title="搜索" hideTable="queryDiv" />
					<form method="post" action="" id="queryMainForm">
						<div class="ui-form" id="queryDiv" style="width: 900px;">
							<x:inputL name="billCode" required="false" label="单据号码" maxLength="32" />
							<x:inputL name="fillinBeginDate" required="false" label="填表日期起" wrapper="date" />
							<x:inputL name="fillinEndDate" required="false" label="填表日期止" wrapper="date" />
							<x:inputL name="personMemberName" required="false" label="制单人" maxLength="64" />
							<x:hidden name="periodId"/>
					        <x:inputL name="periodName" label="业务期间" required="false" wrapper="combo"/>
							<x:selectL list="period" name="periodCode"  required="false" label="考核周期" />
					        <x:inputL name="periodIndex" required="false" label="考核时间" />
					        <x:hidden name="orgUnitId"/>
					        <x:inputL name="orgUnitName" required="false" label="计算主体" wrapper="tree"/>
					        <x:inputL name="archivesName" required="false" label="姓名" />
					        <%-- <x:selectL name="wageKind" label="工资类别" /> --%>
					        <x:hidden name="wageKind" />
					 		<x:inputL name="wageKindList"  label="工资类别" wrapper="select" />
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
