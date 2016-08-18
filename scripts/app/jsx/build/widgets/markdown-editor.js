var MarkdownEditor = React.createClass({displayName: "MarkdownEditor",
    componentDidUpdate: function () {
        $('[data-toggle="tooltip"]').tooltip();
        this.refs.markdownContent.value = this.props.text;
        showdownPreview(this.refs.markdownContent.value, "markdownPreview");
    },
    handleEdit: function () {
        showdownPreview(this.refs.markdownContent.value, "markdownPreview");
    },
    handleScroll: function(event){
        $("#markdownPreview").scrollTop($("#markdownContent").scrollTop());
    },
    insertFontSize: function(){
        var markdownContent = $("#markdownContent").val();
        $("#markdownContent").val(markdownContent + "#1号标题#\r\n##2号标题##\r\n###3号标题###\r\n");
        showdownPreview(this.refs.markdownContent.value, "markdownPreview");
    },
    insertFontStrong: function(){
        var markdownContent = $("#markdownContent").val();
        $("#markdownContent").val(markdownContent + "**重点内容**\r\n");
        showdownPreview(this.refs.markdownContent.value, "markdownPreview");
    },
    insertFontItalic: function(){
        var markdownContent = $("#markdownContent").val();
        $("#markdownContent").val(markdownContent + "*强调内容*\r\n");
        showdownPreview(this.refs.markdownContent.value, "markdownPreview");
    },
    insertStrikeThrough : function(){
        var markdownContent = $("#markdownContent").val();
        $("#markdownContent").val(markdownContent + "~~删除内容~~\r\n");
        showdownPreview(this.refs.markdownContent.value, "markdownPreview");
    },
    insertBlokeQuote : function(){
        var markdownContent = $("#markdownContent").val();
        $("#markdownContent").val(markdownContent + ">引用内容\r\n");
        showdownPreview(this.refs.markdownContent.value, "markdownPreview");
    },
    insertPreCode : function(){
        var markdownContent = $("#markdownContent").val();
        $("#markdownContent").val(markdownContent + "```\r\n这里写代码片段\r\n```\r\n");
        showdownPreview(this.refs.markdownContent.value, "markdownPreview");
    },
    insertLink: function(){
        var markdownContent = $("#markdownContent").val();
        $("#markdownContent").val(markdownContent + "[显示内容](http://www.edo-network.com '标题')\r\n");
        showdownPreview(this.refs.markdownContent.value, "markdownPreview");
    },
    insertPicture: function(){
        $('#markdownPictureDialog').modal('show');
    },
    insertOLList: function(){
        var markdownContent = $("#markdownContent").val();
        $("#markdownContent").val(markdownContent + "1. 列表内容\r\n2. 列表内容\r\n");
        showdownPreview(this.refs.markdownContent.value, "markdownPreview");
    },
    insertULList: function(){
        var markdownContent = $("#markdownContent").val();
        $("#markdownContent").val(markdownContent + "- 列表内容\r\n- 列表内容\r\n");
        showdownPreview(this.refs.markdownContent.value, "markdownPreview");
    },
    insertHRLine: function(){
        var markdownContent = $("#markdownContent").val();
        $("#markdownContent").val(markdownContent + "---\r\n");
        showdownPreview(this.refs.markdownContent.value, "markdownPreview");
    },
    render: function () {
        return (
            React.createElement("div", {id: "markdownEditor"}, 
                React.createElement(MarkdownPictureDialog, null), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("nav", {className: "navbar navbar-default margin-bottom-0"}, 
                        React.createElement("div", {className: "navbar-collapse collapse"}, 
                            React.createElement("ul", {className: "nav navbar-nav"}, 
                                React.createElement("li", null, React.createElement("a", {href: "javascript:void(0)", title: "标题", "data-toggle": "tooltip", "data-placement": "top", onClick: this.insertFontSize}, React.createElement("i", {className: "fa fa-header fa-lg"}))), 
                                React.createElement("li", null, React.createElement("a", {href: "javascript:void(0)", title: "粗体", "data-toggle": "tooltip", "data-placement": "top", onClick: this.insertFontStrong}, React.createElement("i", {className: "fa fa-bold fa-lg"}))), 
                                React.createElement("li", null, React.createElement("a", {href: "javascript:void(0)", title: "斜体", "data-toggle": "tooltip", "data-placement": "top", onClick: this.insertFontItalic}, React.createElement("i", {className: "fa fa-italic fa-lg"}))), 
                                React.createElement("li", null, React.createElement("a", {href: "javascript:void(0)", title: "删除", "data-toggle": "tooltip", "data-placement": "top", onClick: this.insertStrikeThrough}, React.createElement("i", {className: "fa fa-strikethrough fa-lg"}))), 
                                React.createElement("li", null, React.createElement("a", {href: "javascript:void(0)", title: "引用区块", "data-toggle": "tooltip", "data-placement": "top", onClick: this.insertBlokeQuote}, React.createElement("i", {className: "fa fa-indent fa-lg"}))), 
                                React.createElement("li", null, React.createElement("a", {href: "javascript:void(0)", title: "代码片段", "data-toggle": "tooltip", "data-placement": "top", onClick: this.insertPreCode}, React.createElement("i", {className: "fa fa-code fa-lg"}))), 
                                React.createElement("li", null, React.createElement("a", {href: "javascript:void(0)", title: "链接", "data-toggle": "tooltip", "data-placement": "top", onClick: this.insertLink}, React.createElement("i", {className: "fa fa-link fa-lg"}))), 
                                React.createElement("li", null, React.createElement("a", {href: "javascript:void(0)", title: "图片", "data-toggle": "tooltip", "data-placement": "top", onClick: this.insertPicture}, React.createElement("i", {className: "fa fa-image fa-lg"}))), 
                                React.createElement("li", null, React.createElement("a", {href: "javascript:void(0)", title: "有序列表", "data-toggle": "tooltip", "data-placement": "top", onClick: this.insertOLList}, React.createElement("i", {className: "fa fa-list-ol fa-lg"}))), 
                                React.createElement("li", null, React.createElement("a", {href: "javascript:void(0)", title: "无序列表", "data-toggle": "tooltip", "data-placement": "top", onClick: this.insertULList}, React.createElement("i", {className: "fa fa-list-ul fa-lg"}))), 
                                React.createElement("li", null, React.createElement("a", {href: "javascript:void(0)", title: "分割横线", "data-toggle": "tooltip", "data-placement": "top", onClick: this.insertHRLine}, React.createElement("i", {className: "fa fa-ellipsis-h fa-lg"})))
                            )
                        )
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-sm-6 padding-left-0 padding-right-0"}, 
                         React.createElement("textarea", {id: "markdownContent", ref: "markdownContent", 
                                          className: "form-control", 
                                          onChange: this.handleEdit, onScroll: this.handleScroll})
                    ), 
                    React.createElement("div", {id: "markdownPreview", className: "col-sm-6 markdownPreview"}

                    )
                )
            )
        );
    }
});


var MarkdownPictureDialog = React.createClass({displayName: "MarkdownPictureDialog",
    componentDidUpdate: function () {
        //文件上传前触发事件
        $('#uploadMarkdownPicture').bind('fileuploadsubmit', function (e, data) {
            data.formData = {
                'accessKey': SecurityClient.accessKey,
                'accessSecret': SecurityClient.accessSecret,
                'accessToken': sessionStorage.getItem(SessionKey.accessToken),
                'operatorID': sessionStorage.getItem(SessionKey.operatorID),
                'siteID': sessionStorage.getItem(SessionKey.siteID),
                'width': $("#inputMarkdownPictureWidth").val(),
                'height': $("#inputMarkdownPictureHeight").val(),
                'isCompress': $("#checkboxMarkdownPictureCompress").prop("checked")
            };  //如果需要额外添加参数可以在这里添加
        });

        // 上传内容图片列表
        $("#uploadMarkdownPicture").fileupload({
            url: SiteProperties.serverURL + API.uploadFile,
            dataType: 'json',
            autoUpload: true,
            acceptFileTypes: /(\.|\/)(jpe?g|png|gif|bmp)$/i,
            maxNumberOfFiles: 1,
            maxFileSize: 10000000,
            done: function (e, result) {
                var data = result.result;
                if (data.status == "200") {
                    $("#inputMarkdownPictureURL").val(data.data.url);
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

        $('#markdownPictureDialog').on('hide.bs.modal', function (e) {
            // 初始化
            $("#inputMarkdownPictureURL").val("");
            $("#inputMarkdownPictureWidth").val("");
            $("#inputMarkdownPictureHeight").val("");
            $("#checkboxMarkdownPictureCompress").attr("checked",false);
        })
    },
    handleConfirm: function () {
        var markdownContent = $("#markdownContent").val();
        $("#markdownContent").val(markdownContent + "![这里写图片描述](" + this.refs.inputMarkdownPictureURL.value + ")\r\n");
        showdownPreview($("#markdownContent").val(), "markdownPreview");

        $('#markdownPictureDialog').modal('toggle');
    },
    handleUploadFile: function () {
        var isCompress = $("#checkboxMarkdownPictureCompress").prop("checked");
        var message = Message.UPLOAD_UMCOMPRESS_CONFIRM;
        if(isCompress == true){
            message = Message.UPLOAD_COMPRESS_CONFIRM;
        }

        if(window.confirm(message)){
            openFileBrowse("uploadMarkdownPicture");
        }
    },
    handleClose: function () {
        $('#markdownPictureDialog').modal('toggle');
    },
    render: function () {
        return (
            React.createElement("div", {className: "modal fade", id: "markdownPictureDialog", tabindex: "-1", role: "dialog", "aria-labelledby": "dialogTitle"}, 
                React.createElement("div", {className: "modal-dialog", role: "document"}, 
                    React.createElement("div", {className: "modal-content"}, 
                        React.createElement("div", {className: "modal-header"}, 
                            React.createElement("button", {type: "button", className: "close", onClick: this.handleClose}, 
                                React.createElement("span", {"aria-hidden": "true"}, "×")
                            ), 
                            React.createElement("h4", {className: "modal-title", id: "dialogTitle"}, "插入图片")
                        ), 
                        React.createElement("div", {className: "modal-body"}, 
                            React.createElement("div", {className: "row form-group form-horizontal"}, 
                                React.createElement("div", {className: "col-xs-2 control-label"}, 
                                    React.createElement("label", null, "图片路径")
                                ), 
                                React.createElement("div", {className: "col-xs-10"}, 
                                    React.createElement("div", {className: "input-group"}, 
                                        React.createElement("input", {type: "text", id: "inputMarkdownPictureURL", className: "form-control", 
                                               ref: "inputMarkdownPictureURL", 
                                               "aria-describedby": "basic-addon3", placeholder: "输入或上传图片"}), 
                                        React.createElement("span", {className: "input-group-addon btn", id: "basic-addon3", 
                                              onClick: this.handleUploadFile}, 
                                            "上传"
                                        ), 
                                        React.createElement("input", {id: "uploadMarkdownPicture", type: "file", name: "file", className: "hidden", 
                                               accept: "image/gif,image/jpeg,image/x-ms-bmp,image/x-png,image/png"})
                                    )
                                )
                            ), 
                            React.createElement("div", {className: "row form-group"}, 
                                React.createElement("div", {className: "col-xs-2 control-label checkbox"}, 
                                    React.createElement("label", null, 
                                        React.createElement("input", {type: "checkbox", id: "checkboxMarkdownPictureCompress", ref: "checkboxMarkdownPictureCompress"}), 
                                        "压缩"
                                    )
                                ), 
                                React.createElement("div", {className: "col-xs-10 form-inline"}, 
                                    React.createElement("div", {className: "form-group"}, 
                                        React.createElement("input", {type: "number", id: "inputMarkdownPictureWidth", className: "form-control", 
                                               ref: "inputMarkdownPictureWidth", placeholder: "宽度"})
                                    ), 
                                    React.createElement("div", {className: "form-group"}, 
                                        "  ", React.createElement("i", {className: "fa fa-times form-group"}), "  ", 
                                        React.createElement("input", {type: "number", id: "inputMarkdownPictureHeight", className: "form-control", 
                                               ref: "inputMarkdownPictureHeight", placeholder: "高度"})
                                    )
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