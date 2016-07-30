var SideBarMenuActions = Reflux.createActions(['getChannelTree']);

var SideBarMenuStore = Reflux.createStore({
    listenables: [SideBarMenuActions],
    onGetChannelTree: function (data) {

        var url = SiteProperties.serverURL + API.getChannelTree;
        data.appID = SecurityClient.appID;
        data.secret = SecurityClient.secret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.userID = sessionStorage.getItem(SessionKey.userID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);

        // 检查token是否过期
        if (data.accessToken == null || data.accessToken == "" || data.userID == null || data.userID == "") {
            location.href = SiteProperties.clientURL + Page.login;
            return false;
        }

        var self = this;

        var callback = function (result) {

            if (result.status == 200) {
                self.trigger(result.data);
            } else {
                console.log(result);
            }
        };

        ajaxPost(url, data, callback);
    },
});

var SideBarMenu = React.createClass({displayName: "SideBarMenu",
    mixins: [Reflux.connect(SideBarMenuStore, 'channelList')],
    getInitialState: function () {
        return {
            user:{},
            role: {},
            channelList: []
        };
    },
    componentDidMount: function () {
        this.state.user = JSON.parse(sessionStorage.getItem(SessionKey.user));
        if(this.state.user == null){
            location.href = SiteProperties.clientURL + Page.login;
        }

        // 得到该用户的当前站点角色
        var siteOwnerMap = JSON.parse(sessionStorage.getItem(SessionKey.siteOwnerMap));
        var siteID = sessionStorage.getItem(SessionKey.siteID);
        var siteOwner = siteOwnerMap[siteID];
        this.state.role = siteOwner.role;

        // 设置menu的active
        var activeMenuID = this.props.activeMenuID;
        $("#" + activeMenuID).addClass("active");

        this.setState(this.state);
    },
    handleToggleSub: function(event){

        var $a = $(event.target);
        //$a.addClass("active");
        var $next = $a.next("ul");

        if($next.is(":hidden")){
            $a.find(".fa-plus").removeClass("fa-plus").addClass("fa-minus");
        } else{
            $a.find(".fa-minus").removeClass("fa-minus").addClass("fa-plus");
        }

        $next.toggle(300);
    },
    render: function () {
        return (
            React.createElement("div", {id: "sidebar", className: "sidebar"}, 
                React.createElement("div", {id: "sideBarUserInfo", className: "user-details"}, 
                    React.createElement("div", {className: "pull-left"}, 
                        React.createElement("img", {src: this.state.user.photoURL, alt: "", className: "img-square-48 img-circle"})
                    ), 
                    React.createElement("div", {className: "user-info"}, 
                        React.createElement("div", {className: "dropdown"}, 
                            React.createElement("a", {href: "#", className: "dropdown-toggle", "data-toggle": "dropdown", "aria-expanded": "false"}, this.state.user.userName, " ", React.createElement("span", {className: "caret"})), 
                            React.createElement("ul", {className: "dropdown-menu"}, 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: SiteProperties.clientURL + Page.account}, React.createElement("i", {className: "fa fa-user"}), "  个人信息")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: SiteProperties.clientURL + Page.password}, React.createElement("i", {className: "fa fa-pencil"}), "  密码修改")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "javascript:void(0)", onClick: this.handleLogout}, React.createElement("i", {className: "fa fa-power-off"}), "  注销")
                                )
                            )
                        ), 

                        React.createElement("p", {className: "text-muted margin-0"}, SiteRole[this.state.role])
                    )
                ), 
                React.createElement("div", {id: "sidebarMenu", className: "sidebar-menu"}, 
                    React.createElement("ul", null, 
                        React.createElement("li", null, 
                            React.createElement("a", {id: "menuDashboard", href: "javascript:void(0)"}, 
                                React.createElement("i", {className: "fa fa-dashboard"}), 
                                React.createElement("span", null, "我的控制台")
                            )
                        ), 
                        React.createElement("li", null, 
                            React.createElement("a", {href: "javascript:void(0)", className: "has-sub", onClick: this.handleToggleSub}, 
                                React.createElement("i", {className: "fa fa-sitemap"}), 
                                React.createElement("span", null, "站点维护"), 
                                React.createElement("span", {className: "pull-right"}, 
                                    React.createElement("i", {className: "fa fa-plus"})
                                )
                            ), 
                            React.createElement("ul", {style: {display: 'none'}}, 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "javascript:void(0)"}, "站点信息")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "javascript:void(0)"}, "会员管理")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "javascript:void(0)"}, "站长管理")
                                )
                            )
                        ), 
                        React.createElement("li", {className: "has-sub"}, 
                            React.createElement("a", {href: "javascript:void(0)", className: "has-sub", onClick: this.handleToggleSub}, 
                                React.createElement("i", {className: "fa fa-th-list"}), 
                                React.createElement("span", null, "栏目管理"), 
                                React.createElement("span", {className: "pull-right"}, 
                                    React.createElement("i", {className: "fa fa-plus"})
                                )
                            ), 
                            React.createElement("ul", {id: "channelTree", style: {display: 'none'}}, 
                                React.createElement("li", null, "首页"), 
                                React.createElement("li", null, "产品一览")
                            )
                        ), 
                        React.createElement("li", {className: "has-sub"}, 
                            React.createElement("a", {href: "javascript:void(0)"}, "内容管理"), 
                            React.createElement("ul", {id: "channelTree", style: {display: 'none'}}, 
                                React.createElement("li", null, "首页"), 
                                React.createElement("li", null, "产品一览")
                            )
                        ), 
                        React.createElement("li", {className: "has-sub"}, 
                            React.createElement("a", {href: "javascript:void(0)"}, "系统管理"), 
                            React.createElement("ul", {id: "channelTree", style: {display: 'none'}}, 
                                React.createElement("li", null, "用户一览"), 
                                React.createElement("li", null, "产品一览")
                            )
                        ), 
                        React.createElement("li", {className: "has-sub"}, 
                            React.createElement("a", {href: "javascript:void(0)"}, "个人账户"), 
                            React.createElement("ul", {id: "channelTree", style: {display: 'none'}}, 
                                React.createElement("li", null, "首页"), 
                                React.createElement("li", null, "产品一览")
                            )
                        )
                    )
                )
            )
        );
    }
});