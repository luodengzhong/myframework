<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,tree,dialog,grid,dateTime,combox" />
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/attendance/statistics/AttPersonalStatistics.js?version=201512191"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">

			<x:title title="搜索" hideTable="queryDiv" />
			<div class="ui-form" style="width: 900px;">
				<form method="post" action="" id="queryForm">
					<x:hidden name="organId" />
					<x:hidden name="archivesId" />

					<x:inputL name="startDate" label="开始时间" required="true" wrapper="date" width="120" labelWidth="70" />
					<x:inputL name="endDate" label="结束时间" required="true" wrapper="date" width="120" labelWidth="70" />
					<x:inputL name="staffName" required="true" label="员工" wrapper="select" />
					<dl>
						<x:button value="统计" onclick="statistics(this.form)" />
						&nbsp;&nbsp;
					</dl>

				</form>
			</div>
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div>
	</div>
</body>
</html>
