$(function(){$("#clear").click(function(){$("input:text").val("")}),$("#name").focus(),$("#search").click(function(n){return n.preventDefault(),$.getTable(),!1}),$(".bt").button(),$.getTable=function(){var t=$("#results").closest("form"),n=t.serialize();return $.post($("#search").attr("href"),n,function(n){$("#results").replaceWith(n).ready($.formatTable)}),!1},$("ul.sort").sortable(),$("#UpdateSelected").click(function(n){n.preventDefault();var t=$("input[type=checkbox]:checked").map(function(){return $(this).val()}).get().join(",");return self.parent.UpdateSelectedOrgs(t),!1}),$("#close").click(function(){window.parent.$("#orgsDialog").dialog("close")}),$.formatTable=function(){$("td.tooltip").tooltip({showURL:!1,showBody:"|"}),$("#results > tbody > tr:even").addClass("alt")},$.formatTable(),$.SaveOrgIds=function(){var t=$("input[type=checkbox]:checked").map(function(){return $(this).val()}).get().join(",");$.post("/SearchOrgs/SaveOrgIds/"+$("#id").val(),{oids:t})},$("input:checkbox").live("change",$.SaveOrgIds),$("form input").live("keypress",function(n){return n.which&&n.which==13||n.keyCode&&n.keyCode==13?($("#search").click(),!1):!0})})