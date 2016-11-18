var activityKindData = { 1: "审批", 2: "知会" };
$(function () {

    initUI();
    setProperties();

    function initUI() {
        orgSelect($("#personMemberName"));
        $('#activityKind').combox({ data: activityKindData });
    }

    //选择组织
    function orgSelect(elem) {
        elem.orgTree({ filter: 'psm', param: { searchQueryCondition: "org_kind_id in('ogn','dpt','pos','psm')" },
            height: 200,
            width: 250,
            onChange: function (values, data) {
                //tree的赋值
                if ($.isPlainObject(data)) {
                    $("#fullId").val(data.id);
                    $("#fullName").val(data.fullName);
                }
            },
            back: { //tree
                text: '#personMemberName',
                value: '#personMemberId',
                //grid
                id: '#personMemberId',
                name: '#personMemberName',
                fullId: "#fullId",
                fullName: "#fullName"
            }
        });
    }

    function setProperties() {
        var personMemberId = Public.getQueryStringByName("personMemberId");
        var personMemberName = decodeURI(Public.getQueryStringByName("personMemberName"));
        var fullId = Public.getQueryStringByName("fullId");
        var fullName = decodeURI(Public.getQueryStringByName("fullName"));
        var activityKind = Public.getQueryStringByName("activityKind");

        $("#personMemberId").val(personMemberId);
        $("#personMemberName").val(personMemberName);
        $("#fullId").val(fullId);
        $("#fullName").val(fullName);
        $('#activityKind').combox("setValue", activityKind);
    }
});

function getProperties() {
    var result = {};
    result.personMemberId = $("#personMemberId").val();
    result.personMemberName = $("#personMemberName").val();
    result.fullId = $("#fullId").val();
    result.fullName = $("#fullName").val();
    result.activityKind = $('#activityKind').val();
    return result;
}
