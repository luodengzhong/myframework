<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>  
  <title>借款申请单</title>  
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
<body>  
	  <div class="brcImg"><img src="${imgHttpUrl}/themes/default/images/head_logo.png" width="155" height="35"/></div>
      <div align="center" style="font-weight:bold;">  
          <h2>借&nbsp;款&nbsp;申&nbsp;请&nbsp;审&nbsp;批&nbsp;单</h2>
      </div>
      <div align="right" style="font-weight:bold;">  
          <h5>打印计数：${printCount}</h5>
      </div>
      <table cellspacing="0px" cellpadding="0px" class="print"> 
         <tr>  
            <td class="center">主题</td>  
            <td class="left" colspan="3">${summary}</td>  
            <td class="center">领借款编号</td>  
            <td class="left" >${billCode}</td>  
         </tr>  
         <tr>  
            <td class="center">申请人</td>  
            <td class="left">${personMemberName}</td>  
            <td class="center">申请部门</td>  
            <td class="left">${deptName}</td>  
            <td class="center">申请日期</td>  
            <td class="left">${fillinDate}</td>  
         </tr>  
         <tr>  
             <td class="center">借款人</td>  
            <td class="left">${loanPersonName}</td>  
             <td class="center">此前未还借款</td>  
            <td class="left">${unbackLoanAmount}</td>  
            <td class="center">对应立项</td>  
            <td class="left">${setupProjectName}</td>  
         </tr>
         <tr>  
            <td class="center">领借款金额</td>  
            <td class="left">${amount}</td>  
            <td class="center">付款单位</td>  
            <td class="left">${paymentUnitName}</td>  
            <td class="center">收款单位</td>  
            <td class="left">${supplierName}</td>  
         </tr>
         <tr>  
            <td class="center">领借款类型</td>  
            <td class="left">${kindName}</td>  
            <td class="center">开户银行</td>  
            <td class="left">${bankName}</td>  
            <td class="center">银行帐号</td>  
            <td class="left">${accountCode}</td>  
         </tr>
         
         <tr>  
            <td class="center">相关说明</td>  
            <td class="left" colspan="5">${remark}</td>  
         </tr>
      </table>
      <br/>
    <#include "/simple/taskExecutionList.ftl" />
</body>  
</html>   