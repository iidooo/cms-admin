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
        if (this.props.page == Page.dashboard) {
            path.push(React.createElement(DashboardBreadcrumb, {key: "DashboardBreadcrumb"}));
        } else if (this.props.page == Page.site) {
            path.push(React.createElement(SiteMaintenanceBreadcrumb, {key: "SiteMaintenanceBreadcrumb"}));
            path.push(React.createElement(SiteBreadcrumb, {key: "SiteBreadcrumb"}));
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