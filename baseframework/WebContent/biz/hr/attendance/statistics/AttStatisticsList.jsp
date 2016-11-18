<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,tree,dialog,grid,dateTime,combox" />
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/attendance/statistics/AttStatisticsList.js?version=20151219"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
					<div class="ui-form" style="width: 900px;">
						<x:hidden name="organId"/>
						<x:inputL name="organName" label="统计单位" required="true" colspan="3" wrapper="tree" width="220"/>
						<x:selectL name="isWageUnit" emptyOption="false" required="true" label="是否按工资主体"  labelWidth="120"  dictionary="yesorno" width="60" />
						<div class="clear"></div>
						<x:inputL name="year" label="业务年" required="true" cssStyle="width:60px;" width="60"/>
						<x:hidden name="periodId" />
						<x:inputL name="periodName" label="业务期间" required="true" wrapper="combo" width="220"/>
						<dl>
							<x:button value="统计" id="st" onclick="statistics(this.form)" />
						</dl>
					</div>
					<x:title title="搜索" hideTable="queryDiv" />
					<form method="post" action="" id="queryForm">
						<x:hidden name="auditId" />
						<div class="ui-form" id="queryDiv" style="width: 900px;">
							<x:inputL name="staffName" required="false" label="姓名" labelWidth="60" width="120" />
							<x:inputL name="statisticsKind" label="统计类型"  labelWidth="60" width="120"/>
							<x:inputL name="days" required="false" label="大于" labelWidth="40" width="60" mask="nn"/>
							<dl>
								<x:button value="查 询" onclick="query(this.form)" />
								<x:button value="重 置" onclick="resetForm(this.form)" />
							</dl>
						</div>
					</form>
					<div class="blank_div"></div>
					<div id="maingrid" style="margin: 2px;"></div>
				</div>
			</div>
</body>
</html>
