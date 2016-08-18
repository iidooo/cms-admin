var AdminsActions = Reflux.createActions(['searchSiteUserList']);

var AdminsStore = Reflux.createStore({
    listenables: [AdminsActions],
    onSearchSiteUserList: function (data) {
        var url = SiteProperties.serverURL + API.searchSiteUserList;
        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.operatorID = sessionStorage.getItem(SessionKey.operatorID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);
        data.roles = "[1,2]";

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

var Admins = React.createClass({displayName: "Admins",
    mixins: [Reflux.connect(AdminsStore, 'usersData')],
    getInitialState: function () {
        return {
            usersData: {
                page: {},
                userList: []
            }
        };
    },
    componentDidMount: function () {
        AdminsActions.searchSiteUserList(this.state);
    },
    onChildChanged: function (childState) {
        if (childState.currentPage != null) {
            this.state.currentPage = childState.currentPage;

            AdminsActions.searchSiteUserList(this.state);
        }
    },
    handleSearch: function(){
        this.state.loginID = this.refs.inputLoginID.value;
        this.state.userName = this.refs.inputUserName.value;
        this.state.sex = this.refs.inputSex.value;
        this.state.mobile = this.refs.inputMobile.value;
        this.state.email = this.refs.inputEmail.value;
        this.state.weixinID = this.refs.inputWeixinID.value;
        AdminsActions.searchSiteUserList(this.state);
    },
    render: function () {
        return (
            React.createElement("div", null, 
                React.createElement(Header, null), 

                React.createElement("div", {id: "main", className: "container-fluid margin-top-60"}, 
                    React.createElement(SideBar, {activeMenuID: "menuAdminsManage"}), 
                    React.createElement("div", {className: "content-page"}, 
                        React.createElement(Breadcrumb, {page: Page.admins}), 
                        React.createElement("div", {className: "panel panel-default"}, 
                            React.createElement("div", {className: "panel-heading"}, "查询条件"), 
                            React.createElement("div", {className: "panel-body"}, 
                                React.createElement("div", {className: "row form-group form-horizontal"}, 
                                    React.createElement("div", {className: "col-xs-4"}, 
                                        React.createElement("div", {className: "col-xs-4 control-label"}, 
                                            React.createElement("label", null, "用户ID")
                                        ), 
                                        React.createElement("div", {className: "col-xs-8"}, 
                                            React.createElement("input", {type: "text", className: "form-control", ref: "inputLoginID"})
                                        )
                                    ), 
                                    React.createElement("div", {className: "col-xs-4"}, 
                                        React.createElement("div", {className: "col-xs-4 control-label"}, 
                                            React.createElement("label", null, "用户名")
                                        ), 
                                        React.createElement("div", {className: "col-xs-8"}, 
                                            React.createElement("input", {type: "text", className: "form-control", ref: "inputUserName"})
                                        )
                                    ), 
                                    React.createElement("div", {className: "col-xs-4"}, 
                                        React.createElement("div", {className: "col-xs-4 control-label"}, 
                                            React.createElement("label", null, "用户性别")
                                        ), 
                                        React.createElement("div", {className: "col-xs-8"}, 
                                            React.createElement("select", {ref: "inputSex", className: "form-control"}, 
                                                React.createElement("option", {value: ""}, "全部"), 
                                                React.createElement("option", {value: "1"}, "男"), 
                                                React.createElement("option", {value: "2"}, "女")
                                            )
                                        )
                                    )
                                ), 
                                React.createElement("div", {className: "row form-group form-horizontal"}, 
                                    React.createElement("div", {className: "col-xs-4"}, 
                                        React.createElement("div", {className: "col-xs-4 control-label"}, 
                                            React.createElement("label", null, "手机号")
                                        ), 
                                        React.createElement("div", {className: "col-xs-8"}, 
                                            React.createElement("input", {type: "text", className: "form-control", ref: "inputMobile"})
                                        )
                                    ), 
                                    React.createElement("div", {className: "col-xs-4"}, 
                                        React.createElement("div", {className: "col-xs-4 control-label"}, 
                                            React.createElement("label", null, "Email")
                                        ), 
                                        React.createElement("div", {className: "col-xs-8"}, 
                                            React.createElement("input", {type: "text", className: "form-control", ref: "inputEmail"})
                                        )
                                    ), 
                                    React.createElement("div", {className: "col-xs-4"}, 
                                        React.createElement("div", {className: "col-xs-4 control-label"}, 
                                            React.createElement("label", null, "微信号")
                                        ), 
                                        React.createElement("div", {className: "col-xs-8"}, 
                                            React.createElement("input", {type: "text", className: "form-control", ref: "inputWeixinID"})
                                        )
                                    )
                                ), 

                                React.createElement("div", {className: "text-right"}, 
                                    React.createElement("button", {type: "button", className: "btn btn-primary", onClick: this.handleSearch}, "查 询")
                                )
                            )
                        ), 
                        React.createElement(UsersTable, {userList: this.state.usersData.userList}), 

                        React.createElement(Pager, {callbackParent: this.onChildChanged, 
                               recordSum: this.state.usersData.page.recordSum, 
                               currentPage: this.state.usersData.page.currentPage, 
                               pageSum: this.state.usersData.page.pageSum}), 

                        React.createElement(Footer, null)
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
                    React.createElement("th", null, "角色"), 
                    React.createElement("th", null, "用户ID"), 
                    React.createElement("th", null, "用户名"), 
                    React.createElement("th", null, "性别"), 
                    React.createElement("th", null, "手机号"), 
                    React.createElement("th", null, "邮箱"), 
                    React.createElement("th", null, "微信号"), 
                    React.createElement("th", null, "创建时间")
                )
                ), 
                React.createElement("tbody", null, 
                this.props.userList.map(function (item) {
                    return React.createElement(UsersTableRow, {key: item.userID, siteUser: item})
                })
                )
            )
        );
    }
});

var UsersTableRow = React.createClass({displayName: "UsersTableRow",
    handleLink: function (userID) {
        sessionStorage.setItem(SessionKey.userID, userID);
        location.href = SiteProperties.clientURL + Page.admin;
    },
    render: function () {
        return (
            React.createElement("tr", null, 
                React.createElement("td", null, SiteRole[this.props.siteUser.role]), 
                React.createElement("td", null, this.props.siteUser.user.loginID), 
                React.createElement("td", null, React.createElement("a", {href: "javascript:void(0)", onClick: this.handleLink.bind(null, this.props.siteUser.userID)}, this.props.siteUser.user.userName)), 
                React.createElement("td", null, SexMap[this.props.siteUser.user.sex]), 
                React.createElement("td", null, this.props.siteUser.user.mobile), 
                React.createElement("td", null, this.props.siteUser.user.email), 
                React.createElement("td", null, this.props.siteUser.user.weixinID), 
                React.createElement("td", null, new Date(this.props.siteUser.user.createTime).format('yyyy-MM-dd hh:mm:ss'))
            )
        );
    }
});

ReactDOM.render(
    React.createElement(Admins, null),
    document.getElementById('page')
);