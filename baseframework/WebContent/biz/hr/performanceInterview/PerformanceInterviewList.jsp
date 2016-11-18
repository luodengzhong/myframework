<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,layout,grid,date,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/performanceInterview/PerformanceInterviewList.js"/>' type="text/javascript"></script>
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

				<div position="center" title="绩效面谈">
					<x:title title="搜索" hideTable="queryDiv" />
					<form method="post" action="" id="submitForm">
						<x:hidden name="auditId" />
						<div class="ui-form" id="queryDiv" style="width: 900px;">
							<x:inputL name="billCode" required="false" label="单据号码" maxLength="32" />
							<x:inputL name="fillinBeginDate" required="false" label="填表日期起" wrapper="date" />
							<x:inputL name="fillinEndDate" required="false" label="填表日期止" wrapper="date" />
							<x:inputL name="personMemberName" required="false" label="制单人" maxLength="64" />
							<x:inputL name="staffName" required="false" label="员工" maxLength="32" />
							<x:selectL name="status" required="false" label="申请状态" maxLength="22" />
							<x:select name="posLevel" id="mainPosLevel" cssStyle="display:none;" emptyOption="false" />
							<x:inputL name="year" required="false" label="考核年" maxLength="32" />
							<x:selectL list="#{'1':'第一季度','2':'第二季度','3':'第三季度','4':'第四季度'}" name="periodIndex" emptyOption="false" required="false" label="考核时间" />
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
