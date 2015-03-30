﻿$(function () {

    $('body').on('click', 'a.dialog-options', function (ev) {
        ev.preventDefault();
        var $a = $(this);
        $("<div id='dialog-options' />").load($a.data("target"), function () {
            var div = $(this);
            var dialog = div.find("div.modal-dialog");
            var f = div.find("form");
            f.attr("action", $a[0].href);

            if ($a[0].title)
                div.find("h3.modal-title").text($a[0].title);

            $('#empty-dialog').html(dialog);
            $('#empty-dialog').modal("show");

            dialog.on('hidden', function () {
                div.remove();
                dialog.remove();
            });
            f.validate({
                submitHandler: function (form) {
                    if (form.method.toUpperCase() === 'GET') {
                        form.submit();
                    }
                    else {
                        var q = f.serialize();
                        $.post(form.action, q, function (ret) {
                            if ($a.data("callback")) {
                                $.InitFunctions[$a.data("callback")]($a);
                            }
                        });
                    }
                    $('#empty-dialog').modal("hide");
                },
                highlight: function (element) {
                    $(element).closest(".form-group").addClass("has-error");
                },
                unhighlight: function (element) {
                    $(element).closest(".form-group").removeClass("has-error");
                }
            });
        });
        return true;
    });

    $('body').on('click', 'a.dialog-options', function (ev) {
        ev.preventDefault();
        var $a = $(this);
        // data-target is the dialog  and a.href is the report
        // or a.href is the dialog and form.action is the report
        var dialog = $a.data("target") || this.href;
        $.dialogOptions(dialog, $a);
    });
    $.dialogOptions = function (dialog, $a) {
        $("<div id='dialog-options' />").load(dialog, {}, function () {
            var d = $(this);
            var f = d.find("form");
            if ($a[0].title)
                f.find("h3.title").text($a[0].title);
            f.modal("show");
            if (!f.attr("action"))
                f.attr("action", $a[0].href); // a.href will be the report/export
            f.on('hidden', function () {
                d.remove();
                f.remove();
            });
            $.DatePickers();
            f.validate({
                submitHandler: function (form) {
                    if (form.method.toUpperCase() === 'GET')
                        form.submit();
                    else if ($(form).hasClass("ajax")) {
                        var q = f.serialize();
                        $.post(form.action, q, function (ret) {
                            if (ret)
                                $.growlUI("", ret);
                            if ($a.data("callback")) {
                                $.InitFunctions[$a.data("callback")]($a);
                            }
                        });
                    } else {
                        if ($a.data("confirm"))
                            bootbox.confirm($a.data("confirm"), function (ret) {
                                if (!ret)
                                    form.submit();
                            });
                        else
                            form.submit();
                        if ($a.data("callback")) {
                            var q = f.serialize();
                            $.InitFunctions[$a.data("callback")]($a, q);
                        }
                    }
                    f.modal("hide");
                },
                highlight: function (element) {
                    $(element).closest(".control-group").addClass("error");
                },
                unhighlight: function (element) {
                    $(element).closest(".control-group").removeClass("error");
                }
            });
        });
        return false;
    };

    $.AttachFormElements = function () {
        //$("form.ajax input.ajax-typeahead").typeahead({
        //    minLength: 3,
        //    remote: {
        //        url: "test",
        //        beforeSend: function (jqXhr, settings) {
        //            $.SetLoadingIndicator();
        //        },
        //        replace: function (url, uriEncodedQuery) {
        //            return $("input:focus").data("link") + "?query=" + uriEncodedQuery;
        //        }
        //    }
        //});
        //$.DatePickersAndChosen();
        $.InitializeDateElements();
    };

    //$.DatePickersAndChosen = function () {
    //    $("form.ajax .date").datepicker({
    //        autoclose: true,
    //        orientation: "auto",
    //        forceParse: false,
    //        format: $.dtoptions.format
    //    });
    //    $('form.ajax select:not([plain])').chosen();
    //    $('form.ajax a.editable').editable();
    //};

    $('body').on('click', 'ul.nav-tabs a.ajax,a.ajax.ui-tabs-anchor', function (event) {
        var $this = $(this);
        var alreadyClicked = $this.data('clicked');
        if (alreadyClicked) {
            return false;
        }
        $this.data('clicked', true);
        var state = $this.attr("href") || $this.data("target");
        var d = $(state);
        var url = d.data("link");
        if (!d.hasClass("loaded"))
            $.ajax({
                type: 'POST',
                url: url,
                data: {},
                beforeSend: function () {
                    $.block();
                },
                complete: function () {
                    $.unblock();
                },
                success: function (data, status) {
                    d.addClass("loaded");
                    d.html(data).ready(function () {
                        var $form = d.find("form.ajax");
                        if ($form.data("init")) {
                            $.InitFunctions[$form.data("init")]();
                        }
                        if ($form.data("init2")) {
                            $.InitFunctions[$form.data("init2")]();
                        }
                    });
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    $.unblock();
                    swal("Error!", thrownError, "error");
                }
            });
        return true;
    });

    $("div.tab-pane").on("click", "a.ajax-refresh", function (event) {
        event.preventDefault();
        var d = $(this).closest("div.tab-pane");
        $.formAjaxClick($(this), d.data("link"));
        return false;
    });

    $('body').on('click', 'form.ajax a.submit', function (event) {
        event.preventDefault();
        var t = $(this);
        if (t.data("confirm"))
            swal({
                title: "Are you sure?",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            },
            function () {
                $.formAjaxSubmit(t);
            });
        else
            $.formAjaxSubmit(t);
        return false;
    });

    $.formAjaxSubmit = function (a) {
        var $form = a.closest("form.ajax");
        $form.attr("action", a[0].href);
        $form.submit();
    };

    $('body').on('change', 'form.ajax select.ajax', function (event) {
        event.preventDefault();
        var t = $(this);
        var link = t.data("link");
        $.formAjaxClick(t, link);
        return false;
    });

    $('body').on('click', 'form.ajax a.ajax', function (event) {
        event.preventDefault();
        var t = $(this);
        if (t.data("confirm"))
            swal({
                title: "Are you sure?",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            },
            function () {
                $.formAjaxClick(t);
            });
        else
            $.formAjaxClick(t);
        return false;
    });

    $.formAjaxClick = function (a, link) {
        var $form = a.closest("form.ajax");
        var url = link || a.data("link");
        if (typeof url === 'undefined')
            url = a[0].href;
        var data = $form.serialize();
        if (data.length === 0)
            data = {};
        if (!a.hasClass("validate") || $form.valid()) {
            var isModal = $form.hasClass("modal-form");

            $.ajax({
                type: 'POST',
                url: url,
                data: data,
                beforeSend: function () {
                    if (isModal == false)
                        $.block();
                },
                complete: function () {
                    $.unblock();
                },
                success: function (ret, status) {
                    $.unblock();
                    if (a.data("redirect"))
                        window.location = ret;
                    else if (isModal == true) {
                        $form.html(ret).ready(function () {
                            $.resizeModalBackDrop();
                            $.AttachFormElements();
                            if (a.data("callback"))
                                $.InitFunctions[a.data("callback")]();
                        });
                    } else {
                        var results = $($form.data("results") || $form);
                        results.replaceWith(ret).ready(function () {
                            $.AttachFormElements();
                            if ($form.data("init"))
                                $.InitFunctions[$form.data("init")]();
                            if ($form.data("init2")) {
                                $.InitFunctions[$form.data("init2")]();
                            }
                            if (a.data("callback"))
                                $.InitFunctions[a.data("callback")]();
                        });
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    $.unblock();
                    swal("Error!", thrownError, "error");
                }
            });
        }
        return false;
    };

    $.resizeModalBackDrop = function () {
        // resize modal backdrop height.
        var dialog = $('.modal-dialog');
        var backdrop = $('.modal-backdrop');
        var height = dialog.innerHeight();

        $(backdrop).css({
            height: height + 60,
            minHeight: '100%',
            margin: 'auto'
        });
    };

    $.validator.addMethod("unallowedcode", function (value, element, params) {
        return value !== params.code;
    }, "required, select item");

    if (!$.InitFunctions)
        $.InitFunctions = {};
});
