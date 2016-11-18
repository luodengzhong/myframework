<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<link href='<c:url value="/biz/hr/exam/examtime/style.css"/>' rel="stylesheet" type="text/css" />
<x:base include="dialog,grid,dateTime,combox,layout,attachment" />
<script src='<c:url value="/biz/hr/exam/examtime/ExamMarking.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="待阅卷列表" id="mainmenu" style="padding: 5px;">
					<div style="overflow-x: hidden; overflow-y: auto; width:100%" id="examMarkingLeft">
						<c:forEach items="${examPapers}" var="task">
							<div class="list_view<c:if test="${task.examMarkingId==examMarkingId}"> divChoose</c:if>">
								<a href="javascript:void(0);" id="${task.examMarkingId}"  class="GridStyle">
									<c:out value="${task.subject}" />
								</a>
							</div>
						</c:forEach>
					</div>
				</div>
				<div position="center" title="详情" style="padding: 3px;" id="examMarkingCenter">
					<div id="examMarkingQuestion"><c:import url="/biz/hr/exam/examtime/ExamMarkingQuestion.jsp" /></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>