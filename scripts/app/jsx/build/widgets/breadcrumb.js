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
        var path = "";
        if(this.props.page == Page.dashboard){
            path = React.createElement(DashboardBreadcrumb, null);
        }
        return (
            React.createElement("ol", {className: "breadcrumb"}, 
                React.createElement("li", null, React.createElement("a", {href: "javascript:void(0)"}, this.state.site.siteCode)), 
                path
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