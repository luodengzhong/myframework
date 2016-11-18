<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,layout,grid,dateTime,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/evaluate/stat/EvaluateOveralGrid.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<x:hidden name="evaluateStartId"/>
			<x:hidden name="evaluateOrgId"/>
			<div id="layout">
				<div position="left" title="被评价组织" id="mainmenu" style="padding-left: 5px">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
						<c:forEach items="${EvaluateOrgs}" var="org">
							<div class="list_view<c:if test="${org.id==evaluateOrgId}"> divChoose</c:if>">
								<a href="javascript:void(0);" id="${org.id}"  class="GridStyle" title="${org.name}">
									<c:out value="${org.name}" />
								</a>
							</div>
						</c:forEach>
					</div>
				</div>
				<div position="center" title="总体评价列表">
					<div id="showShowOverallEvaluation">
						<div id="maingrid" style="margin: 2px;"></div>
					</div>
					<div id="showUnqualifiedIndexGridManager">
						<div id="unqualifiedIndexGrid" style="margin: 2px;"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
