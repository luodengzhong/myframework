<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<div style="margin-top: 10px; margin-bottom: 5px; text-align: center">
	<span id="landTitle" style="font-size: 20px; font-weight: bold;"> <c:out value="${performAssessScore.title}" /></span>
</div>
<div class="navline"></div>
<input type="hidden" id="performAssessScoreFormId" value='<c:out value="${formId}"/>'/>
<input type="hidden" id="performAssessScoreType" value='<c:out value="${paType}"/>'/>
<table class='tableInput' id="performAssessScoreTable" style="width:99%">
	<x:layout proportion="30px,100px,260px,70px" />
	<thead>
		<tr class="table_grid_head_tr">
			<th>序号</th>
			<th>指标名称</th>
			<th>要求</th>
			<th>评分</th>
		</tr>
	</thead>
	<tbody id="performAssessScoreTbody">
		<c:forEach items="${performAssessScore.items}" var="item" varStatus="status">
			<tr>
			<td style="text-align: center;" class="title"><c:out value="${status.index+1}" /></td>
				<c:choose>
					<c:when test="${item.itemCount>0}">
						<td class="title" width="100" rowspan='<c:out value="${item.itemCount}"/>' style='text-align: center;'>
						<c:out value="${item.partContent}" />
						</td>
					</c:when>
				</c:choose>
				<td title='<c:out value="${item.desption}"/>' class="title"><c:out value="${item.desption}" /></td>
				<td class="edit">
					<input class="text" name="score" required="true" defaultScore="<c:out value="${item.scoreNum}"/>" id="<c:out value="${item.detailId}" />" value='<c:out value="${item.scale}" />'/>
				</td>
			</tr>
		</c:forEach>
	</tbody>
</table>
<div style="height: 10px"></div>