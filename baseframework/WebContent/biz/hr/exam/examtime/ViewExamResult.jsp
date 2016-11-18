<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<html>
<head>
<x:base include="dialog" />
<link href='<c:url value="/biz/hr/exam/examtime/style.css"/>' rel="stylesheet" type="text/css" />
<script src='<c:url value="/biz/hr/exam/examtime/ViewExamResult.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="subject"><c:out value="${subject}" /></div>
	<div style="padding: 10px; text-align: center;">
		<x:hidden name="taskId" id="mainPanelTaskId" />
		<x:hidden name="examPersonTaskId" />
		<table class='tableInput examMainTable''>
			<tr>
					<td class="title">考试编号</td>
					<td class="content"><c:out value="${startBillCode}" /></td>
			</tr>
			<tr>
				<td class="title">姓&nbsp;&nbsp;名</td>
				<td class="content"><c:out value="${personMemberName}" /></td>
			</tr>
			<tr>
				<td class="title">类&nbsp;&nbsp;型</td>
				<td class="content"><c:out value="${examinationTypeName}" /></td>
			</tr>
			<c:if test="${passingScore >0}">
			<tr>
				<td class="title">分&nbsp;&nbsp;数</td>
				<td class="content">总分<font><c:out value="${totalScore}" /></font>分,合格分数<font><c:out value="${passingScore}" /></font>分
				</td>
			</tr>
			</c:if>
			<tr style="height: 100px;">
				<td class="title">考试说明</td>
				<td class="content" style="vertical-align: top;">
					<div style="vertical-align: top; height: 100px; overflow-x: hidden; overflow-y: auto;">
						<c:set var="newline" value="<%= \"\n\" %>" />${fn:replace(remark,newline,"<br>")}
					</div>
				</td>
			</tr>
			<c:if test="${isNotCreateNotify!=1}">
			<tr>
				<td class="title">考试结果</td>
				<td class="content">
				<c:choose>
						<c:when test="${status==2}">
							<font style="color:blue;">等待阅卷</font>
						</c:when>
						<c:otherwise>
							得分<font><c:out value="${finalScore}" /></font>分
							<c:choose>
								<c:when test="${isQualified==0}">
									<img src='<c:url value="/themes/default/images/err.gif"/>' width="24" height="24" align="absMiddle" />&nbsp;<font>考试未通过!</font>
								</c:when>
								<c:when test="${isQualified==1}">
									<img src='<c:url value="/themes/default/images/right.gif"/>' width="24" height="24" align="absMiddle" />&nbsp;通过考试!
								</c:when>
							</c:choose>
						</c:otherwise>
				</c:choose>
				</td>
			</tr>
			</c:if>
			<c:if test="${!isReadOnly}">
				<c:if test="${isViewAnswer==1}">
				<tr>
					<td colspan="2" style="text-align: center">
						请点击<a href="javascript:forwardQuestionAnswerList();" class="GridStyle" style="font-size:16px;">这里</a>查询正确答案!
					</td>
				</tr>
				</c:if>
				<c:if test="${createButton}">
				<tr>
					<td colspan="2" style="text-align: center">
						<c:choose>
							<c:when test="${usedRetakeNum>=retakeNum||isQualified==1}">
								<a href="javascript:saveCompleteTask();" hidefocus class="orangeBtn" ><span>提&nbsp;&nbsp;交</span></a>
							</c:when>
							<c:otherwise>
								还有<font><c:out value="${retakeNum-usedRetakeNum}" />次</font>考试机会,请
								<a href="javascript:saveReStartExamTask();" hidefocus class="orangeBtn" ><span>重新考试</span></a>
							</c:otherwise>
						</c:choose>
					</td>
				</tr>
				</c:if>
			</c:if>
		</table>
	</div>
</body>
</html>