$(function(){$("#refresh").click(function(n){n.preventDefault(),location.reload()}),$("#back").click(function(n){n.preventDefault(),location="/Meeting/Index/"+$("#meetingid").val()}),$("#abcsdialog a").click(function(n){n.preventDefault(),$(".ui-dialog").dialog("close");var t=$(this).text();$("div.ckline").hide(),t==="All"?$("div.ckline").show():$("."+t).show(),$("html, body").animate({scrollTop:0},"fast")}),$("input[type='radio']").bind("change",function(){var i=$(this).val();$("div.ckline").hide(),i==="back"?location="/Meeting/Index/"+$("#meetingid").val():i==="refresh"?location.reload():i==="all"?$("div.ckline").show():$("."+i).show(),$("html, body").animate({scrollTop:0},"fast")}),$("#abcs2").change(function(){var n=$(this).val();$("div.ckline").hide(),n==="all"?$("div.ckline").show():$("."+n).show(),$("html, body").animate({scrollTop:0},"fast")}),$("div.na").bind("click",function(n){return n.preventDefault(),!1}),$("div.ckline input:checkbox").change(function(){var t=$(this);$.post("/Meeting/MarkAttendance/",{MeetingId:$("#meetingid").val(),PeopleId:t.attr("id").substr(2),Present:t.is(":checked")},function(n){n.error&&(t.attr("checked",!t.is(":checked")),alert(n.error))})})})