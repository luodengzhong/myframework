<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox,layout,tree" />
<script
	src='<c:url value="/biz/hr/entry/personnelInterview/PersonalInterviewBill.js"/>'
	type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div class="subject">离职面谈</div>
		<form method="post" action="" id="submitForm">
			<table class='tableInput' style="width: 99%;">
				<x:layout proportion="80px,160px,100px,160px,100px,160px" />
				<tr>
					<x:hidden name="id" />
					<x:hidden name="taskId" />
					<x:hidden name="invType" />
					<x:hidden name="resInvType" />
					<x:inputTD name="staffName" required="false" label="申请离职人姓名"
						maxLength="22" disabled="true" />
					<x:inputTD name="centreName" required="false" label="所在中心"
						disabled="true" />
					<x:inputTD name="posName" required="false" label="所在岗位"
						disabled="true" />

				</tr>
				<tr>
					<x:inputTD name="speakPersonMemberName" required="true" label="面谈人"
						maxLength="7" disabled="true" />
					<x:inputTD name="positionName" required="true" label="面谈人职务"
						maxLength="7" disabled="true" />
					<x:inputTD name="invTime" required="true" label="面谈时间"
						maxLength="7" wrapper="date" disabled="true" />
				</tr>
				<tr>
					<td colspan="6">离职原因是（多选）<input type="hidden"
						name="topTitle[2]" value="离职原因是（多选）"></td>
				</tr>
				<tr>
					<td colspan="2"><x:checkbox name="resReasonChoice"
							label="A.薪资低，福利少" value="A" /></td>
					<td colspan="2"><x:checkbox name="resReasonChoice"
							label="B.不满意公司的政策和措施 " value="B" /></td>
					<td colspan="2"><x:checkbox name="resReasonChoice"
							label="C.缺少机会，没有发展前景 " value="C" /></td>
				</tr>
				<tr>
					<td colspan="2"><x:checkbox name="resReasonChoice"
							label="D.目前的工作不符合自己的职业发展  " value="D" /></td>
					<td colspan="2"><x:checkbox name="resReasonChoice"
							label="  E.工作量大，压力过大  " value="E" /></td>
					<td colspan="2"><x:checkbox name="resReasonChoice"
							label=" F.与上司/同事关系不融洽 " value="F" /></td>
				</tr>
				<tr>
					<td colspan="2"><x:checkbox name="resReasonChoice"
							label="G.已找到更好的工作 " value="G" /></td>
					<td colspan="2"><x:checkbox name="resReasonChoice"
							label="H.决定自己经营生意  " value="H" /></td>
					<td colspan="2"><x:checkbox name="resReasonChoice"
							label="I.健康原因   " value="I" /></td>
				</tr>
				<tr>

					<td colspan="2"><x:checkbox name="resReasonChoice"
							label="J.家庭原因     " value="J" /></td>

					<td colspan="2"><x:checkbox name="resReasonChoice"
							label=" K.不看好现在行业，准备转换行业     " value="K" /></td>
					<td colspan="2"><x:checkbox name="resReasonChoice"
							label="L.实习期届满 " value="L" /></td>
				</tr>
				<tr>
					<td colspan="6"><x:checkbox name="resReasonChoice"
							label=" M.其它（请填写）:" value="M" /><textarea name=invContent rows="2" cols="88"></textarea> </td>
							
				  
				</tr>
                <tr>
                     <td class="title">详情记录:</td>
					 <td class="edit"   colspan="5" ><x:textarea name="resReason"
							required="true" label="详情记录" rows="4"  maxlength="500" /></td>
                </tr>
                <tr id="evaluateSelfWorkTr">
                 <td class="title">如何评价自己在蓝光的工作:</td>
                  <td class="edit"   colspan="5" ><x:textarea name="evaluateSelfWork"
							required="true" label="如何评价自己在蓝光的工作" rows="4"  maxlength="500" /></td>
				</tr>
				<tr  id="forOgnOpinionTr">
				<td class="title">对公司的意见和建议:</td>
                  <td class="edit"   colspan="5" ><x:textarea name="forOgnOpinion"
						required="true" label="对公司的意见和建议" rows="4"  maxlength="500" /></td>
				</tr>
				
				 <tr  id="dptOpinionTr">
				 <td class="title">对于目前所在部门的工作，有什么看法与建议:</td>
                  <td class="edit"   colspan="5" ><x:textarea name="dptOpinion"
						required="true" label="对于目前所在部门的工作，有什么看法与建议" rows="4"  maxlength="500" /></td>
				</tr>
				<tr  id="dptRetainOpinionTr">
				  <td class="title">我们能做什么进行挽留:</td>
                  <td class="edit"   colspan="5" ><x:textarea name="dptRetainOpinion"
						required="true" label="我们能做什么进行挽留" rows="4"  maxlength="500" /></td>
				</tr>
			</table>
		</form>

	</div>
</body>
</html>

