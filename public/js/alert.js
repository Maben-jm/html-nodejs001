(function ($) {
    $.wingsDialog = function (options) {
        // 参数赋值
        var opts = $.extend({}, $.wingsDialog.defaults, options);

        var popWindow = window;
        this.alert = function () {
            var title = '提示', msg = "";
            var numargs = arguments.length;
            if (numargs > 1) {
                title = arguments[0],
                    msg = arguments[1];
            } else if (numargs == 1) {
                msg = arguments[0];
            }
            popWindow.BootstrapDialog.show({
                title: title,
                message: msg,
                draggable: true,
                buttons: [{
                    icon: 'icon-ok',
                    cssClass: 'btn-sm btn-primary',
                    autospin: false,
                    label: '确定',
                    action: function (dialog) {
                        dialog.close();
                    }
                }]
            });
        };
        this.confirm = function () {

        };

        return this;
    };
    // 默认设置
    $.wingsDialog.defaults = {
        type: BootstrapDialog.TYPE_PRIMARY,
        size: BootstrapDialog.SIZE_NORMAL,
        cssClass: '',
        title: null,
        message: null,
        nl2br: true,
        closable: true,
        closeByBackdrop: true,
        closeByKeyboard: true,
        spinicon: BootstrapDialog.ICON_SPINNER,
        autodestroy: true,
        draggable: false,
        animate: true,
        description: '',
        tabindex: -1
    };
})(window.jQuery);

var WingsDialog = {
    data: null,
    currentModalDialog: null,
    forceTopHTML: '<iframe src="about:blank" width="100%" height="100%" frameBorder="0" marginHeight="0" marginWidth="0" style="position:absolute; visibility:inherit; top:0px;left:0px;right:0px;bottom:0px;z-index:-1; filter:alpha(opacity=0);"></iframe>',
    getData: function (key) {
        var d = null;
        if (this.data) {
            d = this.data[key];
        }
        return d;
    },
    setData: function (data) {
        this.data = data;
    },
    getModalDialog: function () {
        return this.currentModalDialog;
    },
    setModalDialog: function (dialog) {
        this.currentModalDialog = dialog
    },
    closeModalDialog: function () {
        if (this.currentModalDialog) {
            this.currentModalDialog.close();
        }
    },
    setLastHeight: function (height) {
        this.lastHeight = height;
    },
    setLastWidth: function (width) {
        this.lastWidth = width;
    },
    alert: function () {
        var title = '提示', msg = "", closeTime = null;
        var numargs = arguments.length;
        if (numargs > 1) {
            title = arguments[0],
                msg = arguments[1];
        } else if (numargs == 1) {
            msg = arguments[0];
        }
        var options = {};
        if (numargs == 3) {
            if (typeof (arguments[2]) == "object") {
                options = arguments[2];
            } else if (typeof (arguments[2]) == "string") {
                closeTime = arguments[2];
            }

        }
        if (!options.titleIconClass) {
            options.titleIconClass = "glyphicon glyphicon-info-sign";
        }
        if (!options.okBtnName) {
            options.okBtnName = "确定";
        }

        var popWindow = window;
        var dialog = new popWindow.BootstrapDialog({
            title: title,
            message: function () {
                var div = $("<div></div>");
                var picDiv = $("<div></div>").addClass("wings-alert-img");
                var messageDiv = $("<div>" + msg + "</div>").addClass("wings-alert-message");
                div.append(picDiv);
                div.append(messageDiv);
                return div;
            },
            draggable: true,
            size: this.SIZE_SMALL,
            onhidden: function (dialog) {
                dialog.getModal().prev('.modal-backdrop').find('iframe').remove();
                if (options.onhidden) {
                    options.onhidden();
                }
            },
            buttons: [{
                icon: 'icon-ok',
                cssClass: 'btn-sm btn-primary',
                autospin: false,
                label: options.okBtnName,
                action: function (dialog) {
                    dialog.close();
                }
            }]
        });

        var dialogWidth = 400; // firm width
        if (options.width) {
            dialogWidth = options.width;
        }
        var windowHeight = $(popWindow).height();
        var windowWidth = $(popWindow).width();
        dialog.onShown(function () {
            var $modalDialog = dialog.getModalDialog();
            dialog.getModal().prev('.modal-backdrop').append(WingsDialog.forceTopHTML);
            var dialogHeight = $modalDialog.height();
            $modalDialog.css({
                "position": "absolute",
                "left": "50%",
                "margin-left": -(dialogWidth / 2)
            });
        });

        dialog.onShow(function () {
            var lines = Math.ceil(msg.length / 25); //25 characters per line
            var paddingTop = (windowHeight - 260 - lines * 20) / 2;
            dialog.getModalDialog().css({
                'padding-top': paddingTop,
                'width': dialogWidth
            });
        });

        dialog.open();
        if (options.titleIconClass) {
            var header = dialog.getModalHeader();
            var titleIcon = $("<li></li>");
            titleIcon.addClass(options.titleIconClass).css({
                "vertical-align": "-10%",
                "font-size": "1.3333333333333333em",
                "padding-right": "8px"
            });
            header.find(".bootstrap-dialog-title ").prepend(titleIcon);
        }
        if (closeTime) {
            //有关闭时间
            setTimeout(function () {
                dialog.close();
            }, closeTime);
        }
    },
    alertWrong: function () {
        var title = '提示', msg = "";
        var numargs = arguments.length;
        if (numargs > 1) {
            title = arguments[0],
                msg = arguments[1];
        } else if (numargs == 1) {
            msg = arguments[0];
        }
        var options = {};
        if (numargs == 3) {
            options = arguments[2];
        }
        if (!options.titleIconClass) {
            options.titleIconClass = "glyphicon glyphicon-warning-sign";
        }

        this.alert(title, msg, options);

    },
    alertRight: function () {
        var title = '提示', msg = "";
        var numargs = arguments.length;
        if (numargs > 1) {
            title = arguments[0],
                msg = arguments[1];
        } else if (numargs == 1) {
            msg = arguments[0];
        }
        var options = {};
        if (numargs == 3) {
            options = arguments[2];
        }
        if (!options.titleIconClass) {
            options.titleIconClass = "glyphicon glyphicon-ok-sign";
        }
        this.alert(title, msg, options);
    },
    confirm: function () {
        var title = '提示', msg = "", callback;
        var numargs = arguments.length;
        title = arguments[0],
            msg = arguments[1];
        if (numargs >= 3) {
            callback = arguments[2];
        }
        var options = {};
        if (numargs == 4) {
            options = arguments[3];
        }
        var popWindow = window;
        var btnObjArr = [];
        btnObjArr.push({
            label: options && options.okBtnName ? options.okBtnName : '确定',
            cssClass: 'btn-sm btn-primary',
            action: function (dialog) {
                if (callback) {
                    callback(true);
                }
                dialog.close();
            }
        });
        //lei 追加单个的按钮的 提示窗口，提供页面阻断操作的提示框
        if (options && options.isNoCancel != 'true') {
            btnObjArr.push({
                label: options && options.cancelBtnName ? options.cancelBtnName : '取消',
                action: function (dialog) {
                    if (callback) {
                        callback(false);
                    }
                    dialog.close();
                }
            });
        }

        var dialog = new popWindow.BootstrapDialog({
            title: title,
            message: msg,
            draggable: true, // <-- Default value is false
            size: this.SIZE_SMALL,
            closable: false,
            buttons: btnObjArr,
            onhidden: function (dialog) {
                dialog.getModal().prev('.modal-backdrop').find('iframe').remove();
            }
        });


        var dialogWidth = 400; // firm width
        var windowHeight = $(popWindow).height();
        var windowWidth = $(popWindow).width();
        dialog.onShown(function () {
            dialog.getModal().prev('.modal-backdrop').append(WingsDialog.forceTopHTML);
            var $modalDialog = dialog.getModalDialog();
            var dialogHeight = $modalDialog.height();
            if (windowHeight < dialogHeight) {
                return;
            }
            $modalDialog.css({
                "position": "absolute",
                "left": "50%",
                "margin-left": -(dialogWidth / 2)
            });
        });

        dialog.onShow(function () {
            var lines = Math.ceil(msg.length / 25); //25 characters per line
            var paddingTop = (windowHeight - 260 - lines * 20) / 2;
            dialog.getModalDialog().css({
                'padding-top': paddingTop,
                'width': dialogWidth
            });
        });
        dialog.open();
    },
    show: function (options) {
        var popWindow = window;
        popWindow.BootstrapDialog.show(options);
    },
    showForm: function (options) {

    },
    prompt: function () {
        var title = arguments[0], msg = arguments[1], value = arguments[2], okCallback = arguments[3],
            cancelCallback = arguments[4];
        var popWindow = window;
        popWindow.BootstrapDialog.show({
            //size: BootstrapDialog.SIZE_SMALL,
            title: title,
            message: msg + '<input type="text" class="form-control" value="' + value + '">',
            draggable: true,
            buttons: [{
                icon: 'icon-ok',
                cssClass: 'btn-xs btn-primary',
                autospin: false,
                label: '确定',
                action: function (dialog) {
                    var val = dialog.getModalBody().find('input').val();
                    var returnV = okCallback(val);
                    if (returnV != false) {
                        dialog.close();
                    }
                }
            }, {
                icon: 'icon-ban-circle',
                cssClass: 'btn-xs btn-primary',
                autospin: false,
                label: '取消',
                action: function (dialog) {
                    if (cancelCallback) {
                        var val = dialog.getModalBody().find('input').val();
                        var returnV = cancelCallback(val);
                        if (returnV != false) {
                            dialog.close();
                        }
                    } else {
                        dialog.close();
                    }
                }
            }]
        });
    },
    /**
     * 模态对话框
     * 参数options 实例window.showModalDialog({
     * 	title:'标题'
     * 	url:'/sword?ctrl=xxxxxx
     *  buttons:[{label: '按钮1',action: handler,icon: 'icon-ban-circle',cssClass: 'btn-sm btn-primary'},
     *  {label: '按钮2',action: handler,icon: 'icon-ban-circle',cssClass: 'btn-sm btn-primary'}]
     * });
     *
     */
    showModalDialog: function (options) {
        options = $.extend({}, WingsDialog.defaultOptions, options);
        if (options.dialog && options.dialog.open) {
            options.dialog.open();
            return options.dialog;
        }
        var popWindow = window;
        var winH = $(popWindow).height() - 160;
        if (options.height) {
            winH = parseInt(options.height);
        }
        var data = {};
        if (options.param) {
            data = options.param;
        }
        var temp_frameId = "wingsDialog_iframe_" + Math.floor(Math.random() * 1000);//随机数
        var message = function (dialog) {
            var $message = $('<div></div>');
            $message = $('<iframe frameborder="0" name = "' + temp_frameId + '" ' + 'style="frameborder:no; border:0; width:100%;height:' + winH + 'px" src="' + options.url + '"></iframe>');
            return $message;
        };
        if (!options.width) {
            options.width = "800px"; //default width
        }
        var windowHeight = $(popWindow).height();
        var windowWidth = $(popWindow).width();
        var dialog = new popWindow.BootstrapDialog.show({
            size: options.size ? options.size : BootstrapDialog.SIZE_WIDE,
            title: options.title,
            draggable: true,
            message: message,
            closable: options.closable,
            cssClass: options.cssClass,
            data: data,
            animate: options.animate,
            autodestroy: options.reload ? false : true,//解决ie8下，焦点问题
            closeByBackdrop: options.closeByBackdrop,
            onshown: function (dialog) {
                console.log('------------------onshown--------------');
                dialog.getModal().prev('.modal-backdrop').append(WingsDialog.forceTopHTML);
                var maxBtn = $("<div></div>")
                var $modalDialog = dialog.getModalDialog();
                $modalDialog.css('width', options.width);
                var dialogWidth = $modalDialog.width();
                var dialogHeight = $modalDialog.height();
                $modalDialog.css({
                    "position": "absolute",
                    "left": "50%",
                    "top": "50%",
                    "margin-left": -(dialogWidth / 2),
                    "margin-top": -(dialogHeight / 2),
                    "margin-bottom": 0 //else scroll bar
                });
                if (options.onshown) {
                    var doc = dialog.getModalBody();
                    options.onshown(dialog, doc);
                }
            },
            onhidden: function (dialog) {
                console.log('------------------obhidden--------------');
                dialog.getModal().prev('.modal-backdrop').find('iframe').remove();
                if (options.onhidden) {
                    var doc = dialog.getModalBody();
                    if (!options.noiframe) {
                        doc = $(dialog.getModalBody().find('iframe').prop('contentWindow').document);
                    }
                    options.onhidden(dialog, doc);
                }
            }
        });
        this.setModalDialog(dialog);
    },

    currentDialog: null,
    SIZE_NORMAL: BootstrapDialog.SIZE_NORMAL,
    SIZE_SMALL: BootstrapDialog.SIZE_SMALL,
    SIZE_WIDE: BootstrapDialog.SIZE_WIDE,
    SIZE_LARGE: BootstrapDialog.SIZE_LARGE,
    configDefaultOptions: function (options) {
        this.defaultOptions = $.extend(true, this.defaultOptions, options);
    },
    defaultOptions: {
        type: BootstrapDialog.TYPE_PRIMARY,
        size: BootstrapDialog.SIZE_WIDE,
        cssClass: '',
        title: null,
        message: null,
        nl2br: true,
        closable: true,
        closeByBackdrop: false,
        closeByKeyboard: true,
        spinicon: BootstrapDialog.ICON_SPINNER,
        autodestroy: true,
        draggable: false,
        animate: true,
        description: '',
        tabindex: -1,
        reload: true //重新加载时是否刷新
    }

} || BootstrapDialog