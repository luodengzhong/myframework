<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox" />
<script src='<c:url value="/biz/oa/info/InfoReader.js"/>'	type="text/javascript"></script>
<style>html{overflow:hidden;}</style>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<x:hidden name="infoPromulgateId" />
			<x:title title="信息阅读表" hideTable="queryDiv"/>
			<form method="post" action="" id="queryMainForm">
				<div class="ui-form" id="queryDiv" style="width: 900px;">
					<x:inputL name="personName" required="false" label="姓名" labelWidth="40" width="80"/>
					<x:inputL name="fullName" required="false" label="组织信息" labelWidth="70" width="80"/>
					<x:selectL name="kindId" list="infoHandlerKind" required="false" label="人员类别" labelWidth="70" width="80"/>
					<dl>
						<dd style="width:180px">
							<x:radio name="readerKind" list="#{'1':'已读','2':'未读','3':'全部'}" value="1"/>
					    </dd>
					</dl>
					<dl>
						<x:button value="查 询" onclick="query(this.form)" />
						&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)" />
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
