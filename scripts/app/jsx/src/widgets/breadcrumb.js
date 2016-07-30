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
        var path = "";
        if(this.props.page == Page.dashboard){
            path = <DashboardBreadcrumb/>;
        }
        return (
            <ol className="breadcrumb">
                <li><a href="javascript:void(0)">{this.state.site.siteCode}</a></li>
                {path}
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