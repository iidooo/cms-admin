/**
 * Created by Ethan on 16/5/20.
 */

var ContentActions = Reflux.createActions(['save', 'getContent']);

var ContentStore = Reflux.createStore({
    listenables: [ContentActions],
    onSave: function (data) {
        var url = SiteProperties.serverURL + API.createContent;

        data.contentID = sessionStorage.getItem(SessionKey.contentID);
        if (data.contentID != null) {
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
                sessionStorage.setItem(SessionKey.contentID, result.data.contentID);
                alert(Message.SAVE_SUCCESS);
                self.trigger(result.data);
            } else {
                console.log(result);
            }
        };

        ajaxPost(url, data, callback);
    },
    onGetContent: function (data) {
        var url = SiteProperties.serverURL + API.getContent;
        data.appID = SecurityClient.appID;
        data.secret = SecurityClient.secret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.userID = sessionStorage.getItem(SessionKey.userID);
        // 检查token是否过期
        if (data.accessToken == null || data.accessToken == "" || data.userID == null || data.userID == "") {
            location.href = Page.login;
            return false;
        }

        var self = this;
        var callback = function (result) {
            if (result.status == 200) {
                self.trigger(result.data);
            } else {
                console.log(result);
            }
        };

        ajaxPost(url, data, callback);
    },
});

var Content = React.createClass({displayName: "Content",
    mixins: [Reflux.connect(ContentStore, 'content')],
    getInitialState: function () {
        return {
            content: {}
        };
    },
    componentWillMount: function () {
        this.state.content.contentID = sessionStorage.getItem(SessionKey.contentID);
        if (this.state.content.contentID != null) {
            ContentActions.getContent(this.state.content);
        } else {
            this.state.content.contentType = sessionStorage.getItem(SessionKey.contentType);
        }
    },
    componentDidMount: function(){
        //文件上传前触发事件
        $('#uploadContentImageTitle').bind('fileuploadsubmit', function (e, data) {
            data.formData = {
                'appID': SecurityClient.appID,
                'secret': SecurityClient.secret,
                'accessToken': sessionStorage.getItem(SessionKey.accessToken),
                'userID': sessionStorage.getItem(SessionKey.userID),
                'siteID': sessionStorage.getItem(SessionKey.siteID),
                'width': '200',
                'height': '200',
                'isCompress': 'true'
            };  //如果需要额外添加参数可以在这里添加
        });

        // 上传内容图片列表
        $("#uploadContentImageTitle").fileupload({
            url: SiteProperties.serverURL + API.uploadFile,
            dataType: 'json',
            autoUpload: true,
            acceptFileTypes: /(\.|\/)(jpe?g|png|gif|bmp)$/i,
            maxNumberOfFiles: 1,
            maxFileSize: 10000000,
            done: function (e, result) {
                var data = result.result;
                if (data.status == "200") {
                    $("#imgContentImageTitle").attr("src", data.data.url);
                    $("#inputContentImageTitle").val(data.data.url);
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
    },
    componentDidUpdate: function () {

        if (this.state.content.contentType == ContentType.NEWS) {
            $("#newsFields").show();
        }

        $("#inputChannelTree").val(this.state.content.channelID);
        $("#inputContentType").val(this.state.content.contentType);
        this.refs.inputContentTitle.value = this.state.content.contentTitle;
        this.refs.inputContentSubTitle.value = this.state.content.contentSubTitle;

        if(this.state.content.contentImageTitle != "") {
            this.refs.inputContentImageTitle.value = this.state.content.contentImageTitle;
            $("#imgContentImageTitle").attr("src", this.state.content.contentImageTitle);
        }

        this.refs.inputAuthor.value = this.state.content.author;
        this.refs.inputSource.value = this.state.content.source;
        this.refs.inputSourceURL.value = this.state.content.sourceURL;
        this.refs.inputContentSummary.value = this.state.content.contentSummary;
    },
    handleSave: function () {
        this.state.content.channelID = $("#inputChannelTree").val();
        this.state.content.contentType = $("#inputContentType").val();
        this.state.content.contentTitle = this.refs.inputContentTitle.value;
        this.state.content.contentSubTitle = this.refs.inputContentSubTitle.value;
        this.state.content.contentImageTitle = this.refs.inputContentImageTitle.value;
        this.state.content.author = this.refs.inputAuthor.value;
        this.state.content.source = this.refs.inputSource.value;
        this.state.content.sourceURL = this.refs.inputSourceURL.value;
        this.state.content.contentSummary = this.refs.inputContentSummary.value;
        this.state.content.contentBody = $("#markdownContent").val();

        if (this.state.content.channelID == "" || this.state.content.contentType == "" || this.state.content.contentTitle == "") {
            $("#messageBox").show().text(Message.INPUT_REQUIRED);
            return false;
        }

        ContentActions.save(this.state.content);
    },
    uploadImageTitle: function () {
        openFileBrowse("uploadContentImageTitle");
    },
    handleFileListDialog: function () {
        var contentID = sessionStorage.getItem(SessionKey.contentID);
        if(contentID == null){
            $("#messageBox").show().text(Message.SAVE_FIRST);
            return;
        }
        $('#fileListDialog').modal('show');
    },
    handlePictureListDialog: function () {
        var contentID = sessionStorage.getItem(SessionKey.contentID);
        if(contentID == null){
            $("#messageBox").show().text(Message.SAVE_FIRST);
            return;
        }
        $("#pictureListDialog").modal('show');
    },
    handleContentTypeChange : function(){
        var contentType = $("#inputContentType").val();
        if (contentType == ContentType.NEWS) {
            $("#newsFields").show();
        }
    },
    render: function () {
        return (
            React.createElement("div", null, 
                React.createElement(Header, {activeMenuID: "menuContentManage"}), 

                React.createElement("div", {id: "main", className: "container margin-top-70"}, 
                    React.createElement(MessageBox, null), 
                    React.createElement(PictureListDialog, null), 
                    React.createElement(FileListDialog, null), 
                    React.createElement("div", {className: "row"}, 
                        React.createElement("ol", {className: "breadcrumb"}, 
                            React.createElement("li", null, React.createElement("a", {href: SiteProperties.clientURL + Page.contents}, "内容一览")), 
                            React.createElement("li", {className: "active"}, "内容维护")
                        )
                    ), 
                    React.createElement("div", {className: "row form-horizontal form-group"}, 
                        React.createElement("div", {className: "col-sm-6"}, 
                            React.createElement("div", {className: "col-sm-3 control-label"}, 
                                React.createElement("label", {className: "required"}, "所属栏目")
                            ), 
                            React.createElement("div", {className: "col-sm-9"}, 
                                React.createElement(ChannelTreeList, null)
                            )
                        ), 
                        React.createElement("div", {className: "col-sm-6"}, 
                            React.createElement("div", {className: "col-sm-3 control-label"}, 
                                React.createElement("label", {className: "required"}, "内容类型")
                            ), 
                            React.createElement("div", {className: "col-sm-9"}, 
                                React.createElement(ContentTypeList, {contentType: this.state.content.contentType, disabled: "disabled", onChange: this.handleContentTypeChange})
                            )
                        )
                    ), 

                    React.createElement("div", {className: "row form-group form-horizontal"}, 
                        React.createElement("div", {className: "col-sm-6"}, 
                            React.createElement("div", {className: "col-sm-3 control-label"}, 
                                React.createElement("label", {className: "required"}, "内容标题")
                            ), 
                            React.createElement("div", {className: "col-sm-9"}, 
                                React.createElement("input", {type: "text", className: "form-control", ref: "inputContentTitle"})
                            )
                        ), 
                        React.createElement("div", {className: "col-sm-6"}, 
                            React.createElement("div", {className: "col-sm-3 control-label"}, 
                                React.createElement("label", null, "内容副标题")
                            ), 
                            React.createElement("div", {className: "col-sm-9"}, 
                                React.createElement("input", {type: "text", className: "form-control", ref: "inputContentSubTitle"})
                            )
                        )
                    ), 

                    React.createElement("div", {className: "row form-group form-horizontal"}, 
                        React.createElement("div", {className: "col-xs-6"}, 
                            React.createElement("div", {className: "col-xs-3 control-label"}, 
                                React.createElement("label", null, "摘要")
                            ), 
                            React.createElement("div", {className: "col-xs-9"}, 
                                React.createElement("textarea", {id: "inputContentSummary", cols: "100", rows: "6", ref: "inputContentSummary", 
                                          className: "form-control"})
                            )
                        ), 
                        React.createElement("div", {className: "col-xs-6"}, 
                            React.createElement("div", {className: "col-xs-3 control-label"}, 
                                React.createElement("label", null, "标题图")
                            ), 
                            React.createElement("div", {className: "col-xs-9"}, 
                                React.createElement("button", {type: "button", className: "btn btn-info btn-block", onClick: this.uploadImageTitle}, 
                                    "上传标题图"
                                ), 
                                React.createElement("div", {id: "divImageTitle", className: "col-xs-9 padding-5"}, 
                                    React.createElement("input", {id: "inputContentImageTitle", ref: "inputContentImageTitle", type: "hidden"}), 
                                    React.createElement("img", {id: "imgContentImageTitle", className: "width-100", src: "../img/upload.png"}), 
                                    React.createElement("input", {id: "uploadContentImageTitle", type: "file", name: "file", className: "hidden", 
                                           accept: "image/gif,image/jpeg,image/x-ms-bmp,image/x-png,image/png"})
                                )
                            )
                        )
                    ), 

                    React.createElement("div", {className: "row form-group form-horizontal"}, 
                        React.createElement("div", {className: "col-xs-6"}, 
                            React.createElement("div", {className: "col-xs-3 control-label"}, 
                                React.createElement("label", null, "内容展示图")
                            ), 
                            React.createElement("div", {className: "col-xs-9"}, 
                                React.createElement("button", {type: "button", className: "btn btn-info btn-block", onClick: this.handlePictureListDialog}, 
                                    "内容展示图管理"
                                )
                            )
                        ), 
                        React.createElement("div", {className: "col-xs-6"}, 
                            React.createElement("div", {className: "col-xs-3 control-label"}, 
                                React.createElement("label", null, "内容附件")
                            ), 
                            React.createElement("div", {className: "col-xs-9"}, 
                                React.createElement("button", {type: "button", className: "btn btn-info btn-block", onClick: this.handleFileListDialog}, 
                                    "内容附件管理"
                                )
                            )
                        )
                    ), 

                    React.createElement("div", {id: "newsFields", style: {display:"none"}}, 
                        React.createElement("div", {className: "row form-group form-horizontal"}, 
                            React.createElement("div", {className: "col-sm-6"}, 
                                React.createElement("div", {className: "col-sm-3 control-label"}, 
                                    React.createElement("label", null, "新闻作者")
                                ), 
                                React.createElement("div", {className: "col-sm-9"}, 
                                    React.createElement("input", {type: "text", className: "form-control", ref: "inputAuthor"})
                                )
                            ), 
                            React.createElement("div", {className: "col-sm-6"}, 
                                React.createElement("div", {className: "col-sm-3 control-label"}, 
                                    React.createElement("label", null, "新闻来源")
                                ), 
                                React.createElement("div", {className: "col-sm-9"}, 
                                    React.createElement("input", {type: "text", className: "form-control", ref: "inputSource"})
                                )
                            )
                        ), 
                        React.createElement("div", {className: "row form-group form-horizontal"}, 
                            React.createElement("div", {className: "col-sm-6"}, 
                                React.createElement("div", {className: "col-sm-3 control-label"}, 
                                    React.createElement("label", null, "新闻URL")
                                ), 
                                React.createElement("div", {className: "col-sm-9"}, 
                                    React.createElement("input", {type: "text", className: "form-control", ref: "inputSourceURL"})
                                )
                            )
                        )
                    ), 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement(MarkdownEditor, {text: this.state.content.contentBody})
                    ), 

                    React.createElement("div", {className: "text-center"}, 
                        React.createElement("button", {className: "btn btn-primary", type: "button", onClick: this.handleSave}, "保 存"
                        ), 
                        " ", 
                        React.createElement("button", {className: "btn btn-danger", type: "button"}, "重 置")
                    )
                )
            )
        );
    }
});

ReactDOM.render(
    React.createElement(Content, null),
    document.getElementById('page')
);
