<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<html>
<head>
<x:base include="layout,grid,dialog,tree,combox,attachment" />
<link href='<c:url value="/biz/hr/exam/examtime/style.css"/>' rel="stylesheet" type="text/css" />
<script src='<c:url value="/biz/hr/exam/examtime/ExamTask.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="time-item" id="show_count_down">
		<strong id="hour_show">0时</strong> 
		<strong id="minute_show">0分</strong>
		<strong id="second_show">0秒</strong>
	</div>
	<div class="mainPanel" style="padding: 10px; text-align: center">
		<x:hidden name="taskId" id="mainPanelTaskId" />
		<x:hidden name="examPersonTaskId" />
		<x:hidden name="timeout" id="allTimeout" />
		<x:hidden name="usedTimeout" />
		<c:choose>
			<c:when test="${status==0||status==1}">
				<div id="examMainInfo">
					<div class="subject"><c:out value="${subject}" /></div>
					<table class='tableInput examMainTable' id="mainTableInput">
						<tr>
							<td class="title">考试编号</td>
							<td class="content"><c:out value="${startBillCode}" /></td>
						</tr>
						<tr>
							<td class="title">类&nbsp;&nbsp;型</td>
							<td class="content"><c:out value="${examinationTypeName}" /></td>
						</tr>
						<tr>
							<td class="title">时间限制</td>
							<td class="content"><font><c:out value="${timeout}" /></font>分钟</td>
						</tr>
						<c:if test="${passingScore >0}">
						<tr>
							<td class="title">分&nbsp;&nbsp;数</td>
							<td class="content">总分<font><c:out value="${totalScore}" /></font>分,合格分数<font><c:out value="${passingScore}" /></font>分</td>
						</tr>
						</c:if>
						<c:if test="${retakeNum >1}">
						<tr>
							<td class="title">允许考试次数</td>
							<td class="content"><font><c:out value="${retakeNum}" /></font>次</td>
						</tr>
						</c:if>
						<tr style="height: 100px;">
							<td class="title">考试说明</td>
							<td class="content" style="vertical-align: top">
								<div style="vertical-align: top;height: 100px;overflow-x:hidden;overflow-y:auto;">
									<c:set var="newline" value="<%= \"\n\" %>" />
									${fn:replace(remark,newline,"<br>")}
								</div>
							</td>
						</tr>
						<tr id="showExamStartFileList" style="display:none;">
							<td class="title">考试资料</td>
							<td class="content"><x:fileList bizCode="examStart" bizId="examStartId" id="examStartFileList" readOnly="true"  isWrap="false"/></td>
						</tr>
						<tr>
							<td class="title" colspan="2">
								<c:choose>
									<c:when test="${status==0}">
										<a href="javascript:startExamTask();" hidefocus class="orangeBtn"><span>开始考试</span></a>
									</c:when>
									<c:when test="${status==1}">
										<a href="javascript:continueExamTask();" hidefocus class="orangeBtn"><span>继续考试</span></a>
									</c:when>
								</c:choose>
							</td>
						</tr>
					</table>
				</div>
				<div id="examQuestionInfo" style="display: none;"></div>
			</c:when>
			<c:when test="${status==2}">
				<c:import url="/biz/hr/exam/examtime/CreateMarking.jsp" />
			</c:when>
			<c:when test="${status==3}">
				<c:import url="/biz/hr/exam/examtime/ExamEnd.jsp" />
			</c:when>
		</c:choose>
	</div>
</body>
</html>
