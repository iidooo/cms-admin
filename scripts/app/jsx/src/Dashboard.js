var Dashboard = React.createClass({
    render: function () {
        return (
            <div>
                <Header/>

                <div id="main" className="container-fluid margin-top-60">
                    <SideBar activeMenuID="menuDashboard"/>

                    <div className="content-page">
                        <Breadcrumb page={Page.dashboard}/>

                        <div className="row">
                            <div className="col-sm-3">
                                <DashboardContentCount/>
                            </div>
                            <div className="col-sm-3">
                                <DashboardNewContentCount/>
                            </div>
                            <div className="col-sm-3">
                                <DashboardUserCount/>
                            </div>
                            <div className="col-sm-3">
                                <DashboardNewUserCount/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6">
                                <DashboardNewContentList/>
                            </div>
                            <div className="col-sm-6">
                                <DashboardPVContentList/>
                            </div>
                        </div>

                        <Footer/>
                    </div>
                </div>

            </div>
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
var DashboardContentCount = React.createClass({
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
            <div className="mini-stat clearfix box-shadow bg-white">
                <span className="mini-stat-icon bg-info"><i className="fa fa-th-list"></i></span>

                <div className="mini-stat-info text-right text-dark">
                    <span className="counter text-dark">{this.state.count}</span>
                    本站内容总数
                </div>
            </div>
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
var DashboardNewContentCount = React.createClass({
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
            <div className="mini-stat clearfix box-shadow bg-white">
                <span className="mini-stat-icon bg-success"><i className="fa fa-hand-o-up"></i></span>

                <div className="mini-stat-info text-right text-dark">
                    <span className="counter text-dark">{this.state.count}</span>
                    今日新增内容数
                </div>
            </div>
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
var DashboardUserCount = React.createClass({
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
            <div className="mini-stat clearfix box-shadow bg-white">
                <span className="mini-stat-icon bg-info"><i className="fa fa-users"></i></span>

                <div className="mini-stat-info text-right text-dark">
                    <span className="counter text-dark">{this.state.count}</span>
                    注册用户总数
                </div>
            </div>
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
var DashboardNewUserCount = React.createClass({
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
            <div className="mini-stat clearfix box-shadow bg-white">
                <span className="mini-stat-icon bg-success"><i className="fa fa-user-plus"></i></span>

                <div className="mini-stat-info text-right text-dark">
                    <span className="counter text-dark">{this.state.count}</span>
                    今日新增用户总数
                </div>
            </div>
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
var DashboardNewContentList = React.createClass({
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
            <div className="panel panel-default">
                <div className="panel-heading">最新内容</div>
                <ul className="list-group">
                    {this.state.contentListData.contentList.map(function (item) {
                        return <DashboardNewContent key={item.contentID} content={item}/>
                    })}
                </ul>
            </div>
        );
    }
});
var DashboardNewContent = React.createClass({
    handleLink: function (contentID) {
        sessionStorage.setItem(SessionKey.contentID, contentID);
        location.href = SiteProperties.clientURL + Page.content;
    },
    render: function () {
        return (
            <li className="list-group-item">
                <div className="row">
                    <div className="col-sm-8">
                        <a href="javascript:void(0)"
                           onClick={this.handleLink.bind(null, this.props.content.contentID)}>{this.props.content.contentTitle}</a>
                    </div>
                    <div
                        className="col-sm-4 text-right">{new Date(this.props.content.createTime).format('yyyy-MM-dd hh:mm:ss')}</div>
                </div>
            </li>
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
var DashboardPVContentList = React.createClass({
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
            <div className="panel panel-default">
                <div className="panel-heading">访问排行榜</div>
                <ul className="list-group">
                    {this.state.contentListData.contentList.map(function (item) {
                        return <DashboardPVContent key={item.contentID} content={item}/>
                    })}
                </ul>
            </div>
        );
    }
});
var DashboardPVContent = React.createClass({
    handleLink: function (contentID) {
        sessionStorage.setItem(SessionKey.contentID, contentID);
        location.href = SiteProperties.clientURL + Page.content;
    },
    render: function () {
        return (
            <li className="list-group-item">
                <div className="row">
                    <div className="col-sm-8">
                        <a href="javascript:void(0)"
                           onClick={this.handleLink.bind(null, this.props.content.contentID)}>{this.props.content.contentTitle}</a>
                    </div>
                    <div
                        className="col-sm-4 text-right">{this.props.content.pageViewCount}</div>
                </div>
            </li>
        );
    }
});

ReactDOM.render(
    <Dashboard />,
    document.getElementById('page')
);