<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>

<x:base include="dialog,grid,dateTime,combox" />
<script src='<c:url value="/biz/hr/recruit/personregister/PersonRegisterDetail.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>

</head>
<body>
	<form method="post" action="" id="submitForm">
		<x:title title="基本信息" name="group" hideTable="#queryTable" />
		<table class='tableInput' style="width: 99%;" id="queryTable">

			<x:layout proportion="80px,160px,115px,160px,90px,160px" />
			<x:hidden name="writeId" />
			<x:hidden name="organId"/>
			<x:hidden name="hunterId" />
			<x:hidden name="isInterRecommend" />
			<x:hidden name="isHeadhunter" />
			<x:hidden name="jobApplyId" />
			<x:hidden name="isInnerUpdate" />

			<tr>
				<x:hidden name="applyPosId" />
				<x:hidden name="applyDeptId" />
				<x:hidden name="applyDeptName" />
				<x:hidden name="applyOrganId" />
				<x:hidden name="applyOrganName" />
				<x:inputTD name="applyPosName" required="true" label="应聘岗位名称" wrapper="select" />
				<x:inputTD name="expecteSalary" required="true" label="希望年薪待遇(税前万元)" mask="nnn.nn" />
				<x:inputTD name="registerDate" required="true" label="填表日期" wrapper="dateTime"   disabled="true"/>
			</tr>
			<tr>
				<x:inputTD name="staffName" required="true" label="姓名" maxlength="10"/>
				<x:selectTD name="idCardType" required="true" label="证件类型" />
				<x:inputTD name="idCardNo" required="true" label="证件号" maxlength="18"/>
			</tr>
			<tr>
				<x:inputTD name="birthdate" required="true" label="出生日期" wrapper="date" />
				<x:inputTD name="age" required="true" label="年龄" mask="nn" />
				<x:selectTD name="sex" required="true" label="性别" />

			</tr>
			<tr>
				<x:inputTD name="nativePlace" required="false" label="籍贯" maxlength="16"/>
				<x:inputTD name="religion" required="false" label="宗教信仰" maxlength="16"/>
				<x:selectTD name="nation" required="false" label="民族" />
			</tr>

			<tr>
				
				<x:inputTD name="height" required="true" label="身高(cm)" mask="nnn" />
				<x:inputTD name="weight" required="false" label="体重(kg)" mask="nnn" />
				<x:selectTD name="blood" required="false" label="血型" />

			</tr>
			<tr>
				<x:inputTD name="university" required="true" label="毕业学校" maxlength="20"/>
				<x:inputTD name="specialty" required="true" label="所学专业" maxlength="18"/>
				<x:selectTD name="eduform" required="true" label="毕业类型" />
			</tr>
			<tr>
				<x:selectTD name="education" required="true" label="最高学历/学位" />
				<x:selectTD name="maritalStatus" required="false" label="婚姻状况" />
				<x:selectTD name="registeredKind" required="false" label="户口性质" />
			</tr>
			<tr>
				<x:selectTD name="politicsStatus" required="false" label="政治面貌" />
				<x:inputTD name="jobTitle" required="false" label="技术职称" maxlength="16"/>
				<x:inputTD name="driverLicense" required="false" label="驾照类别" maxlength="8"/>

			</tr>
			<tr>
				<x:inputTD name="registeredPlace" required="false" label="户口所在地" maxlength="32"/>
				<x:inputTD name="residence" required="false" label="现家庭住址" maxlength="32"/>
				<x:selectTD name="residenceKind" required="false" label="现住所性质" />
			</tr>
			<tr>
				<x:inputTD name="employedDate" required="true" label="预期到岗时间" wrapper="date" />
				<x:inputTD name="workPlace" required="false" label="首选工作地点" id="workPlaceFirst" maxlength="16"/>
				<x:radioTD name="choice" required="false" label="接受公司安排地点" dictionary="yesorno" value="1" />
			</tr>
			<tr>
				<x:inputTD name="phoneNumber" required="true" label="移动号码" maxlength="16"/>
				<x:inputTD name="workPhone" required="false" label="办公号码" maxlength="16"/>
				<x:inputTD name="email" required="true" label="电子邮箱" maxlength="32"/>

			</tr>
			<tr>
				<x:inputTD name="englishLevel" required="false" label="英语程度" maxlength="10"/>
				<x:inputTD name="company" required="true" label="原公司" maxlength="128"/>
				<x:inputTD name="job" required="true" label="原职务" maxlength="128"/>
			</tr>
			<tr id="isBackflowTr">
				<x:selectTD name="isBackflow" required="true" label="是否是回流员工" dictionary="yesorno" value="0" />
			<td colspan="4" class="title"></td>
			</tr>
			<tr>
				<x:inputTD name="linkman" required="false" label="紧急联系人姓名" maxlength="8"/>
				<x:inputTD name="otherPhoneNumber" required="false" label="紧急联系人电话号码" maxlength="16"/>
				<x:selectTD name="sourceType" required="true" label="应聘来源" dictionary="recruitWay" />
			</tr>
			<tr>
				<x:textareaTD name="strength" required="false" label="个人特长" rows="2" colspan="5" maxlength="99"/>
			</tr>
			<tr>
				<x:textareaTD name="hobby" required="false" label="业余爱好" rows="2" colspan="5" maxlength="99"/>
			</tr>

			<tr>
				<x:textareaTD name="expertise" required="false" label="技术专长及业绩" rows="3" colspan="5" maxlength="356"/>
			</tr>
		</table>
		
		
	</form>
</body>
</html>
