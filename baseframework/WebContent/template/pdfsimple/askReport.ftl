<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>  
  <title>请示报告单</title>  
   <style type="text/css">
            body { font-family: SimSun;   font-size:12px;}
            .brcImg{
			    border-bottom: 1px solid #000000;
            }
            table{
               width:100%;table-layout:fixed; word-break:break-strict;
               border:0px;
               border-left: 1px solid #000000;border-top: 1px solid #000000;
            }
           
            table tr{  
               text-align: left;
            } 
                        
            table td{
               border-right: 1px solid #000000;height:35px;border-bottom: 1px solid #000000;
               word-break: break-all;word-wrap: break-word; 
               padding-left:5px;
            }
           .navTitle{font-weight:bold;margin:5px;}
           .tableInput{width98%;}
           .radio,.checkbox,.radiochecked,.checkboxchecked{
          	    vertical-align: middle;
				height: 13px;
				width: 13px;
				overflow:hidden;
				display: -moz-inline-stack;display:inline-block; zoom: 1;*display: inline;
				margin-right:5px;
           }
           .radio,.radiochecked{
	           	background:url('${imgHttpUrl}/themes/default/images/form/radio.gif') no-repeat 0 0;
           }
           
           .checkbox,.checkboxchecked{
	           	background:url('${imgHttpUrl}/themes/default/images/form/checkbox.gif') no-repeat 0 0;
           }
           .checkboxchecked,.radiochecked{
			    background-position:-13px -13px;
			}
           @page {    
              size:  210mm 297mm;
           } 
        </style> 
</head>
<#-- 定义宏formatdate-->
<#macro formatdate date>
<#if date??&&date?string!=''>
${date?string("yyyy-MM-dd")}
</#if>
</#macro>  
<body style="width:210mm;"> 
  <div>
	<div class="brcImg"><img src="${imgHttpUrl}/themes/default/images/head_logo.png" width="155" height="35"/></div>
	<br></br>
	<div align="center" style="font-weight:bold;font-size:30px;">${subject}</div>
    <div>
			<span style="float: left; margin-left: 10px;font-weight:bold;"> 
				单据号码：<strong>${billCode}</strong> &nbsp;&nbsp;
				制单日期：<strong><@formatdate date=fillinDate/></strong>
			</span> 
			<span style="float: right; margin-right: 10px;"> 
				发送人：<strong>${organName}.${deptName}.${personMemberName}</strong>
			</span>
     </div>
     <br></br>
     <table cellspacing="0" cellpadding="0"> 
         <tr>  
         	<td width='34%'>文件编号:${dispatchNo?default("&nbsp;")}</td>
            <td width='33%'>主送:${reportToName?default("&nbsp;")}</td>
            <td width='33%'>责任人:${personInChargeName}</td>
         </tr>  
      </table>
     <div style="margin-top:3px;">
 		${extendedFieldDivHtml?default("")}
 	</div>
 	<div style="width:98%;margin-top:3px;">
 	  ${askContent?default("")}
 	</div>
 	<#include "/simple/taskExecutionList.ftl" />   
 </div>
</body>  
</html>   