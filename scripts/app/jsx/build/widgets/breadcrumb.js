var Breadcrumb = React.createClass({displayName: "Breadcrumb",
    getInitialState: function () {
        return {
            site: ""
        };
    },
    componentDidMount: function () {
        var siteID = sessionStorage.getItem(SessionKey.siteID);
        var siteMap = JSON.parse(sessionStorage.getItem(SessionKey.siteMap));
        this.state.site = siteMap[siteID];

        this.setState(this.state);
    },
    render: function () {
        var path = new Array();
        switch (this.props.page){
            case Page.dashboard:
                path.push(React.createElement(DashboardBreadcrumb, {key: "DashboardBreadcrumb"}));
                break;
            case Page.contents:
                path.push(React.createElement(ContentsBreadcrumb, {key: "ContentsBreadcrumb"}))
                break;
            case Page.channels:
                path.push(React.createElement(ChannelsBreadcrumb, {key: "ChannelsBreadcrumb"}))
                break;
            case Page.users:
                path.push(React.createElement(UsersBreadcrumb, {key: "UsersBreadcrumb", active: "active", href: "javascript:void(0)"}));
                break;
            case Page.user:
                path.push(React.createElement(UsersBreadcrumb, {key: "UsersBreadcrumb", active: "", href: SiteProperties.clientURL + Page.users}));
                path.push(React.createElement(UserBreadcrumb, {key: "UserBreadcrumb", active: ""}));
                break;
            case Page.site:
                path.push(React.createElement(SiteMaintenanceBreadcrumb, {key: "SiteMaintenanceBreadcrumb"}));
                path.push(React.createElement(SiteBreadcrumb, {key: "SiteBreadcrumb"}));
                break;
        }

        return (
            React.createElement("ol", {className: "breadcrumb"}, 
                React.createElement("li", null, React.createElement("a", {href: "javascript:void(0)"}, this.state.site.siteCode)), 
                path.map(function (item) {
                    return item;
                })
            )
        );
    }
});

var DashboardBreadcrumb = React.createClass({displayName: "DashboardBreadcrumb",
    render: function () {
        return (
            React.createElement("li", {className: "active"}, "我的控制台")
        );
    }
});

var ContentsBreadcrumb = React.createClass({displayName: "ContentsBreadcrumb",
    render: function () {
        return (
            React.createElement("li", {className: "active"}, "内容管理")
        );
    }
});

var ChannelsBreadcrumb = React.createClass({displayName: "ChannelsBreadcrumb",
    render: function () {
        return (
            React.createElement("li", {className: "active"}, "栏目管理")
        );
    }
});

var UsersBreadcrumb = React.createClass({displayName: "UsersBreadcrumb",
    render: function () {
        return (
            React.createElement("li", {className: this.props.active}, 
                React.createElement("a", {href: this.props.href}, "用户管理")
            )
        );
    }
});

var UserBreadcrumb = React.createClass({displayName: "UserBreadcrumb",
    render: function () {
        return (
            React.createElement("li", {className: "active"}, "用户信息")
        );
    }
});

var SiteMaintenanceBreadcrumb = React.createClass({displayName: "SiteMaintenanceBreadcrumb",
    render: function () {
        return (
            React.createElement("li", null, React.createElement("a", {href: "javascript:void(0)"}, "站点维护"))
        );
    }
});

var SiteBreadcrumb = React.createClass({displayName: "SiteBreadcrumb",
    render: function () {
        return (
            React.createElement("li", {className: "active"}, "站点信息")
        );
    }
});

