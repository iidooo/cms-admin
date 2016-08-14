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
                        
                            //<MainMenu activeMenuID={this.props.activeMenuID}/>
                        
                        React.createElement(LoginInfo, {userName: this.state.user.userName})
                    )
                )
            )
        );
    }
});

{
//var MainMenu = React.createClass({
//    componentDidMount: function () {
//        var activeMenuID = this.props.activeMenuID;
//        $("#" + activeMenuID).addClass("active");
//    },
//    render: function () {
//        return (
//            <ul className="nav navbar-nav">
//                <li id="menuContentManage">
//                    <a href={SiteProperties.clientURL + Page.contents}>内容管理</a>
//                </li>
//                <li id="menuAccountManage">
//                    <a href={SiteProperties.clientURL + Page.account}>账户管理</a>
//                </li>
//                <li id="menuSystemManage">
//                    <a href={SiteProperties.clientURL + Page.users}>系统管理</a>
//                </li>
//            </ul>
//        );
//    }
//});
}
var LoginInfo = React.createClass({displayName: "LoginInfo",
    handleLogout: function () {
        sessionStorage.removeItem(SessionKey.accessToken);
        sessionStorage.removeItem(SessionKey.operatorID);
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
                        React.createElement("li", null, 
                            React.createElement("a", {href: SiteProperties.clientURL + Page.profile}, React.createElement("i", {className: "fa fa-user"}), "  个人信息")
                        ), 
                        React.createElement("li", null, 
                            React.createElement("a", {href: SiteProperties.clientURL + Page.password}, React.createElement("i", {className: "fa fa-pencil"}), "  密码修改")
                        ), 
                        
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