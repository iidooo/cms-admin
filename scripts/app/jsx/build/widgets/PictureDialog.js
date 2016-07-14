var PictureDialogActions = Reflux.createActions(['upload']);

var PictureDialogStore = Reflux.createStore({
    listenables: [PictureDialogActions],
    onUpload: function (data) {
        var pageMode = sessionStorage.getItem(SessionKey.pageMode);
        var url = SiteProperties.serverURL + API.createContent;

        if (pageMode == PageMode.UPDATE) {
            url = SiteProperties.serverURL + API.updateContent;
        }

        data.appID = SecurityClient.appID;
        data.secret = SecurityClient.secret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.userID = sessionStorage.getItem(SessionKey.userID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);
        // 检查token是否过期
        if (data.accessToken == null || data.accessToken == "" || data.userID == null || data.userID == "") {
            location.href = Page.login;
            return false;
        }

        var self = this;
        var callback = function (result) {
            if (result.status == 200) {
                alert("保存成功!");
                location.href = SiteProperties.clientURL + Page.contents;
            } else {
                console.log(result);
            }
        };

        ajaxPost(url, data, callback);
    },
});

var PictureDialog = React.createClass({displayName: "PictureDialog",
    getInitialState: function () {
        return {
            pictureName: "",
            pictureURL: ""
        };
    },

    componentDidUpdate: function () {
        //文件上传前触发事件
        $('#inputPictureUpload').bind('fileuploadsubmit', function (e, data) {
            data.formData = {
                'appID': SecurityClient.appID,
                'secret': SecurityClient.secret,
                'accessToken': sessionStorage.getItem(SessionKey.accessToken),
                'userID': sessionStorage.getItem(SessionKey.userID),
                'siteID': sessionStorage.getItem(SessionKey.siteID),
                'width': $("#inputUploadWidth").val(),
                'height': $("#inputUploadHeight").val(),
                'isCompress': $("#checkboxCompress").prop("checked")
            };  //如果需要额外添加参数可以在这里添加
        });

        // 上传内容图片列表
        $("#inputPictureUpload").fileupload({
            url: SiteProperties.serverURL + API.uploadFile,
            dataType: 'json',
            autoUpload: true,
            acceptFileTypes: /(\.|\/)(jpe?g|png|gif|bmp)$/i,
            maxNumberOfFiles: 1,
            maxFileSize: 10000000,
            done: function (e, result) {
                var data = result.result;
                if (data.status == "200") {
                    $("#inputUploadPictureURL").val(data.data.url);
                    $("#uploadPicturePreview").attr("src", data.data.url);
                } else {
                    console.log(data);
                }
            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10) + "%";

                console.log(progress);
            },
            error: function (e, data) {
                console.log(data);
            },
            fail: function (e, data) {
                console.log(data);
            }
        });
        $('#pictureDialog').on('hidden.bs.modal', function (e) {
            // 初始化
            this.refs.inputOnlinePictureName.value = "";
            this.refs.inputOnlinePictureURL.value = "";
            this.refs.inputUploadPictureName.value = "";
            this.refs.inputUploadPictureURL.value = "";
            this.refs.inputUploadWidth.value = "";
            this.refs.inputUploadHeight.value = "";
            this.refs.checkboxCompress.checked = false;
            $("#divSizeArea").addClass("hidden");
            $("#uploadPicturePreview").attr("src", "../img/upload.png");
        })
    },

    handleConfirm: function () {
        var $activeTab = $(".tab-content .active");
        var activeTabID = $activeTab.attr("id");

        if (activeTabID == "online") {
            this.state.pictureName = this.refs.inputOnlinePictureName.value;
            this.state.pictureURL = this.refs.inputOnlinePictureURL.value;
        } else {
            this.state.pictureName = this.refs.inputUploadPictureName.value;
            this.state.pictureURL = this.refs.inputUploadPictureURL.value;
        }

        $('#pictureDialog').modal('toggle');
        this.props.callbackParent(this.state);
    },
    handleCheckboxCompress: function () {
        if (this.refs.checkboxCompress.checked == true) {
            $("#divSizeArea").removeClass("hidden");
        } else {
            $("#divSizeArea").addClass("hidden");
        }
    },
    handleUploadFile: function () {
        openFileBrowse("inputPictureUpload");
    },
    render: function () {
        return (
            React.createElement("div", {className: "modal fade", id: "pictureDialog", tabindex: "-1", role: "dialog", "aria-labelledby": "dialogTitle"}, 
                React.createElement("div", {className: "modal-dialog", role: "document"}, 
                    React.createElement("div", {className: "modal-content"}, 
                        React.createElement("div", {className: "modal-header"}, 
                            React.createElement("button", {type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close"}, React.createElement("span", {
                                "aria-hidden": "true"}, "×")), 
                            React.createElement("h4", {className: "modal-title", id: "dialogTitle"}, "插入图片")
                        ), 
                        React.createElement("div", {className: "modal-body"}, 
                            React.createElement("ul", {className: "nav nav-tabs", role: "tablist"}, 
                                React.createElement("li", {role: "presentation", className: "active"}, React.createElement("a", {href: "#online", "data-toggle": "tab", 
                                                                              "aria-expanded": "true"}, "在线图片")), 
                                React.createElement("li", {role: "presentation"}, React.createElement("a", {href: "#upload", "data-toggle": "tab", 
                                                           "aria-expanded": "true"}, "上传图片"))
                            ), 
                            React.createElement("div", {className: "tab-content"}, 
                                React.createElement("div", {role: "tabpanel", className: "tab-pane active", id: "online"}, 
                                    React.createElement("p", {className: "text-muted"}, "图片标题会作为图片提示，有助于搜索引擎准确抓取"), 

                                    React.createElement("div", {className: "input-group"}, 
                                        React.createElement("span", {className: "input-group-addon", id: "basic-addon1"}, 
                                            React.createElement("i", {className: "fa fa-font"})
                                        ), 
                                        React.createElement("input", {type: "text", className: "form-control", ref: "inputOnlinePictureName", 
                                               placeholder: "请输入图片标题", "aria-describedby": "basic-addon1"})
                                    ), 
                                    React.createElement("br", null), 

                                    React.createElement("div", {className: "input-group"}, 
                                        React.createElement("span", {className: "input-group-addon", id: "basic-addon2"}, 
                                            React.createElement("i", {className: "fa fa-link"})
                                        ), 
                                        React.createElement("input", {type: "text", className: "form-control", ref: "inputOnlinePictureURL", 
                                               placeholder: "请输入图片路径", "aria-describedby": "basic-addon2"})
                                    )
                                ), 
                                React.createElement("div", {role: "tabpanel", className: "tab-pane", id: "upload"}, 
                                    React.createElement("p", {className: "text-muted"}, "图片标题会作为图片提示，有助于搜索引擎准确抓取"), 

                                    React.createElement("div", {className: "input-group"}, 
                                        React.createElement("span", {className: "input-group-addon", id: "basic-addon1"}, 
                                            React.createElement("i", {className: "fa fa-font"})
                                        ), 
                                        React.createElement("input", {type: "text", className: "form-control", ref: "inputUploadPictureName", 
                                               placeholder: "请输入图片标题", "aria-describedby": "basic-addon1"})
                                    ), 
                                    React.createElement("br", null), 

                                    React.createElement("div", {className: "input-group"}, 
                                        React.createElement("span", {className: "input-group-addon", id: "basic-addon3"}, 
                                            React.createElement("i", {className: "fa fa-photo"})
                                        ), 
                                        React.createElement("input", {type: "text", id: "inputUploadPictureURL", className: "form-control", 
                                               ref: "inputUploadPictureURL", 
                                               "aria-describedby": "basic-addon3", readonly: true}), 
                                        React.createElement("span", {className: "input-group-addon btn", id: "basic-addon3", 
                                              onClick: this.handleUploadFile}, 
                                            "上传"
                                        ), 
                                        React.createElement("input", {id: "inputPictureUpload", type: "file", name: "file", className: "hidden", 
                                               accept: "image/gif,image/jpeg,image/x-ms-bmp,image/x-png,image/png"})
                                    ), 
                                    React.createElement("div", {className: "form-group"}, 
                                        React.createElement("div", {className: "checkbox"}, 
                                            React.createElement("label", null, 
                                                React.createElement("input", {type: "checkbox", id: "checkboxCompress", ref: "checkboxCompress", 
                                                       onClick: this.handleCheckboxCompress}), 
                                                "压缩尺寸"
                                            )
                                        )
                                    ), 
                                    React.createElement("div", {id: "divSizeArea", className: "form-group form-inline hidden"}, 
                                        React.createElement("div", {className: "input-group"}, 
                                                React.createElement("span", {className: "input-group-addon", id: "basic-addon-width"}, 
                                                    React.createElement("i", {className: "fa fa-text-width"})
                                                ), 
                                            React.createElement("input", {type: "number", id: "inputUploadWidth", className: "form-control", 
                                                   ref: "inputUploadWidth", 
                                                   "aria-describedby": "basic-addon-width"})
                                        ), 
                                        "  ", React.createElement("i", {className: "fa fa-times"}), "  ", 
                                        React.createElement("div", {className: "input-group"}, 
                                                React.createElement("span", {className: "input-group-addon", id: "basic-addon-height"}, 
                                                    React.createElement("i", {className: "fa fa-text-height"})
                                                ), 
                                            React.createElement("input", {type: "number", id: "inputUploadHeight", className: "form-control", 
                                                   ref: "inputUploadHeight", 
                                                   "aria-describedby": "basic-addon-height"})
                                        )
                                    ), 

                                    React.createElement("p", {className: "text-muted"}, "1、图片大小不能超过2M"), 

                                    React.createElement("p", {className: "text-muted"}, "2、支持格式：.jpg .gif .png .bmp"), 

                                    React.createElement("div", {className: "text-center"}, 
                                        React.createElement("img", {id: "uploadPicturePreview", className: "width-200", src: "../img/upload.png"})
                                    )
                                )
                            )

                        ), 
                        React.createElement("div", {className: "modal-footer"}, 
                            React.createElement("button", {type: "button", className: "btn btn-default", "data-dismiss": "modal"}, "取消"), 
                            React.createElement("button", {type: "button", className: "btn btn-primary", onClick: this.handleConfirm}, "确定")
                        )
                    )
                )
            )
        );
    }
});
