$(function(){$("#progress").dialog({autoOpen:!1,modal:!0,close:function(){$("#progress").html("<h2>Working...</h2>")}}),$(".bt").button(),$("#Send").click(function(){var n=$("#progress"),t;n.dialog("open"),$("#Body").text(CKEDITOR.instances.Body.getData()),t=$(this).closest("form").serialize(),$.post("/Email/QueueEmails",t,function(t){var i,r;if(t=="timeout"){window.location="/Email/Timeout";return}i=t.id,i==0?n.html(t.content):r=window.setInterval(function(){$.post("/Email/TaskProgress/"+i,null,function(t){t.substr(0,20).indexOf("<!--completed-->")>=0&&window.clearInterval(r),n.html(t)})},3e3)})}),$("#TestSend").click(function(){var t=$("#progress"),n;t.dialog("open"),$("#Body").text(CKEDITOR.instances.Body.getData()),n=$(this).closest("form").serialize(),$.post("/Email/TestEmail",n,function(n){if(n=="timeout"){window.location="/Email/Timeout";return}t.html(n)})});var t={height:400,filebrowserUploadUrl:"/Account/CKEditorUpload/",filebrowserImageUploadUrl:"/Account/CKEditorUpload/",toolbar_Full:[["Source"],["Cut","Copy","Paste","PasteText","PasteFromWord","-","SpellChecker","Scayt"],["Undo","Redo","-","Find","Replace","-","SelectAll","RemoveFormat"],"/",["Bold","Italic","Underline","Strike","-","Subscript","Superscript"],["NumberedList","BulletedList","-","Outdent","Indent","Blockquote","CreateDiv"],["JustifyLeft","JustifyCenter","JustifyRight"],["Link","Unlink","Anchor"],["Image","Table","SpecialChar"],"/",["Styles","Format","Font","FontSize"],["TextColor","BGColor"],["Maximize","ShowBlocks","-","About"]]},n={height:100,filebrowserUploadUrl:"/Account/CKEditorUpload/",filebrowserImageUploadUrl:"/Account/CKEditorUpload/",toolbar_Full:[["Source"],["Bold","Italic","Underline"],["Image"],["Font","FontSize"],["TextColor","BGColor"],]};$("#textarea.editor").ckeditor(t),$("#textarea.smalleditor").ckeditor(n),$("#CreateVoteTag").live("click",function(n){n.preventDefault(),CKEDITOR.instances.votetagcontent.updateElement();var t=$(this).closest("form").serialize();$.post("/Email/CreateVoteTag",t,function(n){CKEDITOR.instances.votetagcontent.setData(n,function(){CKEDITOR.instances.votetagcontent.setMode("source")})})})})