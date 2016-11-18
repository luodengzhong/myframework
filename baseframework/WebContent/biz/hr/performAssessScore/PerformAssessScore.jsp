<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/JSTLFunction.tld" prefix="f"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<div style="margin-top: 10px; margin-bottom: 5px; text-align: center">
	<span id="landTitle" style="font-size: 20px; font-weight: bold;"> <c:out value="${performAssessScore.title}" />
	</span>
</div>
<div class="navline"></div>
<input type="hidden" id="performAssessScorePersionId" value='<c:out value="${performAssessScore.personId}"/>'/>
<input type="hidden" id="jxassessType" value='<c:out value="${performAssessScore.jxassessType}"/>'/>
<input type="hidden" id="performAssessScoreFormId" value='<c:out value="${formId}"/>'/>
<input type="hidden" id="performAssessScoreType" value='<c:out value="${paType}"/>'/>
<table class='tableInput'>
 <tr>	
		
		<td style='height: 30px;text-align: left;'>所在单位:&nbsp;${performAssessScore.ognName}</td>	
		<td  style='height: 30px;text-align: left;'>所在中心:&nbsp;${performAssessScore.centreName}</td>	
		<td   style='height: 30px;text-align: left;'>所在岗位:&nbsp;${ performAssessScore.posName}</td>	
		<td style='height: 30px;text-align: left;'>考核年:&nbsp;${performAssessScore.year}</td>	
		<td style='height: 30px;text-align: left;'>考核时间:&nbsp;${performAssessScore.pericodName}</td>	
		</tr>
		
</table>
<div  class="blank_div"></div>
<table class='tableInput' id="performAssessScoreTable" style="width:99%">
  
	<thead>
		<tr class="table_grid_head_tr">
			<th style="width: 7%;">指标项</th>
			<th style="width: 3%;">序号</th>
			<th style="width: 14%;">指标名称</th>
			<th style="width: 9%;">指标关键项</th>
			<th style="width: 30%;">衡量标准</th>
			<th style="width: 12%;">目标值</th>
			<th style="width: 15%;">实际完成情况</th>
			<th style="width: 4%;">分值</th>
			
			<c:forEach items="${performAssessScore.persons}" var="person">
				<c:choose>
					<c:when test="${f:theSamePerson(performAssessScore.assessId,person.scorePersonId)}">
						<th style="width: 50px;">自评分</th>
					</c:when>
					<c:otherwise>
						<th style="width: 50px;"><c:out value="${person.scorePersonName}" /></th>
					</c:otherwise>
				</c:choose>
			</c:forEach>
		</tr>
	</thead>
	<tbody id="performAssessScoreTbody">
		<c:forEach items="${performAssessScore.items}" var="item" varStatus="status">
			<tr>
				<c:choose>
					<c:when test="${item.itemCount>0}">
						<td class="title" width="100" rowspan='<c:out value="${item.itemCount}"/>' style='text-align: center;'><c:out
								value="${item.mainContent}" /></td>
					</c:when>
				</c:choose>
				<td style="text-align: center;" class="title"><c:out value="${status.index+1}" /></td>
				<c:choose>
					<c:when test="${item.itemPartCount>0}">
						<td class="title" width="100" rowspan='<c:out value="${item.itemPartCount}"/>' style='text-align: center;'><c:out
								value="${item.partContent}" /></td>
					</c:when>
				</c:choose>
				
				 <td title='<c:out value="${item.partContent}"/>' class="title"><c:out value="${item.partContent}" /></td>
				  <td title='<c:out value="${item.keyContent}"/>' class="title"><c:out value="${item.keyContent}" /></td>
				<td title='<c:out value="${item.desption}"/>' class="title"><c:out value="${item.desption}" /></td>
				<td title='<c:out value="${item.goalContent}"/>' class="title"><c:out value="${item.goalContent}" /></td>
			  <input type='hidden' name='indexDetailId' value='<c:out value="${item.indexDetailId}"/>' />
				
				
				  <td title='<c:out value="${item.realityCompeteContent}"/>' class="edit">
				   <textarea class="textarea"    name="realityCompeteContent" required="true" id="realityCompeteContent"  style="height: 100%"><c:out value="${item.realityCompeteContent}" /></textarea>
				 </td>
				<td title='<c:out value="${item.scoreNum}"/>' class="title"><c:out value="${item.scoreNum}" /></td>
				<c:forEach items="${performAssessScore.persons}" var="person">
					<c:set var="tempKey" value="${item.indexDetailId}_${person.scorePersonId}" />
					<c:set var="tempDetailKey" value="${item.indexDetailId}_${person.scorePersonId}_detailId" />
					<c:choose>
						<c:when test="${f:theSamePerson(performAssessScore.personId,person.scorePersonId)}">
							<td class="edit">
								<input class="text" name="score" required="true" id="<c:out value="${item[tempDetailKey]}" />" value='<c:out value="${item[tempKey]}" />' />
							</td>
						</c:when>
						<c:otherwise>
							<td class="title" style="text-align: center;"><c:out value="${item[tempKey]}" /></td>
						</c:otherwise>
					</c:choose>
				</c:forEach>
			</tr>
		</c:forEach>
		<tr style="font-weight: bold;height:25px;">
			<td class="title" style="text-align: center;">合&nbsp;计</td>
			<td class="title" style="text-align: left;" colspan="6"></td>
			<td class="title" style="text-align: center;"><c:out value="${performAssessScore.total}"/></td>
			<c:forEach items="${performAssessScore.persons}" var="person">
				<td class="title" style="text-align:center;" id="total_<c:out value="${person.scorePersonId}"/>">
					<c:out value="${person.totalScore}" />
				</td>
			</c:forEach>
		</tr>
	</tbody>
</table>
<div  class="blank_div"></div>
<table class='tableInput' id="personSubAddTable">
<c:if test="${isCountAsscore=='1'}">
   <tr style="height:38px">
   <td class="title" style="text-align: center;width: 15px;"  >综合素质</td>
   <td class="title" style="text-align: center;width: 100px;"  >主要包括但不限于:积极主动、责任心、组织沟通协调、行为态度、决策能力以及知识技能和专业能力等</td>
   	<td class="edit"  style="text-align: center;width: 10px;">
	 <select class="text"    name="addsubScore" required="true" id="addsubScore" ><c:out value="${addsubScore}" />
	 <option  value="2">A</option>
	  <option  value="1">B</option>
	 <option  value="0"  selected="selected">C</option>
	 <option  value="-1">D</option>
	  <option  value="-2">E</option>
	 </select>
	</td>
  </tr>
</c:if>
</table>
<table class='tableInput' id="personEvaluateTable">
 
 	<c:forEach items="${performAssessScore.persons}" var="person">
		 <tr style="height:80px">
			<td class="title" style="text-align: center;width: 60px;"  >评分意见</td>
			  <input type='hidden' name='scorePersonId' value='<c:out value="${person.scorePersonId}"/>' />
				<td class="title" style="text-align:center;width: 50px;">
					<c:out value="${person.scorePersonName}" />
				</td>
				<c:choose>
				<c:when test="${f:theSamePerson(performAssessScore.personId,person.scorePersonId)}">
				<td class="edit" >
					 <textarea class="text"  style="height:80px"   name="evaluate" required="true" id="evaluate" ><c:out value="${person.evaluate}" /></textarea>
					
				</td>
				</c:when>
				<c:otherwise>
					<td class="title" style="text-align: center;"><c:out value="${person.evaluate}" /></td>
				</c:otherwise>
				</c:choose>
		</tr> 
		</c:forEach>
</table>

<div style="height: 10px"></div>