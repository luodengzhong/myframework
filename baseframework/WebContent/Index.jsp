<%@ page import="com.brc.system.opm.Operator" %>
<%@ page import="com.brc.util.Constants" %>
<%@ page import="com.brc.client.session.SessionCache" %>
<%@ page import="com.brc.util.SpringBeanFactory" %>
<%@ page import="org.apache.struts2.ServletActionContext" %>
<%@ page import="com.brc.util.StringUtil" %>
<%@ page contentType="text/html; charset=utf-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<%
    Operator operator = (Operator) request.getSession().getAttribute(Constants.SESSION_OPERATOR_ATTRIBUTE);
    if (operator == null) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            String brcUserInfo = null;
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(Constants.BRC_USER_INFO)) {
                    brcUserInfo = cookie.getValue();
                    break;
                }
            }
            SessionCache sc = SpringBeanFactory.getBean(ServletActionContext.getServletContext(), "sessionCache", SessionCache.class);
            if (!StringUtil.isBlank(brcUserInfo)) {
                operator = sc.getOperator(brcUserInfo);
            }
        }

        if (operator == null) {
            response.sendRedirect("logout.do");
        } else {
            session.setAttribute(Constants.SESSION_OPERATOR_ATTRIBUTE, operator);
        }
    }
%>
<head>
    <title>蓝光协同</title>
    <link href='<c:url value="/themes/ligerUI/Aqua/css/ligerui-all.css"/>' rel="stylesheet" type="text/css"/>
    <link href='<c:url value="/themes/ligerUI/Gray/css/layout.css"/>' rel="stylesheet" type="text/css"/>
    <link href='<c:url value="/themes/ligerUI/Gray/css/tab.css"/>' rel="stylesheet" type="text/css"/>
     <link href='<c:url value="/themes/default/style.css"/>' rel="stylesheet" type="text/css"/>
    <link href='<c:url value="/themes/default/ui.css?a=1"/>' rel="stylesheet" type="text/css"/>
    <link href='<c:url value="/themes/default/index.css?a=1"/>' rel="stylesheet" type="text/css"/>
    <link href='<c:url value="/themes/default/indexAddJob.css"/>' rel="stylesheet" type="text/css"/>
    <link href='<c:url value="/themes/default/help.css"/>' rel="stylesheet" type="text/css"/>
    <link href='<c:url value="/themes/ligerUI/ligerui-icons.css"/>' rel="stylesheet" type="text/css"/>
    <script src='<c:url value="/javaScript/WEB_APP.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/common/Context.jsp"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquery-1.7.2.min.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquery.json-2.4.min.js"/>' type='text/javascript'></script>
    <script src='<c:url value="/lib/jquery/jquery.base64.js"/>' type='text/javascript'></script>
    <%--<script src='<c:url value="/lib/jquery/jquery.md5.js"/>' type='text/javascript'></script>--%>
    <script src='<c:url value="/lib/jquery/ui/jquery-ui.min.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquery.lazyload.min.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/ligerUI/core/base.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/ligerUI/ligerui.all.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/ligerUI/plugins/ligerTree.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquery.spasticNav.js?a=1"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquery.dragEvent.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquery.combox.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquert.htmlEditor.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquery.color.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquery.help.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/javaScript/getCNDate.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/javaScript/common.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/javaScript/indexCommon.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/javaScript/indexAddJob.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/javaScript/UICtrl.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/javaScript/index.js?a=12"/>' type="text/javascript"></script>
    <x:base include="dialog"/>
</head>
<body>
<div id='screenOverLoading' class='ui-tab-loading' style='display: block; top: 0;'></div>
<div class="indexMainDiv">
    <div id="layout">
        <div position="top" style="border: 0;" class="bg">
            <div id="indexHead" style="display: none;">
                <div id="indexHeadLeft">
<%--                     <img src="<c:url value="/themes/default/images/head_logo.png"/>"/> --%>
                </div>
                <div id="indexHeadRight">
                    <table>
                        <tr>
                            <td rowspan=2>
                                <a href="javascript:addUserNodeTab();" class="bianqian" hidefocus>&nbsp;</a>
                                <a href="javascript:addUserCalendarTab();" class="richeng" hidefocus>&nbsp;</a>
                            </td>
                            <td>
                                <div class="time_start">&nbsp;</div>
                                <div class="time_content">
                                    <span id="spanDate"></span>&nbsp; <span id="spanCNDate"></span>&nbsp; <span id="spanTime"></span>
                                </div>
                                <div class="time_end" >&nbsp;</div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="user_info ellipsis" style="width: 265px;" title='<c:out value="${sessionScope.sessionOperatorAttribute.fullDisplayName}" />'>
                                    <img src='<c:url value="/themes/default/images/icons/user1.gif"/>' width="16" height="16" align="absMiddle"/>&nbsp;欢迎您,
                                    <c:out value="${sessionScope.sessionOperatorAttribute.fullDisplayName}"/>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div id="indexNavigation">
                <div id="indexQuickNavigation">
                    <span class="span_link" id="btnLeft"></span>
					<span class="span_link" id="btnRight"></span>
                    <div id="divFunctionNavigation">
                        <ul id="functionNavigation"></ul>
                    </div>
                </div>
                <div id="indexOtherNavigation">
                    <div class="headNav">
                        <ul class="mainHeadUl"  id="mainHeadNavUl">
                        	<li>
                        		<a href="##" hidefocus>
                        			<img src='<c:url value="/themes/default/images/icons/application.png"/>' width="16" height="16" align="absMiddle"/>&nbsp;快捷菜单
                        		</a>
                        		<ul>
         							 <li class="hasFun">
         								  <a href="javascript:selectTabItem('main_tab');" hidefocus>
         								  	<img src='<c:url value="/themes/default/images/icons/networking.png"/>' width="16" height="16" align="absMiddle"/>&nbsp;首页
         								  </a>
         							</li>
                          			<li class="hasFun">
                          				  <a href="javascript:selectTabItem('work_table');" hidefocus>
                          				  	<img src='<c:url value="/themes/default/images/icons/home.png"/>' width="16" height="16" align="absMiddle"/>&nbsp;我的桌面
                          				  </a>
                          			</li>
                          			<li class="hasFun">
                          				  <a href="<c:url value="/portals/home.jsp"/>" target="_self">
                          				  	<img src='<c:url value="/themes/default/images/icons/icon_monitor_pc.gif"/>' width="16" height="16" align="absMiddle"/>&nbsp;信息门户
                          				  </a>
                          			</li>
						    	</ul>
                          </li>
                          <li>
                        		<a href="##" hidefocus>
                        			<img src='<c:url value="/themes/default/images/icons/user1.gif"/>' width="16" height="16" align="absMiddle"/>&nbsp;我的信息
                        		</a>
                        		<ul>
                        			<li id="saveResetPswHead" >
                        				<a href="javascript:showResetPsw();" hidefocus>
                        					<img src='<c:url value="/themes/default/images/icons/theme.gif"/>' width="16" height="16" align="absMiddle"/>&nbsp;修改密码
                        				</a>
                        			</li>
                            		<li id="saveControlPanelHead">
                            			<a href="javascript:showcontrolPanel();" hidefocus>
                            				<img src='<c:url value="/themes/default/images/icons/list_settings.gif"/>' width="16" height="16" align="absMiddle"/>&nbsp;控制面板
                            			</a>
                            		</li>
                            		<li id="switchOperator">
                            			<a href="javascript:switchOperator();" hidefocus>
                            				<img src='<c:url value="/themes/default/images/icons/list_users.gif"/>' width="16" height="16" align="absMiddle"/>&nbsp;切换岗位
                            			</a>
                            		</li>
                        		</ul>
                          </li>
                           <li>
                           		<a href="##" hidefocus>
                           			<img src='<c:url value="/themes/default/images/icons/help.png"/>' width="16" height="16" align="absMiddle"/>&nbsp;帮助&制度
                           		</a>
                           		<ul>
                           			<li id="showInstitutionHead">
                                		<a href="javascript:showInstitution();" hidefocus>
                                			<img src='<c:url value="/themes/default/images/icons/book_edit.png"/>' width="16" height="16" align="absMiddle"/>&nbsp;制度
                                		</a>
                                	</li>
                           			 <li id="saveSuggestionBoxHead">
                               			<a href="javascript:showSuggestionBox();" hidefocus>
                               				<img src='<c:url value="/themes/default/images/icons/icon_monitor_mac.gif"/>' width="16" height="16" align="absMiddle"/>&nbsp;意见箱
                               			</a>
                               		</li>
                           		    <li id="showHelpBoxHead">
                                		<a href="javascript:showHelpBox();" hidefocus>
                                			<img src='<c:url value="/themes/default/images/icons/help.png"/>' width="16" height="16" align="absMiddle"/>&nbsp;帮助
                                		</a>
                                    </li>
                           		</ul>
                           </li> 
                            <li>
                           		<a href="##" hidefocus>
                           			<img src='<c:url value="/themes/default/images/icons/computer_edit.png"/>' width="16" height="16" align="absMiddle"/>&nbsp;文档管理
                           		</a>
                           		<ul>
                           			 <li id="showKnowLedgeHead" style="width: 110px;">
                                		<a href="javascript:showDocumentPage();"  hidefocus>
                                			<img src='<c:url value="/themes/default/images/icons/icon_monitor_pc.gif"/>' width="16" height="16" align="absMiddle"/>&nbsp;文档中心
                                		</a>
                            		</li>
                            		<li id="oldKnowLedgeHead" style="width: 110px;">
                             		    <a href="http://doc.brc.com.cn/SitePages/index.aspx" target="_blank">
                             		    	<img src='<c:url value="/themes/default/images/icons/page_deny.gif"/>' width="16" height="16" align="absMiddle"/>&nbsp;(老)知识中心
                             		    </a>
                            		</li>
                           		</ul>
                           	</li>
                           	<li id="showLinkMainHead">
                                	<a href="http://oa.brc.com.cn/_layouts/xlviewer.aspx?id=/Shared%20Documents/%E5%9B%9B%E5%B7%9D%E8%93%9D%E5%85%89%E5%92%8C%E9%AA%8F%E5%AE%9E%E4%B8%9A%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8%E9%80%9A%E8%AE%AF%E5%BD%95.xlsx&Source=http%3A%2F%2Foa%2Ebrc%2Ecom%2Ecn%2FShared%2520Documents%2FForms%2FAllItems%2Easpx&DefaultItemOpen=1"
                                   target="_blank">
                                   		<img src='<c:url value="/themes/default/images/icons/list_components.gif"/>' width="16" height="16" align="absMiddle"/>&nbsp;通讯录
                                   	</a>
                            </li>
                            <li id="showAppDialogHead">
                            	<a  href="javascript:showAppDialog();" hidefocus>
                            		<img src='<c:url value="/themes/default/images/icons/phone_sound.png"/>' width="16" height="16" align="absMiddle"/>&nbsp;移动办公
                            	</a>
                            </li>
                            <li id="showLogoutHead" class="hasFun">
                            	<a href="<c:url value="/logout.do"/>" hidefocus>
                            		<img src='<c:url value="/themes/default/images/icons/exit.gif"/>' width="16" height="16" align="absMiddle"/>&nbsp;注销
                            	</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="blank_div_5px">
                <span id="headerToggle" class="header-toggle header-toggle-bottom">&nbsp;</span>
            </div>
        </div>
        <div position="left" title="我的工作台" id="left_menu" class="bg" style="border-top: 0;">
            <div class="page-loading" id="pageloading"></div>
            <div id="menuTree" class="indexMainDiv">
                <ul id="tree_ul"></ul>
                <div id="indexTaskCenterButtons">
                	<div id="showAddJobDiv">
                		<a href="javascript:showAddJob();" >
                			<img src='<c:url value="/themes/default/images/32X32/book.gif"/>' width="32" height="32" align="absMiddle"/>
                			&nbsp;新建事项
                		</a>
                	</div>
                	<div>
                		<a href="javascript:showTaskCenter(1);" >
                			<img src='<c:url value="/themes/default/images/32X32/order.gif"/>' width="32" height="32" align="absMiddle"/>
                			&nbsp;<font style="font-weight: bold;font-size: 14px;">待办任务</font>
                		</a>
                	</div>
                	<div>
                		<a href="javascript:showTaskCenter(4);" >
	                		<img src='<c:url value="/themes/default/images/32X32/pen.gif"/>' width="32" height="32" align="absMiddle"/>
	                		&nbsp;待发任务
                		</a>
                	</div>
                	<div>
                		<a href="javascript:showTaskCenter(5);" >
	                		<img src='<c:url value="/themes/default/images/32X32/address.gif"/>' width="32" height="32" align="absMiddle"/>
	                		&nbsp;本人发起
                		</a>
                	</div>
                	<div>
                		<a href="javascript:showTaskCenter(3);">
	                		<img src='<c:url value="/themes/default/images/32X32/refresh.gif"/>' width="32" height="32" align="absMiddle"/>
	                		&nbsp;提交任务
                		</a>
                	</div>
                	<div>
                		<a href="javascript:showTaskCenter(2);" >
	                		<img src='<c:url value="/themes/default/images/32X32/order_159.gif"/>' width="32" height="32" align="absMiddle"/>
	                		&nbsp;已办任务
                		</a>
                	</div>
                	<div>
                		<a href="javascript:showTaskCenter(6);" >
	                		<img src='<c:url value="/themes/default/images/32X32/premium.gif"/>' width="32" height="32" align="absMiddle"/>
	                		&nbsp;收藏任务
                		</a>
                	</div>
                	<div>
                		<a href="javascript:showPlanTaskCenter();" >
	                		<img src='<c:url value="/themes/default/images/32X32/calendar.png"/>' width="32" height="32" align="absMiddle"/>
	                		&nbsp;我的计划
                		</a>
                	</div>
                	<div>
                		<a href="javascript:showInfoCenter();" >
	                		<img src='<c:url value="/themes/default/images/32X32/invoice.gif"/>' width="32" height="32" align="absMiddle"/>
	                		&nbsp;信息中心
                		</a>
                	</div>
                </div>
            </div>
        </div>
        <div position="center" id="indexCenter">
            <div id="frameCenter"></div>
        </div>
    </div>
    <!-- <div class="blank_div_5px"></div>
    <div id="indexBottom" style="text-align:left;">
            公告:
    </div> -->
</div>
<div id="showAppDownDiv" style="display:none;">
	<table>
		<tr>
			<td colspan="2">
				<div>请扫描二维码，安装后以<font color="Tomato">OA账号/密码</font>登录。</div>
				<div style="color: #a0a0a0;">注意：<font color="Tomato">请勿使用微信扫描</font>功能，可使用QQ或浏览器的扫描;</div>
			</td>
		</tr>
		<tr>
			<td><h1 style="font-size: 16px;margin: 5px;">Android（安卓）版</h1></td>
			<td><h1 style="font-size: 16px;margin: 5px;">IOS（苹果）版</h1></td>
		</tr>
		<tr>
			<td><img src='<c:url value="/images/view_qr_code.png"/>' width="145" height="145" align="absMiddle"/></td>
			<td><img src='<c:url value="/images/view_ios_code.png"/>' width="145" height="145" align="absMiddle"/></td>
		</tr>
	</table>
</div>
<x:hidden name="moduleId"/>
</body>
</html>
