<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox,tree,attachment"/>
  	 <script src='<c:url value="/biz/hr/recruit/interview/InterviewApplyBill.js"/>' type="text/javascript"></script>  
<%--   	    <script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>
 --%>  	
  </head>
  <body>
  <div class="ui-form" style="width: 99%;">
		<div class="subject">面试测评表</div>
		<form method="post" action="" id="submitForm">
			<table class='tableInput' id='queryTable'>
				<x:layout proportion="73px,160px,80px,160px,80px,160px" />
		<x:hidden name="interviewApplyId"/>
		<x:hidden name="writeId"/>
		<x:hidden name="deptId" />
		<x:hidden name="fullId" />
		<x:hidden name="positionId" />
		<x:hidden name="personMemberId" />
		<x:hidden name="organId" />
		<x:hidden name="taskId"/>
	<%-- 	<tr>
		<x:inputTD name="organName" required="false" label="单位名称" disabled="true"/>					
		<x:inputTD name="fillinDate" required="false" label="填表日期" disabled="true"/>					
		<x:inputTD name="billCode" required="false" label="单据号码" disabled="true"/>					
		</tr>
		<tr>			
		<x:inputTD name="deptName" required="false" label="部门名称" disabled="true"/>					
		<x:inputTD name="positionName" required="false" label="岗位名称" disabled="true"/>					
		<x:inputTD name="personMemberName" required="false" label="申请人" disabled="true"/>		
		</tr>	 --%>
		<tr>			
		<x:inputTD name="staffName" required="false" label="应聘者" disabled="true"/>
		<x:hidden name="applyPosId"/>
		<x:inputTD name="applyPosName" required="false" label="应聘职位" disabled="true"/>	
		<x:selectTD name="sourceType" required="false" label="应聘来源" dictionary="recruitWay" readonly="true"/>	
		<x:hidden name="expecteSalary"/>
		</tr>	
		<tr>					
		<x:hidden name="employCompanyId"/>
		<x:inputTD name="employCompany" required="false" label="拟定单位"   readonly="true"/>	
		<x:hidden name="employCenterId"/>				
		<x:inputTD name="employCenter" required="false" label="拟定中心" maxLength="32"  readonly="true"/>	
		<x:hidden name="employDeptId"/>				
		<x:inputTD name="employDept" required="false" label="拟定部门" maxLength="32"  readonly="true"/>	
		</tr>
		<tr>	
		<x:hidden name="viewMemberId"/>
		<x:inputTD name="viewMemberName" required="false" label="面试官" maxLength="32"  readonly="true"/>	
		<x:inputTD name="bookInterviewPlace" required="false" label="预约面试地点" maxLength="32"   readonly="true"/>	
		<x:inputTD name="bookInterviewTime" required="false" label="预约面试时间" maxLength="32"  wrapper="dateTime" readonly="true"/>	
		
		
		</tr>	
		<tr>
		<x:selectTD name="viewOpinion" required="true" label="面试意见" />	
		<x:inputTD name="viewTime" required="true" label="面试时间"  wrapper="dateTime"/>
		<td  class="title" ><a href="javascript:showViewPersonRegister(this.form);" class="GridStyle"> 查看应聘者简历 </a></td>
		
		<td  class="title" ><a href="javascript:interviewRecord(this.form);" class="GridStyle"> 查看其他面试官的面试意见 </a></td>
		
		</tr>	
		<tr>
		<td colspan="6" style="color:red;font-size:14px">
		(备注:如果选择录用,请明确录用岗位是否为当前面试岗位)
		</td>
		</tr>	
		<tr>
		<x:textareaTD name="bsicAssessment" required="true" label="综合评价" rows="8"  colspan="5"  maxLength="512"/>	
		</tr>
			</table>
		<x:fileList bizCode="interviewApply" bizId="interviewApplyId" id="interviewApplyFileList" />
		</form>
	</div>
  </body>
</html>
