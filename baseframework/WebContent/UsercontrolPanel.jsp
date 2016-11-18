<%@ page contentType="text/html; charset=utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<x:base include="dialog,grid,layout,date,layout,attachment" />
<link href='<c:url value="/themes/default/usercontrolPanel.css"/>' rel="stylesheet" type="text/css"/>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.md5.js"/>' type='text/javascript'></script>
<script src='<c:url value="/lib/jquery/jquery.base64.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.multiselect2side.js"/>' type="text/javascript"></script>
<script src='<c:url value="/rtx/rtxGroupUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/javaScript/UsercontrolPanel.js?a=2"/>' type="text/javascript"></script>
</head>
<body>
<div class="header">
	<div class="header01"></div>
	<div class="header02">控制面板</div>
</div>
<div class="left" id="LeftBox">
	<div class="left02">
		<div class="left02top">
			<div class="left02top_right"></div>
			<div class="left02top_left"></div>
			<div class="left02top_c">个人信息</div>
		</div>
		<div class="left02down">
			<div class="left02down01"><a href="javascript:showRightPanel('setUserInfo');" ><div class="left02down01_img"></div>个人资料</a></div>
			<div class="left02down01"><a href="javascript:showRightPanel('setUserPassword');"><div class="left02down01_img"></div>密码修改</a></div>
		</div>
	</div>
	<div class="left02">
		<div class="left02top">
			<div class="left02top_right"></div>
			<div class="left02top_left"></div>
			<div class="left02top_c">系统设置</div>
		</div>
		<div class="left02down">
			<div class="left02down01"><a href="javascript:showRightPanel('setHomePageTab');" ><div class="left02down01_img"></div>门户设置</a></div>
			<div class="left02down01"><a href="javascript:showRightPanel('setUserGroup');" ><div class="left02down01_img"></div>自定义用户组</a></div>
			<div class="left02down01"><a href="javascript:showRightPanel('setProcessTemplates');" ><div class="left02down01_img"></div>自定义流程模板</a></div>
			<div class="left02down01"><a href="javascript:showRightPanel('setRtxGroup');" ><div class="left02down01_img"></div>客户端群维护</a></div>
		
		</div>
	</div>
	<div class="left02">
		<div class="left02top">
			<div class="left02top_right"></div>
			<div class="left02top_left"></div>
			<div class="left02top_c">系统下载</div>
		</div>
		<div class="left02down">
			<div class="left02down01"><a href="javascript:showRightPanel('softDownDiv');" ><div class="left02down01_img"></div>软件下载</a></div>
		</div>
	</div>
</div>
<div class="rrcc" id="RightBox">
	<div class="right">
		<div class="right01" style="overflow-x:hidden;overflow-y:auto">
			<div style="text-align:center;display: none;" class="righrDiv" id="setHomePageTab">
				<div class="subject" style="text-align:left;padding-left:30px;">
					<img src='<c:url value="/themes/default/images/32X32/home.gif"/>' width="32" height="32" align="absMiddle" />&nbsp;门户设置
				</div>
				 <select name="homePageTab" id='chooseHomePageTab' multiple='multiple' ></select>
				 <div class=blank_div></div>
				 <div style="clear: left;color:red;"><x:button value="保存设置" onclick="saveHomePageTab()" />保存设置后刷首页即可生效</div>
			</div>
			<div style="text-align:left;" class="righrDiv" id="setUserInfo">
			  	  <div class="subject" style="text-align:left;padding-left:30px;">
			  	  	<span style="float: right;margin-right: 40px"><a href="javascript:updateErpUserStatus();" hidefocus class="orangeBtn"><span>激活明源系统账号</span></a></span>
					<img src='<c:url value="/themes/default/images/32X32/member.gif"/>' width="32" height="32" align="absMiddle" />&nbsp;个人资料
				  </div>
				  <div class="ui-form" style="width:800px;margin-left: 30px;clear:none;">
				  <form method="post" action="" id="updatePersonForm">
				  		<x:title title="基本信息" name="group"/>
                		<x:inputL name="name" required="false" label="姓名"  disabled="true"/>
                	    <x:inputL name="loginName" required="false" label="登陆账号"  disabled="true"/>
                	    <div class="clear"></div>
                	    <x:inputL name="birthday" required="false" label="出生日期"  wrapper="date"/>
                	    <x:inputL name="joinDate" required="false" label="参加工作日期"  wrapper="date"/>
                	    <div class="clear"></div>
                	    <x:inputL name="homePlace" required="false" label="出生地" mask="30"/>
                	    <x:inputL name="degree" required="false" label="学历" maxlength="16"/>
                	    <div class="clear"></div>
                	    <x:inputL name="graduateSchool" required="false" label="毕业院校" maxlength="16"/>
                	    <x:inputL name="speciality" required="false" label="专业" maxlength="16"/>
                	    <div class="clear"></div>
                	    <x:title title="联系方式" name="group"/>
                	    <x:inputL name="officePhone" required="false" label="工作电话" width="230" maxlength="16"/>
                	    <div class="clear"></div>
                	    <x:inputL name="mobilePhone" required="false" label="手机" width="230" maxlength="16"/>
                	    <dl><dd style="width:200px">填写后可接收系统发送的手机短信</dd></dd></dl>
                	    <div class="clear"></div>
                	    <x:inputL name="email" required="false" label="电子邮件" width="230" maxlength="30"/>
                	    <dl><dd style="width:200px">填写后可接收系统发送的邮件</dd></dd></dl>
                	    <div class="clear"></div>
                	    <x:inputL name="qq" required="false" label="QQ" width="230" maxlength="16"/>
                	    <div class="clear"></div>
                	    <x:inputL name="appCode" required="false" label="微信" width="230" maxlength="30"/>
                	    <div class="clear"></div>
                	   <x:title title="家庭信息" name="group"/>
                	    <x:inputL name="familyAddress" required="false" label="家庭住址" width="230" maxlength="100"/>
                	    <div class="clear"></div>
                	     <x:inputL name="familyPhone" required="false" label="家庭电话" width="230" maxlength="16"/>
                	    <div class="clear"></div>
                	     <x:inputL name="zip" required="false" label="家庭邮编" width="230" maxlength="16"/>
                	    <div class="clear"></div>
                 </form>
                 </div>
				  <div class=blank_div></div>
				  <div style="text-align: center"><x:button value="保存修改" onclick="saveUserInfo()" /></div>
				  <div style="min-height: 20px;">&nbsp;</div>
			</div>
			<div style="text-align:left;display:none;" class="righrDiv" id="setUserPassword">
			  	 <div class="subject" style="text-align:left;padding-left:30px;">
					<img src='<c:url value="/themes/default/images/32X32/administrative_docs.gif"/>' width="32" height="32" align="absMiddle" />&nbsp;密码修改
				 </div>
			  	  <form method="post" action="" id="updatePasswordForm">
				  <table class="tableInput" style="width:350px;margin-left:30px;">
				  	<x:layout proportion="30%,70%"/>
				  	<tr>
				  		<td class="title">&nbsp;&nbsp;原密码<font color="red">*</font>:</td>
				  		<td><input type='password' class='text' id='modifOldPassword' required='true' maxlength='20' /></td>
				  	</tr>
				  	<tr>
				  		<td class="title">&nbsp;&nbsp;新密码<font color="red">*</font>:</td>
				  		<td><input type='password' class='text' id='modifNewPassword' required='true' maxlength='20' /></td>
				  	</tr>
				  	<tr>
				  		<td class="title">&nbsp;&nbsp;确认密码<font color="red">*</font>:</td>
				  		<td><input type='password' class='text' id='modifSurePassword' required='true' maxlength='20' /></td>
				  	</tr>
				  	<tr>
				  		<td class="title">&nbsp;&nbsp;密码强度:</td>
				  		<td style="text-align:center;">
				  			<span class='passwordStrength' id='passwordStrength1'>弱</span>&nbsp;
				  			<span class='passwordStrength' id='passwordStrength2'>中</span>&nbsp;
				  			<span class='passwordStrength' id='passwordStrength3'>强</span>
				  		</td>
				  	</tr>
				  	<tr>
				  		<td colspan="2" style="text-align:center;">
				  			<input type='radio' name='passwordType' id='passwordType1' value='1' checked/>
							&nbsp;<label for='passwordType1'>登陆密码</label>&nbsp;&nbsp;
							<input type='radio' name='passwordType' id='passwordType2' value='2'/>
							&nbsp;<label for='passwordType2'>重要数据密码</label>
				  		</td>
				  	</tr>
				  </table>
				  </form>
				  <div class=blank_div></div>
				  <div style="padding-left: 150px"><x:button value="保存密码" onclick="savePassword()" /></div>
			</div>
			<div style="text-align:center;display:none;padding: 5px;" class="righrDiv" id="setUserGroup">
				<div class="subject" style="text-align:left;padding-left:30px;">
					<img src='<c:url value="/themes/default/images/32X32/role.gif"/>' width="32" height="32" align="absMiddle" />&nbsp;管理用户组
					&nbsp;&nbsp;<x:button value="新建用户组" onclick="doEditGroup()" />
					&nbsp;&nbsp;<x:button value="刷 新" onclick="queryUserOwnerGroup()" />
					&nbsp;&nbsp;<x:button value="列表显示" onclick="toUserGroupListDetail()" />
				</div>
				<div style="padding-left:30px;">
					<table class='tableInput' style="width: 98%;" id="userGroupListTable">
						<thead>
							<tr class='table_grid_head_tr'>
								<th style="width:5%;">序号</th>
								<th style="width:15%;">用户组名称</th>
								<th style="width:50%;">包含组织</th>
								<th style="width:20%;">操&nbsp;作</th>
							</tr>
						</thead>
						<tbody></tbody>
					</table>
				</div>
			</div>
			<div style="text-align:center;display:none;padding: 5px;" class="righrDiv" id="setProcessTemplates">
				<div class="subject" style="text-align:left;padding-left:30px;">
					<img src='<c:url value="/themes/default/images/32X32/sitemap.gif"/>' width="32" height="32" align="absMiddle" />&nbsp;管理流程模板
					&nbsp;&nbsp;<x:button value="新建流程模板" onclick="doProcessTemplate()" />
					&nbsp;&nbsp;<x:button value="刷 新" onclick="queryUserProcessTemplates()" />
				</div>
				<div style="padding-left:30px;">
					<table class='tableInput' style="width: 98%;" id="processTemplatesListTable">
						<thead>
							<tr class='table_grid_head_tr'>
								<th style="width:5%;">序号</th>
								<th style="width:15%;">模板名称</th>
								<th style="width:50%;">包含人员</th>
								<th style="width:20%;">操&nbsp;作</th>
							</tr>
						</thead>
						<tbody></tbody>
					</table>
				</div>
			</div>
			<div style="text-align:center;display:none;padding: 5px;" class="righrDiv" id="setRtxGroup">
				<div class="subject" style="text-align:left;padding-left:30px;">
					<img src='<c:url value="/themes/default/images/32X32/address.gif"/>' width="32" height="32" align="absMiddle" />&nbsp;管理客户端群
					&nbsp;&nbsp;<x:button value="新建群" onclick="doEditRtxGroup()" />
					&nbsp;&nbsp;<x:button value="编辑群" onclick="editRTXGroup()" />
					&nbsp;&nbsp;<x:button value="删除群" onclick="deleteRTXGroup()" />
					&nbsp;&nbsp;<x:button value="刷 新" onclick="queryUserRTXGroup()" />
					<input type="hidden"  id="rtxUserGroupId">
				</div>
				<div style="padding-left:30px;">
					<div id="userRTXGroupLayout" style="text-align:left;">
						<div position="left" title="群列表" >
							<div style="overflow-x: hidden; overflow-y: auto; width:98%;padding-left: 5px;" id="rtxUserGroupList">
							</div>
						</div>
						<div position="center" title="成员列表" id="rtxUserGroupDetailCenter">
							<div id="rtxUserGroupDetailGrid" style="margin:2px; "></div>
						</div>
					</div>
				</div>
			</div>
			<div style="text-align:center;display:none;padding: 5px;" class="righrDiv" id="softDownDiv">
				<div class="subject" style="text-align:left;padding-left:30px;">
					<img src='<c:url value="/themes/default/images/32X32/finished_work.gif"/>' width="32" height="32" align="absMiddle" />&nbsp;工具软件下载
				</div>
				<div style="padding-left:30px;">
					<div  style="text-align:left;" class="ui-attachment-list">
						<div class="file"><span class="note">&nbsp;</span><a class="GridStyle" href="http://10.0.0.94/update/蓝光RTX客户端.exe">蓝光RTX客户端</a></div>
						<div class="clear"></div>
						<div style="color:#a0a0a0;"> 解释：蓝光内部即时通讯客户端软件。</div>
						<div class="file"><span class="note">&nbsp;</span><a class="GridStyle" href="http://10.0.0.94/update/蓝光终端管理安装客户端.exe">蓝光终端管理安装客户端</a></div>
						<div class="clear"></div>
						<div style="color:#a0a0a0;"> 解释：公司所属在用、重新安装的台式机、笔记本电脑等必需安装，将不定期抽查。</div>
						<div class="file"><span class="swf">&nbsp;</span><a class="GridStyle" href="http://10.0.0.94/update/蓝光综合管理信息系统正文插件.exe">蓝光综合管理信息系统正文插件</a></div>
						<div class="clear"></div>
						<div style="color:#a0a0a0;"> 解释：综合管理系统正文显示用的flash插件仅限windows系统的IE使用。</div>
						<div class="file"><span class="swf">&nbsp;</span><a class="GridStyle" href="http://10.0.0.94/update/蓝光综合管理信息系统正文插件卸载工具.exe">蓝光综合管理信息系统正文插件卸载工具</a></div>
						<div class="clear"></div>
						<div style="color:#a0a0a0;">解释：综合管理系统正文显示用的flash插件故障后，在修复工具运用无效后，卸载后，再重新安装。</div>
						<div class="file"><span class="swf">&nbsp;</span><a class="GridStyle" href="http://10.0.0.94/update/蓝光综合管理信息系统正文插件修复工具.exe">蓝光综合管理信息系统正文插件修复工具</a></div>
						<div class="clear"></div>
						<div style="color:#a0a0a0;"> 解释：综合管理系统正文显示用的flash插件故障后，首先运行修复工具修复。</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
</body>
</html>
