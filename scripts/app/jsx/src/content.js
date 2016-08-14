/**
 * Created by Ethan on 16/5/20.
 */

var ContentActions = Reflux.createActions(['save', 'getContent', 'delete']);

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
        data.operatorID = sessionStorage.getItem(SessionKey.operatorID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);
        // 检查token是否过期
        if (data.accessToken == null || data.accessToken == "") {
            location.href = SiteProperties.clientURL + Page.login;
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
    onDelete: function (data) {
        var url = SiteProperties.serverURL + API.deleteContent;
        data.appID = SecurityClient.appID;
        data.secret = SecurityClient.secret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.operatorID = sessionStorage.getItem(SessionKey.operatorID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);
        data.contentID = sessionStorage.getItem(SessionKey.contentID);
        // 检查token是否过期
        if (data.accessToken == null || data.accessToken == "") {
            location.href = SiteProperties.clientURL + Page.login;
            return false;
        }

        var self = this;
        var callback = function (result) {
            if (result.status == 200) {
                sessionStorage.setItem(SessionKey.contentID, result.data.contentID);
                alert(Message.DELETE_SUCCESS);
                location.href = SiteProperties.clientURL + Page.contents;
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
        data.operatorID = sessionStorage.getItem(SessionKey.operatorID);
        // 检查token是否过期
        if (data.accessToken == null || data.accessToken == "") {
            location.href = SiteProperties.clientURL + Page.login;
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

var Content = React.createClass({
    mixins: [Reflux.connect(ContentStore, 'content')],
    getInitialState: function () {
        return {
            content: {}
        };
    },
    componentDidMount: function(){

        this.state.content.contentID = sessionStorage.getItem(SessionKey.contentID);
        if (this.state.content.contentID != null) {
            ContentActions.getContent(this.state.content);
        } else {
            this.state.content.contentType = sessionStorage.getItem(SessionKey.contentType);
        }
        //文件上传前触发事件
        $('#uploadContentImageTitle').bind('fileuploadsubmit', function (e, data) {
            data.formData = {
                'appID': SecurityClient.appID,
                'secret': SecurityClient.secret,
                'accessToken': sessionStorage.getItem(SessionKey.accessToken),
                'operatorID': sessionStorage.getItem(SessionKey.operatorID),
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
        $("#inputContentStatus").val(this.state.content.status);
        if(this.state.content.isSilent == 1){
            $("#checkboxIsSilent").attr("checked",true);
        } else{
            $("#checkboxIsSilent").attr("checked",false);
        }
        $("#inputStickyIndex").val(this.state.content.stickyIndex);
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
        this.state.content.stickyIndex = this.refs.inputStickyIndex.value;
        this.state.content.status = $("#inputContentStatus").val();
        var isSilent = $("#checkboxIsSilent").prop("checked");
        if(isSilent == true){
            this.state.content.isSilent = 1;
        } else {
            this.state.content.isSilent = 0;
        }
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
    handleDelete : function(){
        if(window.confirm(Message.DELETE_CONFIRM)) {
            ContentActions.delete(this.state.content);
        }
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
            <div>
                <Header/>

                <div id="main" className="container-fluid margin-top-60">
                    <SideBar activeMenuID="menuContentManage"/>
                    <div className="content-page">
                        <Breadcrumb page={Page.content}/>
                        <div className="panel panel-default">
                            <div className="panel-heading">内容信息</div>
                            <div className="panel-body">
                                <MessageBox/>
                                <PictureListDialog/>
                                <FileListDialog/>
                                <div className="row form-horizontal form-group">
                                    <div className="col-sm-6">
                                        <div className="col-sm-3 control-label">
                                            <label className="required">所属栏目</label>
                                        </div>
                                        <div className="col-sm-9">
                                            <ChannelTreeList/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="col-sm-3 control-label">
                                            <label className="required">内容类型</label>
                                        </div>
                                        <div className="col-sm-9">
                                            <ContentTypeList contentType={this.state.content.contentType} disabled="disabled" onChange={this.handleContentTypeChange}/>
                                        </div>
                                    </div>
                                </div>

                                <div className="row form-group form-horizontal">
                                    <div className="col-sm-6">
                                        <div className="col-sm-3 control-label">
                                            <label className="required">内容标题</label>
                                        </div>
                                        <div className="col-sm-9">
                                            <input type="text" className="form-control" ref="inputContentTitle"/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="col-sm-3 control-label">
                                            <label>内容副标题</label>
                                        </div>
                                        <div className="col-sm-9">
                                            <input type="text" className="form-control" ref="inputContentSubTitle"/>
                                        </div>
                                    </div>
                                </div>

                                <div className="row form-group form-horizontal">
                                    <div className="col-xs-6">
                                        <div className="col-xs-3 control-label">
                                            <label>摘要</label>
                                        </div>
                                        <div className="col-xs-9">
                                    <textarea id="inputContentSummary" cols="100" rows="6" ref="inputContentSummary"
                                              className="form-control"></textarea>
                                        </div>
                                    </div>
                                    <div className="col-xs-6">
                                        <div className="col-xs-3 control-label">
                                            <label>标题图</label>
                                        </div>
                                        <div className="col-xs-9">
                                            <button type="button" className="btn btn-info btn-block" onClick={this.uploadImageTitle}>
                                                上传标题图
                                            </button>
                                            <div id="divImageTitle" className="col-xs-9 padding-5">
                                                <input id="inputContentImageTitle" ref="inputContentImageTitle" type="hidden"/>
                                                <img id="imgContentImageTitle" className="width-100" src="../img/upload.png"/>
                                                <input id="uploadContentImageTitle" type="file" name="file" className="hidden"
                                                       accept="image/gif,image/jpeg,image/x-ms-bmp,image/x-png,image/png"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row form-group form-horizontal">
                                    <div className="col-xs-6">
                                        <div className="col-xs-3 control-label">
                                            <label>内容展示图</label>
                                        </div>
                                        <div className="col-xs-9">
                                            <button type="button" className="btn btn-info btn-block" onClick={this.handlePictureListDialog}>
                                                内容展示图管理
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-xs-6">
                                        <div className="col-xs-3 control-label">
                                            <label>内容附件</label>
                                        </div>
                                        <div className="col-xs-9">
                                            <button type="button" className="btn btn-info btn-block" onClick={this.handleFileListDialog}>
                                                内容附件管理
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="row form-group form-horizontal">
                                    <div className="col-sm-6">
                                        <div className="col-sm-3 control-label">
                                            <label>置顶级别</label>
                                        </div>
                                        <div className="col-sm-9">
                                            <input type="number" className="form-control" ref="inputStickyIndex"/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="col-sm-3 control-label">
                                            <label>状态</label>
                                        </div>
                                        <div className="col-sm-5">
                                            <ContentStatusList contentStatus={this.state.content.status}/>
                                        </div>
                                        <div className="col-sm-4 checkbox">
                                            <label>
                                                <input type="checkbox" id="checkboxIsSilent" ref="checkboxIsSilent"/>
                                                禁止评论
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div id="newsFields" style={{display:"none"}}>
                                    <div className="row form-group form-horizontal">
                                        <div className="col-sm-6">
                                            <div className="col-sm-3 control-label">
                                                <label>新闻作者</label>
                                            </div>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" ref="inputAuthor"/>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="col-sm-3 control-label">
                                                <label>新闻来源</label>
                                            </div>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" ref="inputSource"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row form-group form-horizontal">
                                        <div className="col-sm-6">
                                            <div className="col-sm-3 control-label">
                                                <label>新闻URL</label>
                                            </div>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" ref="inputSourceURL"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <MarkdownEditor text={this.state.content.contentBody}/>
                                </div>

                            </div>
                        </div>


                        <div className="text-right">
                            <button className="btn btn-primary" type="button" onClick={this.handleSave}>保&nbsp;存
                            </button>
                            &nbsp;
                            <button className="btn btn-danger" type="button" onClick={this.handleDelete}>删&nbsp;除</button>
                        </div>

                        <Footer/>
                </div>
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <Content />,
    document.getElementById('page')
);
