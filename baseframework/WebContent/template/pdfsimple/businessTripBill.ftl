<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>  
  <title>出差申请表</title>  
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
               height: 55px;text-align: left;
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
                width:200px;
            	text-align: left;
            	padding-left:20px;
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
  <div> 
  	  <div class="brcImg"><img src="${imgHttpUrl}/themes/default/images/head_logo.png" width="155" height="35"/></div>
      <div align="center" style="font-weight:bold;">  
          <h3>出&nbsp;差&nbsp;申&nbsp;请&nbsp;表</h3>
      </div>
      <table cellspacing="0px" cellpadding="0px" class="print"> 
         <tr>  
            <td class="center">出差部门</td>  
            <td class="left">${dept}</td>  
            <td class="center">出差地点</td>  
            <td class="left">${address}</td>  
         </tr>  
         <tr>  
            <td class="center">出差时间</td>  
            <td colspan="3" class="left">${startDate}&nbsp;至&nbsp;${endDate}</td>  
         </tr>   
         <tr>  
            <td class="center">出差人员</td>  
            <td colspan="3" class="left">${personMembers}</td>  
         </tr>  
         <tr>  
            <td class="center">出差事由</td>  
            <td colspan="3" class="left">${reason}</td>  
         </tr> 
         <tr>  
            <td class="center">报销标准</td>  
            <td colspan="3" class="left">${reimbursementStandard}</td>  
         </tr>   
         <tr>  
            <td class="center">费用承担部门</td>  
            <td colspan="3" class="left">${feeDeptName}</td>  
         </tr>   
         <tr style="height:65px">  
            <td class="center">费用承担部门领<br/>导审核</td>  
            <td colspan="3" class="left"></td>  
         </tr>
         <tr style="height:65px">  
            <td class="center">出差部门中心领<br/>导审核</td>  
            <td colspan="3" class="left"></td>  
         </tr> 
         <tr style="height:65px">  
            <td class="center">分管领导审批<br/>(按制度报销)</td>  
            <td colspan="3" class="left"></td>  
         </tr>  
         <tr style="height:65px">  
            <td class="center">总裁审批<br/>(实报实销)</td>  
            <td colspan="3" class="left"></td>  
         </tr>                                                                           
      </table>
   </div> 
    <div style="margin-bottom: 4px">单据号:${billCode}</div>
    <div style="margin-bottom: 4px">发起人:${center}[${personMemberName}]</div>
    <#include "/simple/taskExecutionList.ftl" />
</body>  
</html>   