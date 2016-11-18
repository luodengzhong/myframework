<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,tree,combox,attachment"/>
  	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/biz/hr/performanceRank/PerformanceRankGroupResult.js"/>' type="text/javascript"></script>
  </head>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  		<div class="subject">绩效排名结果审核</div>
	  		<div  style="color: red" align="center"  id="tipdiv">${tip}</div>
			<form method="post" action="" id="submitForm">
			      <div class="bill_info">
			          <span style="float:right;">
			         	单据号码：<strong><c:out value="${billCode}"/></strong>
			     	    &nbsp;&nbsp;&nbsp;
					           填表日期：<strong><x:format name="fillinDate" type="date"/></strong>
				      </span>
		          </div>
		          <div class="blank_div"></div>
				<table class='tableInput'>
			        <x:layout proportion="90px,110px,90px,110px,90px,110px,90px,110px" />
			        <x:hidden name="performanceRankGroupId" />
			        <x:hidden name="id"/>
			        <x:hidden name="organId" />
			        <x:hidden name="deptId" />
			        <x:hidden name="positionId" />
			        <x:hidden name="personMemberId" />
			        <x:hidden name="fullId" />
			        <x:hidden name="billCode"/>
			        <x:hidden name="fillinDate"  type="date"/>
			        <x:hidden name="status" />
			        <x:hidden name="isArchive"/>
			        <x:hidden name="isCombine"/>
			        <x:hidden name="isCountAsscore"/>
			        
			        <!-- 排名负责人 -->
			        <x:hidden name="organizationId" />
			        <x:hidden name="organizationName" />
			        <x:hidden name="underAssessmentId"/>
			        <x:hidden name="centerId" />
			        <x:hidden name="centerName" />
			        <x:hidden name="dptId" />
			        <x:hidden name="dptName" />
			        <x:hidden name="posId" />
			        <x:hidden name="posName" />
			        <x:hidden name="archivesId" />
			        <x:select name="performanceLevel" id="mainPerformanceLevel" dictionary="performanceLevel"  cssStyle="display:none;" emptyOption="false"/>
	             	<x:select name="tempArchivesState" list="archivesState" cssStyle="display:none;"/>
			        <!--  			        
			        <tr>
				        <x:inputTD name="organName" required="false" disabled="true" label="公司名称" maxLength="64" />
				        <x:inputTD name="billCode" required="false" disabled="true" label="单据号码" maxLength="32" />
				        <x:inputTD name="fillinDate" required="false" disabled="true" label="填表日期" mask="date" />
			        </tr>
			        <tr>
		                <x:inputTD name="deptName" required="false" label="部门名称"  disabled="true"/>					
		                <x:inputTD name="positionName" required="false" label="岗位名称" disabled="true"/>					
		                <x:inputTD name="personMemberName" required="false" label="制单人"  disabled="true"/>	
		            </tr>
		            -->	
			        <tr>
			        <x:hidden name="periodIndex"/>
			        <x:hidden name="periodCode"/>
			           <x:inputTD name="underAssessmentName" emptyOption="false" required="false" label="排名单位" disabled="true"/>
			           <x:inputTD name="year" emptyOption="false" required="false" label="考核年" disabled="true"/>
			           <x:inputTD name="periodText" emptyOption="false" required="false" label="考核周期" disabled="true"/>
			           <x:inputTD name="staffName" required="false" label="排名负责人" disabled="true" />	
		            </tr>
		            
		        </table>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div> 
	</div>
  </body>
</html>
