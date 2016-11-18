<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<head>
     	<x:base include="dialog,grid,dateTime,tree,combox,attachment"/>
     	<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
        <script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>
  	  	<script src='<c:url value="/biz/hr/performanceassess/assessmentaudit/OnJobAssessBill.js"/>'   type="text/javascript"></script>
</head>

  <body>
  	<div class="ui-form" style="width: 99%;">
  			<div class="subject">在岗履职测评申请表</div>
	  	<form method="post" action="" id="submitForm">
		<table class='tableInput' id='queryTable'>
				<x:layout proportion="100px,160px,100px,160px,100px,160px" />
		        <x:hidden name="auditId" />
				<x:hidden name="organId" />
				<x:hidden name="deptId" />
				<x:hidden name="positionId" />
				<x:hidden name="personMemberId" />
				<x:hidden name="fullId" />
				<x:hidden name="taskId"/>
				<x:hidden name="kind"/>
				<x:hidden name="personId"/>
				<x:hidden name="assessPaId"/>
				<x:hidden name="assessPaName"/>
				<x:hidden name="underAssessmentId" />
				<x:select name="scorePersonLevel" cssStyle="display:none;" id="scorePersonLevel" emptyOption="false"/>
				<x:select name="periodMap" id="periodMapQuery" list="periodMap" cssStyle="display:none;"/>
		  		<tr>
					<x:inputTD name="organName" required="false" label="单位名称"  disabled="true" />
					<x:inputTD name="fillinDate" required="false" label="填表日期" wrapper="date" disabled="true" />
					<x:inputTD name="billCode" required="false" label="单据号码" disabled="true" />
				</tr>
				<tr>
					<x:inputTD name="deptName" required="false" label="部门名称" disabled="true" />
					<x:inputTD name="positionName" required="false" label="岗位名称" disabled="true" />
					<x:inputTD name="personMemberName" required="false" label="申请人" disabled="true" />
				</tr>
		</table>	
			</form>
			<div class="blank_div"></div>
			<x:title name="group" title="测评名单选择" needLine="false"/>
			<div  style="color: red" align="left"> 
			      参与测评人员名单拟定原则：<br/>
			      1、原则上参与测评人员不少于10人（不含自评人员）；<br/>
			      2、原则上测评人员中上级、平级、下级均应有人参与测评 ；<br/>
			      3、若上级或下级只有一个人，请将其归入平级<br/>
			      上级是指拟任岗位中心第一负责人、直线上级、中心本部与拟任岗位业务强相关领导<br/>
			      平级是指中心内业务强相关部门的经理级、副经理级人员<br/>
			      下级是指拟任岗位直接下级所有人员    
			</div>
			<div id="maingrid"></div>
			<div class="blank_div"></div>
		  <div  style="color: red;font-size:16px" align="left"> 
		   (注:请根据实际情况上传个人业绩报告)
		  </div>
			<x:fileList bizCode="HROnJobAssessApply" bizId="auditId" id="onJobAssessApplyFileList"/> 
		</div>	
  </body>
	
	
