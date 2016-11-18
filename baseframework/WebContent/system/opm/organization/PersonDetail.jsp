<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<div class="mainPanel">
	<form method="post" action="" id="submitForm">
		<x:hidden name="id" />
		<x:hidden name="mainOrgId" />
		<x:hidden name="version" />
		<x:hidden name="status" />
		<table class='tableInput' style="width:830px;">
			<x:layout proportion="12%,21%,12%,21%,10%,*" />
			<tr>
				<x:inputTD name="parentFullName" required="false" label="上级" readonly="true" colspan="3" />
				<td class='title' rowspan="6">&nbsp;</td>
				<td rowspan="6">
					<div style="text-align: center;">
						<img src='<c:url value="/attachmentAction!downFileBySavePath.ajax?file=${picturePath}"/>' height='120' width='85' border=0 id="showArchivePicture"/>
					</div>
				</td>
			</tr>
			<tr>
				<x:inputTD name="code" id="code" required="true" label="编码" readonly="false"/>
				<x:inputTD name="name" id="name" required="true" label="名称" readonly="false"/>
			</tr>
			<tr>
				<x:inputTD name="loginName" id="loginName" required="false" label="登录名" readonly="false"/>
				<x:inputTD name="englishName" id="englishName" required="false" label="英文名称" readonly="false"/>
			</tr>
			<tr>
				<x:selectTD name="sex" dictionary="sex" required="false" label="性别" />
				<x:selectTD name="marriage" dictionary="maritalStatus" required="false" label="婚姻状况" />
			</tr>
			<tr>
				<x:inputTD name="idCard" id="idCard" required="false" label="身份证号" readonly="false"/>
				<x:inputTD name="birthday" id="birthday" required="false" label="出生日期" wrapper="date" readonly="false"/>

			</tr>
			<tr>
				<x:inputTD name="cardKind" id="cardKind" required="false" label="证件类型" readonly="false" />
				<x:inputTD name="cardNo" id="cardNo" required="false" label="证件号码" readonly="false"/>
			</tr>
			<tr>
				<x:inputTD name="joinDate" id="joinDate" required="false" label="参加工作日期" wrapper="date" readonly="false"/>
				<x:inputTD name="title" id="title" required="false" label="职称" readonly="false"/>
				<x:selectTD name="degree" dictionary="education" required="false" label="学历" />
			</tr>
			<tr>
				<x:inputTD name="graduateSchool" id="graduateSchool" required="false" label="毕业院校" readonly="false"/>
				<x:inputTD name="speciality" id="speciality" required="false" label="专业" readonly="false"/>
				<x:inputTD name="schoolLength" id="schoolLength" required="false" label="学年制" readonly="false"/>
			</tr>
			<tr>
				<x:inputTD name="email" id="email" required="false" label="电子邮件" readonly="false"/>
				<x:inputTD name="qq" id="qq" required="false" label="QQ" readonly="false"/>
				<x:inputTD name="msn" id="msn" required="false" label="MSN" readonly="false"/>
			</tr>
			<tr>
				<x:inputTD name="officePhone" id="officePhone" required="false" label="办公电话" readonly="false"/>
				<x:inputTD name="mobilePhone" id="mobilePhone" required="false" label="移动电话" readonly="false"/>
				<x:inputTD name="familyPhone" id="familyPhone" required="false" label="家庭电话" readonly="false"/>
			</tr>
			<tr>
				<x:inputTD name="appCode" required="false" label="微信" readonly="false"/>
				<x:inputTD name="zip" id="zip" required="false" label="邮编" readonly="false"/>
				<x:inputTD name="familyAddress" id="familyAddress" required="false" label="家庭地址" readonly="false"/>
			</tr>
			<tr>
				<x:inputTD name="passwordTimeLimit" id="passwordTimeLimit" required="false" label="密码时限" readonly="false"/>
				<x:inputTD name="passwordModifyTime" id="passwordModifyTime" required="false" label="密码修改时间" readonly="false"/>
				<x:inputTD name="sequence" required="true" label="排序号"
			readonly="false" spinner="true" mask="nnn" dataOptions="min:1" labelWidth="60" width="60"/>
			</tr>
			<tr>
				<x:textareaTD name="discription" label="描述" readonly="false" labelWidth="90" width="672" rows="3" colspan="5"/>
			</tr>
		</table>
	</form>
</div>