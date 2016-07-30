var Header = React.createClass({displayName: "Header",
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
            React.createElement("nav", {className: "navbar navbar-inverse navbar-fixed-top", role: "navigation"}, 
                React.createElement("div", {className: "container-fluid"}, 
                    React.createElement("div", {className: "navbar-header width-240"}, 
                        React.createElement("a", {className: "navbar-brand", href: SiteProperties.clientURL + Page.sites}, 
                            React.createElement("i", {className: "fa fa-home", "aria-hidden": "true"}), 
                            React.createElement("span", null, "EDO CMS SYSTEM")
                        )
                    ), 
                    React.createElement("div", {id: "navbar", className: "navbar-collapse collapse"}, 
                        
                            React.createElement(MainMenu, {activeMenuID: this.props.activeMenuID}), 
                        
                        React.createElement(LoginInfo, {userName: this.state.user.userName})
                    )
                )
            )
        );
    }
});


var MainMenu = React.createClass({displayName: "MainMenu",
    componentDidMount: function () {
        var activeMenuID = this.props.activeMenuID;
        $("#" + activeMenuID).addClass("active");
    },
    render: function () {
        return (
            React.createElement("ul", {className: "nav navbar-nav"}, 
                React.createElement("li", {id: "menuContentManage"}, 
                    React.createElement("a", {href: SiteProperties.clientURL + Page.contents}, "内容管理")
                ), 
                React.createElement("li", {id: "menuAccountManage"}, 
                    React.createElement("a", {href: SiteProperties.clientURL + Page.account}, "账户管理")
                ), 
                React.createElement("li", {id: "menuSystemManage"}, 
                    React.createElement("a", {href: SiteProperties.clientURL + Page.users}, "系统管理")
                )
            )
        );
    }
});

var LoginInfo = React.createClass({displayName: "LoginInfo",
    handleLogout: function () {
        sessionStorage.removeItem(SessionKey.accessToken);
        sessionStorage.removeItem(SessionKey.userID);
        location.href = SiteProperties.clientURL + Page.login;
    },

    render: function () {
        return (
            React.createElement("ul", {className: "nav navbar-nav navbar-right"}, 
                React.createElement("li", {className: "dropdown"}, 
                    React.createElement("a", {href: "javascript:void(0)", className: "dropdown-toggle", "data-toggle": "dropdown"}, 
                        React.createElement("span", null, "您好，", this.props.userName, "   "), 
                        React.createElement("i", {className: "fa fa-cog"})
                    ), 
                    React.createElement("ul", {className: "dropdown-menu"}, 
                        React.createElement("li", null, React.createElement("a", {href: SiteProperties.clientURL + Page.sites}, React.createElement("i", {
                            className: "fa fa-database"}), "  站点")), 
                        React.createElement("li", null, React.createElement("a", {href: SiteProperties.clientURL + Page.account}, React.createElement("i", {className: "fa fa-user"}), "  帐户")), 
                        
                            //<li><a href="/pricing"><i className="fa fa-clipboard"></i>&nbsp;&nbsp;Plans</a></li>
                            //<li><a href="/docs"><i className="fa fa-files-o"></i>&nbsp;&nbsp;Documentation</a></li>
                        
                        React.createElement("li", null, React.createElement("a", {href: "javascript:void(0)", onClick: this.handleLogout}, React.createElement("i", {
                            className: "fa fa-power-off"}), "  注销"))
                    )
                )
            )
        );
    }
});