<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>  
  <title>付款登记单</title>  
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
          <h2>付&nbsp;款&nbsp;登&nbsp;记&nbsp;单</h2>
      </div>
      <table cellspacing="0px" cellpadding="0px" class="print"> 
         <tr>  
            <td class="center">请款主题</td>  
            <td class="left" colspan="3">${summary}</td>  
            <td class="center">登记编号</td>  
            <td class="left" >${billCode}</td>  
         </tr>  
         <tr>  
            <td class="center">机构名称</td>  
            <td class="left">${organName}</td>
            <td class="center">部门名称</td>  
            <td class="left">${deptName}</td>  
            <td class="center">操作人</td>  
            <td class="left">${personMemberName}</td> 
         </tr> 
         <tr>  
            <td class="center">申请日期</td>  
            <td class="left">${sfillinDate}</td>  
            <td class="center">请款金额</td>  
            <td class="left">${applyAmount}</td>  
            <td class="center">本次登记金额</td>  
            <td class="left">${amount}</td>  
         </tr>   
      </table>
    <div  style="font-weight:bold;font-size:16px;text-align:left;">  
          <b>付款登记明细</b>
    </div>
	<table cellspacing="0" cellpadding="0" class="print">
      	<tr>
      		<td class="center" style="width:5px;"><b>序号</b></td> 
      		<td class="center" style="width:15px;"><b>实付金额</b></td> 
      		<td class="center" style="width:135px;"><b>实付方式</b></td> 
            <td class="center" style="width:30px;"><b>付款银行</b></td>  
            <td class="center" style="width:150px;"><b>结算方式</b></td>
            <td class="center" style="width:40px;"><b>结算单号</b></td>
         </tr>
		<#list paymentRegisterDetail as detail>
			<tr >
				<td class="center">${detail_index?if_exists+1}</td>
				<td class="center">${detail.realAmount}</td>
				<td class="center">${detail.paymentKind}</td>
				<td class="center">${detail.bankName}</td>
				<td class="center">${detail.settlementKindName}</td>
				<td class="center">${detail.settlementBillNo}</td>
			</tr> 
		</#list>
      </table>
</body>  
</html>   