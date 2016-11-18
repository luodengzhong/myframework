<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox,attachment" />
<script src='<c:url value="/biz/oa/info/InfoFeedbackViewList.js"/>'	type="text/javascript"></script>
<style>html{overflow:hidden;}</style>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<x:hidden name="infoPromulgateId" />
			<x:hidden name="hasFeedBackAttachment" />
			<x:title title="搜索" hideTable="queryDiv" />
			<form method="post" action="" id="queryMainForm">
				<div class="ui-form" id="queryDiv" style="width: 900px;">
					<x:inputL name="personName" required="false" label="姓名" labelWidth="40" width="100"/>
					<x:inputL name="fullName" required="false" label="组织信息" labelWidth="70" width="100"/>
					<dl>
						<dd style="width:220px">
							<x:checkbox name="isFeedBacker" label="反馈接收人" />&nbsp;
							<x:checkbox name="isNoFeedBack" label="未反馈人" />
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
