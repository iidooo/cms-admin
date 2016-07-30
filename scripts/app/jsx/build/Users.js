/**
 * Created by Ethan on 16/5/18.
 */

var UsersActions = Reflux.createActions(['search']);

var UsersStore = Reflux.createStore({
    listenables: [UsersActions],
    onSearch: function (data) {
        var url = SiteProperties.serverURL + API.searchContentList;
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

var Users = React.createClass({displayName: "Users",
    mixins: [Reflux.connect(UsersStore, 'usersData')],
    getInitialState: function () {
        return {
            usersData: {
                page: {},
                userList: []
            }
        };
    },
    componentWillMount: function () {

    },
    onChildChanged: function (childState) {
        if (childState.currentPage != null) {
            this.state.currentPage = childState.currentPage;

            UsersActions.search(this.state);
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
                React.createElement(Header, {activeMenuID: "menuSystemManage"}), 

                React.createElement("div", {id: "main", className: "container-fluid margin-top-70"}, 
                    React.createElement("div", {className: "col-sm-2 sidebar margin-top-20"}, 
                        React.createElement("div", {className: "list-group"}, 
                            React.createElement("a", {href: SiteProperties.clientURL + Page.account, className: "list-group-item active"}, 
                                "用户管理"
                            ), 
                            React.createElement("a", {href: SiteProperties.clientURL + Page.password, className: "list-group-item"}, "密码重设")
                        )
                    ), 
                    React.createElement("div", {className: "col-sm-offset-2"}, 
                        React.createElement("div", null, 
                            React.createElement("div", {className: "title pull-left"}, 
                                React.createElement("h4", null, "用户管理")
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
                        React.createElement(UsersTable, {userList: this.state.usersData.userList}), 

                        React.createElement(Pager, {callbackParent: this.onChildChanged, 
                               recordSum: this.state.usersData.page.recordSum, 
                               currentPage: this.state.usersData.page.currentPage, 
                               pageSum: this.state.usersData.page.pageSum})
                    )
                )

            )
        );
    }
});

var UsersTable = React.createClass({displayName: "UsersTable",
    render: function () {
        return (
            React.createElement("table", {className: "table table-hover"}, 
                React.createElement("thead", null, 
                React.createElement("tr", null, 
                    React.createElement("th", null, "用户ID"), 
                    React.createElement("th", null, "用户名"), 
                    React.createElement("th", null, "手机号"), 
                    React.createElement("th", null, "邮箱"), 
                    React.createElement("th", null, "微信号"), 
                    React.createElement("th", null, "角色"), 
                    React.createElement("th", null, "更新时间")
                )
                ), 
                React.createElement("tbody", null, 
                this.props.userList.map(function (item) {
                    return React.createElement(UsersTableRow, {key: item.userID, user: item})
                })
                )
            )
        );
    }
});

var UsersTableRow = React.createClass({displayName: "UsersTableRow",
    handleLink: function (contentID) {
        sessionStorage.setItem(SessionKey.contentID, contentID);
        location.href = SiteProperties.clientURL + Page.content;
    },
    render: function () {
        return (
            React.createElement("tr", {onClick: this.handleLink.bind(null, this.props.user.userID)}, 
                React.createElement("td", null, this.props.user.userName), 
                React.createElement("td", null, React.createElement("a", {href: "javascript:void(0)", onClick: this.handleLink.bind(null, this.props.user.userID)}, this.props.user.userName)), 
                React.createElement("td", null), 
                React.createElement("td", null), 
                React.createElement("td", null), 
                React.createElement("td", null), 
                React.createElement("td", null, new Date(this.props.user.updateTime).format('yyyy-MM-dd hh:mm:ss'))
            )
        );
    }
});

ReactDOM.render(
    React.createElement(Users, null),
    document.getElementById('page')
);