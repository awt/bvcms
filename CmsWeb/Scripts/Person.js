﻿$(function() {
    var addrtabs = $("#address-tab").tabs();
    $("#enrollment-tab").tabs();
    $("#member-tab").tabs();
    $("#growth-tab").tabs();
    var maintabs = $("#main-tab").tabs();
    addrtabs.tabs('select', $('#addrtab').val());
    $('#dialogbox').SearchPeopleInit({ overlay: { background: "#000", opacity: 0.3} });
    $('#clipaddr').live('click', function() {
        var inElement = $('#addrhidden')[0];
        if (inElement.createTextRange) {
            var range = inElement.createTextRange();
            if (range)
                range.execCommand('Copy');
        }
        return false;
    });
    $('#deleteperson').click(function() {
        var href = $(this).attr("href");
        if (confirm('Are you sure you want to delete?')) {
            $.post(href, null, function(ret) {
                if (ret) {
                    $.blockUI({ message: "delete Failed: " + ret });
                    $('.blockOverlay').attr('title', 'Click to unblock').click($.unblockUI);
                }
                else {
                    $.blockUI({ message: "person deleted" });
                    $('.blockOverlay').attr('title', 'Click to unblock').click(function() {
                        $.unblockUI();
                        window.location = "/";
                    });
                }
            });
        }
        return false;
    });
    $('#moveperson').click(function(ev) {
        var href = $(this).attr("href");
        $('#dialogbox').SearchPeople(ev, function(id, peopleid) {
            $.post(href, { to: peopleid }, function(ret) {
                $('#dialogbox').dialog("close");
                if (ret) {
                    $.blockUI({ message: "Move Failed: " + ret });
                    $('.blockOverlay').attr('title', 'Click to unblock').click($.unblockUI);
                }
                else {
                    $.blockUI({ message: "Move succeeded" });
                    $('.blockOverlay').attr('title', 'Click to unblock').click(function() {
                        $.unblockUI();
                        window.location.reload();
                    });
                }
            });
        });
        return false;
    });
    if ($("#ui-widget-iframe").length == 0) {
        $('<div id="ui-widget-iframe-outer"><iframe id="ui-widget-iframe" src="" frameborder="0" /></div>')
		.appendTo(document.body)
		.hide();
    }

    $('#current-tab form a.membertype').live("click", function(ev) {
        var dialogOuter = $("#ui-widget-iframe-outer");
        var w = 600;
        var dialogFrame = $("#ui-widget-iframe");
        dialogFrame.attr('height', 400);
        dialogFrame.attr('width', 600);

        dialogFrame.attr('src', this.href);
        $("body").css("overflow", "hidden");
        var dialog = dialogOuter.dialog(
				{ modal: true,
				    title: this.title,
				    resizable: false,
				    shadow: false,
				    close: function(ev, ui) {
				        dialogOuter.dialog('destroy'); $("body").css("overflow", "auto");
				        $.getTable($('#current-tab form'));
				    }
				});

        var hW = dialogFrame.width();
        dialog.dialog('option', 'width', hW + 40);
        dialog.dialog('option', 'position', 'center');

        var offset = dialog.offset();
        $('.ui-widget-shadow').width(hW + 40);
        $('.ui-widget-shadow').css({
            left: offset.left,
            top: offset.top,
            width: dialog.outerWidth(),
            height: dialog.outerHeight()
        });
        return false;
    });

    $(".CreateAndGo").click(function() {
        if (confirm($(this).attr("confirm")))
            $.post($(this).attr("href"), null, function(ret) {
                window.location = ret;
            });
        return false;
    });

    $("#enrollment-link").click(function() {
        $.showTable($('#current-tab form'));
    });
    $("#previous-link").click(function() {
        $.showTable($('#previous-tab form'));
    });
    $("#pending-link").click(function() {
        $.showTable($('#pending-tab form'));
    });
    $("#attendance-link").click(function() {
        $.showTable($('#attendance-tab form'));
    });
    $("#growth-link").click(function() {
        $("#contacts-tab form").each(function() {
            $.showTable($(this));
        });
    });
    $("a.displayedit").live('click', function() {
        var f = $(this).closest('form');
        $.post($(this).attr('href'), null, function(ret) {
            $(f).html(ret).ready(function() {
                var acopts = {
                    minChars: 3,
                    matchContains: 1
                };
                $('#Employer', f).autocomplete("/Person/Employers", acopts);
                $('#School', f).autocomplete("/Person/Schools", acopts);
                $('#Occupation', f).autocomplete("/Person/Occupations", acopts);
                $('#NewChurch,#PrevChurch', f).autocomplete("/Person/Churches", acopts);
                $(".datepicker").datepicker({
                    dateFormat: 'm/d/yy',
                    changeMonth: true,
                    changeYear: true
                });
                $("#verifyaddress").click(function() {
                    var f = $(this).closest('form');
                    var q = f.serialize();
                    $.post($(this).attr('href'), q, function(ret) {
                        if (confirm(ret.address + "\nUse this Address?")) {
                            $('#Address1', f).val(ret.Line1);
                            $('#Address2', f).val(ret.Line2);
                            $('#City', f).val(ret.City);
                            $('#State', f).val(ret.State);
                            $('#Zip', f).val(ret.Zip);
                        }
                    }, "json");
                    return false;
                });
                return false;
            });
        });
        return false;
    });
    $("form.DisplayEdit a.submitbutton").live('click', function() {
        var f = $(this).closest('form');
        var q = f.serialize();
        $.post($(this).attr('href'), q, function(ret) {
            $(f).html(ret).ready(function() {
                var bc = $('#businesscard');
                $.post($(bc).attr("href"), null, function(ret) {
                    $(bc).html(ret);
                });
            });
        });
        return false;
    });
    $("#future").live('click', function() {
        var f = $(this).closest('form');
        var q = f.serialize();
        $.post($(f).attr("action"), q, function(ret) {
            $(f).html(ret);
        });
    });
    $("form.DisplayEdit").submit(function() {
        if (!$("#submitit").val())
            return false;
    });

});

