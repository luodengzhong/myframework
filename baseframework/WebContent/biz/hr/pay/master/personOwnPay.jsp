<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox" />
<script src='<c:url value="/biz/hr/setup/DetailUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/javaScript/PersonalPasswordAuth.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/pay/master/personOwnPay.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv" style="width: 99%;">
			<x:hidden name="archivesId" id="mainArchivesId" />
			<form method="post" action="" id="queryGridForm">
				<div class="ui-form" id="queryDiv" style="width: 900px;">
					<x:selectL name="statKind" label="统计方式" labelWidth="60" width="60" list="#{'1':'年','2':'期间','3':'时间'}" emptyOption="false" value="1" />
					<x:inputL name="year" required="false" label="年份" labelWidth="60" width="80" />
					<x:hidden name="periodId" />
					<x:inputL name="periodName" label="期间" required="false" wrapper="select" labelWidth="60" width="215" />
					<x:inputL name="dateBegin" label="时间起" required="false" wrapper="date" labelWidth="60" width="100" />
					<x:inputL name="dateEnd" label="时间止" required="false" wrapper="date" labelWidth="60" width="100" />
					<dl>
						<x:button value="查 询" onclick="query(this.form)" />
						&nbsp;&nbsp;
					</dl>
				</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div>
	</div>
</body>
</html>
