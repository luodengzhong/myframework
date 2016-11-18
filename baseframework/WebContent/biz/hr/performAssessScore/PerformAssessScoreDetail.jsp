<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox,layout,tree" />
<script src='<c:url value="/biz/hr/performAssessScore/PerformAssessScoreDetail.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="待评分列表" id="mainmenu" style="padding: 5px;">
					<div style="overflow-x: hidden; overflow-y: auto; width:100%" id="scoreLeft">
						<c:forEach items="${scorePersonList}" var="task">
							<div class="list_view">
								<a href="javascript:void(0);" id="${task.formId}" type="${task.paType}"  isOnJobAssess="${task.isOnJobAssess}"  isCountAsscore="${task.isCountAsscore }"  class="GridStyle"><c:out value="${task.formName}" /></a>
							</div>
						</c:forEach>
					</div>
				</div>
				<div position="center" title="评分详情" style="padding: 3px;" id="scoreCenter">
					<x:select name="levelMap" id="levelMapQuery" list="levelMap" cssStyle="display:none;"/>
					<div id="intancePage"></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>