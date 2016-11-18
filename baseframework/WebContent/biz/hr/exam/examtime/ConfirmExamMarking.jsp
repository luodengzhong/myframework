<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<div style="padding: 10px; text-align: center;">
	<table class='tableInput examMainTable'' style="width:98%;">
		<tr>
			<td class="title">姓&nbsp;&nbsp;名</td>
			<td class="content"><c:out value="${personMemberName}" /></td>
		</tr>
		<tr>
			<td class="title">类&nbsp;&nbsp;型</td>
			<td class="content"><c:out value="${examinationTypeName}" /></td>
		</tr>
		<tr>
			<td class="title">分&nbsp;&nbsp;数</td>
			<td class="content">总分<font><c:out value="${totalScore}" /></font>分<c:if test="${passingScore >0}">,合格分数<font><c:out value="${passingScore}" /></font>分</c:if>
			</td>
		</tr>
		<tr style="height: 100px;">
			<td class="title">考试说明</td>
			<td class="content" style="vertical-align: top;">
				<div style="vertical-align: top;height: 100px;overflow-x:hidden;overflow-y:auto;">
					<c:set var="newline" value="<%= \"\n\" %>" />${fn:replace(remark,newline,"<br>")}
				</div>
			</td>
		</tr>
		<tr>
			<td class="title">考试结果</td>
			<td class="content">得分<font><c:out value="${finalScore}" /></font>分
			<c:choose>
				<c:when test="${isQualified==0}">
					<img src='<c:url value="/themes/default/images/err.gif"/>' width="24" height="24" align="absMiddle"/>&nbsp;<font>考试未通过!</font>
				</c:when>
				<c:when test="${isQualified==1}">
					<img src='<c:url value="/themes/default/images/right.gif"/>' width="24" height="24" align="absMiddle"/>&nbsp;通过考试!
				</c:when>
			</c:choose>
			</td>
		</tr>
	</table>
</div>

