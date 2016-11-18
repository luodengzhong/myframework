<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox"/>
  	  	  	<script src='<c:url value="/biz/hr/entry/teacher/TeacherPlanBill.js"/>'   type="text/javascript"></script>
  </head>
  <body>
  	<div class="ui-form" style="width: 99%;">
  		<div class="subject">新员工试用期督导情况表 </div>
	  	<form method="post" action="" id="submitForm">
				<div class="bill_info">
				<span style="float:right;">
					单据编号：<strong><c:out value="${billCode}"/></strong>
				</span>	
		      </div>
		      			 	<x:title title="基本信息" name="group"/>
		      
		<table class='tableInput' id='queryTable'>
				<x:layout proportion="80px,160px,100px,160px,80px,160px" />
					
		<x:hidden name="teacherPlanId"/>
	    <x:hidden name="archivesId"/>
		<x:hidden name="teacherId"/>
		<x:hidden name="organId"/>
		<x:hidden name="sendTimes"/>
		<x:hidden name="taskId"/>	
		<x:hidden name="billCode"/>							
		<tr>			
		<x:inputTD name="staffName" required="false" label="新员工姓名" readonly="true"/>			
		<x:inputTD name="dptName" required="false" label="员工所在部门" readonly="true"/>	
		<x:hidden name="posId"/>
		<x:hidden name="personId"/>				
		<x:inputTD name="posName" required="false" label="员工岗位" readonly="true"/>					
		
		</tr>	
		<tr>
		<x:inputTD name="teacher" required="false" label="督导师姓名" readonly="true"/>		
		<x:hidden name="teacherDptId"/>			
		<x:inputTD name="teacherDeptName" required="false" label="督导师所在部门" />		
		<x:inputTD name="teacherPosName" required="false" label="督导师岗位" />		
			
		</tr>	
		</table>
		
		<x:title title="督导内容包含但不限于以下内容：" name="group"/>
		 <table class='tableInput' id='queryTable'>
         <x:layout proportion="170px,150px,73px,160px,120px,80px"/>
		<tr>
		<td  colspan="7"  >
			<x:title title="1. 新员工到岗第二天进行20分钟以上的面谈沟通;" name="1"/>
			<x:title title="2. 公司组织架构、办公环境、上下级及部门同事、对接单位及对接人;" name="1"/>
		    <x:title title="3. 本岗位职能职责、业务内容和要求、工作流程;" name="1"/>	
		    <x:title title="4. 公司绩效考核方式、共同制定本季度的绩效考核表（若季度参与考核）;" name="1"/>		
			<x:title title="5. 日常工作注意事项、相关权责、部门规章制度及文档;" name="1"/>		
		   <x:title title="6. 工作相关的办公工具和办公软件;" name="1"/>		
		</td>
		</tr>	
		</table>
		<x:title title="双方拟定的其他督导内容（分试用期三个月制定专项工作任务）" name="group"/>
		 <table class='tableInput' id='queryTable'>
		   <x:layout proportion="35px,92px,206px,260px,70px,70px"/>
		 <tr>
		  <td class="title" colspan="4"></td>
		  <td style='text-align: center;'  colspan="2">督导师确认</td>
		</tr>	
		<tr>
		 <td class="title"  rowspan="3">试用期阶段性目标设定</td>
		<x:textareaTD name="contentOne" required="true" label="试用期第一个月" rows="7"  colspan="2" maxLength="500"/>	
		<x:radioTD name="oneIsFinished"  required="true" label="是否完成" dictionary="yesorno" />		
		</tr>
		 <tr>
		<x:textareaTD name="contentTwo" required="true" label="试用期第二个月" rows="7"  colspan="2" maxLength="400"/>	
		<x:radioTD name="twoIsFinished"  required="true" label="是否完成" dictionary="yesorno" />		
		
		</tr>	
		 <tr>
		<x:textareaTD name="contentThree" required="true" label="试用期第三个月" rows="7"  colspan="2" maxLength="400"/>
		<x:radioTD name="threeIsFinished"   required="true" label="是否完成" dictionary="yesorno" />		
		</tr>	
		 <tr  id="forStaffEvaTr">
		 <td class="title"  rowspan="2"> 其他意见及建议</td>
		<x:textareaTD name="forStaffEva" required="true" label="本栏由督导师填写，根据新员工的表现，从职业素养、业务技能、工作态度等方面进行评价" rows="7"  colspan="4" maxLength="400"/>
		</tr>	
		<tr id="forTeacherEvaTr">
		<x:textareaTD name="forTeacherEva" required="true" label="本栏由新员工填写，根据督导师督导内容，进行评价或建议" rows="7"  colspan="4" maxLength="400"/>
		</tr>
		</table>
		</form>
			</div>
  </body>
</html>
