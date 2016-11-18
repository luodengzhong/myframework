<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<head>
     	<x:base include="dialog,grid,dateTime,tree,combox,attachment"/>
     	<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
        <script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>
  	  	<script src='<c:url value="/biz/hr/performanceInterview/PerformanceInterview.js"/>'   type="text/javascript"></script>
  </head>

  <body>
  	<div class="ui-form" style="width: 99%;">
  			<div class="subject">绩效面谈整改审批表</div>
	  	<form method="post" action="" id="submitForm">
			<table class='tableInput' style="width: 99%;"  id='queryTable' id="table_03">
			<x:layout proportion="12%,21%,12%,21%,10%" />
			        <x:hidden name="auditId" />
			        <x:hidden name="organId" />
			        <x:hidden name="deptId" />
			        <x:hidden name="positionId" />
			        <x:hidden name="personMemberId" />
			        <x:hidden name="fullId" />
			        
			        <x:hidden name="archivesId" />
			        <x:hidden name="orgnizationId" />
			        <x:hidden name="centerId" />
			        <x:hidden name="departmentId" />
			        <x:hidden name="posId" />
			        <x:hidden name="status"  value="0"/>
			        <x:hidden name="rectificationPlan"  value="0"/>
			        <x:hidden name="interviewerId" />

		<tr>
		     <x:inputTD name="organName" required="false" label="单位名称"  disabled="true"  />					
		     <x:inputTD name="fillinDate" required="false" label="填表日期" wrapper="date" disabled="true"/>					
		     <x:inputTD name="billCode" required="false" label="单据号码" disabled="true"/>		
		</tr>
		<tr>			
		      <x:inputTD name="deptName" required="false" label="部门名称" disabled="true"/>					
		      <x:inputTD name="positionName" required="false" label="岗位名称" disabled="true"/>					
		      <x:inputTD name="personMemberName" required="false" label="制表人" disabled="true"/>	
		</tr>
		</table>
		<x:title name="group" title="被面谈人基本信息" hideTable="#table_01" />
		<table  class='tableInput' style="width: 99%;"  id="table_01">
		<x:layout proportion="12%,21%,12%,21%,10%" />
		<tr>
		      <x:inputTD name="staffName" required="true" label="员工" readonly="true"/>
		      <x:selectTD name="rank" dictionary="performanceLevel"  required="false" label="排名等级" readonly="true"/>
		      <x:selectTD name="sex" required="false" dictionary="sex" label="性别" readonly="true"/>
		     
		</tr>
		<tr>
		      <x:inputTD name="year" required="true" label="考核年"   mask="nnnn"/>
	          <x:selectTD list="period" name="periodCode"   required="true" label="考核周期" emptyOption="false"  disable="true"/>		   
			 <x:inputTD name="periodIndex" required="true" label="考核时间" />
		     
		</tr>
		<tr>
              <x:selectTD name="education" required="false" dictionary="education" label="学历" readonly="true"/>		
			  <x:inputTD name="orgnizationName" required="false" label="单位" readonly="true"/>
		      <x:inputTD name="centerName" required="false" label="中心"  readonly="true"/>
		      
		      <!--  	
		      <x:inputTD name="departmentName" required="false" label="部门" maxLength="32" readonly="true"/>
              -->	
		</tr>
		<tr>
		      <x:inputTD name="posName" required="false" label="岗位" readonly="true"/>
		      <x:selectTD name="posLevel" dictionary="posLevel"  required="false" label="行政级别" readonly="true"/>	
		      <x:inputTD name="employedDate" required="false" label="入职日期" wrapper="date" readonly="true"/>
		</tr>
		</table>
	
		<x:title name="group" title="面谈记录" hideTable="#table_03"/>
		<table  class='tableInput' style="width: 99%;"  id="table_03">
		<x:layout proportion="86px,160px,100px,160px,87px,160px" />
		<tr>
		<td colspan="6" style="color:red;font-size:14px">
		(备注:请面谈人填写面谈时间,面谈地点和面谈内容)
		</td>
		</tr>
		<tr  >
		      <x:inputTD name="interviewerName" required="true" label="沟通人" wrapper="select"/>	
		      <x:inputTD name="interviewTime" required="false" label="沟通时间"  wrapper="date"/>	
		      <x:inputTD name="interviewLocation" required="false" label="沟通地点"  />			
		</tr>
		</table>
		<x:title title="季度绩效沟通要点" name="group" />
		<table class='tableInput' style="width: 99%;"  id="advantage">
		<x:layout proportion="100px,300px,120px" />
		   <thead>
			<tr class="table_grid_head_tr">
				<th>员工现有优势</th>
				<th>该优势保留/提升的行动计划（至少1条）</th>
				<th>具体目标</th>
			</tr>
		  </thead>
		<tbody id="performdetailComTbody">
		<c:forEach  items="${advantageList}" var="item">
			<tr>
			<input type='hidden' name='detailType' value='1' />
			<input type='hidden' name='interviewDetailId' value='<c:out value="${item.interviewDetailId}"/>' />
			<input type='hidden' name='auditId' value='<c:out value="${item.auditId}"/>' />
			
				<td title='<c:out value="${item.item}"/>' class="edit">
						<input class="text" name="item" id="item" style='height: 30px;' required="true"
							maxLength="300" value='<c:out value="${item.item}" />'
							title='<c:out value="${item.item}" />'></input>
				</td>		
				<td title='<c:out value="${item.content}"/>' class="edit">
						<input class="text" name="content" id="content" style='height: 30px;' required="true"
							maxLength="300" value='<c:out value="${item.content}" />'
							title='<c:out value="${item.content}" />'></input>
				</td>		
				<td title='<c:out value="${item.target}"/>' class="edit">
						<input class="text" name="target" id="target" style='height: 30px;' required="true"
							maxLength="300" value='<c:out value="${item.target}" />'
							title='<c:out value="${item.target}" />'></input>
				</td>			
			</tr>	
		</c:forEach>
		</tbody>
		</table>
		  <table class='tableInput' style="width: 99%;"  id="improve">
		<x:layout proportion="100px,300px,120px" />
		   <thead>
			<tr class="table_grid_head_tr">
				<th>员工需改进的地方</th>
				<th>下季度改进的行动计划（至少1条）</th>
				<th>具体目标</th>
			</tr>
		  </thead>
		<tbody id="performdetailComTbody">
		<c:forEach  items="${improveList}" var="item">
			<tr>
			<input type='hidden' name='detailType' value='2' />
			<input type='hidden' name='interviewDetailId' value='<c:out value="${item.interviewDetailId}"/>' />
			<input type='hidden' name='auditId' value='<c:out value="${item.auditId}"/>' />
				<td title='<c:out value="${item.item}"/>' class="edit">
						<input class="text" name="item" id="item" style='height: 30px;' required="true"
							maxLength="300" value='<c:out value="${item.item}" />'
							title='<c:out value="${item.item}" />'></input>
				</td>		
				<td title='<c:out value="${item.content}"/>' class="edit">
						<input class="text" name="content" id="content" style='height: 30px;' required="true"
							maxLength="300" value='<c:out value="${item.content}" />'
							title='<c:out value="${item.content}" />'></input>
				</td>		
				<td title='<c:out value="${item.target}"/>' class="edit">
						<input class="text" name="target" id="target" style='height: 30px;' required="true"
							maxLength="300" value='<c:out value="${item.target}" />'
							title='<c:out value="${item.target}" />'></input>
				</td>			
			</tr>	
		</c:forEach>
		</tbody>
		</table>
		 	<div  id="yearImprovePlan">
		<x:title name="group" title="年度沟通要点（第4季度绩效沟通时必须填写）" />
		<table  class='tableInput' style="width: 99%;"  id="table_02">
		<x:layout proportion="110px,160px,100px,160px,87px,160px" />
		<tr>
		      <x:textareaTD name="developmentPlanOne" required="false" label="1年内职业发展目标" rows="6" colspan="5"/>
		    
		</tr>
		<tr>
		      <x:textareaTD name="developmentPlanThree" required="false" label="1-3年内职业发展目标" rows="6" colspan="5"/>
		</tr>
			<tr>
		      <x:textareaTD name="acceptPlace" required="false" label="可接受的工作地点" rows="2" colspan="5"/>
		</tr>
		</table>
		</div>
			</form>
		</div> 
  </body>
	
	
