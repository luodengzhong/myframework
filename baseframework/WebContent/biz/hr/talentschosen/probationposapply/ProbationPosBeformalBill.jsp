<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox,tree,attachment" />
<script src='<c:url value="/biz/hr/talentschosen/probationposapply/ProbationPosBeformalBill.js"/>' type="text/javascript"></script>

</head>
<body>
	<div class="ui-form" style="width: 99%;">
		<div class="subject">见习转正申请表</div>
		<div class="bill_info">
				<span style="float: right;"> 单据号码：<strong><c:out
							value="${billCode}" /></strong>&nbsp;&nbsp;&nbsp; 填表日期：<strong><x:format
							name="fillinDate" type="date" /></strong>&nbsp;&nbsp; 经办人:<strong><c:out
							value="${personMemberName}" /></strong>
				</span>
			</div>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
	<x:layout/>
		<x:hidden name="posBeformalId"/>
		<x:hidden name="organId"/>
		<x:hidden name="deptId"/>
		<x:hidden name="positionId"/>
		<x:hidden name="personMemberId"/>
		<x:hidden name="fullId"/>
		<x:hidden name="status"/>
		<x:hidden name="personId"/>
		<x:hidden name="operationFormType"   value="2"/>
		<x:hidden name="organName"/>
		<x:hidden name="billCode"/>
		<x:hidden name="fillinDate"  type="date"/>
		<x:hidden name="personMemberName"/>
		<x:hidden name="positionName"/>
		<tr>
		<x:hidden name="archivesId"/>
		<x:inputTD name="staffName" required="false" label="员工"  wrapper="select" />	
		<x:selectTD name="sex" required="false" label="性别" disabled="true"/>		
		<x:inputTD name="age" required="false" label="年龄" disabled="true"/>	
		</tr>
		<tr>
		<x:hidden name="orgnizationId"/>
		<x:hidden name="centerId"/>
		<x:hidden name="departmentId"/>
		<x:hidden name="posId"/>
		<x:inputTD name="orgnizationName" required="false" label="单位" readonly="true" cssClass="textReadonly"/>
		<x:inputTD name="centerName" required="false" label="中心" readonly="true" cssClass="textReadonly"/>
		<x:inputTD name="departmentName" required="false" label="部门" maxLength="32" readonly="true" cssClass="textReadonly"/>
		</tr>
		<tr>	
		<x:selectTD name="education" required="false" label="最高学历" disabled="true"/>
		<x:inputTD name="campus" required="false" label="学校" disabled="true"/>		
		<x:inputTD name="specialty" required="false" label="专业" disabled="true"/>		
		</tr>
		<tr>	
		<x:inputTD name="posName" required="false" label="现岗位" readonly="true" cssClass="textReadonly"/>
		<x:inputTD name="employedDate" required="false" label="入职时间" disabled="true" wrapper="date"/>	
		<x:inputTD name="jobTitleName" required="false" label="职称" disabled="true"/>	
	    <x:selectTD name="scorePersonLevel" cssStyle="display:none;" id="scorePersonLevel" emptyOption="false"/>

			</tr>
		<tr>
			<x:hidden name="beformalDeptId"/>
			<x:hidden name="beformalOrganId"/>
				<x:hidden name="beformalPosId"/>
				<x:hidden name="posLevel"/>
	     <x:inputTD name="beformalPosName" required="true" label="申请岗位"  wrapper="select"/>	
		<x:inputTD name="beformalOrganName" required="true" label="申请单位"  readonly="true" cssClass="textReadonly"/>		
		<x:inputTD name="beformalDeptName" required="true" label="申请部门" readonly="true" cssClass="textReadonly"/>		
		</tr>	
		<tr>
			<x:hidden name="beformalCenterId"/>
		<x:inputTD name="beformalCenterName" required="true" label="申请中心" readonly="true" cssClass="textReadonly"/>		
		 <x:selectTD name="staffingPostsRank" required="true" label="申请岗位职级" />		
		<td class="title"  colspan="2"></td>
		</tr>
			</table>
		<div class="blank_div"></div>
		<table class='tableInput'  style="width: 99%;">
			<x:layout  proportion="50px,30px,100px,100px,200px,100px"/>
		<tr>	
		
		<td class="title" style='height:30px;text-align: center;' rowspan='3' >工作经历</td>	
		<td  class="title" style='height:30px;text-align: center;'>序号</td>	
		<td  class="title"  style='height:30px;text-align: center;'>起始日期</td>	
		<td class="title" style='height:30px;text-align: center;'>终止日期</td>	
		<td class="title" style='height:30px;text-align: center;'>任职单位</td>	
		<td class="title" style='height:30px;text-align: center;'>职务</td>		
		</tr>
		
		<tr>
		<td   style='text-align: center;'>1</td>	
		<td   style='text-align: center;'>${ resume_begin_date_0}</td>	
		<td   style='text-align: center;'>${ resume_end_date_0}</td>	
		<td   style='text-align: center;'>${ resume_company_0}</td>	
		<td   style='text-align: center;'>${ resume_duty_0}</td>	
		
		</tr>
		<tr>
		<td   style='text-align: center;'>2</td>	
		<td   style='text-align: center;'>${ resume_begin_date_1}</td>	
		<td   style='text-align: center;'>${ resume_end_date_1}</td>	
		<td   style='text-align: center;'>${ resume_company_1}</td>	
		<td   style='text-align: center;'>${ resume_duty_1}</td>	
		</tr>
		<tr>
		
		 <td class="title"  >转正理由陈述(含见习期主要工作及任务完成情况等)</td>
		<td  colspan="5"><x:textarea name="beformalReason" required="true" label="陈述理由" rows="12" maxlength="500"/></td>	
	     </tr>
	</table>
	<x:fileList bizCode="probationPosApply" bizId="posBeformalId" id="probationPosApplyFileList" />
	
</form>
<div class="blank_div"></div>
<x:title name="group" title="履职测评名单" needLine="false"/>
<div id="maingrid"  style="margin: 2px;"></div>
	</div>
</body>
</html>