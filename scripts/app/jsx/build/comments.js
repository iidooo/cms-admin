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

var Comments = React.createClass({displayName: "Comments",
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
            React.createElement("div", null, 
                React.createElement(Header, null), 

                React.createElement("div", {id: "main", className: "container-fluid margin-top-60"}, 
                    React.createElement(SideBar, {activeMenuID: "menuCommentManage"}), 
                    React.createElement("div", {className: "content-page"}, 
                        React.createElement(Breadcrumb, {page: Page.comments}), 
                        React.createElement("div", {className: "panel panel-default"}, 
                            React.createElement("div", {className: "panel-heading"}, "查询条件"), 
                            React.createElement("div", {className: "panel-body"}, 
                                React.createElement("div", {className: "row form-group form-horizontal"}, 
                                    React.createElement("div", {className: "col-xs-4"}, 
                                        React.createElement("div", {className: "col-xs-4 control-label"}, 
                                            React.createElement("label", null, "评论关键字")
                                        ), 
                                        React.createElement("div", {className: "col-xs-8"}, 
                                            React.createElement("input", {type: "text", className: "form-control", ref: "inputComment"})
                                        )
                                    ), 
                                    React.createElement("div", {className: "col-xs-4"}, 
                                        React.createElement("div", {className: "col-xs-4 control-label"}, 
                                            React.createElement("label", null, "内容标题")
                                        ), 
                                        React.createElement("div", {className: "col-xs-8"}, 
                                            React.createElement("input", {type: "text", className: "form-control", ref: "inputContentTitle"})
                                        )
                                    ), 
                                    React.createElement("div", {className: "col-xs-4"}, 
                                        React.createElement("div", {className: "col-xs-4 control-label"}, 
                                            React.createElement("label", null, "创建者")
                                        ), 
                                        React.createElement("div", {className: "col-xs-8"}, 
                                            React.createElement("input", {type: "text", className: "form-control", ref: "inputCreateUser"})
                                        )
                                    )
                                ), 
                                React.createElement("div", {className: "text-right"}, 
                                    React.createElement("button", {type: "button", className: "btn btn-primary", onClick: this.handleSearch}, "查 询")
                                )
                            )
                        ), 

                        React.createElement(CommentsTable, {commentList: this.state.commentsData.commentList}), 

                        React.createElement(Pager, {callbackParent: this.onChildChanged, 
                               recordSum: this.state.commentsData.page.recordSum, 
                               currentPage: this.state.commentsData.page.currentPage, 
                               pageSum: this.state.commentsData.page.pageSum}), 

                        React.createElement(Footer, null)
                    )
                )

            )
        );
    }
});

var CommentsTable = React.createClass({displayName: "CommentsTable",
    render: function () {
        return (
            React.createElement("table", {className: "table table-hover"}, 
                React.createElement("thead", null, 
                React.createElement("tr", null, 
                    React.createElement("th", null, "作者"), 
                    React.createElement("th", null, "评论"), 
                    React.createElement("th", null, "内容标题"), 
                    React.createElement("th", null, "发布时间")
                )
                ), 
                React.createElement("tbody", null, 
                this.props.commentList.map(function (item) {
                    return React.createElement(CommentsTableRow, {key: item.commentID, comment: item})
                })
                )
            )
        );
    }
});

var CommentsTableRow = React.createClass({displayName: "CommentsTableRow",
    handleLink: function (commentID) {
        sessionStorage.setItem(SessionKey.commentID, commentID);
        location.href = SiteProperties.clientURL + Page.comment;
    },
    render: function () {
        return (
            React.createElement("tr", null, 
                React.createElement("td", {className: "col-sm-2"}, this.props.comment.createUser.userName), 
                React.createElement("td", {className: "col-sm-5"}, React.createElement("a", {href: "javascript:void(0)", onClick: this.handleLink.bind(null, this.props.comment.commentID)}, this.props.comment.comment)), 
                React.createElement("td", {className: "col-sm-3"}, this.props.comment.content.contentTitle), 
                React.createElement("td", {className: "col-sm-2"}, new Date(this.props.comment.createTime).format('yyyy-MM-dd hh:mm:ss'))
            )
        );
    }
});

ReactDOM.render(
    React.createElement(Comments, null),
    document.getElementById('page')
);