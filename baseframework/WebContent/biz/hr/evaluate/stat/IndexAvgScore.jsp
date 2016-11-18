<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/JSTLFunction.tld" prefix="f"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:forEach items="${IndexAvgScoreList}" var="indexAvgScore">
<div class="indexAvgScoreList">
<div class="subject">${indexAvgScore.title}</div>
<table class='tableInput'  style="width:98%">
	<thead>
		<tr class="table_grid_head_tr">
			<th style="width:25%;"  colspan="2">评价维度</th>
			<th style="width:65%;" >要求</th>
			<th style="width:10%;">评均分</th>
		</tr>
	</thead>
	<tbody>
		<c:forEach items="${indexAvgScore.indexs}" var="index">
		<tr>
			<td class="title mainContent"><c:out value="${index.mainContent}"/></td>
			<td class="title partContent"><c:out value="${index.partContent}"/></td>
			<td class="title desption"><c:out value="${index.desption}"/></td>
			<td class="title" style="text-align:right;"><c:out value="${index.score}"/></td>
		</tr>
		</c:forEach>
	</tbody>
</table>
</div>
<div class="blank_div"></div>
</c:forEach>