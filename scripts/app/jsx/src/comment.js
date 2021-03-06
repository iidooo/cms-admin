var CommentActions = Reflux.createActions(['save', 'getComment', 'delete']);

var CommentStore = Reflux.createStore({
    listenables: [CommentActions],
    onSave: function (data) {
        var url = SiteProperties.serverURL + API.updateComment;
        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.operatorID = sessionStorage.getItem(SessionKey.operatorID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);
        data.commentID = sessionStorage.getItem(SessionKey.commentID);
        // 检查token是否过期
        if (data.accessToken == null || data.accessToken == "") {
            location.href = SiteProperties.clientURL + Page.login;
            return false;
        }

        var self = this;
        var callback = function (result) {
            if (result.status == 200) {
                self.trigger(result.data);
                alert(Message.SAVE_SUCCESS);
            } else {
                console.log(result);
            }
        };

        ajaxPost(url, data, callback);
    },
    onDelete: function (data) {
        var url = SiteProperties.serverURL + API.deleteComment;
        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.operatorID = sessionStorage.getItem(SessionKey.operatorID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);
        data.commentID = sessionStorage.getItem(SessionKey.commentID);
        // 检查token是否过期
        if (data.accessToken == null || data.accessToken == "") {
            location.href = SiteProperties.clientURL + Page.login;
            return false;
        }

        var self = this;
        var callback = function (result) {
            if (result.status == 200) {
                alert(Message.DELETE_SUCCESS);
                location.href = SiteProperties.clientURL + Page.comments;
            } else {
                console.log(result);
            }
        };

        ajaxPost(url, data, callback);
    },
    onGetComment: function (data) {
        var url = SiteProperties.serverURL + API.getComment;
        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.operatorID = sessionStorage.getItem(SessionKey.operatorID);
        data.commentID = sessionStorage.getItem(SessionKey.commentID);
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

var Comment = React.createClass({
    mixins: [Reflux.connect(CommentStore, 'comment')],
    getInitialState: function () {
        return {
            comment: {}
        };
    },
    componentDidMount: function(){
        CommentActions.getComment(this.state.comment);
    },
    componentDidUpdate: function () {

        this.refs.inputCreateUser.value = this.state.comment.createUser.userName;
        this.refs.inputContentTitle.value = this.state.comment.content.contentTitle;
        this.refs.inputCreateTime.value = new Date(this.state.comment.createTime).format('yyyy-MM-dd hh:mm:ss');
        this.refs.inputComment.value = this.state.comment.comment;
    },
    handleSave: function () {
        this.state.comment.comment = this.refs.inputComment.value;

        CommentActions.save(this.state.comment);
    },
    handleDelete : function(){
        if(window.confirm(Message.DELETE_CONFIRM)) {
            CommentActions.delete(this.state.comment);
        }
    },
    render: function () {
        return (
            <div>
                <Header/>

                <div id="main" className="container-fluid margin-top-60">
                    <SideBar activeMenuID="menuCommentManage"/>
                    <div className="content-page">
                        <Breadcrumb page={Page.comment}/>
                        <div className="panel panel-default">
                            <div className="panel-heading">评论信息</div>
                            <div className="panel-body">
                                <MessageBox/>
                                <div className="form-group">
                                    <div className="control-label">
                                        <label>创建者</label>
                                    </div>
                                    <input id="inputCreateUser" ref="inputCreateUser" type="text" className="form-control" disabled="disabled"/>
                                </div>
                                <div className="form-group">
                                    <div className="control-label">
                                        <label>评论对象</label>
                                    </div>
                                    <input id="inputContentTitle" ref="inputContentTitle" type="text" className="form-control" disabled="disabled"/>
                                </div>
                                <div className="form-group">
                                    <div className="control-label">
                                        <label>评论时间</label>
                                    </div>
                                    <input id="inputCreateTime" ref="inputCreateTime" type="text" className="form-control" disabled="disabled"/>
                                </div>
                                <div className="form-group">
                                    <div className="control-label">
                                        <label>评论内容</label>
                                    </div>
                                    <textarea id="inputComment" ref="inputComment" rows="5" type="text" className="form-control"></textarea>
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
    <Comment />,
    document.getElementById('page')
);
