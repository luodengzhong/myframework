<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<div id="viewTempletIndexDiv" style="overflow-x:hidden;overflow-y:auto;">
	<table class='tableInput'>
		<x:layout proportion="50px,30px,80px,300px,30px" />
		<thead>
			<tr class="table_grid_head_tr">
				<th>项目</th>
				<th>序号</th>
				<th>指标名称</th>
				<th>指标要求</th>
				<th>分值</th>
			</tr>
		</thead>
		<tbody>
			<c:set var="totalscore" value="0"/>
			<c:forEach items="${performAssessScoreList}" var="item">
				<c:set var="totalscore" value="${totalscore+item.scoreNum}"/>
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
					<td style="text-align: center;min-height:23px;" class="title"><c:out value="${item.sequence}" /></td>
					<td title='<c:out value="${item.partContent}"/>' class="title"><c:out value="${item.partContent}" /></td>
					<td title='<c:out value="${item.desption}"/>' class="title"><c:out value="${item.desption}" /></td>
					<td title='<c:out value="${item.scoreNum}"/>' class="title"><c:out value="${item.scoreNum}" /></td>
				</tr>
			</c:forEach>
			<tr>
				<td style="text-align: center;height:23px;" class="title">合&nbsp;计</td>
				<td style="text-align: center;" class="title" colspan="3">&nbsp;</td>
				<td class="title"><c:out value="${totalscore}" /></td>
			</tr>
		</tbody>
	</table>
</div>