var Dashboard = React.createClass({displayName: "Dashboard",
    render: function () {
        return (
            React.createElement("div", null, 
                React.createElement(Header, null), 

                React.createElement("div", {id: "main", className: "container-fluid margin-top-60"}, 
                    React.createElement(SideBar, {activeMenuID: "menuDashboard"}), 

                    React.createElement("div", {className: "content-page"}, 
                        React.createElement(Breadcrumb, {page: Page.dashboard}), 

                        React.createElement("div", {className: "row"}, 
                            React.createElement("div", {className: "col-sm-3"}, 
                                React.createElement(DashboardContentCount, null)
                            ), 
                            React.createElement("div", {className: "col-sm-3"}, 
                                React.createElement(DashboardNewContentCount, null)
                            ), 
                            React.createElement("div", {className: "col-sm-3"}, 
                                React.createElement(DashboardUserCount, null)
                            ), 
                            React.createElement("div", {className: "col-sm-3"}, 
                                React.createElement(DashboardNewUserCount, null)
                            )
                        ), 
                        React.createElement("div", {className: "row"}, 
                            React.createElement("div", {className: "col-sm-6"}, 
                                React.createElement(DashboardNewContentList, null)
                            ), 
                            React.createElement("div", {className: "col-sm-6"}, 
                                React.createElement(DashboardPVContentList, null)
                            )
                        ), 

                        React.createElement(Footer, null)
                    )
                )

            )
        );
    }
});

var DashboardContentCountActions = Reflux.createActions(['getContentCount']);
var DashboardContentCountStore = Reflux.createStore({
    listenables: [DashboardContentCountActions],
    onGetContentCount: function (data) {
        var url = SiteProperties.serverURL + API.getContentCount;
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
            if (result.status == 200) {
                self.trigger(result.data);
            } else {
                console.log(result);
            }
        };

        ajaxPost(url, data, callback);
    }
});
var DashboardContentCount = React.createClass({displayName: "DashboardContentCount",
    mixins: [Reflux.connect(DashboardContentCountStore, 'count')],
    getInitialState: function () {
        return {
            count: ""
        };
    },
    componentDidMount: function () {
        DashboardContentCountActions.getContentCount(this.state);
    },
    render: function () {
        return (
            React.createElement("div", {className: "mini-stat clearfix box-shadow bg-white"}, 
                React.createElement("span", {className: "mini-stat-icon bg-info"}, React.createElement("i", {className: "fa fa-th-list"})), 

                React.createElement("div", {className: "mini-stat-info text-right text-dark"}, 
                    React.createElement("span", {className: "counter text-dark"}, this.state.count), 
                    "本站内容总数"
                )
            )
        );
    }
});

var DashboardNewContentCountActions = Reflux.createActions(['getContentCount']);
var DashboardNewContentCountStore = Reflux.createStore({
    listenables: [DashboardNewContentCountActions],
    onGetContentCount: function (data) {
        var url = SiteProperties.serverURL + API.getContentCount;
        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.operatorID = sessionStorage.getItem(SessionKey.operatorID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);
        data.startDateTime = new Date().format("yyyy-MM-dd");
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
    }
});
var DashboardNewContentCount = React.createClass({displayName: "DashboardNewContentCount",
    mixins: [Reflux.connect(DashboardNewContentCountStore, 'count')],
    getInitialState: function () {
        return {
            count: ""
        };
    },
    componentDidMount: function () {
        DashboardNewContentCountActions.getContentCount(this.state);
    },
    render: function () {
        return (
            React.createElement("div", {className: "mini-stat clearfix box-shadow bg-white"}, 
                React.createElement("span", {className: "mini-stat-icon bg-success"}, React.createElement("i", {className: "fa fa-hand-o-up"})), 

                React.createElement("div", {className: "mini-stat-info text-right text-dark"}, 
                    React.createElement("span", {className: "counter text-dark"}, this.state.count), 
                    "今日新增内容数"
                )
            )
        );
    }
});

var DashboardUserCountActions = Reflux.createActions(['getSiteUserCount']);
var DashboardUserCountStore = Reflux.createStore({
    listenables: [DashboardUserCountActions],
    onGetSiteUserCount: function (data) {
        var url = SiteProperties.serverURL + API.getSiteUserCount;
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
            if (result.status == 200) {
                self.trigger(result.data);
            } else {
                console.log(result);
            }
        };

        ajaxPost(url, data, callback);
    }
});
var DashboardUserCount = React.createClass({displayName: "DashboardUserCount",
    mixins: [Reflux.connect(DashboardUserCountStore, 'count')],
    getInitialState: function () {
        return {
            count: ""
        };
    },
    componentDidMount: function () {
        DashboardUserCountActions.getSiteUserCount(this.state);
    },
    render: function () {
        return (
            React.createElement("div", {className: "mini-stat clearfix box-shadow bg-white"}, 
                React.createElement("span", {className: "mini-stat-icon bg-info"}, React.createElement("i", {className: "fa fa-users"})), 

                React.createElement("div", {className: "mini-stat-info text-right text-dark"}, 
                    React.createElement("span", {className: "counter text-dark"}, this.state.count), 
                    "注册用户总数"
                )
            )
        );
    }
});

var DashboardNewUserCountActions = Reflux.createActions(['getSiteUserCount']);
var DashboardNewUserCountStore = Reflux.createStore({
    listenables: [DashboardNewUserCountActions],
    onGetSiteUserCount: function (data) {
        var url = SiteProperties.serverURL + API.getSiteUserCount;
        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.operatorID = sessionStorage.getItem(SessionKey.operatorID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);
        data.startDateTime = new Date().format("yyyy-MM-dd");

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
    }
});
var DashboardNewUserCount = React.createClass({displayName: "DashboardNewUserCount",
    mixins: [Reflux.connect(DashboardNewUserCountStore, 'count')],
    getInitialState: function () {
        return {
            count: ""
        };
    },
    componentDidMount: function () {
        DashboardNewUserCountActions.getSiteUserCount(this.state);
    },
    render: function () {
        return (
            React.createElement("div", {className: "mini-stat clearfix box-shadow bg-white"}, 
                React.createElement("span", {className: "mini-stat-icon bg-success"}, React.createElement("i", {className: "fa fa-user-plus"})), 

                React.createElement("div", {className: "mini-stat-info text-right text-dark"}, 
                    React.createElement("span", {className: "counter text-dark"}, this.state.count), 
                    "今日新增用户总数"
                )
            )
        );
    }
});

var DashboardNewContentListActions = Reflux.createActions(['searchContentList']);
var DashboardNewContentListStore = Reflux.createStore({
    listenables: [DashboardNewContentListActions],
    onSearchContentList: function (data) {
        var url = SiteProperties.serverURL + API.searchContentList;
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
            if (result.status == 200) {
                self.trigger(result.data);
            } else {
                console.log(result);
            }
        };

        ajaxPost(url, data, callback);
    }
});
var DashboardNewContentList = React.createClass({displayName: "DashboardNewContentList",
    mixins: [Reflux.connect(DashboardNewContentListStore, 'contentListData')],
    getInitialState: function () {
        return {
            contentListData: {
                page: "",
                contentList: []
            }
        };
    },
    componentDidMount: function () {
        DashboardNewContentListActions.searchContentList(this.state);
    },
    render: function () {
        return (
            React.createElement("div", {className: "panel panel-default"}, 
                React.createElement("div", {className: "panel-heading"}, "最新内容"), 
                React.createElement("ul", {className: "list-group"}, 
                    this.state.contentListData.contentList.map(function (item) {
                        return React.createElement(DashboardNewContent, {key: item.contentID, content: item})
                    })
                )
            )
        );
    }
});
var DashboardNewContent = React.createClass({displayName: "DashboardNewContent",
    handleLink: function (contentID) {
        sessionStorage.setItem(SessionKey.contentID, contentID);
        location.href = SiteProperties.clientURL + Page.content;
    },
    render: function () {
        return (
            React.createElement("li", {className: "list-group-item"}, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-sm-8"}, 
                        React.createElement("a", {href: "javascript:void(0)", 
                           onClick: this.handleLink.bind(null, this.props.content.contentID)}, this.props.content.contentTitle)
                    ), 
                    React.createElement("div", {
                        className: "col-sm-4 text-right"}, new Date(this.props.content.createTime).format('yyyy-MM-dd hh:mm:ss'))
                )
            )
        );
    }
});

var DashboardPVContentListActions = Reflux.createActions(['searchContentList']);
var DashboardPVContentListStore = Reflux.createStore({
    listenables: [DashboardPVContentListActions],
    onSearchContentList: function (data) {
        var url = SiteProperties.serverURL + API.searchContentList;
        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.operatorID = sessionStorage.getItem(SessionKey.operatorID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);
        data.sortField = "pageViewCount";
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
    }
});
var DashboardPVContentList = React.createClass({displayName: "DashboardPVContentList",
    mixins: [Reflux.connect(DashboardPVContentListStore, 'contentListData')],
    getInitialState: function () {
        return {
            contentListData: {
                page: "",
                contentList: []
            }
        };
    },
    componentDidMount: function () {
        DashboardPVContentListActions.searchContentList(this.state);
    },
    render: function () {
        return (
            React.createElement("div", {className: "panel panel-default"}, 
                React.createElement("div", {className: "panel-heading"}, "访问排行榜"), 
                React.createElement("ul", {className: "list-group"}, 
                    this.state.contentListData.contentList.map(function (item) {
                        return React.createElement(DashboardPVContent, {key: item.contentID, content: item})
                    })
                )
            )
        );
    }
});
var DashboardPVContent = React.createClass({displayName: "DashboardPVContent",
    handleLink: function (contentID) {
        sessionStorage.setItem(SessionKey.contentID, contentID);
        location.href = SiteProperties.clientURL + Page.content;
    },
    render: function () {
        return (
            React.createElement("li", {className: "list-group-item"}, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-sm-8"}, 
                        React.createElement("a", {href: "javascript:void(0)", 
                           onClick: this.handleLink.bind(null, this.props.content.contentID)}, this.props.content.contentTitle)
                    ), 
                    React.createElement("div", {
                        className: "col-sm-4 text-right"}, this.props.content.pageViewCount)
                )
            )
        );
    }
});

ReactDOM.render(
    React.createElement(Dashboard, null),
    document.getElementById('page')
);