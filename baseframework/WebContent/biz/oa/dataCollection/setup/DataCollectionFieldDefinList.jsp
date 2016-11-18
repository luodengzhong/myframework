<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,combox" />
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/dataCollection/setup/DataCollectionFieldDefin.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<x:hidden name="dataCollectionKindId" id="mainDataCollectionKindId"/>
			<x:hidden name="kindFieldGroupId" id="mainKindFieldGroupId"/>
			<div id="layout">
				<div position="left" title="字段分组" id="mainmenu" style="padding: 5px;">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
						<c:forEach items="${Rows}" var="obj">
							<div class="list_view">
								<a href="javascript:void(0);" id="${obj.kindFieldGroupId}"  class="GridStyle" title="${obj.groupName}" >
									<c:out value="${obj.groupName}" />
								</a>
							</div>
						</c:forEach>
					</div>
				</div>
				<div position="center" title="字段列表">
					<form method="post" action="" id="queryMainForm">
						<div class="ui-form" id="queryDiv" style="width: 900px;">
							<x:inputL name="paramValue" required="false" label="关键字" maxLength="32" labelWidth="60" width="120"/>
							<x:selectL name="allField" dictionary="yesorno" label="显示全部字段" width="60"/>
							<x:selectL name="isCondition" dictionary="yesorno" label="查询条件" width="60" labelWidth="60" />
							<x:selectL name="isShow" dictionary="yesorno" label="查询显示" width="60" labelWidth="60" />
							<dl>
								<x:button value="查 询" onclick="queryForm(this.form)" />&nbsp;&nbsp;
								<x:button value="重 置" onclick="resetForm(this.form)" />&nbsp;&nbsp;
							</dl>
						</div>
					</form>
					<div id="maingrid" style="margin: 2px;"></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>