var CommentsActions = Reflux.createActions(['search']);

var CommentsStore = Reflux.createStore({
    listenables: [CommentsActions],
    onSearch: function (data) {
        var url = SiteProperties.serverURL + API.searchCommentList;
        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;
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

var Comments = React.createClass({
    mixins: [Reflux.connect(CommentsStore, 'commentsData')],
    getInitialState: function () {
        return {
            searchCondition:{},
            commentsData: {
                page: {},
                commentList: []
            }
        };
    },
    componentDidMount: function () {
        CommentsActions.search(this.state.searchCondition);
    },
    onChildChanged: function (childState) {
        if (childState.currentPage != null) {
            this.state.searchCondition.currentPage = childState.currentPage;

            CommentsActions.search(this.state.searchCondition);
        }
    },
    handleSearch: function () {
        this.state.searchCondition.comment = this.refs.inputComment.value;
        this.state.searchCondition.contentTitle = this.refs.inputContentTitle.value;
        this.state.searchCondition.createUserName = this.refs.inputCreateUser.value;
        CommentsActions.search(this.state.searchCondition);
    },
    render: function () {
        return (
            <div>
                <Header/>

                <div id="main" className="container-fluid margin-top-60">
                    <SideBar activeMenuID="menuCommentManage"/>
                    <div className="content-page">
                        <Breadcrumb page={Page.comments}/>
                        <div className="panel panel-default">
                            <div className="panel-heading">查询条件</div>
                            <div className="panel-body">
                                <div className="row form-group form-horizontal">
                                    <div className="col-xs-4">
                                        <div className="col-xs-4 control-label">
                                            <label>评论关键字</label>
                                        </div>
                                        <div className="col-xs-8">
                                            <input type="text" className="form-control" ref="inputComment"/>
                                        </div>
                                    </div>
                                    <div className="col-xs-4">
                                        <div className="col-xs-4 control-label">
                                            <label>内容标题</label>
                                        </div>
                                        <div className="col-xs-8">
                                            <input type="text" className="form-control" ref="inputContentTitle"/>
                                        </div>
                                    </div>
                                    <div className="col-xs-4">
                                        <div className="col-xs-4 control-label">
                                            <label>创建者</label>
                                        </div>
                                        <div className="col-xs-8">
                                            <input type="text" className="form-control" ref="inputCreateUser"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <button type="button" className="btn btn-primary" onClick={this.handleSearch}>查&nbsp;询</button>
                                </div>
                            </div>
                        </div>

                        <CommentsTable commentList={this.state.commentsData.commentList}/>

                        <Pager callbackParent={this.onChildChanged}
                               recordSum={this.state.commentsData.page.recordSum}
                               currentPage={this.state.commentsData.page.currentPage}
                               pageSum={this.state.commentsData.page.pageSum}/>

                        <Footer/>
                    </div>
                </div>

            </div>
        );
    }
});

var CommentsTable = React.createClass({
    render: function () {
        return (
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>作者</th>
                    <th>评论</th>
                    <th>内容标题</th>
                    <th>发布时间</th>
                </tr>
                </thead>
                <tbody>
                {this.props.commentList.map(function (item) {
                    return <CommentsTableRow key={item.commentID} comment={item}/>
                })}
                </tbody>
            </table>
        );
    }
});

var CommentsTableRow = React.createClass({
    handleLink: function (commentID) {
        sessionStorage.setItem(SessionKey.commentID, commentID);
        location.href = SiteProperties.clientURL + Page.comment;
    },
    render: function () {
        return (
            <tr>
                <td className="col-sm-2">{this.props.comment.createUser.userName}</td>
                <td className="col-sm-5"><a href="javascript:void(0)" onClick={this.handleLink.bind(null, this.props.comment.commentID)}>{this.props.comment.comment}</a></td>
                <td className="col-sm-3">{this.props.comment.content.contentTitle}</td>
                <td className="col-sm-2">{new Date(this.props.comment.createTime).format('yyyy-MM-dd hh:mm:ss')}</td>
            </tr>
        );
    }
});

ReactDOM.render(
    <Comments />,
    document.getElementById('page')
);