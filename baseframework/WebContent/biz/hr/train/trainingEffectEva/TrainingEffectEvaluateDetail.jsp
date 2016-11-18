<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox" />
<script
	src='<c:url value="/biz/hr/train/trainingEffectEva/TrainingEffectEvaluateDetail.js"/>'  type="text/javascript"></script>
</head>
<body>
	<div class="ui-form" style="width: 99%;">
		<div class="subject">培训效果评估表</div>
		<form method="post" action="" id="submitForm">
			<table class='tableInput' id='queryTable'>
				<x:layout proportion="70px,70px,70px,70px" />
				<x:hidden name="evaluateId" />
				<x:hidden name="taskId" />
				<x:hidden name="trainingClassCourseId" />
				<x:hidden name="trainingStudentId" />
				<x:hidden name="trainingCourseId" />
				<x:hidden name="trainingTeacherId" />
				<x:hidden name="teacherType" />
				<tr>
					<x:inputTD name="trainingCourseName" required="false" label="课程名称"
						readonly="true" cssClass="textReadonly" />
					<x:inputTD name="trainingTeacherName" required="false" label="讲师姓名"
						readonly="true" cssClass="textReadonly" />
				</tr>
				<tr>
					<x:inputTD name="courseStartTime" required="false" label="培训时间"
						wrapper="dateTime" readonly="true" />
					<x:inputTD name="trainingStudentName" required="false" label="学员姓名"
						readonly="true" cssClass="textReadonly" />
				</tr>
			</table>
			<x:title title="请就下面每一项进行评价,1分表示差,10分表示好" name="group" id="" />
			<table class='tableInput' id="trainingEvaluteContent">
				<x:layout proportion="70px,140px,70px" />
				<x:select name="levelMapValue" list="EvaValue" cssStyle="display:none;" emptyOption="false"/>
				<c:forEach items="${indexList}" var="item">
					<tr>
						<input type='hidden' name='evaluateDetailId'
							value='<c:out value="${item.evaluateDetailId}"/>' />
						<input type='hidden' name='type'
							value='<c:out value="${item.type}"/>' />
						<c:choose>
							<c:when test="${item.itemCount>0}">
								<td class="title" width="100"
									rowspan='<c:out value="${item.itemCount}"/>'
									title='<c:out value="${item.mainItem}"/>'
									style='text-align: center;'><c:out
										value="${item.mainItem}" /></td>
							</c:when>
						</c:choose>
						<td title='<c:out value="${item.item}"/>' class="title"
							style='margin: 15px;'><c:out value="${item.item}" /></td>


						<td class="edit"><input class="text" name="result"
							id="result" required="true"
							value='<c:out value="${item.result}" />' /></td>
					</tr>
				</c:forEach>
			</table>
			<table class='tableInput' id="innerSuggest">
				<x:layout proportion="70px,70px,70px,70px" />
				<tr>
					<x:inputTD name="receiving" required="false" label="参加此次培训的收获(多选)"
						maxLength="32" colspan="3" wrapper="select" />
				</tr>
				<tr>
					<x:inputTD name="otherReceiving" required="false" label="其他收获"
						maxLength="1024" colspan="3" />
				</tr>
				<tr>
					<x:inputTD name="totalScore" required="true" label="您给予这次培训的总评分是（以10分计）"
						 colspan="3"  mask="nnn"/>
				</tr>
				<tr>
					<x:textareaTD name="suggest" required="false" label="其他建议或培训需求"
						maxLength="512" colspan="3" rows="3" />
				</tr>
			</table>
			<table class='tableInput' id="outerSuggest">
				<x:layout proportion="70px,70px,70px,70px" />
				<tr>
					<x:selectTD  name="isCommend" required="false" label="您是否愿意邀请这位老师来公司做内训?" dictionary="yesorno" />
					<td class="title" colspan="2"></td>
				</tr>
				<tr>
					<x:textareaTD name="commendReason" required="false" label="原因"
						maxLength="512" colspan="3" rows="3" />
				</tr>
			</table>
		</form>
	</div>
</body>
</html>