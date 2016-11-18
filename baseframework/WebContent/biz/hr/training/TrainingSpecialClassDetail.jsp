<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
	<x:layout  proportion="100px,170px,110px,200px"/>
	<tr>
	<x:hidden name="applyCompanyId"/>
	<x:hidden name="applyDeptId"/>
	<x:hidden name="classStatus"  value="0"/>
	<x:inputTD name="applyCompany" required="true" label="申请公司"  wrapper="select"/>		
	<x:inputTD name="applyDept" required="true" label="申请部门"  wrapper="select"/>	
	</tr>
	<tr>
	<x:hidden name="trainingSpecialClassId"/>
	<x:inputTD name="className" required="true" label="班级名称" maxLength="128"  />
	<x:inputTD name="slogan" required="false" label="班级口号" maxLength="256"  />
	</tr>
	<tr>
	<x:inputTD name="trainingWay" required="true" label="培训形式" maxLength="256"  colspan="3"/>
	</tr>
	<tr>
	<x:inputTD name="openTime" required="true" label="计划开班时间" wrapper="dateTime" maxLength="7"/>
	<x:inputTD name="graduatedTime" required="true" label="计划结业时间" wrapper="dateTime" maxLength="7"/>
	</tr>
	<tr>
	<x:selectTD name="trainingLevel" required="true" label="培训级别"  />	
	<x:selectTD name="isNewStaffTrain" required="true" label="新员工入职培训"  dictionary="yesorno"  value="0"/>	
	</tr>
	<tr>
	<x:inputTD name="trainStaffNum" required="true" label="培训人数"  mask="nnnnn" />	
	<x:inputTD name="trainFee" required="true" label="费用预算"  mask="nnnnnnn.nn"/>
	</tr>
	<tr>
	<x:selectTD name="isOnlineScore" required="true" label="是否线上评分"   dictionary="yesorno" />	
	<x:inputTD name="realityTrainFee" required="false" label="实际培训费用"  mask="nnnnnnn.nn"/>
	</tr>
	<tr>
	<x:selectTD name="isHignLeaderTrain" required="true" label="是否公司高管培训"   dictionary="yesorno"  />	
	<td colspan="2"  class="title"></td>
	</tr>
	</table>
</form>
