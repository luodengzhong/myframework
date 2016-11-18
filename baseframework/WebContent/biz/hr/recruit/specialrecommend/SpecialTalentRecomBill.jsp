<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox,tree,attachment"/>
  	<script src='<c:url value="/biz/hr/recruit/specialrecommend/SpecialTalentRecomBill.js"/>'   type="text/javascript"></script>
 </head>
  <body>
	<div class="ui-form" style="width: 99%;">
		<div class="subject">特殊人才推荐表</div>
		  <form method="post" action="" id="submitForm">
			   <table class='tableInput' id='queryTable'>
				<x:layout proportion="73px,160px,80px,160px,80px,160px" />
	     <tr>
		
		<x:hidden name="recomId"/>
		
			<x:hidden name="organId"/>
		<x:hidden name="deptId" />
		<x:hidden name="positionId"/>
			<x:hidden name="personMemberId"/>
						<x:hidden name="fullId"/>
			
		<tr>
		<x:inputTD name="organName" required="false" label="单位名称" disabled="true"/>				
		<x:inputTD name="fillinDate" required="false" label="填表日期" disabled="true" wrapper="date"/>					
		<x:inputTD name="billCode" required="false" label="编号" disabled="true"/>					
		</tr>	
		<tr>
		<x:inputTD name="deptName" required="false" label="部门名称"  />					
		<x:inputTD name="positionName" required="false" label="岗位名称" />					
		<x:inputTD name="personMemberName" required="false" label="推荐人"  wrapper="select" />	
		</tr>	
		<tr>
		<x:inputTD name="recomName" required="true" label="被推荐人" maxLength="32"/>		
		<x:selectTD name="sex" required="false" label="性别" />		
		<x:inputTD name="age" required="false" label="年龄" maxLength="22" mask="nn"/>		
		</tr>	
		<tr>
		<x:hidden name="recomPosId"/>
		<x:hidden name="recomDptId" />
		<x:hidden name="recomOrgId"/>
		<x:hidden name="jobApplyId"/>
		<x:inputTD name="recomPosName" required="true" label="推荐职位" wrapper="select"  
		dataOptions="type:'hr',name:'recruitPosChoose',
				   	back:{name:'#recomPosName',jobApplyId:'#jobApplyId',jobPosId:'#recomPosId',organId:'#recomOrgId',
				   	deptName:'#recomDptName',organName:'#recomOrgName',deptId:'#recomDptId'}"/>		
		<x:inputTD name="recomOrgName" required="true" label="推荐单位" />
		<x:inputTD name="recomDptName" required="true" label="推荐部门"  />		
		
		</tr>	
		<tr>	
		<x:selectTD name="education" required="false" label="最高学历" />		
		<x:inputTD name="specialty" required="false" label="所学专业" maxLength="32"/>		
		<x:inputTD name="university" required="false" label="毕业学校" maxLength="32"/>	
		</tr>	
		<tr>	
		<x:inputTD name="nowCompany" required="false" label="现就职单位" maxLength="32"/>		
		<x:inputTD name="nowPos" required="false" label="现任职务" maxLength="32"/>	
		<x:inputTD name="telephone" required="false" label="联系方式" maxLength="32"/>		
			
		</tr>	
		<tr>
				<x:inputTD name="relation" required="false" label="与推荐人关系" maxLength="32"/>
				<td colspan=4 class='title'></td>
		
		</tr>
	     <tr>
			<x:textareaTD name="recomReason" required="false" label="推荐理由"
						rows="3" colspan="5" />
		</tr>
	</table>
		  <x:fileList bizCode="HRSpecialTalentRecom" bizId="recomId" id="HRSpecialTalentRecomFileList"/>
	
	</form>
	</div>
</body>
</html>
