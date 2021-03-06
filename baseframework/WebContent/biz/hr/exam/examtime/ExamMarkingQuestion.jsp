<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<div style="margin-top: 10px; margin-bottom: 5px; text-align: center">
	<span style="font-size: 20px; font-weight: bold;"> <c:out value="${subject}" /></span>
</div>
<div class="navline"></div>
<input type="hidden" id="examMarkingId" value='<c:out value="${examMarkingId}"/>'/>
<input type="hidden" id="examPersonTaskId" value='<c:out value="${examPersonTaskId}"/>'/>
<c:set var="newline" value="<%= \"\n\" %>" />
<div class="questionListContent" style="width:98%;margin-top:0px;border: 0px">
<c:forEach items="${questions}" var="question" >
	<div class="questionType<c:out value="${question.isSubjective}" />">
		<div class="bill_info" style="font-size: 16px; font-weight: bold;">
			<c:out value="${question.sequence}" />.&nbsp;<c:out value="${question.itemName}" />&nbsp;
			<span style="font-size: 14px;">(<c:out value="${question.itemTypeName}" />)&nbsp;</span>
			<c:choose>
				 <c:when test="${question.isSubjective==0}">
					<span style="font-size: 12px;color: #dddddd">回答</span>
					<c:choose>
						<c:when test="${question.isRight==1}">
						<img src='<c:url value="/themes/default/images/right.gif"/>' width="24" height="24" align="absMiddle" title="你的回答"/>
						</c:when>
						<c:otherwise>
						<img src='<c:url value="/themes/default/images/err.gif"/>' width="24" height="24" align="absMiddle" title="你的回答"/>
						</c:otherwise>
					</c:choose>
				</c:when>
				<c:when test="${question.isSubjective==1}">
					 <font style="font-size: 14px;">得分:&nbsp;</font>
					 <input type="text" class="text" 
					 	index="<c:out value="${question.sequence}" />" 
					 	score="<c:out value="${question.score}" />" 
					 	name="finalScore"
						id="<c:out value="${question.personTaskQuestionsId}" />" 
						value="<c:out value="${question.finalScore}" />"/>
				</c:when>
			</c:choose>	
		</div>
		<c:if test="${question.isQuestionPics}">
			<div class="show_question_img">
				<div style="color: #666666;">点击查看大图:</div>
				<c:forEach items="${question.questionPics}" var="pic" varStatus="picStatus">
					<img src='<c:url value="/attachmentAction!downFile.ajax?id=${pic.id}"/>'  style="display: none" border='0 ' onclick='showQuestionImg(${pic.id})' />
				</c:forEach>
			</div>
		</c:if>
		<c:choose>
		 <c:when test="${question.isSubjective==0}">
			<c:forEach items="${question.questionItems}" var="item"   varStatus="status">
			<div class="bill_info" style="margin: 5px;margin-left:20px;vertical-align:middle">
				<span class="item_index">${item.itemIndex}.</span>
				<span class="<c:out value="${question.itemType}" /><c:if test="${item.isSelect==1}"> <c:out value="${question.itemType}" />checked</c:if>"></span>
				&nbsp;<c:out value="${item.description}"/>&nbsp;
				<c:if test="${item.isCorrect==1}"><img src='<c:url value="/themes/default/images/right.gif"/>' width="16" height="16" align="absMiddle" title="正确答案"/></c:if>
			</div>					
			</c:forEach>
		 </c:when>
			<c:when test="${question.isSubjective==1}">
				 <div>${fn:replace(question.answer,newline,"<br>")}</div>
			</c:when>
		</c:choose>
		<div class="line"></div>
	</div>
</c:forEach>
</div>