<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox,attachment"/>
   	<script src='<c:url value="/biz/hr/entry/beformal/BeFormalBill.js"/>' type="text/javascript"></script> 

  </head>
  <body>
  <div class="ui-form" style="width: 99%;">
  			<div class="subject">员工转正申请</div>
	  	<form method="post" action="" id="submitForm">
	  	<div class="bill_info">
				<span style="float: right;"> 单据号码：<strong><c:out
							value="${billCode}" /></strong> &nbsp;&nbsp; 申请日期：<strong> <x:format
							name="fillinDate" type="date" /></strong>
				</span> 
			
			</div>
			<table class='tableInput' id='queryTable'>
				<x:layout proportion="80px,160px,100px,160px,100px,160px,100px,160px" />
					
		<x:hidden name="beFormalId"/>
			<x:hidden name="organId"/>
		<x:hidden name="deptId"/>
		<x:hidden name="positionId"/>
		<x:hidden name="personMemberId"/>
		<x:hidden name="taskKindId"/>
		<x:hidden name="fullId"/>
		<x:hidden name="procUnitId"/>
		<x:hidden name="billCode"/>
		<x:hidden name="fillinDate" type="date"/>
		<x:hidden name="staffingPostsRank"/>
		<x:hidden name="staffingPostsRankSequence"/>
		<tr>
		<x:inputTD name="personMemberName" required="false" label="姓名" disabled="true"/>	
		<x:inputTD name="age" required="false" label="年龄"   mask="nn" disabled="true"/>	
		<x:selectTD name="sex" required="false" label="性别" readonly="true"/>	
		<x:inputTD name="positionName" required="false" label="岗位名称" disabled="true"/>					
		</tr>
		<tr>	
	    <x:inputTD name="organName" required="false" label="公司"  disabled="true"  />	
	    <x:inputTD name="centreName" required="false" label="一级中心" disabled="true"/>					
	  	<x:inputTD name="deptName" required="false" label="部门" disabled="true"/>					
	    <x:selectTD name="posLevel" required="false" label="行政级别"  readonly="true"/>
		</tr>
		<tr>			
		<x:selectTD name="education" required="false" label="学历"  maxLength="32"  readonly="true"/>					
		<x:inputTD name="f04" required="false" label="毕业学校" disabled="true" />		
	    <x:inputTD name="employedDate" required="false" label="到公司时间"  wrapper="date"  readonly="true"/>			
		 <x:inputTD name="willBeformalDate" required="false" label="预计转正时间"  wrapper="date"  readonly="true"/>			
		</tr>		
				
		<tr  id="beformalTypeTr">
     	<x:selectTD name="beformalType" required="true" label="转正类型" />	
        <td colspan="4" class="title"></td>
		</tr>
		
		<tr>
		<x:textareaTD name="mainWork" required="true" label="试用期主要工作业绩"   colspan="7" maxLength="450"  rows="5"/>	
		</tr>		
		
		<tr>
		<x:textareaTD name="personalEvaluate" required="true" label="个人提升方向" rows="5"  colspan="7" maxLength="450"/>	
		</tr>			
		
		<tr  id="viewRecordTr">
		<x:textareaTD name="viewRecord" required="false" label="转正面谈记录" rows="5"  colspan="7" maxLength="450"/>	
		</tr>		
		</table>
		<x:title title="确认以下转正资料是否齐全"  name="group"/>
		<table class='tableInput' id='queryTable'>
				<x:layout proportion="80px,70px,80px,70px,80px,70px,80px,70px,80px,70px,110px" />
				<tr id="resultScore">
				<x:inputTD name="upLevelAverageScore" required="false" label="上级平均分"   />					
				<x:inputTD name="equelLevelAverageScore" required="false" label="平级平均分"  />					
				<x:inputTD name="lowLevelAverageScore" required="false" label="下级平均分"   />					
				<x:inputTD name="totalAverage" required="false" label="合计平均分" />					
				<x:inputTD name="scoreMyself" required="false" label="自评分"  />
				<td colspan=1 class="title"><a href="javascript:viewZZCPResultDetail(this.form);" class="ALink"> 查看转正测评明细 </a></td>
				</tr>
				<tr>
		<td colspan="11" style="color:red;font-size:14px;">
		(1:新员工试用期督导情况表,由督导师填写;2:督导考核评分表,由员工本人在系统中的待办任务中提交;
		  3:新员工试用期评价表,由中心第一负责人填写;4:培训记录,由人力资源上传)
		</td>
		</tr>	
				<tr>
				<td colspan="2">
			     <A HREF="javascript:teacherPlanRecord(this.form);"> 新员工试用期督导情况表
				</td>
				<td colspan="2">
			     <A HREF="javascript:teacherScoreRecord(this.form);"> 督导考核评分表
				</td>
				<td colspan="2">
			     <A HREF="javascript:proEvaRecord(this.form);"> 新员工试用期评价表
				</td>
				<!-- <td colspan="2">
			     <A HREF="javascript:familyVisitRecord(this.form);"> 家访记录
				</td> -->
				<td colspan="5">
			     <A HREF="javascript:trainRecord(this.form);"> 培训记录
				</td>
				
				</tr>
				
				</table>
		     
			</form>
		</div> 
		 <div class="blank_div"></div>
		<div  style="color: red;font-size:14px" align="left"> 
		   (注:家访记录单是将已填写好家访回执单扫描成附件上传,若是特殊家访,请员工本人在系统中填写特殊情况家访申请表,并将直系亲属与员工的关系证明扫描附件上传)
		  </div>
			<x:fileList bizCode="beFormalApply" bizId="beFormalId"  id="beFormalApplyFileList"  isClass="true" proportion="11%,21%,12%,21%,10%,26%" />
		<div id="leaderHeader">
		<x:title title="直接领导意见" name="group" />
		<table class='tableInput' id='queryTable' >
			<x:layout proportion="80px,160px,100px,160px,100px,160px" />
		<tr>
     	<x:selectTD name="opinion" required="false" label="是否同意转正 "/>	
     	<x:selectTD name="salaryOpinion" required="false" label="工资变动意见" />
        <td colspan="2" class="title"></td>
		</tr>
		</table>
		</div>
		
  </body>
</html>
