<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<div class="questionContent" style="text-align: center;margin-top: 5%;" id="examEndDiv">
	<div class="subject">考试结束，您的得分为:<b style="color:#ff0000;font-size:24px;"><c:out value="${finalScore}" /></b>分</font></div>
	<div class="bill_info">
		本次考试总分<font><c:out value="${totalScore}" />分</font>,合格分数<font><c:out value="${passingScore}" />分</font>;
	</div>
	<c:choose>
		<c:when test="${isQualified==0}">
		<div class="bill_info" style="margin-left:20px">
			<img src='<c:url value="/themes/default/images/err.gif"/>' width="48" height="48" align="absMiddle"/>&nbsp;<font>考试未通过!</font>
		</div>
		<div class="bill_info"  style="margin-left:20px">
			<c:choose>
					<c:when test="${usedRetakeNum>=retakeNum}">
						<a href="javascript:saveCompleteExamTaskWriteBack();" hidefocus class="orangeBtn" ><span>完成考试任务</span></a>
					</c:when>
					<c:otherwise>
						还有<font><c:out value="${retakeNum-usedRetakeNum}" />次</font>考试机会,请
						<a href="javascript:saveReStartExamTask();" hidefocus class="orangeBtn" ><span>重新考试</span></a>
					</c:otherwise>
			</c:choose>
		</div>
		</c:when>
		<c:when test="${isQualified==1}">
		<div class="bill_info' style="margin-left:20px">
			<img src='<c:url value="/themes/default/images/right.gif"/>' width="48" height="48" align="absMiddle"/>&nbsp;<span style="font-size:20px;">恭喜您通过考试!</span>
		</div>
		<div class="bill_info" style="margin-left:20px">
			<a href="javascript:saveCompleteExamTaskWriteBack();" hidefocus class="orangeBtn" ><span>完成考试任务</span></a>
		</div>
		</c:when>
	</c:choose>
	<c:if test="${isViewAnswer==1}">
		<div class="bill_info" id="showViewAnswerDiv">
		 请点击<a href="javascript:forwardQuestionAnswerList();" class="GridStyle" style="font-size:16px;">这里</a>查询正确答案!
		</div>
	</c:if>
</div>