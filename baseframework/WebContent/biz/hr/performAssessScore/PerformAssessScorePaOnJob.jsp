<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<div style="margin-top: 10px; margin-bottom: 5px; text-align: center">
	<span id="landTitle" style="font-size: 20px; font-weight: bold;"> <c:out value="${performAssessScore.title}" /></span>
</div>
<div class="navline"></div>
<input type="hidden" id="performAssessScoreFormId" value='<c:out value="${formId}"/>'/>
<input type="hidden" id="performAssessScoreType" value='<c:out value="${paType}"/>'/>
<input type="hidden" id="isOnJobAssess" value='<c:out value="${isOnJobAssess}"/>'/>
<table class='tableInput' id="performAssessOnJobTable" style="width:99%">
	<thead>
		<tr class="table_grid_head_tr">
			<th  style="width: 7%;">序号</th>
			<th  style="width: 21%;">指标名称</th>
			<th  style="width: 30%;">要求</th>
			<th  style="width: 15%;">评分</th>
			<th  style="width: 27%;">改进及提升计划</th>
		</tr>
	</thead>
	<tbody id="performAssessOnJobTbody">
		<c:forEach items="${performAssessScore.items}" var="item" varStatus="status">
			<tr>
			<input type='hidden' name='detailId' value='<c:out value="${item.detailId}"/>' />
			<input type='hidden' name='scoreNum' value='<c:out value="${item.scoreNum}"/>' />
		    <input type='hidden' name='scorePersonDetailId' value='<c:out value="${scorePersonDetailId}"/>' />
			
			<td style="text-align: center;" class="title"><c:out value="${status.index+1}" /></td>
				<c:choose>
					<c:when test="${item.itemCount>0}">
						<td class="title"  rowspan='<c:out value="${item.itemCount}"/>' style='text-align: center;'>
						<c:out value="${item.partContent}" />
						</td>
					</c:when>
				</c:choose>
				<td title='<c:out value="${item.desption}"/>' class="title"><c:out value="${item.desption}" /></td>
				<!--  <td style="text-align: center;" class="title"><c:out value="${item.scoreNum}" /></td>-->
			    <td class="edit">
					<input class="text" name="score" required="true"   value='<c:out value="${item.scale}" />'/>
				</td>
				<c:if test="${item.itemCount>0}">
			<!--  	<td class="edit"     colspan="1" rowspan='<c:out value="${item.itemCount}"/>'>
					<textarea class="textarea" name="recommend" required="true" style="ovuterflow:auto" rows="<c:out value="${item.itemCount}"  />"><c:out value="${item.recommend}" /></textarea>
				</td>-->
				<td class="edit"   colspan="1"  rowspan='<c:out value="${item.itemCount}"/>' >
					<textarea class="textarea"   name="overallEvaluation" required="true" rows="<c:out value="${item.itemCount}" />"  rows="<c:out value="${item.itemCount}"  />"><c:out value="${item.overallEvaluation}" /></textarea>
				</td>
				</c:if>
			</tr>
		</c:forEach>
	</tbody>
	
</table>
					<div class="blank_div"></div>
<table class='tableInput' id="personScoreTable"  style="width:99%">
	<tr>			
	  <td class="title" style="text-align: center;"  rowspan="5">评分说明</td>
	  <td class="title"   rowspan="5"  colspan="4">1、公司将开展2015年下半年度高层管理人员胜任力评价工作，请各位评分人在本任务推出后在24小时内完成评分任务
       <br> 2、根据“（一）投资运作、经营运作、财务运作能力”及“（二）综合管理能力”指标描述及被评人的情况，填写对被评人需重点提升的能力素质建议及改进方向
             </td>
     <!--    <td class="edit"  rowspan="5">总分:
        <input class="text"  mask="nnnn.nn" name="totalScore" required="true"  value='<c:out value="${totalScore}" />' />
       </td>-->
	</tr>
	</table>
<div style="height: 10px"></div>