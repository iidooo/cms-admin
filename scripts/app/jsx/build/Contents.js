/**
 * Created by Ethan on 16/5/18.
 */

var ContentsActions = Reflux.createActions(['search']);

var ContentsStore = Reflux.createStore({
    listenables: [ContentsActions],
    onSearch: function (data) {
        var url = SiteProperties.serverURL + API.searchContents;
        data.appID = SecurityClient.appID;
        data.secret = SecurityClient.secret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.userID = sessionStorage.getItem(SessionKey.userID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);
        data.channelID = sessionStorage.getItem(SessionKey.channelID);

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

var Contents = React.createClass({displayName: "Contents",
    mixins: [Reflux.connect(ContentsStore, 'contentsData')],
    getInitialState: function () {
        return {
            contentsData: {
                page: {},
                contents: []
            }
        };
    },
    componentWillMount: function () {
        sessionStorage.removeItem(SessionKey.channelID);
        ContentsActions.search(this.state);
    },
    onChildChanged: function (childState) {
        if (childState.currentPage != null) {
            this.state.currentPage = childState.currentPage;

            ContentsActions.search(this.state);
        }
    },
    handleCreate: function (contentType) {
        sessionStorage.setItem(SessionKey.contentType, contentType);
        sessionStorage.removeItem(SessionKey.contentID);
        location.href = SiteProperties.clientURL + Page.content;
    },
    render: function () {
        return (
            React.createElement("div", null, 
                React.createElement(Header, {activeMenuID: "menuContentManage"}), 

                React.createElement("div", {id: "main", className: "container-fluid margin-top-70"}, 
                    React.createElement("div", {className: "col-sm-2 sidebar margin-top-20"}, 
                        React.createElement("div", {className: "title"}, 
                            React.createElement("h4", null, "栏目管理")
                        ), 
                        React.createElement(ChannelTree, null)
                    ), 
                    React.createElement("div", {className: "col-sm-offset-2"}, 
                        React.createElement("div", null, 
                            React.createElement("div", {className: "title pull-left"}, 
                                React.createElement("h4", null, "内容管理")
                            ), 
                            React.createElement("div", {className: "pull-right form-inline"}, 
                                React.createElement("div", {className: "btn-group"}, 
                                    React.createElement("a", {className: "btn btn-primary dropdown-toggle", "data-toggle": "dropdown"}, 
                                        React.createElement("span", null, "创建内容"), "  ", 
                                        React.createElement("i", {className: "fa fa-caret-down"})
                                    ), 
                                    React.createElement("ul", {className: "dropdown-menu"}, 
                                        React.createElement("li", null, React.createElement("a", {href: "javascript:void(0)", onClick: this.handleCreate.bind(null, ContentType.DEFAULT)}, React.createElement("i", {
                                            className: "fa fa-file-o"}), "  默认")), 
                                        React.createElement("li", null, React.createElement("a", {href: "javascript:void(0)", onClick: this.handleCreate.bind(null, ContentType.NEWS)}, React.createElement("i", {className: "fa fa-newspaper-o"}), " " + ' ' +
                                            "新闻")
                                        ), 
                                        React.createElement("li", null, React.createElement("a", {href: "javascript:void(0)", onClick: this.handleCreate.bind(null, ContentType.FILE)}, React.createElement("i", {className: "fa fa-download"}), "  文件")
                                        )
                                    )
                                ), 
                                React.createElement("div", {id: "searchForm", className: "input-group margin-left-5"}, 
                                    React.createElement("input", {type: "text", className: "form-control", placeholder: "请输入内容关键字"}), 
                                    React.createElement("span", {className: "input-group-btn"}, 
                                        React.createElement("a", {className: "btn btn-default"}, 
                                            React.createElement("i", {className: "fa fa-search"}), "搜索"
                                        )
                                    )
                                )
                            )
                        ), 
                        React.createElement("div", {className: "clearfix"}), 
                        React.createElement("div", {className: "spacer10"}), 
                        React.createElement(ContentsTable, {contents: this.state.contentsData.contents}), 

                        React.createElement(Pager, {callbackParent: this.onChildChanged, 
                               recordSum: this.state.contentsData.page.recordSum, 
                               currentPage: this.state.contentsData.page.currentPage, 
                               pageSum: this.state.contentsData.page.pageSum})
                    )
                )

            )
        );
    }
});

var ContentsTable = React.createClass({displayName: "ContentsTable",
    render: function () {
        return (
            React.createElement("table", {className: "table table-hover"}, 
                React.createElement("thead", null, 
                React.createElement("tr", null, 
                    React.createElement("th", null, "栏目"), 
                    React.createElement("th", {className: "width-400"}, "标题"), 
                    React.createElement("th", null, "类型"), 
                    React.createElement("th", null, "状态"), 
                    React.createElement("th", null, "发布者"), 
                    React.createElement("th", null, "发布时间"), 
                    React.createElement("th", null, "更新时间")
                )
                ), 
                React.createElement("tbody", null, 
                this.props.contents.map(function (item) {
                    return React.createElement(ContentsTableRow, {key: item.contentID, content: item})
                })
                )
            )
        );
    }
});

var ContentsTableRow = React.createClass({displayName: "ContentsTableRow",
    handleLink: function (contentID) {
        sessionStorage.setItem(SessionKey.contentID, contentID);
        location.href = SiteProperties.clientURL + Page.content;
    },
    render: function () {
        return (
            React.createElement("tr", {onClick: this.handleLink.bind(null, this.props.content.contentID)}, 
                React.createElement("td", null, this.props.content.channel.channelName), 
                React.createElement("td", null, React.createElement("a", {href: "javascript:void(0)", onClick: this.handleLink.bind(null, this.props.content.contentID)}, this.props.content.contentTitle)), 
                React.createElement("td", null, ContentTypeMap[this.props.content.contentType]), 
                React.createElement("td", null, ContentStatusMap[this.props.content.status]), 
                React.createElement("td", null, this.props.content.createUser.userName), 
                React.createElement("td", null, new Date(this.props.content.createTime).format('yyyy-MM-dd hh:mm:ss')), 
                React.createElement("td", null, new Date(this.props.content.updateTime).format('yyyy-MM-dd hh:mm:ss'))
            )
        );
    }
});

ReactDOM.render(
    React.createElement(Contents, null),
    document.getElementById('page')
);