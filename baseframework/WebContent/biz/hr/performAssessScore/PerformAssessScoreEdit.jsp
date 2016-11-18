<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<table class='tableInput' id="performAssessScoreTable" style="width:99%">
	<x:layout proportion="50px,30px,80px,300px,30px" />
	<thead>
		<tr class="table_grid_head_tr">
			<th>项目</th>
			<th>指标名称</th>
			<th>序号</th>
			<th>指标要求</th>
			<th>分值</th>
		</tr>
	</thead>
	<tbody id="performAssessScoreTbody">
		<c:forEach items="${performAssessScoreList}" var="item">
			<tr>
				<input type='hidden' name='formId' value='<c:out value="${item.formId}"/>' />
				<input type='hidden' name='templetId' value='<c:out value="${item.templetId}"/>' />
				<input type='hidden' name='indexDetailId' value='<c:out value="${item.indexDetailId}"/>' />
				<c:choose>
					<c:when test="${item.itemCount>0}">
						<td class="title" width="100" rowspan='<c:out value="${item.itemCount}"/>' title='<c:out value="${item.mainContent}"/>'
							style='text-align: center;'><c:out value="${item.mainContent}" /></td>
					</c:when>
				</c:choose>
				
				<td title='<c:out value="${item.partContent}"/>' class="edit"><input type="text" class="text" name="partContent" id="partContent"
					required="false" value='<c:out value="${item.partContent}" />' title='<c:out value="${item.partContent}" />'></input></td>
				<td style="text-align: center;" title='<c:out value="${item.sequence}"/>' class="edit"><input type="text" class="text" name="sequence"
					id="sequence" required="false" value='<c:out value="${item.sequence}" />' title='<c:out value="${item.sequence}" />'></input></td>
				<td title='<c:out value="${item.desption}"/>' class="edit"><input type="text" class="text" name="desption" id="desption" required="false"
					value='<c:out value="${item.desption}" />' title='<c:out value="${item.desption}" />'></input></td>
				<td title='<c:out value="${item.scoreNum}"/>' class="edit"><input type="text" class="text" name="scoreNum" id="scoreNum" required="false"
					value='<c:out value="${item.scoreNum}" />' title='<c:out value="${item.scoreNum}" />'></input></td>
			</tr>
		</c:forEach>
	</tbody>
</table>