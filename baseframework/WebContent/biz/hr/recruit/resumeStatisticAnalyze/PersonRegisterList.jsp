
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox"/>
  </head>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  		<x:title title="应聘人员登记表" hideTable="queryDiv"/>
			<form method="post" action="" id="queryMainForm">
			<div class="ui-form" id="queryDiv" style="width:900px;">
					
		<x:hidden name="writeId"/>
					
		<x:inputL name="applyPosId" required="false" label="应聘职位(岗位)ID" maxLength="32"/>					
		<x:inputL name="applyPosName" required="false" label="应聘职位(岗位)名称" maxLength="64"/>					
		<x:inputL name="expecteSalary" required="false" label="希望待遇（税前年收入）" maxLength="32"/>					
		<x:inputL name="staffName" required="true" label="姓名" maxLength="32"/>					
		<x:inputL name="sex" required="false" label="性别" maxLength="1"/>					
		<x:inputL name="idCardNo" required="false" label="身份证号" maxLength="20"/>					
		<x:inputL name="birthdate" required="false" label="出生日期" maxLength="7"/>					
		<x:inputL name="age" required="false" label="年龄" maxLength="22"/>					
		<x:inputL name="nativePlace" required="false" label="籍贯" maxLength="128"/>					
		<x:inputL name="religion" required="false" label="宗教信仰" maxLength="128"/>					
		<x:inputL name="nation" required="false" label="民族" maxLength="2"/>					
		<x:inputL name="employedDate" required="false" label="到岗时间" maxLength="7"/>					
		<x:inputL name="maritalStatus" required="false" label="婚姻状况" maxLength="2"/>					
		<x:inputL name="education" required="false" label="最高学历" maxLength="2"/>					
		<x:inputL name="jobTitle" required="false" label="技术职称" maxLength="10"/>					
		<x:inputL name="weight" required="false" label="体重" maxLength="10"/>					
		<x:inputL name="height" required="false" label="身高（ｃｍ）" maxLength="8"/>					
		<x:inputL name="blood" required="false" label="血型" maxLength="2"/>					
		<x:inputL name="specialty" required="false" label="所学专业" maxLength="64"/>					
		<x:inputL name="university" required="false" label="毕业学校" maxLength="64"/>					
		<x:inputL name="eduform" required="false" label="毕业类型" maxLength="2"/>					
		<x:inputL name="driverLicense" required="false" label="驾照类别" maxLength="8"/>					
		<x:inputL name="politicsStatus" required="false" label="政治面貌" maxLength="2"/>					
		<x:inputL name="registeredPlace" required="false" label="户口所在地" maxLength="128"/>					
		<x:inputL name="registeredKind" required="false" label="户口性质" maxLength="2"/>					
		<x:inputL name="residence" required="false" label="现家庭住址" maxLength="128"/>					
		<x:inputL name="residenceKind" required="false" label="现住所性质" maxLength="2"/>					
		<x:inputL name="phoneNumber" required="false" label="移动号码" maxLength="16"/>					
		<x:inputL name="linkman" required="false" label="紧急联系人姓名" maxLength="32"/>					
		<x:inputL name="otherPhoneNumber" required="false" label="紧急联系人电话号码" maxLength="16"/>					
		<x:inputL name="englishLevel" required="false" label="英语程度" maxLength="2"/>					
		<x:inputL name="hobby" required="false" label="业余爱好" maxLength="256"/>					
		<x:inputL name="expertise" required="false" label="技术业务专长及业绩" maxLength="1024"/>					
		<x:inputL name="strength" required="false" label="个人特长" maxLength="1024"/>					
		<x:inputL name="workPlace" required="false" label="首选工作地点" maxLength="32"/>					
		<x:inputL name="choice" required="false" label="工作地点是否接受公司安排" maxLength="22"/>					
		<x:inputL name="sourceType" required="false" label="应聘来源(1,猎头招聘  2：社会招聘   3：内部推荐  4：校园招聘)" maxLength="22"/>					
		<x:inputL name="registerDate" required="false" label="填表日期" maxLength="7"/>					
		<x:inputL name="email" required="false" label="电子邮箱" maxLength="32"/>					
		<x:inputL name="workPhone" required="false" label="办公电话" maxLength="16"/>					
		<x:inputL name="hunterId" required="false" label="猎头ID" maxLength="22"/>					
		<x:inputL name="vaCode" required="false" label="编码" maxLength="16"/>					
		<x:inputL name="recruitResult" required="false" label="应聘结果" maxLength="22"/>					
		<x:inputL name="personMemberId" required="false" label="推荐人ID" maxLength="65"/>					
		<x:inputL name="personMemberName" required="false" label="推荐人姓名" maxLength="32"/>					
		<x:inputL name="applyDeptId" required="false" label="应聘部门ID" maxLength="32"/>					
		<x:inputL name="applyDeptName" required="false" label="应聘部门名称" maxLength="32"/>					
		<x:inputL name="applyOrganId" required="false" label="应聘单位ID" maxLength="32"/>					
		<x:inputL name="applyOrganName" required="false" label="应聘单位名称" maxLength="65"/>					
		<x:inputL name="isBackflow" required="false" label="是否是回流员工" maxLength="22"/>					
		<x:inputL name="jobApplyId" required="false" label="招聘ID" maxLength="22"/>
					<dl>
						<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
					</dl>
			</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"  style="margin: 2px;"></div>
		</div> 
	</div>
  </body>
</html>
