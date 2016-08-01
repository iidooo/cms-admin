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

var SideBar = React.createClass({
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
            <div id="sidebar" className="sidebar">
                <div id="sideBarUserInfo" className="user-details">
                    <div className="pull-left">
                        <img src={this.state.user.photoURL} alt="" className="img-square-48 img-circle"/>
                    </div>
                    <div className="user-info">
                        <div className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">{this.state.user.userName} <span className="caret"></span></a>
                            <ul className="dropdown-menu">
                                <li>
                                    <a href={SiteProperties.clientURL + Page.account}><i className="fa fa-user"></i>&nbsp;&nbsp;个人信息</a>
                                </li>
                                <li>
                                    <a href={SiteProperties.clientURL + Page.password}><i className="fa fa-pencil"></i>&nbsp;&nbsp;密码修改</a>
                                </li>
                            </ul>
                        </div>

                        <p className="text-muted margin-0">{SiteRole[this.state.role]}</p>
                    </div>
                </div>
                <div id="sidebarMenu" className="sidebar-menu">
                    <ul>
                        <li>
                            <a id="menuDashboard" href={SiteProperties.clientURL + Page.dashboard}>
                                <i className="fa fa-dashboard"></i>
                                <span>我的控制台</span>
                            </a>
                        </li>
                        <li>
                            <a id="menuContentManage" href={SiteProperties.clientURL + Page.contents}>
                                <i className="fa fa-book"></i>
                                <span>内容管理</span>
                            </a>
                        </li>
                        <li>
                            <a  id="menuChannelManage" href={SiteProperties.clientURL + Page.channels}>
                                <i className="fa fa-th-list"></i>
                                <span>栏目管理</span>
                            </a>
                        </li>
                        <li className="has-sub">
                            <a href="javascript:void(0)">用户管理</a>
                            <ul id="channelTree" style={{display: 'none'}}>
                                <li>
                                    <a href="javascript:void(0)">会员管理</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)">站长管理</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a id="menuSiteMaintenance" href="javascript:void(0)" className="has-sub" onClick={this.handleToggleSub}>
                                <i className="fa fa-sitemap"></i>
                                <span>站点维护</span>
                                <span className="pull-right">
                                    <i className="fa fa-plus"></i>
                                </span>
                            </a>
                            <ul style={{display: 'none'}}>
                                <li>
                                    <a id="menuLinkSite" href={SiteProperties.clientURL + Page.site}>站点信息</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
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