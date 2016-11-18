<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox,tree,attachment" />
<script src='<c:url value="/biz/hr/talentschosen/talentschosenapply/TalentsChosenApplyBill.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>

</head>
<body>
	<div class="ui-form" style="width: 99%;">
		<div class="subject">人才选拔申请表</div>
<form method="post" action="" id="submitForm">
  <x:title title="基本信息"  name="group"/>
	<table class='tableInput' style="width: 99%;">
	<x:layout  proportion="80px,100px,100px,100px,100px,100px"/>
	     <tr>
		
		<x:hidden name="chosenApplyId"/>
		<x:hidden name="archivesId"/>
				<x:hidden name="posId"/>
				<x:hidden name="ognId"/>
				<x:hidden name="centreId"/>
				<x:hidden name="posLevel"/>
				<x:hidden name="fullId"/>
		<x:inputTD name="ognName" required="false" label="所在单位" readonly="true" cssClass="textReadonly"/>		
		<x:inputTD name="centreName" required="false" label="所在中心" disabled="true"/>		
		<x:inputTD name="employedDate" required="false" label="入职时间"  wrapper="date"  disabled="true"/>	
		
		</tr>
		<tr>
		<x:inputTD name="staffName" required="false" label="员工姓名" disabled="true" />		
		<x:selectTD name="sex" required="false" label="性别" disabled="true"/>		
		<x:inputTD name="age" required="false" label="年龄" disabled="true"/>		
		</tr>
		<tr>
		<x:selectTD name="education" required="false" label="最高学历" disabled="true"/>		
		<x:inputTD name="campus" required="false" label="毕业学校" disabled="true"/>		
		<x:inputTD name="specialty" required="false" label="专业" disabled="true"/>	
		</tr>
		<tr>	
		<x:hidden name="chosenPosId"/>
		<x:hidden name="competePositionId"/>
		<x:hidden name="chosenOrganId"/>
		<x:hidden name="chosenCenterId"/>
		<x:hidden name="chosenDeptId"/>
			<x:hidden name="chosenOrganName"/>	
			<x:hidden name="chosenCenterName"/>	
			<x:hidden name="chosenDeptName"/>
			<x:hidden name="talentsChosenDemandId"/>
			<x:hidden name="speechType"/>
		<x:inputTD name="chosenPosName" required="true" label="拟选拔职位"  wrapper="select"/>		
		<x:inputTD name="fillinDate" required="true" label="填表时间"  wrapper="date"/>		
		<x:inputTD name="posName" required="false" label="现任职位" disabled="true"/>		
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
		<x:textareaTD name="reason" required="true" label="申请理由陈述" rows="20" colspan="5"  maxLength="512"/>
		
		</tr>
		</table>
		<x:fileList bizCode="talentsChosenApply" bizId="chosenApplyId" id="talentsChosenApplyFileList" />
		
</form>
	</div>
</body>
</html>