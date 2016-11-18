<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
    <x:base include="dialog,grid,dateTime,combox,tree,attachment" />
    <script src='<c:url value="/biz/hr/train/specailtrainapply/TrainSpecialApplyBill.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="ui-form" style="width: 99%;">
		<div class="subject"> 专项培训申请表</div>
		<div class="bill_info">
		<span style="float: right;"> 
		 单据号码：<strong><c:out value="${billCode}" /></strong>
		 &nbsp;&nbsp;&nbsp; 填表日期：<strong><x:format name="fillinDate" type="date" /></strong>
		 &nbsp;&nbsp; 经办人:<strong><c:out value="${personMemberName}" /></strong>&nbsp;&nbsp;
		</span>
		</div>
    <form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
	<x:layout/>
	     <tr>
		<x:hidden name="trainSpecialApplyId"/>
		<x:hidden name="organName"/>
		<x:hidden name="organId"/>
		<x:hidden name="deptId"/>
		<x:hidden name="deptName"/>
		<x:hidden name="positionId"/>
		<x:hidden name="positionName"/>
		<x:hidden name="personMemberId"/>
		<x:hidden name="personMemberName"/>
		<x:hidden name="fullId"/>
		<x:hidden name="status"  value="0"/>
		<x:hidden name="billCode"/>
		<x:hidden name="fillinDate"  type="date"/>
		<x:hidden name="version"/>
	    <x:select name="TLevel" list="TLevel" cssStyle="display:none;" emptyOption="false" />
		<x:hidden name="applyCompanyId"/>
		<x:hidden name="applyDeptId"/>
		<x:hidden name="applyCenterId"/>
		<x:inputTD name="applyCompany" required="true" label="申请公司"  wrapper="select"/>	
		<x:inputTD name="applyCenter" required="true" label="申请中心"  wrapper="select"/>	
		<x:inputTD name="applyDept" required="true" label="申请部门"  wrapper="select"/>	
		</tr>
		<tr>
		<x:selectTD name="trainingLevel" required="true" label="培训级别"  />	
		<x:selectTD name="isNewStaffTrain" required="true" label="是否是新员工入职培训"  dictionary="yesorno"/>	
		<x:inputTD name="trainStaffNum" required="true" label="培训人数"  mask="nnnnn" />	
		</tr>
		
		<tr>
		<x:inputTD name="trainStartTime" required="true" label="培训开始时间"  wrapper="dateTime"/>		
		<x:inputTD name="trainEndTime" required="true" label="培训结束时间" wrapper="dateTime"/>		
		<x:inputTD name="trainFee" required="true" label="费用预算(/元)" mask="nnnnnnn.nn"/>		
	    </tr>
	    <tr>
		<x:inputTD name="applyName" required="true" label="培训项目名称"  colspan="5"  maxLength="64" />	
		</tr>
	    <tr>
	    <x:textareaTD name="trainCourse" required="true" label="课程大纲" maxLength="512"  colspan="5"  rows="3"/>		
	    </tr>
	    <tr>
	    <x:textareaTD name="trainAddReason" required="true" label="申请原因" maxLength="512"   colspan="5"  rows="5"/>		
	    </tr>
	  </table>
    	<x:fileList bizCode="TrainingSpecialApply" bizId="trainSpecialApplyId" id="TrainingSpecialApplyFileList" />
	  <div class="blank_div"></div>
	  <x:title title="培训讲师列表"  name="group"/>
      <div id="maingrid"  style="margin: 2px;"></div>
    </form>
</div>
</body>
</html>