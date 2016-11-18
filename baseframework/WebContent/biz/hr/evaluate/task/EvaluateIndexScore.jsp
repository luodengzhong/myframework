<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/JSTLFunction.tld" prefix="f"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<div style="margin-top: 10px; margin-bottom: 5px; text-align: center">
<input type="hidden" id="scoreEvaluateOrgRelevanceId" value='<c:out value="${evaluateOrgRelevanceId}"/>'/>
<input type="hidden" id="scoreStatus"  value='<c:out value="${status}"/>'/>
<table class='tableInput'  id="evaluateOrgScoreTable" style="width:98%">
	<thead>
		<tr class="table_grid_head_tr">
			<th style="width:20%;"  rowspan="2" colspan="2">评价维度</th>
			<th style="width:20%;"  rowspan="2">要求</th>
			<th style="width:40%;" colspan="5">评分标准</th>
			<th style="width:20%;word-wrap:break-word;white-space:normal;" rowspan="2">备注(低于80分请结合具体事项进行描述)</th>
		</tr>
		<tr class="table_grid_head_tr">
			<th style="width:10%;word-wrap:break-word;white-space:normal;">100分卓越</th>
			<th style="width:10%;word-wrap:break-word;white-space:normal;">90分优秀</th>
			<th style="width:10%;word-wrap:break-word;white-space:normal;">80分良好</th>
			<th style="width:10%;word-wrap:break-word;white-space:normal;">70分有待提高</th>
			<th style="width:10%;word-wrap:break-word;white-space:normal;">60分急需改进</th>
		</tr>
	</thead>
	<tbody id="tbody<c:out value="${evaluateOrgRelevanceId}"/>">
		<c:forEach items="${indexList}" var="index">
		<tr id="<c:out value="${index.evaluateOrgIndexId}"/>">
			<td class="title mainContent"><c:out value="${index.mainContent}"/></td>
			<td class="title partContent"><c:out value="${index.partContent}"/></td>
			<td class="title desption"><c:out value="${index.desption}"/></td>
			<td class="title" style="text-align:center;"><label><input type="radio" name="radio<c:out value="${index.evaluateOrgIndexId}"/>"  <c:if test="${index.scoreNum==100}">checked</c:if> value="100" />100</label></td>
			<td class="title" style="text-align:center;"><label><input type="radio" name="radio<c:out value="${index.evaluateOrgIndexId}"/>"  <c:if test="${index.scoreNum==90}">checked</c:if> value="90" />90</label></td>
			<td class="title" style="text-align:center;"><label><input type="radio" name="radio<c:out value="${index.evaluateOrgIndexId}"/>"  <c:if test="${index.scoreNum==80}">checked</c:if> value="80" />80</label></td>
			<td class="title" style="text-align:center;"><label><input type="radio" name="radio<c:out value="${index.evaluateOrgIndexId}"/>"  <c:if test="${index.scoreNum==70}">checked</c:if> value="70" />70</label></td>
			<td class="title" style="text-align:center;"><label><input type="radio" name="radio<c:out value="${index.evaluateOrgIndexId}"/>"  <c:if test="${index.scoreNum==60}">checked</c:if> value="60" />60</label></td>
			<td class="edit"><textarea name="remark"  maxlength="200" class="textarea" rows="3"><c:out value="${index.remark}"/></textarea></td>
		</tr>
		</c:forEach>
	</tbody>
</table>
<div  class="blank_div"></div>
<table class='tableInput'  style="width:98%">
 	<tr>
 		<td class="title" width="20%"><span class="labelSpan">对本单位的总体评价&nbsp;:</span>
 		<td class="edit" width="80%"><textarea name="overallEvaluation"  maxlength="400"  id="overallEvaluation<c:out value="${evaluateOrgRelevanceId}"/>" class="textarea" rows="5"><c:out value="${overallEvaluation}"/></textarea></td>
 	</tr>
</table>