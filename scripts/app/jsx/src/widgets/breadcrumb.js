var Breadcrumb = React.createClass({
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
                path.push(<DashboardBreadcrumb key="DashboardBreadcrumb"/>);
                break;
            case Page.contents:
                path.push(<ContentsBreadcrumb key="ContentsBreadcrumb"/>)
                break;
            case Page.channels:
                path.push(<ChannelsBreadcrumb key="ChannelsBreadcrumb"/>)
                break;
            case Page.site:
                path.push(<SiteMaintenanceBreadcrumb key="SiteMaintenanceBreadcrumb"/>);
                path.push(<SiteBreadcrumb key="SiteBreadcrumb"/>);
                break;
        }

        return (
            <ol className="breadcrumb">
                <li><a href="javascript:void(0)">{this.state.site.siteCode}</a></li>
                {path.map(function (item) {
                    return item;
                })}
            </ol>
        );
    }
});

var DashboardBreadcrumb = React.createClass({
    render: function () {
        return (
            <li className='active'>我的控制台</li>
        );
    }
});

var ContentsBreadcrumb = React.createClass({
    render: function () {
        return (
            <li className='active'>内容管理</li>
        );
    }
});

var ChannelsBreadcrumb = React.createClass({
    render: function () {
        return (
            <li className='active'>栏目管理</li>
        );
    }
});

var SiteMaintenanceBreadcrumb = React.createClass({
    render: function () {
        return (
            <li><a href="javascript:void(0)">站点维护</a></li>
        );
    }
});

var SiteBreadcrumb = React.createClass({
    render: function () {
        return (
            <li className='active'>站点信息</li>
        );
    }
});

