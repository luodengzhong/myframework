<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<script type="text/javascript">
$(document).ready(function() {
	var html=new Array();
	html.push('<table width="100%" border=0 cellspacing=0 cellpadding=0 style="border:0px;">');
	html.push('<tr><td>');
	html.push('<input type="text" class="text" id="id_card_no"/>');
	html.push('</td></tr>');
	html.push('<tr><td style="text-aling:center;">');
	html.push("<input type='button' value='确 定' class='buttonGray ok'/>&nbsp;&nbsp;");
	html.push("<input type='button' value='关 闭' class='buttonGray close'/>&nbsp;&nbsp;");
	html.push('</td></tr>');
	html.push('</table>');
	var options={
		title:'请输入身份证号码',
		content:html.join(''),
		width: 250,
		opacity:0.1,
		onClick:function($el){
			if($el.hasClass('ok')){//确定按钮
				var idCard=$('#id_card_no').val();
				if(idCard==''){
					Public.tip('请输入身份证号码！');
					$('#id_card_no').focus();
					return false;
				}
				Public.ajax(web_app.name + "/hrArchivesAction!getArchivesIdByIdCard.ajax",{idCard:idCard},function(id){
					var url=web_app.name + '/hrArchivesAction!showUpdate.do?functionCode=HREmployeeModifEntry&archivesId='+id;
					window.location.href=url;
				});
			}else if($el.hasClass('close')){//关闭按钮
				this.close();
				UICtrl.closeCurrentTab();
			}
		}
	};
	var div=Public.dialog(options);
	$('a.close',div).hide();
});
</script>
</head>
<body>
</body>
</html>
