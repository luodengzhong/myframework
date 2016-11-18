<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
		<x:layout proportion="20%,30%,20%,30%"/>
		<tr>
			<x:hidden name="copyNewExamQuestionsId" />
			<x:hidden name="examQuestionsId" />
			<x:textareaTD name="itemName" required="true" label="题目名称" maxLength="800"  colspan="3"  rows="3"/>
		</tr>
		<tr>
			<x:radioTD list="#{'0':'客观题','1':'主观题'}" name="isSubjective"  value="0"  label="类别"/>
			<x:selectTD name="itemType" required="true" label="题目类型" maxLength="8" list="questionKinds" emptyOption="false" id="detailItemType"/>
		</tr>
		<tr>
			<x:inputTD name="remark" required="false" label="备注" maxLength="200"  colspan="3"/>
		</tr>
	</table>
</form>
<div class="blank_div"></div>
<x:fileList bizCode="examQuestionPic" bizId="examQuestionsId" id="examQuestionPicFileList" title="题目图片"/>
<div class="blank_div"></div>
<div id="examQuestionsItemGrid" ></div>