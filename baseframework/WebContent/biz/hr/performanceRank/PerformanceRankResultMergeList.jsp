<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,tree,dialog,grid,dateTime,combox" />
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>'
	type="text/javascript"></script>
<script
	src='<c:url value="/biz/hr/performanceRank/PerformanceRankResultMergeList.js"/>'
	type="text/javascript"></script>
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

				<div position="center" title="绩效排名结果">
					<x:title title="搜索" hideTable="queryDiv" />
					<form method="post" action="" id="submitForm">
						<x:hidden name="fullId" />
						<div class="ui-form" id="queryDiv" style="width: 900px;">
							<x:select name="performanceLevel" id="mainPerformanceLevel"
								dictionary="performanceLevel" cssStyle="display:none;"
								emptyOption="false" />
							<x:select name="assessCycle" id="mainAssessCycle"
								dictionary="assessCycle" cssStyle="display:none;"
								emptyOption="false" />
							<dl>
								<dt style="width: 60px;">考核年&nbsp;:</dt>
								<dd style="width: 80px;">
									<x:input name="year" required="false" label="考核年" maxLength="4"
										cssStyle="width:80px;" />
								</dd>
							</dl>
							<dl>
								<dt style="width: 73px;">考核周期&nbsp;:</dt>
								<dd style="width: 80px;">
									<x:select list="period" name="periodCode" 
										required="false" label="考核周期" />
								</dd>
							</dl>
							<dl>
								<dt style="width: 73px;">考核时间&nbsp;:</dt>
								<dd style="width: 175px;">
									<x:input name="periodIndex" required="false" label="考核时间" />
								</dd>
							</dl>
							<div class='clear'></div>
							<dl>
								<dt style="width: 60px;">人员&nbsp;:</dt>
								<dd style="width: 120px;">
									<x:input name="staffName" required="false" label="考核时间" />
								</dd>
							</dl>
							<x:inputL name="startDate" required="false" label="开始日期"
								wrapper="date"  labelWidth="80" width="100"/>
							<x:inputL name="endDate" required="false" label="结束日期"
								wrapper="date" labelWidth="80" width="100" />
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
