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
            case Page.content:
                path.push(<ContentsBreadcrumb key="ContentsBreadcrumb" active="" href={SiteProperties.clientURL + Page.contents}/>)
                path.push(<ContentBreadcrumb key="ContentBreadcrumb"/>)
                break;
            case Page.comments:
                path.push(<CommentsBreadcrumb key="CommentsBreadcrumb" active="" href="javascript:void(0)"/>);
                break;
            case Page.comment:
                path.push(<CommentsBreadcrumb key="CommentsBreadcrumb" active="active" href={SiteProperties.clientURL + Page.comments}/>);
                path.push(<CommentBreadcrumb key="CommentBreadcrumb"/>)
                break;
            case Page.channels:
                path.push(<ChannelsBreadcrumb key="ChannelsBreadcrumb"/>)
                break;
            case Page.users:
                path.push(<UsersBreadcrumb key="UsersBreadcrumb" active="active" href="javascript:void(0)"/>);
                break;
            case Page.user:
                path.push(<UsersBreadcrumb key="UsersBreadcrumb" active="" href={SiteProperties.clientURL + Page.users}/>);
                path.push(<UserBreadcrumb key="UserBreadcrumb" active=""/>);
                break;
            case Page.site:
                path.push(<SiteMaintenanceBreadcrumb key="SiteMaintenanceBreadcrumb"/>);
                path.push(<SiteBreadcrumb key="SiteBreadcrumb"/>);
                break;
            case Page.admins:
                path.push(<SiteMaintenanceBreadcrumb key="SiteMaintenanceBreadcrumb"/>);
                path.push(<AdminsBreadcrumb key="AdminsBreadcrumb" active="active" href="javascript:void(0)"/>);
                break;
            case Page.admin:
                path.push(<SiteMaintenanceBreadcrumb key="SiteMaintenanceBreadcrumb"/>);
                path.push(<AdminsBreadcrumb key="AdminsBreadcrumb" active="" href={SiteProperties.clientURL + Page.admins}/>);
                path.push(<AdminBreadcrumb key="AdminBreadcrumb"/>);
                break;
            case Page.profile:
                path.push(<AccountBreadcrumb key="AccountBreadcrumb"/>);
                path.push(<ProfileBreadcrumb key="ProfileBreadcrumb"/>);
                break;
            case Page.password:
                path.push(<AccountBreadcrumb key="AccountBreadcrumb"/>);
                path.push(<PasswordBreadcrumb key="PasswordBreadcrumb"/>);
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
            <li className={this.props.active}>
                <a href={this.props.href}>内容管理</a>
            </li>
        );
    }
});

var ContentBreadcrumb = React.createClass({
    render: function () {
        return (
            <li className='active'>内容详细</li>
        );
    }
});

var CommentsBreadcrumb = React.createClass({
    render: function () {
        return (
            <li className={this.props.active}>
                <a href={this.props.href}>评论管理</a>
            </li>
        );
    }
});

var CommentBreadcrumb = React.createClass({
    render: function () {
        return (
            <li className="active">评论详细</li>
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

var UsersBreadcrumb = React.createClass({
    render: function () {
        return (
            <li className={this.props.active}>
                <a href={this.props.href}>用户管理</a>
            </li>
        );
    }
});

var UserBreadcrumb = React.createClass({
    render: function () {
        return (
            <li className='active'>用户信息</li>
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

var AdminsBreadcrumb = React.createClass({
    render: function () {
        return (
            <li className={this.props.active}>
                <a href={this.props.href}>站长管理</a>
            </li>
        );
    }
});

var AdminBreadcrumb = React.createClass({
    render: function () {
        return (
            <li className="active">站长信息</li>
        );
    }
});

var AccountBreadcrumb = React.createClass({
    render: function () {
        return (
            <li><a href="javascript:void(0)">账户信息</a></li>
        );
    }
});

var ProfileBreadcrumb = React.createClass({
    render: function () {
        return (
            <li className='active'>个人信息</li>
        );
    }
});

var PasswordBreadcrumb = React.createClass({
    render: function () {
        return (
            <li className='active'>密码重设</li>
        );
    }
});

