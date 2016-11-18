<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
	<x:base include="dialog,grid,dateTime,combox,tree"/>
	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/biz/hr/paformMake/PerformAssessFormBill.js"/>'   type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>

</head>
<body>
	<div class="ui-form" style="width: 99%;">
		<div class="subject">绩效考核表制定</div>
         <form method="post" action="" id="submitForm">
              <div class="bill_info">
			  <span style="float:right;">
			     	单据号码：<strong><c:out value="${billCode}"/></strong>
			     	&nbsp;&nbsp;&nbsp;
					填表日期：<strong><x:format name="fillinDate" type="date"/></strong>
				</span>
		</div>
		<div class="blank_div"></div>
	<table class='tableInput' style="width: 99%;">
	<x:layout />
		<x:hidden name="templetId"/>
		<x:select name="scorePersonLevel" cssStyle="display:none;" id="scorePersonLevel" emptyOption="false"/>
		<x:select name="periodMap" id="periodMapQuery" list="periodMap" cssStyle="display:none;" emptyOption="false"/>
		
		     <x:hidden name="organId" />
				<x:hidden name="deptId" />
				<x:hidden name="positionId" />
				<x:hidden name="personMemberId" />
				<x:hidden name="fullId" />
				<x:hidden name="organName" />
				<x:hidden name="billCode" />
				<x:hidden name="deptName" />
				<x:hidden name="positionName" />
				<x:hidden name="personMemberName" />
				<x:hidden name="fillinDate" type="date"/>
				<x:hidden name="paType"  value="1"/>
				<x:hidden name="templetCode"/>
				<x:hidden name="templetId" />
				<x:hidden name="procUnitId"/>
				<x:hidden name="auditId"/>
				<x:hidden name="underAssessmentId"/>
				<x:hidden name="isScreenStartAssessButton"/>
				<x:hidden name="isEditTemplet"/>
				<x:hidden name="isCountQuarterGrade"/>
				<x:hidden name="isQuarterRank"/>
				<x:hidden name="lineMax"/>
				<x:hidden name="lineMin"/>
				<x:hidden name="minScore"/>
				<tr>
				    <x:hidden name="personId" />
					<x:inputTD name="personName" required="false" label="被考核人"  disabled="true"/>
					<x:inputTD name="deptName" required="false" label="被考核人所在部门"  disabled="true"/>
					<x:inputTD name="positionName" required="false" label="被考核人岗位"  disabled="true"/>
				</tr>
				<%-- <tr>
					
					<x:hidden name="paType"/>
				    <x:inputTD name="templetName" required="true" label="选择考核模板"  wrapper="select"/>
					<x:inputTD name="examBeginTime" required="true" label="考核开始时间"  wrapper="date"/>
					<x:inputTD name="examEndTime" required="true" label="考核结束时间" wrapper="date" />
				</tr>	 --%>
			
				<tr>
				<x:hidden name="orgnId" id="detailOrgnId"/>
				<x:hidden name="jxassessType" />
				<x:inputTD name="jxassessTempletTypeName"  label="绩效考核模板选择"    required="true"  wrapper="select" />
				<x:inputTD name="periodCode" required="true" label="考核类别" maxLength="22" id="detailPeriodCode"/>
				<x:inputTD name="total" required="true" label="权重合计" maxLength="22"  mask="nnn"/>
				
				</tr>
				<tr>
				 <x:inputTD name="orgnName" id="detailOrgnName" required="false" label="考核排名单位" maxLength="64" wrapper="select"/>
				<x:inputTD name="templetName" required="true" label="考核表名称" />
				<x:selectTD name="status" label="考核表状态"   list="PerStatus"  emptyOption="false" readonly="true" />
				</tr>
					<tr>
		<td colspan="6" style="color:red;font-size:12px">
		考核排名单位选择规则<br/>
		1:考核排名单位指员工本人参与考评排名的机构;<br/>
		2:特殊排名的机构如成都公司的销支类岗位,需要单独在组织机构中选择“销支岗位”,具体请咨询本单位人力资源部门.
		3:城市公司财务部门负责人的排名单位请选择总部财务管理中心会计管理中心，成本部门负责人的排名单位请选择总部成本管理中心.
		</td>
		</tr>	
	</table>
		<div class="blank_div"></div>
	  <div id="maingrid" style="margin: 2px;"></div>
	  <div class="blank_div"></div>
	  <x:title title="评分人列表"/>
	  <div  style="color: red" align="left"  id="selfDefinePersonDiv"> 
	  <table>
	   <tr>
          <td width="30%" align="center">人员类别</td>
          <td width="30%" align="center">一级评分人及权重</td>
          <td width="30%" align="center">二级评分人及权重</td>
          
        </tr>
         <tr>
          <td width="30%" align="center">预算/融资人员</td>
          <td width="30%" align="center">城市公司直接上级，30%</td>
          <td width="30%" align="center">总部职能中心负责人，70%</td>
          
        </tr>
         <tr>
          <td width="30%" align="center">城市公司核算/成本职能第一负责人</td>
          <td width="30%" align="center">城市公司负责人，30%</td>
          <td width="30%" align="center">总部职能中心负责人，70%</td>
          
        </tr>
         <tr>
          <td width="30%" align="center">招采人员</td>
          <td width="30%" align="center">城市公司评分人，100%</td>
          <td width="30%" align="center">总部招标采购中心负责人，100%</td>
          
        </tr>
        <tr>
          <td width="30%" align="center">其他员工</td>
          <td width="30%" align="center">直接上级，100%</td>
          <td width="30%" align="center">直接上级的上级，100%</td>
        </tr>
	  </table>
	  </div>
	  
	  <div style="color: red" align="left"  id="specialDefinePersonDiv">
	  <table>
	    <tr>
          <td width="30%" align="center">使用固定模板的岗位</td>
          <td width="30%" align="center">一级评分人</td>
          <td width="30%" align="center">二级评分人</td>
        </tr>
         <tr>
          <td width="30%" align="center">置业顾问</td>
          <td width="30%" align="center">所在项目销售经理</td>
          <td width="30%" align="center">所在项目营销总监或销售总监</td>
        </tr>
         <tr>
          <td width="30%" align="center">销售经理/销支经理</td>
          <td width="30%" align="center">所在公司营销第一负责人</td>
          <td width="30%" align="center">郑贝</td>
        </tr>
         <tr>
          <td width="30%" align="center">销支主管/销售内业/签约专员</td>
          <td width="30%" align="center">销支经理或销售经理</td>
          <td width="30%" align="center">所在公司营销第一负责人</td>
        </tr>
         <tr>
          <td width="30%" align="center">呼叫座席</td>
          <td width="30%" align="center">蔡筱雯</td>
          <td width="30%" align="center">李巍巍</td>
        </tr>
       
	  </table>
	  </div>
	  <div id="personid" style="margin: 2px;"></div>
	
</form>
</div>
</body>
</html>