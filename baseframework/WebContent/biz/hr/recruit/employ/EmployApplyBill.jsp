<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox,tree,attachment" />
<script src='<c:url value="/biz/hr/recruit/employ/EmployApplyBill.js"/>' type="text/javascript"></script>
<script src='<c:url value="/javaScript/PersonalPasswordAuth.js"/>' type="text/javascript"></script>
<!--  <script src='<c:url value="/biz/hr/recruit/interview/QueryOrganComm.js"/>' type="text/javascript"></script>-->
</head>
<body>
	<div class="ui-form" style="width: 99%;">
		<div class="subject">新员工录用审批表</div>
		<form method="post" action="" id="submitForm">
		 <div class="bill_info">
				<span style="float:left;">
					单据号码：<strong><c:out value="${billCode}"/></strong>
					&nbsp;&nbsp;
					申请日期：<strong><x:format name="fillinDate" type="date"/> </strong>
				</span>
				<span style="float:right;">
					申请人：<strong><c:out value="${personMemberName}"/></strong>
				</span>
		</div>
		<div class="blank_div"></div>
			<table class='tableInput' id='queryTable'>
				<x:layout proportion="130px,140px,110px,150px,90px,160px" />
				<x:hidden name="employApplyId" />
				<x:hidden name="writeId" />
				<x:hidden name="organId" />
				<x:hidden name="deptId" />
				<x:hidden name="positionId" />
				<x:hidden name="personMemberId" />
				<x:hidden name="fullId" />
				<x:hidden name="organName" />
				<x:hidden name="fillinDate" type="date"/>
				<x:hidden name="billCode" />
				<x:hidden name="deptName" />
				<x:hidden name="positionName" />
				<x:hidden name="personMemberName" />
				
				<tr>
					<x:inputTD name="staffName" required="true" label="录用员工"  wrapper="select"/>
					<x:hidden name="applyPosId" />
					<x:inputTD name="applyPosName" required="false" label="应聘职位" />
					<td colspan=1 class="title"><a href="javascript:interviewRecord(this.form);" class="ALink"> 查看面试记录 </a></td>
					<td colspan=1 class="title"><a href="javascript:showViewPersonRegister(this.form);" class="ALink"> 查看个人简历 </a></td>
					 
				</tr>
				
				<tr>
					<x:hidden name="employPosId" />
					<x:inputTD name="employPosName" required="true" label="拟定职位" wrapper="select" />
					<x:selectTD name="posLevel" required="true" label="行政级别" />
					<td colspan=1 class="title"><a href="javascript:queryRecruitApply(this.form);" class="ALink"> 查看招聘需求</a> </td>
					<td colspan=1 class="title"><a href="javascript:showViewBackground(this.form);" class="ALink"> 查看背景调查 </a></td>
				
				</tr>
				
				<tr>
					<x:hidden name="employCompanyId" />
					<x:inputTD name="employCompany" required="true" label="拟定单位" readonly="true"/>
					<x:hidden name="employCenterId" />
					<x:inputTD name="employCenter" required="true" label="拟定中心" readonly="true"/>
					<x:hidden name="employDeptId" />
					<x:inputTD name="employDept" required="true" label="拟定部门"  readonly="true"/>
				</tr>
			
				<tr>
				    <x:selectTD name="staffingLevel" required="true" label="编制类别" />
					<x:selectTD name="staffKind" required="true" label="人员类别"  />
						<x:hidden name="teacherId"/>
						<x:inputTD name="teacher" required="false" label="督导师姓名"  wrapper="select"/>
				</tr>
				<tr>
				    <x:selectTD name="staffingPostsRank" required="true" label="职级" />
					<x:inputTD name="staffingPostsRankSequence" required="true" label="职级序列"  maxLength="20" labelWidth="70"  wrapper="select" />
					<x:hidden name="responsibilitiyId"/>
					<x:inputTD name="responsibilitiyName" required="true" label="职能"  maxLength="20" labelWidth="60"  wrapper="select"/>
				</tr>
				<tr>
				<x:selectTD name="isCenterManager" required="true" label="是否公司/中心/部门第一负责人"  dictionary="yesorno"/>
				<x:selectTD name="isEnjoyDsWelfare" required="true" label="是否享受异地探亲福利"  dictionary="yesorno"/>
									<td colspan="2" class="title">&nbsp;</td>
				
				</tr>
			</table>
			<c:if test="${param.taskKindId!='makeACopyFor'&&param.isReadOnly!='true'}">
			<x:title title="薪酬" name="group" id="paymentGroup"/>
			<table class='tableInput' id='paymentTable'>
				<x:layout proportion="50px,100px,160px,110px,160px,100px,160px" />
				<tr id="wageKindTR">
				    <td class="title">类别:</td>
					<%-- <x:selectTD name="wageKind" required="true" label="工资类别标识" /> --%>
					<x:selectTD list="wageKindList" id="wageKind" name="wageKind" label="工资类别标识" required="true"/>	
					<td colspan="2" class="title">&nbsp;</td>
					<td colspan="2" class="title">&nbsp;</td>
				</tr>
				<tr>
					<td rowspan="2" class="title" >转正后:</td>
					<x:inputTD name="salaryYear" required="false" label="年度标准(元)" mask="money" />
					<x:inputTD name="salaryMonth" required="false" label="月度标准(元)" mask="money" />
					<x:inputTD name="specialQuarterlyPerformance" required="false" label="(招采)特殊绩效(元)" mask="money" />
				</tr>
				<tr>
					<x:inputTD name="performanceRelatedPay" required="false" label="年度绩效工资(元)" mask="money" />
					<x:inputTD name="quarterlyPerformance" required="false" label="全年季度绩效(元)" mask="money" />
					<x:inputTD name="consumptionMonth" required="false" label="月职务消费(元)" mask="money" />
				</tr>
				<tr>
					<td rowspan="2" class="title">试用期:</td>
					<x:inputTD name="proSalaryYear" required="false" label="年度标准(元)" mask="money" />
					<x:inputTD name="proSalaryMonth" required="false" label="月度标准(元)" mask="money" />
					<td colspan="2" class="title">&nbsp;</td>
				</tr>
				<tr>
					<x:inputTD name="proPerformanceRelatedPay" required="false" label="年度绩效工资(元)" mask="money" />
					<x:inputTD name="proQuarterlyPerformance" required="false" label="全年季度绩效(元)" mask="money" />
					<x:inputTD name="proConsumptionMonth" required="false" label="月职务消费(元)" mask="money" />
				</tr>
			</table>
			</c:if>
			<x:title title="基本信息" name="group" />
			<table class='tableInput' id='queryTable'>
				<x:layout proportion="100px,160px,100px,160px,100px,160px" />
				<tr>
					<x:inputTD name="height" required="false" label="身高" readonly="true" />
					<x:selectTD name="sex" required="false" label="性别" />
					<x:inputTD name="age" required="false" label="年龄" readonly="true" />
				</tr>
				<tr>
					<x:inputTD name="university" required="false" label="毕业院校" readonly="true" />
					<x:inputTD name="specialty" required="false" label="专业" readonly="true" />
					<x:selectTD name="education" required="false" label="学历" />
				</tr>
				<tr>
					<x:inputTD name="phoneNumber" required="false" label="联系方式" readonly="true" />
					<x:inputTD name="employDate" required="true" label="预期到岗时间" wrapper="date" />
					<x:radioTD name="isBackflow" required="true" label="是否是回流员工" dictionary="yesorno" value="0"></x:radioTD>
				</tr>
				<tr>
					<x:textareaTD name="excellent" required="false" label="优秀素质" rows="2" colspan="5"  maxLength="256"/>
				</tr>
				<tr>
					<x:textareaTD name="remark" required="false" label="备注" rows="2" colspan="5" maxLength="256"/>
				</tr>
			</table>
			<div class="blank_div"></div>
			<div  style="color: red;font-size:16px" align="left"> 
		   (注:录用主管级及以上的人员请务必挂上相应任免文件)
		  </div>
			<x:fileList bizCode="employApply" bizId="employApplyId" id="employApplyFileList" />
		</form>
	</div>
</body>
</html>
