function RefreshList(){var n=$("#form").formSerialize2();$.navigate("/Task/List",n)}function GotoPage(n){var t=$("#form").formSerialize2();t=t.appendQuery("Page="+n),$.navigate("/Task/List",t)}function SetPageSize(n){var t=$("#form").formSerialize2();t=t.appendQuery("PageSize="+n),$.navigate("/Task/List",t)}function SelectTab(n){n&&$("#CurTab").val(n),$("#tabs").tabs("select","#"+$("#CurTab").val())}function ClickTab(n){return n&&$("#CurTab").val(n),$.cookie("CurTaskTab",n,{expires:360}),RefreshList(),!1}function StripeList(){$("#tasks > tbody > tr:even").addClass("alt")}function DeleteList(n){$.post("/Task/Action/",n,function(n){var t=n.split("<---------->");$("#tabs").html(t[0]),$("#actions").html(t[1]),$("#tasks > tbody").html(t[2]).ready(StripeList)})}function DoAction(){var t=$("#actions option:selected").val(),r=$(".actionitem:checked").getCheckboxVal().join(","),i="option="+t+"&curtab="+$("#CurTab").val()+"&items="+r,n;if($("#actions").attr("selectedIndex",0),!(r=""))switch(t){case"":case"-":return;case"delegate":n=$("#dialogbox"),$("iframe",n).attr("src","/SearchAdd/Index/1?type=taskdelegate2"),n.dialog("option","title","Delegate tasks"),n.dialog("open");return;case"sharelist":$.growlUI("error","not implemented yet");return;case"deletelist":confirm("Are you sure you want to delete the list?")&&($.block(),DeleteList(i),$.unblock());return;default:$.block(),$.post("/Task/Action/",i,function(n){$("#tasks > tbody").html(n).ready(StripeList),$.unblock()});return}}function AddListEnter(n){var t=window.event?n.keyCode:n.which;return t!=13?!0:(AddListClick(),!1)}function AddListClick(){var n="ListName="+$("#ListName").val();return $.post("/Task/AddList/",n,function(n){var t=n.split("<---------->");$("#tabs").html(t[0]),$("#actions").html(t[1]),$("#ListName").val("")}),!1}function AddTaskEnter(n){var t=window.event?n.keyCode:n.which;return t!=13?!0:(AddTaskClick(),!1)}function AddTaskClick(){var t=$("#TaskDesc").val().replace(/\s/g,""),n;t&&t.length!=0&&(n="TaskDesc="+$("#TaskDesc").val()+"&CurTab="+$("#CurTab").val(),$.post("/Task/AddTask/",n,function(n){$("#nomatch").remove();var t=!($("#tasks > tbody tr:visible:first").hasClass("alt")||!1);$("#tasks > tbody tr:first").before(n),t&&$("#tasks > tbody tr:first").addClass("alt"),$("#TaskDesc").val("")}))}function ShowDetail(n){var t=$("#TaskId").val();t?$.post("/Task/Detail/"+n+"/Row/"+t,function(i){var r=i.split("<---------->");$("#r"+t).html(r[0]),$("#r"+t).removeClass("detailrow"),$("#r"+n).addClass("detailrow").html(r[1])}):$.post("/Task/Detail/"+n,function(t){$("#r"+n).addClass("detailrow"),$("#r"+n).html(t)})}function Deselect(){var n=$("#TaskId").val();return $.post("/Task/Columns/"+n,function(t){$("#r"+n).removeClass("detailrow").html(t)}),!1}function SetPriority(n,t){return $.post("/Task/Priority/"+n+"?priority="+t,null,function(n){$("#Priority").text(n.Priority)}),!1}function SetComplete(n){return $.post("/Task/SetComplete/"+n,null,function(t){$("#r"+n).removeClass("detailrow").html(t)}),!1}function Accept(n){return $.post("/Task/Accept/"+n,null,function(t){$("#r"+n).html(t)}),!1}function ChangePage(){}function SearchClicked(){}function SelectPerson(){}function SearchContacts(){SearchClicked=SearchContactClicked,ChangePage=ChangeContactPage,$("#dialogbox2").dialog("option","title","Select Contact"),$("#dialogbox2").load("/Task/SearchContact/",null,function(){queryString=$("#searchform").formSerialize2(),$(".datepicker").datepicker({changeYear:!0,changeMonth:!0}),$("#contacts").initPager(),$("#contacts > thead a.sortable").click(function(n){return $("#contacts #Sort").val($(n.target).text()),queryString=$("#searchform").formSerialize2(),$.post("/Task/SearchContact/0",queryString,function(n){$("#contacts > tbody").html(n).ready(function(){$("#contacts").initPager()})}),!1})}),$("#dialogbox2").dialog("open")}function AddSourceContact(n){var t=$("#TaskId").val();$.post("/Task/AddSourceContact/"+t+"?contactid="+n,null,function(n){$("#r"+t).html(n)}),$("#dialogbox2").dialog("close")}function CompleteWithContact(){var n=$("#TaskId").val();$.post("/Task/CompleteWithContact/"+n,null,function(n){window.location="/Contact.aspx?edit=1&id="+n.ContactId})}function ActOnPerson(n,t){var i=$("#TaskId").val();$.post(n+i+"?peopleid="+t,null,function(n){$("#r"+i).html(n)}),$("#dialogbox").dialog("close")}function ChangeContactPage(n){return $.post("/Task/SearchContact/"+n,queryString,function(n){$("#contacts > tbody").html(n)}),!1}function ChangePeoplePage(n){return $.post("/SearchPeople/"+n,queryString,function(n){$("#people > tbody").html(n)}),!1}function SearchContactClicked(){return queryString=$("#searchform").formSerialize2(),$.post("/Task/SearchContact/0",queryString,function(n){$("#contacts > tbody").html(n).ready(function(){$("#contacts").initPager()})}),!1}function Edit(){var n=$("#TaskId").val();$.post("/Task/Edit/"+n,function(t){$("#r"+n).html(t),$(".datepicker").datepicker({changeYear:!0,changeMonth:!0})})}function Update(){var n=$("#TaskId").val(),t=$("#Edit").formSerialize2();return $.post("/Task/Update/"+n,t,function(t){$("#r"+n).html(t)},"html"),!1}function AddSelected(n){ActOnPerson(n.url,n.pid)}function AddSelected2(n){var i=$(".actionitem:checked").getCheckboxVal().join(","),t="items="+i;$.block(),$.post("/Task/DelegateAll/"+n.pid,t,function(n){$("#tasks > tbody").html(n).ready(StripeList),$("#dialogbox").dialog("close"),$.unblock()})}$(function(){SearchClicked=RefreshList,$("#tabs").tabs(),$("#tabs > ul > li > a").click(function(){var n=$(this).attr("href").substring(1);return ClickTab(n)}),SelectTab(),StripeList();var n=$.cookie("tasklast");$("#tasks > thead a.sortable").click(function(){$("#Sort").val($(this).text()),RefreshList()}),$("#dialogbox").dialog({title:"Search Dialog",bgiframe:!0,autoOpen:!1,width:700,height:630,modal:!0,overlay:{opacity:.5,background:"black"},close:function(){$("iframe",this).attr("src","")}}),$("#changeowner").live("click",function(n){n.preventDefault();var t=$("#dialogbox");return $("iframe",t).attr("src",this.href),t.dialog("option","title","Change Owner"),t.dialog("open"),!1}),$("#delegate").live("click",function(n){n.preventDefault();var t=$("#dialogbox");return $("iframe",t).attr("src",this.href),t.dialog("option","title","Delegate task"),t.dialog("open"),!1}),$("#changeabout").live("click",function(n){n.preventDefault();var t=$("#dialogbox");return $("iframe",t).attr("src",this.href),t.dialog("option","title","Make Task About"),t.dialog("open"),!1})}),$(function(){$("#dialogbox2").dialog({overlay:{background:"#000",opacity:.8},bgiframe:!0,modal:!0,autoOpen:!1,closeOnEscape:!0,width:700,height:525,position:"top",close:function(){$("#dialogbox2").empty(),SearchClicked=RefreshList}})});var queryString="";$.fn.initPager=function(){return this.each(function(){$(".pagination",this).pagination($("#Count",this).val(),{items_per_page:$("#PageSize",this).val(),num_display_entries:5,num_edge_entries:1,current_page:0,callback:ChangePage}),$("#NumItems",this).text($("#Count",this).val().addCommas()+" items")}),this}