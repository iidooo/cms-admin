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
            case Page.content:
                path.push(React.createElement(ContentsBreadcrumb, {key: "ContentsBreadcrumb", active: "", href: SiteProperties.clientURL + Page.contents}))
                path.push(React.createElement(ContentBreadcrumb, {key: "ContentBreadcrumb"}))
                break;
            case Page.comments:
                path.push(React.createElement(CommentsBreadcrumb, {key: "CommentsBreadcrumb", active: "", href: "javascript:void(0)"}));
                break;
            case Page.comment:
                path.push(React.createElement(CommentsBreadcrumb, {key: "CommentsBreadcrumb", active: "active", href: SiteProperties.clientURL + Page.comments}));
                path.push(React.createElement(CommentBreadcrumb, {key: "CommentBreadcrumb"}))
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
            case Page.admins:
                path.push(React.createElement(SiteMaintenanceBreadcrumb, {key: "SiteMaintenanceBreadcrumb"}));
                path.push(React.createElement(AdminsBreadcrumb, {key: "AdminsBreadcrumb", active: "active", href: "javascript:void(0)"}));
                break;
            case Page.admin:
                path.push(React.createElement(SiteMaintenanceBreadcrumb, {key: "SiteMaintenanceBreadcrumb"}));
                path.push(React.createElement(AdminsBreadcrumb, {key: "AdminsBreadcrumb", active: "", href: SiteProperties.clientURL + Page.admins}));
                path.push(React.createElement(AdminBreadcrumb, {key: "AdminBreadcrumb"}));
                break;
            case Page.profile:
                path.push(React.createElement(AccountBreadcrumb, {key: "AccountBreadcrumb"}));
                path.push(React.createElement(ProfileBreadcrumb, {key: "ProfileBreadcrumb"}));
                break;
            case Page.password:
                path.push(React.createElement(AccountBreadcrumb, {key: "AccountBreadcrumb"}));
                path.push(React.createElement(PasswordBreadcrumb, {key: "PasswordBreadcrumb"}));
                break;
        }

        return (
            React.createElement("ol", {className: "breadcrumb"}, 
                React.createElement("li", null, React.createElement("a", {href: "javascript:void(0)"}, this.state.site.siteName)), 
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
            React.createElement("li", {className: this.props.active}, 
                React.createElement("a", {href: this.props.href}, "内容管理")
            )
        );
    }
});

var ContentBreadcrumb = React.createClass({displayName: "ContentBreadcrumb",
    render: function () {
        return (
            React.createElement("li", {className: "active"}, "内容详细")
        );
    }
});

var CommentsBreadcrumb = React.createClass({displayName: "CommentsBreadcrumb",
    render: function () {
        return (
            React.createElement("li", {className: this.props.active}, 
                React.createElement("a", {href: this.props.href}, "评论管理")
            )
        );
    }
});

var CommentBreadcrumb = React.createClass({displayName: "CommentBreadcrumb",
    render: function () {
        return (
            React.createElement("li", {className: "active"}, "评论详细")
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

var AdminsBreadcrumb = React.createClass({displayName: "AdminsBreadcrumb",
    render: function () {
        return (
            React.createElement("li", {className: this.props.active}, 
                React.createElement("a", {href: this.props.href}, "站长管理")
            )
        );
    }
});

var AdminBreadcrumb = React.createClass({displayName: "AdminBreadcrumb",
    render: function () {
        return (
            React.createElement("li", {className: "active"}, "站长信息")
        );
    }
});

var AccountBreadcrumb = React.createClass({displayName: "AccountBreadcrumb",
    render: function () {
        return (
            React.createElement("li", null, React.createElement("a", {href: "javascript:void(0)"}, "账户信息"))
        );
    }
});

var ProfileBreadcrumb = React.createClass({displayName: "ProfileBreadcrumb",
    render: function () {
        return (
            React.createElement("li", {className: "active"}, "个人信息")
        );
    }
});

var PasswordBreadcrumb = React.createClass({displayName: "PasswordBreadcrumb",
    render: function () {
        return (
            React.createElement("li", {className: "active"}, "密码重设")
        );
    }
});

