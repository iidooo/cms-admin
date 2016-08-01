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

var SideBar = React.createClass({displayName: "SideBar",
    mixins: [Reflux.connect(SideBarMenuStore, 'channelList')],
    getInitialState: function () {
        return {
            user:{},
            role: {},
            channelList: []
        };
    },
    componentDidMount: function () {
        //SideBarMenuActions.getChannelTree(this.state);

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
        var activeMenuLinkID = this.props.activeMenuLinkID;

        $("#" + activeMenuID).addClass("active");
        $("#" + activeMenuLinkID).addClass("active");

        // 展开所有的父UL
        var $parentULList = $("#" + activeMenuLinkID).parents("ul");
        $.each($parentULList, function(index, item){
            $ul = $(item);
            $a = $ul.prev();
            if($ul.is(":hidden")){
                $a.find(".fa-plus").removeClass("fa-plus").addClass("fa-minus");
                $ul.toggle(300)
            }
        });
        this.setState(this.state);
    },
    componentDidUpdate: function () {
        //var $contentChannelTree = $("#contentChannelTree");
        //$contentChannelTree.children().remove();
        //$.each(this.state.channelList, function (index, item) {
        //    var index = 0;
        //    createChannelTree($contentChannelTree, item, index);
        //});
    },
    handleToggleSub: function(event){
        var $a = $(event.target);
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
                                )
                            )
                        ), 

                        React.createElement("p", {className: "text-muted margin-0"}, SiteRole[this.state.role])
                    )
                ), 
                React.createElement("div", {id: "sidebarMenu", className: "sidebar-menu"}, 
                    React.createElement("ul", null, 
                        React.createElement("li", null, 
                            React.createElement("a", {id: "menuDashboard", href: SiteProperties.clientURL + Page.dashboard}, 
                                React.createElement("i", {className: "fa fa-dashboard"}), 
                                React.createElement("span", null, "我的控制台")
                            )
                        ), 
                        React.createElement("li", null, 
                            React.createElement("a", {id: "menuContentManage", href: SiteProperties.clientURL + Page.contents}, 
                                React.createElement("i", {className: "fa fa-book"}), 
                                React.createElement("span", null, "内容管理")
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
                            React.createElement("a", {href: "javascript:void(0)"}, "用户管理"), 
                            React.createElement("ul", {id: "channelTree", style: {display: 'none'}}, 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "javascript:void(0)"}, "会员管理")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "javascript:void(0)"}, "站长管理")
                                )
                            )
                        ), 
                        React.createElement("li", null, 
                            React.createElement("a", {id: "menuSiteMaintenance", href: "javascript:void(0)", className: "has-sub", onClick: this.handleToggleSub}, 
                                React.createElement("i", {className: "fa fa-sitemap"}), 
                                React.createElement("span", null, "站点维护"), 
                                React.createElement("span", {className: "pull-right"}, 
                                    React.createElement("i", {className: "fa fa-plus"})
                                )
                            ), 
                            React.createElement("ul", {style: {display: 'none'}}, 
                                React.createElement("li", null, 
                                    React.createElement("a", {id: "menuLinkSite", href: SiteProperties.clientURL + Page.site}, "站点信息")
                                )
                            )
                        )
                    )
                )
            )
        );
    }
});

function createChannelTree($channelTree, item, index) {
    var $li = $("<li></li>");
    var $a = $("<a href='javascript:void(0)'></a>");
    $a.text(item.text);
    $li.append($a);

    //var text = "";
    //for (var i = 0; i < index; i++) {
    //    text += "&nbsp;";
    //}
    //text = text + item.text;
    //$option.html(text);
    $channelTree.append($li);

    if (item.nodes.length > 0) {
        var $ul = $("<ul></ul>");
        $li.append($ul);
        $.each(item.nodes, function (index, item) {
            index = index + 1;
            createChannelTree($ul, item, index);
        });
    }
}