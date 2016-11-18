<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox" />
<script
	src='<c:url value="/biz/hr/train/lightNewstaff/LightNewstaffEvalDetail.js"/>'  type="text/javascript"></script>
</head>
<body>
	<div class="ui-form" style="width: 99%;">
		<div class="subject">光芒新生工作情况季度评价表</div>
		<form method="post" action="" id="submitForm">
			<div class="bill_info">
				<span style="float: right;"> 单据号码：<strong><c:out
							value="${billCode}" /></strong> &nbsp;&nbsp;&nbsp; 填表日期：<strong><x:format
							name="fillinDate" type="date" /></strong>
				</span>
			</div>
			<table class='tableInput' id='queryTable'>
				<x:layout proportion="70px,70px,70px,70px,70px,70px" />
				<x:hidden name="evalId" />
				<x:hidden name="archivesId" />
				<x:hidden name="deptId" />
				<x:hidden name="billCode" />
				<x:hidden name="fillinDate" type="date" />
				<x:hidden name="centerId" />
				<x:hidden name="teacherId" />
				<x:hidden name="centreId" />
				<x:hidden name="personMemberName" />
				<tr>
					<x:inputTD name="staffName" required="false" label="姓名"
						maxLength="64" readonly="true" />
					<x:inputTD name="ognName" required="false" label="单位"
						maxLength="64" readonly="true" />
					<x:selectTD name="periodIndex" required="true" label="考核周期"
						maxLength="64"
						list="#{'1':'1季度',
			                    '2':'2季度',
			                    '3':'3季度',
			                     '4':'4季度'}" />
				</tr>
				<tr>
					<x:inputTD name="dptName" required="false" label="中心（部门）"
						maxLength="64" readonly="true" />
					<x:inputTD name="posName" required="false" label="现任岗位"
						maxLength="64" readonly="true" />
					<td colspan="2" class="title">&nbsp;</td>
				</tr>
			</table>
			<x:title title="第一部分：季度沟通" name="group" id="paymentGroup" />
			<table class='tableInput' id='paymentTable'>
				<x:layout proportion="120px,240px" />
				<tr>
					<x:hidden name="joinPersonId" />
					<td class="title">参与人员姓名(包括员工本人、督导师，建议督导师上级参与)</td>
					<td class="edit"><x:input name="joinPersonName"
							required="true" label="参与人员姓名" wrapper="select" /></td>
				</tr>
				<tr>
				   <x:hidden name="joinHrPersonId" />
					<x:inputTD name="joinHrPersonName" required="true"
						label="人力资源参与人员"  wrapper="select" />
				</tr>
				<tr>
					<td class="title">沟通内容(本季度工作业绩，个人优势及不足，下一步改进方向等)</td>
					<td class="edit"><x:textarea name="communicateContent"
							required="true" label="沟通内容" rows="6" maxlength="500" /></td>
				</tr>
				<tr>
					<x:textareaTD name="nextQuarterContent" required="true"
						label="下季度重点工作3-5项" rows="6" maxlength="500" />
				</tr>
			</table>
			<x:title title="第二部分：季度表现评分" name="group" id="paymentGroup" />
			<table class='tableInput'>
				<x:layout proportion="50px,30px,80px,300px,30px,30px" />
				<thead>
					<tr class="table_grid_head_tr">
						<th>评价维度</th>
						<th>序号</th>
						<th>名称</th>
						<th>评价内容</th>
						<th>标准分</th>
						<th>评价得分</th>
					</tr>
				</thead>
				<tbody id="lightNewstaffTbody">

					<c:forEach items="${indexList}" var="item">

						<tr>
							<input type='hidden' name='detailId'
								value='<c:out value="${item.detailId}"/>' />
							<input type='hidden' name='teacherScoreId'
								value='<c:out value="${item.teacherScoreId}"/>' />
							<c:choose>
								<c:when test="${item.itemCount>0}">
									<td class="title" width="100"
										rowspan='<c:out value="${item.itemCount}"/>'
										title='<c:out value="${item.evaluativeDim}"/>'
										style='text-align: center;'><c:out
											value="${item.evaluativeDim}" /></td>
								</c:when>
							</c:choose>
							<td title='<c:out value="${item.sequence}"/>' class="title"><c:out
									value="${item.sequence}" /></td>
							<td title='<c:out value="${item.evaluativeName}"/>' class="title"><c:out
									value="${item.evaluativeName}" /></td>
							<td title='<c:out value="${item.content}"/>' class="edit"><input
								class="text" name="content" id="content" style='height: 45px;'
								required="true" maxLength="300"
								value='<c:out value="${item.content}" />'
								title='<c:out value="${item.content}" />'></input></td>
							<td title='<c:out value="${item.totalScore}"/>' class="title"><c:out
									value="${item.totalScore}" /></td>
							<td title='<c:out value="${item.score}"/>' class="edit"><input
								class="text" name="score" id="score" required="true"
								value='<c:out value="${item.score}" />'
								title='<c:out value="${item.score}" />'></td>
						</tr>
					</c:forEach>
					<tr>
						<td style="text-align: center; height: 23px;" class="title">合&nbsp;计</td>
						<td style="text-align: center;" class="title" colspan="3">&nbsp;</td>
						<td class="title" id="standardScoreSumTd">
							${standardScoreSum}</td>
						<td class="title" id="scoreSumTd">&nbsp;${scoreSum}</td>
					</tr>
				</tbody>
			</table>
		</form>
	</div>
</body>
</html>
