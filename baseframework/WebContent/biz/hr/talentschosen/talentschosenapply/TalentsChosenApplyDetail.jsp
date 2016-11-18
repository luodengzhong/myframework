<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
  <x:title title="基本信息"  name="group"/>
	<table class='tableInput' style="width: 99%;">
	<x:layout  proportion="120px,200px,100px,150px,100px,150px"/>
	   
	   
	   <tr>
		<x:inputTD name="staffName" required="false" label="员工姓名"   wrapper="select"/>		
		<x:selectTD name="sex" required="false" label="性别"   readonly="true"  cssClass="textReadonly"/>		
		<x:inputTD name="age" required="false" label="年龄"  readonly="true"  cssClass="textReadonly"/>		
		</tr>
	     <tr>
		
		<x:hidden name="chosenApplyId"/>
		<x:hidden name="archivesId"/>
				<x:hidden name="posId"/>
				<x:hidden name="ognId"/>
				<x:hidden name="centreId"/>
				<x:hidden name="posLevel"/>
				<x:hidden name="fullId"/>
		<x:inputTD name="ognName" required="false" label="所在单位" readonly="true" cssClass="textReadonly"/>		
		<x:inputTD name="centreName" required="false" label="所在中心" readonly="true"  cssClass="textReadonly"/>		
		<x:inputTD name="employedDate" required="false" label="入职时间"  wrapper="date"  readonly="true"  cssClass="textReadonly"/>	
		
		</tr>
		
		<tr>
		<x:selectTD name="education" required="false" label="最高学历" readonly="true"  cssClass="textReadonly"/>		
		<x:inputTD name="campus" required="false" label="毕业学校" readonly="true"  cssClass="textReadonly"/>		
		<x:inputTD name="specialty" required="false" label="专业" readonly="true"  cssClass="textReadonly"/>	
		</tr>
		<tr>	
		<x:hidden name="chosenPosId"/>
		<x:hidden name="competePositionId"/>
		<x:hidden name="chosenOrganId"/>
		<x:hidden name="chosenCenterId"/>
		<x:hidden name="chosenDeptId"/>
			<x:hidden name="chosenOrganName"/>	
			<x:hidden name="chosenCenterName"/>	
			<x:hidden name="chosenDeptName"/>
			<x:hidden name="talentsChosenDemandId"/>
			<x:hidden name="speechType"/>
		<x:inputTD name="chosenPosName" required="true" label="拟选拔职位"  wrapper="select"/>		
		<x:inputTD name="fillinDate" required="true" label="填表时间"  wrapper="date"/>		
		<x:inputTD name="posName" required="false" label="现任职位" readonly="true"  cssClass="textReadonly"/>		
		</tr>
		
		<tr>
		<x:textareaTD name="reason" required="true" label="申请理由陈述" rows="20" colspan="5"  maxLength="512"/>
		
		</tr>
				</table>
		
		
</form>
