<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<div class="questionContent">
	<div style="color: #666666;">共:<c:out value="${questionCount}" />题&nbsp;&nbsp;当前第:<font style="font-size: 12px;"><c:out value="${sequence}" /></font>题</div>
	<div class="problem_title">
		<c:out value="${sequence}" />.&nbsp;<c:out value="${itemName}" />&nbsp; <span>(<c:out value="${itemTypeName}" />)</span>
	</div>
	<c:if test="${isQuestionPics}">
		<div class="show_question_img">
			<div style="color: #666666;">点击查看大图:</div>
			<c:forEach items="${questionPics}" var="pic" varStatus="picStatus">
				<img src='<c:url value="/attachmentAction!downFile.ajax?id=${pic.id}"/>'  style="display: none" border='0 ' onclick='showQuestionImg(${pic.id})' />
			</c:forEach>
		</div>
	</c:if>
	<c:choose>
		<c:when test="${isSubjective==0}">
		<c:forEach items="${questionItems}" var="item" varStatus="status">
			<div class="question_item" >
				<span class="item_index">${item.itemIndex}.</span><label><input type='<c:out value="${itemType}" />' name='f<c:out value="${personTaskQuestionsId}"/>' id="<c:out value="${item.personQuestionsItemId}"/>"<c:if test="${item.isSelect==1}">checked</c:if> /> &nbsp;<c:out value="${item.description}" /></label>
			</div>
		</c:forEach>					
		</c:when>
		<c:when test="${isSubjective==1}">
			 <textarea name='f<c:out value="${personTaskQuestionsId}"/>'  id="text<c:out value="${personTaskQuestionsId}"/>" maxlength="1200"  class="textarea"  style="height:120px"></textarea>		
		</c:when>
	</c:choose>
	<div style="margin: 5px; margin-left: 20px;">
		<a href="javascript:void(0);" onclick="submitQuestions(this)" hidefocus class="orangeBtn" id="<c:out value="${personTaskQuestionsId}"/>"  timer="<c:out value="${currentTimeMillis}"/>" isSubjective="<c:out value="${isSubjective}"/>">
			<span>提交答案</span>
		</a>
	</div>
</div>