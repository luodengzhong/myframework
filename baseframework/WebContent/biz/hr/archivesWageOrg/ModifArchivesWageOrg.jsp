<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="modifArchivesWageOrgForm">
	<div class="ui-form" style="width:370px;">
		<x:radioL list="#{'0':'期间内工资单位','1':'档案内工资单位'}" name="modifArchivesWageOrgType" value="0" required="true"  label="修改类别" width="260"  labelWidth="70"/>
		<dl style="width:350px" id="modifPeriodChoose">
			<dt style="width:50px">期间<font color="#FF0000">*</font>&nbsp;:</dt>
			<dd style="width:55px">
				<x:input name="year" spinner="true" id="modifYear" mask="nnnn"/>
			</dd>
			<dd style="width:210px">
				<x:hidden name="periodId" id="modifPeriodId"/>
				<x:input name="yearPeriodName"  id="modifYearPeriodName"  wrapper="select"/>
			</dd>
		</dl>
		<x:hidden name="wageOrgId" id="modifWageOrgId"/>
		<x:inputL name="wageOrgName" id="modifWageOrgName" label="工资主体" required="true" maxLength="16" labelWidth="75" width="250"  wrapper="select"/>
		<x:hidden name="wageCompanyId" id="modifWageCompanyId"/>
		<x:inputL name="wageCompanyName" id="modifWageCompanyName" label="工资归属" required="true" maxLength="16" labelWidth="75"  width="250" wrapper="select"/>
	</div>
</form>