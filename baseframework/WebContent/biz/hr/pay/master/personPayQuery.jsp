<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox,tree" />
<script src='<c:url value="/biz/hr/setup/DetailUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/javaScript/PersonalPasswordAuth.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/pay/master/personPayQuery.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv" style="width: 99%;">
			<form method="post" action="" id="queryGridForm">
				<div class="ui-form" id="queryDiv" style="width: 900px;">
					<x:hidden name="qFullId" id="mainFullId" />
					<x:inputL name="mainOrgName" required="false" label="组织机构" readonly="false" wrapper="select"/>
					<x:inputL name="archivesQueryName" label="员工" required="false"  />
					<%-- <x:selectL name="wageKind" label="薪酬类别" labelWidth="80" /> --%>
					<x:selectL list="wageKindList" id="wageKind" name="wageKind" label="薪酬类别" labelWidth="80" />
					<div class="clear"></div>
					<x:inputL name="year" required="false" label="年份"  width="80" />
					<x:selectL name="wageAffiliation" label="工资归属" />
					<div class="clear"></div>
					<x:inputL name="dateBegin" label="时间起" required="false" wrapper="date" />
					<x:inputL name="dateEnd" label="时间止" required="false" wrapper="date" />
					<dl>
						<x:button value="查 询" onclick="query(this.form)" />
						<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
					</dl>
				</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div>
	</div>
</body>
</html>
