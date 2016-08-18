var PictureDialogActions = Reflux.createActions(['save', 'getPicture']);

var PictureDialogStore = Reflux.createStore({
    listenables: [PictureDialogActions],
    onSave: function (data) {
        var url = SiteProperties.serverURL + API.createPicture;
        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.operatorID = sessionStorage.getItem(SessionKey.operatorID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);
        data.contentID = sessionStorage.getItem(SessionKey.contentID);

        data.pictureID = sessionStorage.getItem(SessionKey.pictureID);
        if(data.pictureID != null){
            url = SiteProperties.serverURL + API.updatePicture;
        }

        // 检查token是否过期
        if (data.accessToken == null || data.accessToken == "") {
            location.href = SiteProperties.clientURL + Page.login;
            return false;
        }

        var self = this;
        var callback = function (result) {

            if (result.status == 200) {
                sessionStorage.removeItem(SessionKey.pictureID);
                PictureListDialogActions.getPictureList(data);
                $('#pictureDialog').modal('toggle');
            } else {
                console.log(result);
            }
        };

        ajaxPost(url, data, callback);
    },
    onGetPicture: function (data) {
        var url = SiteProperties.serverURL + API.getPicture;
        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.operatorID = sessionStorage.getItem(SessionKey.operatorID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);
        data.contentID = sessionStorage.getItem(SessionKey.contentID);
        data.pictureID = sessionStorage.getItem(SessionKey.pictureID);

        // 检查token是否过期
        if (data.accessToken == null || data.accessToken == "") {
            location.href = SiteProperties.clientURL + Page.login;
            return false;
        }

        var self = this;
        var callback = function (result) {
            //console.log(result.data);
            if (result.status == 200) {
                self.trigger(result.data);
            } else {
                console.log(result);
            }
        };

        ajaxPost(url, data, callback);
    }
});

var PictureDialog = React.createClass({displayName: "PictureDialog",
    getInitialState: function () {
        return {
            picture: {}
        };
    },

    componentDidUpdate: function () {
        //文件上传前触发事件
        $('#uploadPicture').bind('fileuploadsubmit', function (e, data) {
            data.formData = {
                'accessKey': SecurityClient.accessKey,
                'accessSecret': SecurityClient.accessSecret,
                'accessToken': sessionStorage.getItem(SessionKey.accessToken),
                'operatorID': sessionStorage.getItem(SessionKey.operatorID),
                'siteID': sessionStorage.getItem(SessionKey.siteID),
                'width': $("#inputPictureWidth").val(),
                'height': $("#inputPictureHeight").val(),
                'isCompress': $("#checkboxCompress").prop("checked")
            };  //如果需要额外添加参数可以在这里添加
        });

        // 上传内容图片列表
        $("#uploadPicture").fileupload({
            url: SiteProperties.serverURL + API.uploadFile,
            dataType: 'json',
            autoUpload: true,
            acceptFileTypes: /(\.|\/)(jpe?g|png|gif|bmp)$/i,
            maxNumberOfFiles: 1,
            maxFileSize: 10000000,
            done: function (e, result) {
                var data = result.result;
                if (data.status == "200") {
                    $("#inputPictureURL").val(data.data.url);
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

        $('#pictureDialog').on('hide.bs.modal', function (e) {
            // 初始化
            $("#inputPictureName").val("");
            $("#inputPictureURL").val("");
            $("#inputPictureWidth").val("");
            $("#inputPictureHeight").val("");
            $("#checkboxCompress").attr("checked",false);
            $("#inputPictureHref").val("");
            $("#inputDescription").val("");
        })
    },
    handleConfirm: function () {
        this.state.pictureName = this.refs.inputPictureName.value;
        this.state.pictureURL = this.refs.inputPictureURL.value;
        this.state.pictureHref = this.refs.inputPictureHref.value;
        this.state.pictureDescription = this.refs.inputDescription.value;
        PictureDialogActions.save(this.state);
    },
    handleUploadFile: function () {
        var isCompress = $("#checkboxCompress").prop("checked");
        var message = Message.UPLOAD_UMCOMPRESS_CONFIRM;
        if(isCompress == true){
            message = Message.UPLOAD_COMPRESS_CONFIRM;
        }

        if(window.confirm(message)){
            openFileBrowse("uploadPicture");
        }
    },
    handleClose: function () {
        $('#pictureDialog').modal('toggle');
    },
    render: function () {
        return (
            React.createElement("div", {className: "modal fade", id: "pictureDialog", tabindex: "-1", role: "dialog", "aria-labelledby": "dialogTitle"}, 
                React.createElement("div", {className: "modal-dialog", role: "document"}, 
                    React.createElement("div", {className: "modal-content"}, 
                        React.createElement("div", {className: "modal-header"}, 
                            React.createElement("button", {type: "button", className: "close", onClick: this.handleClose}, 
                                React.createElement("span", {"aria-hidden": "true"}, "×")
                            ), 
                            React.createElement("h4", {className: "modal-title", id: "dialogTitle"}, "内容图片")
                        ), 
                        React.createElement("div", {className: "modal-body"}, 
                            React.createElement("div", {className: "row form-group form-horizontal"}, 
                                React.createElement("div", {className: "col-xs-2 control-label"}, 
                                    React.createElement("label", null, "图片标题")
                                ), 
                                React.createElement("div", {className: "col-xs-10"}, 
                                    React.createElement("input", {id: "inputPictureName", type: "text", className: "form-control", ref: "inputPictureName", 
                                           placeholder: "请输入图片标题"})
                                )
                            ), 
                            React.createElement("div", {className: "row form-group form-horizontal"}, 
                                React.createElement("div", {className: "col-xs-2 control-label"}, 
                                    React.createElement("label", null, "图片路径")
                                ), 
                                React.createElement("div", {className: "col-xs-10"}, 
                                    React.createElement("div", {className: "input-group"}, 
                                        React.createElement("input", {type: "text", id: "inputPictureURL", className: "form-control", 
                                               ref: "inputPictureURL", 
                                               "aria-describedby": "basic-addon3", placeholder: "输入或上传图片"}), 
                                        React.createElement("span", {className: "input-group-addon btn", id: "basic-addon3", 
                                              onClick: this.handleUploadFile}, 
                                            "上传"
                                        ), 
                                        React.createElement("input", {id: "uploadPicture", type: "file", name: "file", className: "hidden", 
                                               accept: "image/gif,image/jpeg,image/x-ms-bmp,image/x-png,image/png"})
                                    )
                                )
                            ), 
                            React.createElement("div", {className: "row form-group"}, 
                                React.createElement("div", {className: "col-xs-2 control-label checkbox"}, 
                                    React.createElement("label", null, 
                                        React.createElement("input", {type: "checkbox", id: "checkboxCompress", ref: "checkboxCompress"}), 
                                        "压缩"
                                    )
                                ), 
                                React.createElement("div", {className: "col-xs-10 form-inline"}, 
                                    React.createElement("div", {className: "form-group"}, 
                                        React.createElement("input", {type: "number", id: "inputPictureWidth", className: "form-control", 
                                               ref: "inputPictureWidth", placeholder: "宽度"})
                                    ), 
                                    React.createElement("div", {className: "form-group"}, 
                                        "  ", React.createElement("i", {className: "fa fa-times form-group"}), "  ", 
                                        React.createElement("input", {type: "number", id: "inputPictureHeight", className: "form-control", 
                                               ref: "inputPictureHeight", placeholder: "高度"})
                                    )
                                )
                            ), 
                            React.createElement("div", {className: "row form-group form-horizontal"}, 
                                React.createElement("div", {className: "col-xs-2 control-label"}, 
                                    React.createElement("label", null, "跳转路径")
                                ), 
                                React.createElement("div", {className: "col-xs-10"}, 
                                    React.createElement("input", {type: "text", id: "inputPictureHref", className: "form-control", 
                                           ref: "inputPictureHref", placeholder: "点击图片后的跳转URL"})
                                )
                            ), 
                            React.createElement("div", {className: "row form-group form-horizontal"}, 
                                React.createElement("div", {className: "col-xs-2 control-label"}, 
                                    React.createElement("label", null, "图片描述")
                                ), 
                                React.createElement("div", {className: "col-xs-10"}, 
                                    React.createElement("textarea", {id: "inputDescription", className: "form-control", cols: "100", rows: "6", 
                                              ref: "inputDescription", placeholder: "请输入图片的描述"})
                                )
                            )
                        ), 
                        React.createElement("div", {className: "modal-footer"}, 
                            React.createElement("button", {type: "button", className: "btn btn-default", onClick: this.handleClose}, "取消"), 
                            React.createElement("button", {type: "button", className: "btn btn-primary", onClick: this.handleConfirm}, "确定")
                        )
                    )
                )
            )
        );
    }
});
