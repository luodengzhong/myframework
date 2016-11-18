<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>  
  <title>验收登记</title>  
        <style type="text/css">
            body { font-family: SimSun;   font-size:12px;}
            
            .brcImg{
			    border-bottom: 1px solid #000000;
            }
            
            table.print{
               width:100%;table-layout:fixed; word-break:break-strict;
               border-left: 1px solid #000000;border-top: 1px solid #000000;
            }
            
            table.print tr{  
               height: 35px;text-align: left;
            } 
                        
            table.print td{
               border-right: 1px solid #000000;height:25px;border-bottom: 1px solid #000000;
               word-break: break-all;word-wrap: break-word;
            }
            table.print td.center{
                width:100px;
            	text-align: center;
            	word-break: break-all;word-wrap: break-word;
            }
            table.print td.left{
                width:100px;
            	text-align: left;
            	padding-left:10px;
            }
            table.tableInput{
				font-size:9pt;
				width:100%;
				table-layout:fixed;
				word-wrap:break-word; 
                word-break:break-all;
			    border: 1px solid #000000;
			    border-width: 1px 0 0 1px;
			}
			
			table.tableInput td{
				border: 1px solid #000000;
			    border-width: 0 1px 1px 0;
			    height:auto;
			    min-height:25px;
			    vertical-align:middle;
				word-break:break-all;
				word-wrap:break-word;
			}
			table.tableInput td div.textLabel{
				padding-left:5px;
			}
            @page {    
              size:  210mm 297mm;
              @bottom-right {  
                    content: "KJ-A04-01[A/0版]";  
              } 
           }    
        </style> 
</head>  
<#-- 定义宏formatdate-->
<#macro formatdate date>
<#if date??&&date?string!=''>
${date?string("yyyy-MM-dd")}
</#if>
</#macro>
<body>  
	  <div class="brcImg"><img src="${imgHttpUrl}/themes/default/images/head_logo.png" width="155" height="35"/></div>
      <div align="center" style="font-weight:bold;">  
          <h2>验&nbsp;收&nbsp;登&nbsp;记</h2>
      </div>
      <div>
			<span style="float: left; margin-left: 10px;font-weight:bold;"> 
				单据号码：<strong>${billCode}</strong> &nbsp;&nbsp;
				填表日期：<strong><@formatdate date=fillinDate/></strong>
			</span> 
			<span style="float: right; margin-right: 10px;"> 
				申请人：<strong>${organName}.${deptName}.${personMemberName}</strong>
			</span>
      </div>
      <br></br>
      <table cellspacing="0px" cellpadding="0px" class="print"> 
         <tr>  
            <td class="center">主题</td>  
            <td class="left" colspan="3">${subject}</td>  
            <td class="center">经办人</td>  
            <td class="left" >${operatorDeptName}.${operatorName}</td>  
         </tr>  
         
         <tr>  
             <td class="center">业务大类</td>  
            <td class="left">${businessKindName}</td>  
             <td class="center">所属项目</td>  
            <td class="left">${projectName}</td>  
            <td class="center">验收依据</td>  
            <td class="left">${kindIdName}</td>  
         </tr>
         <tr>  
            <td class="center">涉及合同</td>  
            <td class="left">${contractName}</td>  
            <td class="center">乙方单位</td>  
            <td class="left">${supplierName}</td>  
            <td class="center">乙方联系人</td>  
            <td class="left">${contactName}</td>  
         </tr>
         <tr>  
            <td class="center">乙方联系电话</td>  
            <td class="left">${contactNumber}</td>  
            <td class="center">验收日期</td>  
            <td class="left"><@formatdate date=acceptDate/></td>   
            <td class="center">是否尾款验收</td>  
            <td class="left"><#if isLastAcceptance == '0'>否<#else>是</#if></td>   
         </tr>
         
         <tr>  
            <td class="center">验收金额</td>  
            <td class="left">${approvalTotalAmount}</td>  
            <td colspan="4"></td>  
         </tr>
         
         <tr>  
            <td class="center">验收说明</td>  
            <td class="left" colspan="5">${remark}</td>  
         </tr>
      </table>
      <br/>
    <#include "/simple/taskExecutionList.ftl" />
</body>  
</html>   