<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>  
  <title>申购单</title>  
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
	  <div class="brcImg"><img src="${imgHttpUrl}/themes/default/images/head_logo.png" width="155" height="35"/></div>
      <div align="center" style="font-weight:bold;font-size:20px;">  
          <h3>申&nbsp;购&nbsp;单</h3>
      </div>
      
      <div>
			<span style="float: left; margin-left: 10px;font-weight:bold;"> 
				单据号码：<strong>${billCode}</strong> &nbsp;&nbsp;
				制单日期：<strong><@formatdate date=fillinDate/></strong>
			</span> 
			<span style="float: right; margin-right: 10px;"> 
				经办人：<strong>${organName}.${deptName}.${personMemberName}</strong>
			</span>
      </div>
      <br></br>
      
      <table cellspacing="0px" cellpadding="0px" class="print"> 
         <tr>  
            <td class="center">文件编号</td>  
            <td class="left">${dispatchNo}</td>  
            <td class="center">关键字</td>  
            <td class="left">${keyword?html}</td> 
         </tr>  
         <tr>  
            <td class="center">采购类别</td>  
            <td class="left">${materialClassTextView?default("")?html}</td>  
            <td class="center">主要设备专业类别</td>  
            <td class="left">${materialCategoryTextView?default("")?html}</td>  
         </tr>
         <tr>  
            <td class="center">合计金额(元)</td>  
            <td class="left">${amount}</td>  
            <td class="center">大写金额</td>  
            <td class="left">${chineseAmount}</td>  
         </tr>
         <tr>  
            <td class="center">采购方式</td>  
            <td colspan="3" class="left">${buyWayTextView?default("")?html}</td>  
         </tr>
         <tr>  
            <td class="center">申购原因</td>  
            <td colspan="3" class="left">${reason?html}</td>  
         </tr>
         <tr>  
            <td class="center">备注</td>  
            <td colspan="3" class="left">${remark?html}</td>  
         </tr>
      </table>
      
      <br/>
    <div  style="font-weight:bold;font-size:16px;text-align:left;">  
          <b>申购清单</b>
    </div>
	<table cellspacing="0" cellpadding="0" class="print">
      	<tr>  
      		<td class="center" style="width:30px;"><b>序号</b></td>  
            <td class="center" style="width:60px;"><b>物资类别</b></td>  
            <td class="center" style="width:100px;"><b>品牌</b></td>
            <td class="center" style="width:100px;"><b>规格\型号</b></td>
            <td class="center" style="width:30px;"><b>单位</b></td>
            <td class="center" style="width:50px;"><b>审批数量</b></td>
            <td class="center" style="width:50px;"><b>审批单价</b></td>
            <td class="center" style="width:50px;"><b>审批金额</b></td>
            <td class="center" style="width:50px;"><b>使用部门</b></td>
         </tr>
        <#if purchaseDetail?? && purchaseDetail?size gt 0> 
		<#list purchaseDetail as purchase>
			<tr >
				<td class="center">${purchase_index?if_exists+1}</td>
				<td class="center">${purchase.materialName}</td>
				<td class="center">${purchase.brand?html}</td>
				<td class="center">${purchase.specification?html}</td>
				<td class="center">${purchase.unitTextView?default("")?html}</td>
				<td class="center">${purchase.approvalQuantity}</td>
				<td class="center">${purchase.approvalPrice}</td>
				<td class="center">${purchase.approvalAmount}</td>
				<td class="center">${purchase.deptName}</td>
			</tr> 
		</#list>
		<#else>
			<tr>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
			</tr> 
		</#if>
      </table>
      <br/>
    <#include "/simple/taskExecutionList.ftl" />
</body>  
</html>   