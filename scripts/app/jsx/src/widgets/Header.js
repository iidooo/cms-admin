var Header = React.createClass({
    getInitialState: function () {
        return {
            user: {}
        };
    },
    componentWillMount: function () {
        this.state.user = JSON.parse(sessionStorage.getItem(SessionKey.user));
        if(this.state.user == null){
            location.href = SiteProperties.clientURL + Page.login;
        }
    },
    render: function () {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand" href={SiteProperties.clientURL + Page.sites}>
                            <i className="fa fa-home" aria-hidden="true"></i>
                            <span>EDO CMS SYSTEM</span>
                        </a>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        <MainMenu activeMenuID={this.props.activeMenuID}/>
                        <LoginInfo userName={this.state.user.userName}/>
                    </div>
                </div>
            </nav>
        );
    }
});


var MainMenu = React.createClass({
    componentDidMount: function () {
        var activeMenuID = this.props.activeMenuID;
        $("#" + activeMenuID).addClass("active");
    },
    render: function () {
        return (
            <ul className="nav navbar-nav">
                <li id="menuContentManage">
                    <a href={SiteProperties.clientURL + Page.contents}>内容管理</a>
                </li>
                <li id="menuAccountManage">
                    <a href={SiteProperties.clientURL + Page.account}>账户管理</a>
                </li>
            </ul>
        );
    }
});

var LoginInfo = React.createClass({
    handleLogout: function () {
        sessionStorage.removeItem(SessionKey.accessToken);
        sessionStorage.removeItem(SessionKey.userID);
        location.href = SiteProperties.clientURL + Page.login;
    },

    render: function () {
        return (
            <ul className="nav navbar-nav navbar-right">
                <li className="dropdown">
                    <a href="javascript:void(0)" className="dropdown-toggle" data-toggle="dropdown">
                        <span>您好，{this.props.userName}&nbsp;&nbsp;&nbsp;</span>
                        <i className="fa fa-cog"></i>
                    </a>
                    <ul className="dropdown-menu">
                        <li><a href={SiteProperties.clientURL + Page.sites}><i
                            className="fa fa-database"></i>&nbsp;&nbsp;站点</a></li>
                        <li><a href={SiteProperties.clientURL + Page.account}><i className="fa fa-user"></i>&nbsp;&nbsp;帐户</a></li>
                        {
                            //<li><a href="/pricing"><i className="fa fa-clipboard"></i>&nbsp;&nbsp;Plans</a></li>
                            //<li><a href="/docs"><i className="fa fa-files-o"></i>&nbsp;&nbsp;Documentation</a></li>
                        }
                        <li><a href="javascript:void(0)" onClick={this.handleLogout}><i
                            className="fa fa-power-off"></i>&nbsp;&nbsp;注销</a></li>
                    </ul>
                </li>
            </ul>
        );
    }
});