/**
 * Created by Ethan on 16/5/20.
 */

var ContentActions = Reflux.createActions(['save', 'getContent']);

var ContentStore = Reflux.createStore({
    listenables: [ContentActions],
    onSave: function (data) {
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

var Content = React.createClass({
    mixins: [Reflux.connect(ContentStore, 'content')],
    getInitialState: function () {
        return {
            content: {
            }
        };
    },
    componentWillMount: function () {
        var pageMode = sessionStorage.getItem(SessionKey.pageMode);

        if (pageMode == PageMode.UPDATE) {
            this.state.content.contentID = sessionStorage.getItem(SessionKey.contentID);
            ContentActions.getContent(this.state.content);
        }
    },
    componentDidUpdate: function () {
        $("#inputChannelTree").val(this.state.content.channelID);
        $("#inputContentType").val(this.state.content.contentType);
        this.refs.inputContentTitle.value = this.state.content.contentTitle;
        this.refs.inputContentSubTitle.value = this.state.content.contentSubTitle;
        this.refs.inputAuthor.value = this.state.content.author;
        this.refs.inputSource.value = this.state.content.source;
        this.refs.inputSourceURL.value = this.state.content.sourceURL;
        this.refs.inputContentBody.value = this.state.content.contentBody;
        showdownPreview(this.state.content.contentBody, "txtContentBodyPreview");
    },
    handleContentBodyEdit: function () {
        showdownPreview(this.refs.inputContentBody.value, "txtContentBodyPreview");
    },
    handleSave: function () {
        this.state.content.channelID = $("#inputChannelTree").val();
        this.state.content.contentType = $("#inputContentType").val();
        this.state.content.contentTitle = this.refs.inputContentTitle.value;
        this.state.content.contentSubTitle = this.refs.inputContentSubTitle.value;
        this.state.content.author = this.refs.inputAuthor.value;
        this.state.content.source = this.refs.inputSource.value;
        this.state.content.sourceURL = this.refs.inputSourceURL.value;
        this.state.content.contentSummary = this.refs.inputContentBody.value.substring(0, 200);
        this.state.content.contentBody = this.refs.inputContentBody.value;

        if(this.state.content.channelID == "" || this.state.content.contentType == "" || this.state.content.title == ""){
            $("#messageBox").show().text(Message.INPUT_REQUIRED);
            return false;
        }

        ContentActions.save(this.state.content);
    },
    render: function () {
        return (
            <div>
                <Header activeMenuID="menuContentManage"/>

                <div id="main" className="container－fluid margin-top-70 margin-bottom-70">
                    <MessageBox/>
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
                                <ContentTypeList contentType={sessionStorage.getItem(SessionKey.contentType)} disabled="disabled"/>
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

                    <div id="newsFields">
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

                    <div className="row form-group form-horizontal">
                        <div className="col-sm-6">
                            <div className="col-sm-3 control-label">
                                <label>正文</label>
                            </div>
                            <div className="col-sm-9">

                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="col-sm-3 control-label">
                                <a href="http://iidooo-toxic-wave.oss-cn-shanghai.aliyuncs.com/resources/img/markdown-tips.jpg"
                                   target="_blank">编辑样式说明</a>
                            </div>
                        </div>
                    </div>

                    <div className="row form-group form-horizontal">
                        <div className="col-sm-6">
                            <div className="col-sm-3 control-label">

                            </div>
                            <div className="col-sm-9">
                                <textarea id="inputContentBody" ref="inputContentBody" cols="100" rows="25"
                                          className="form-control"
                                          onChange={this.handleContentBodyEdit}></textarea>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="col-sm-3 control-label">
                            </div>
                            <div id="txtContentBodyPreview" className="col-sm-9 markdownPreview">

                            </div>
                        </div>
                    </div>


                    <div className="text-center">
                        <button className="btn btn-primary" type="button" onClick={this.handleSave}>保&nbsp;存
                        </button>
                        &nbsp;
                        <button className="btn btn-danger" type="button">重&nbsp;置</button>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
});

ReactDOM.render(
    <Content />,
    document.getElementById('page')
);
