<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,layout,grid,date,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/pay/staffwelfare/noStaffwelfarePerson.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel" style="margin-top: 5px;">
		<div id="layout">
			<div position="left" title="组织机构" id="mainmenu">
				<div style="overflow-x: hidden; overflow-y: auto; width: 99%; height: 355px;">
					<ul id="maintree"></ul>
				</div>
			</div>
			<div position="center" title="人员列表">
				<x:title title="搜索" hideTable="queryDiv" />
				<form method="post" action="" id="queryMainForm">
					<div class="ui-form" id="queryDiv" style="width: 900px;">
						<x:inputL name="year" required="false" label="业务年"  width="80" spinner="true"/>
						<x:hidden name="impPeriodId" />
						<x:inputL name="periodName" label="业务期间" required="true" wrapper="select" labelWidth="80" width="250" />
						<div class='clear'></div>
						<x:inputL name="impArchivesName" required="false" label="姓名" maxLength="64" labelWidth="80" />
						<x:selectL name="impyesorno" dictionary="yesorno" label="是否购买公积金" labelWidth="100" width="80" />
						<dl>
							<x:button value="查 询" onclick="query(this.form)" />
							&nbsp;&nbsp;
						</dl>
					</div>
				</form>
				<div class="blank_div"></div>
				<div id="maingrid" style="margin: 2px;"></div>
			</div>
		</div>
	</div>
</body>
</html>
