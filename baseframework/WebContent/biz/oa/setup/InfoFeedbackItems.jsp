<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:choose>
<c:when test="${requestScope.height>0}">
<div style="height:${requestScope.height}px;overflow: auto">
</c:when>
<c:otherwise>
<div>
</c:otherwise>
</c:choose>
<form method="post" action="" id="infoFeedbackItemsForm">
	<table class='tableInput' style="width: 99%;">
		<x:layout proportion="30%,70%"/>
		<c:forEach items="${requestScope.infoFeedbackItems}" var="item">
		<tr>
			<td class="title" <c:if test="${item.remark!=''}">rowspan="2"</c:if>>
				&nbsp;&nbsp;
				<c:out value="${item.itemName}" />
				<c:if test="${item.required==1}">
					<font color="red">*</font>
				</c:if>
				:&nbsp;
			</td>
			<td class="edit">
				<input type='text' class='text' name="<c:out value="${item.itemId}"/>"
						value="<c:out value="${item.value}"/>"
						maxLength="100"
					   <c:if test="${item.editStyle=='date'}">
								date="true"
						</c:if>
						<c:if test="${item.required==1}">
							required="true" 
							label="<c:out value="${item.itemName}" />" 
						</c:if>
						<c:if test="${item.editStyle=='number'}">
						<c:choose>
							   <c:when test="${item.valueRange== ''}">
								mask="nnnnnnnnn.nnnn"
							   </c:when>
							   <c:otherwise>
							    mask="<c:out value="${item.valueRange}"/>"
								</c:otherwise>
						</c:choose>
						</c:if>
						<c:if test="${item.editStyle=='radio'}">
							    combo="true" dataOptions="data:'<c:out value="${item.valueRange}"/>'.split(',')"	
						</c:if>
						<c:if test="${item.editStyle=='checkbox'}">
							    combo="true" dataOptions="checkbox:true,data:'<c:out value="${item.valueRange}"/>'.split(',')"	
						</c:if>  
					 />	
			</td>
		</tr>
		<c:if test="${item.remark!=''}">
		<tr><td class="title"><c:out value="${item.remark}"/></td></tr>
		</c:if>
	</c:forEach>
	</table>
</form>
</div>