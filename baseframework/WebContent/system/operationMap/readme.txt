brcmenu.swf ��Ӧ����

addCallback("clear",function():void
{
main.removeAllChildren();
});
//���һ����ť
addCallback("addButton",function(c:Object):void
{
main.addButton(c);
});
//���һ�����ߵ�
addCallback("addFoldPoint",function(c:Object):void
{
main.addFoldPoint(c);
});
//�Ƿ���ʾ���ߵ�
addCallback("showFoldPoint",function(b:Boolean):void
{
main.showFoldPoint(b);
});
//��ȡͼ���Ӧ��json����
addCallback("getJsonInfo",function():Object
{
return main.getJsonInfo();
});
//���������һ��json����
addCallback("setJsonInfo",function(c:Object):void
{
return main.setJsonInfo(c);
});
//�������ߵ����ͣ�standard,dashed,bold
addCallback("setLineType",function(t:String):void
{
return main.setLineType(t);
});
//ɾ��ѡ�е�ͼ��
addCallback("delSelected",function(t:String):void
{
return main.delSelected();
});
//ѡ��ͼ��������
addCallback("horizSelected",function(t:String):void
{
return main.horizSelected();
});
//ѡ��ͼ���������
addCallback("verticalSelected",function(t:String):void
{
return main.verticalSelected();
});
//�����Ƿ������϶�
addCallback("setDragEnable",function(b:Boolean):void
{
return main.setDragEnable(b);
});
//��ȡѡ�нڵ���Ϣ
addCallback("getSelecteds",function():Array
{
return main.getSelecteds();
});
//���½ڵ���Ϣ
addCallback("updateButton",function(d:Object):void
{
main.updateButton(d);
});
//��ȡͼ���С
addCallback("getImgSize",function():Object
{
return main.getImgSize()
});


//����

var flash = document.getElementById('brcmenu');
flash.setJsonInfo({
buttons: [{
id: '1000',x: 156,y: 316,text:'test 1000'
},{
id: '1001',x: 136,y: 196,text:'test 1001'
},{
id: '1002',x: 300,y: 210,text: 'disable',disabled: true
}],
folds: [],
lines: [{from:'1000',to:'1001',type: 'standard'}]
});


//��ť������Ĭ��ֵ����Щֵ���ǿ��Ըĵ�
_default = {
				color: "#000000",
				border_color: "#fef9e3",
				eclipse: 4,
				width: 142,
				height: 42,
				font_size: "14px",
				disabled: false,
				text:""
			}
