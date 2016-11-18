<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<div id="viewPersonDiv" style="overflow-x: hidden; overflow-y: auto;">
	<table class='tableInput'>
		<x:layout proportion="30px,50px,250px,80px,30px" />
		<thead>
			<tr class="table_grid_head_tr">
				<th>序号</th>
				<th>姓名</th>
				<th>路径</th>
				<th>评分人级别</th>
				<th>权重</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach items="${personsList}" var="item">
				<tr>
					<td style="text-align: center;" class="title"><c:out value="${item.sequence}" /></td>
					<td class="title"><c:out value="${item.scorePersonName}" /></td>
					<td title='<c:out value="${item.fullName}"/>' class="title"><c:out value="${item.fullName}" /></td>
					<td class="title"><c:out value="${item.scorePersonLevelTextView}" /></td>
					<td class="title" style="text-align:center;"><c:out value="${item.proportion}" /></td>
				</tr>
			</c:forEach>
		</tbody>
	</table>
</div>