$(function(){var n={height:200,filebrowserUploadUrl:"/Account/CKEditorUpload/",filebrowserImageUploadUrl:"/Account/CKEditorUpload/",toolbar_Full:[["Source"],["Cut","Copy","Paste","PasteText","PasteFromWord","-","SpellChecker","Scayt"],["Undo","Redo","-","Find","Replace","-","SelectAll","RemoveFormat"],"/",["Bold","Italic","Underline","Strike","-","Subscript","Superscript"],["NumberedList","BulletedList","-","Outdent","Indent","Blockquote","CreateDiv"],["JustifyLeft","JustifyCenter","JustifyRight"],["Link","Unlink","Anchor"],["Image","Table","SpecialChar"],"/",["Styles","Format","Font","FontSize"],["TextColor","BGColor"],["Maximize","ShowBlocks","-","About"]]};$("#editor").ckeditor(n),$("ul.enablesort div.newitem > a").live("click",function(n){if(!$(this).attr("href"))return!1;n.preventDefault();var t=$(this);$.post(t.attr("href"),null,function(n){t.parent().prev().append(n),t.parent().prev().find(".tip").tooltip({opacity:0,showBody:"|"})})}),$("ul.enablesort a.del").live("click",function(n){if(!$(this).attr("href"))return!1;n.preventDefault(),$(this).parent().parent().parent().remove()}),$.regsettingeditclick=function(n){$(".tip",n).tooltip({opacity:0,showBody:"|"}),$("ul.enablesort ul.sort",n).sortable(),$("ul.noedit input",n).attr("disabled","disabled"),$("ul.noedit select",n).attr("disabled","disabled"),$("ul.noedit a",n).not('[target="otherorg"]').removeAttr("href"),$("ul.noedit a",n).not('[target="otherorg"]').css("color","grey"),$("ul.noedit a",n).not('[target="otherorg"]').unbind("click")},$.regsettingeditclick(),$("a.editor").live("click",function(n){if(!$(this).attr("href"))return!1;var t=$(this).attr("tb");return n.preventDefault(),$("#EditorDialog").dialog({width:650,height:450,modal:!0,draggable:!0,resizable:!0,open:function(){$("#editor").val($("#"+t).val())},buttons:{Save:function(){var n=$("#editor").val();$("#"+t).val(n),$("#"+t+"_ro").html(n),$(this).dialog("close")}}}),!1}),$("#notifylist").live("click",function(n){if(!$(this).attr("href"))return!1;n.preventDefault();var t=$("#usersDialog");$("iframe",t).attr("src",this.href),t.dialog("open")})})