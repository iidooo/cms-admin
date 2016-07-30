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

var SideBarMenu = React.createClass({
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
                                <li>
                                    <a href="javascript:void(0)" onClick={this.handleLogout}><i className="fa fa-power-off"></i>&nbsp;&nbsp;注销</a>
                                </li>
                            </ul>
                        </div>

                        <p className="text-muted margin-0">{SiteRole[this.state.role]}</p>
                    </div>
                </div>
                <div id="sidebarMenu" className="sidebar-menu">
                    <ul>
                        <li>
                            <a id="menuDashboard" href="javascript:void(0)">
                                <i className="fa fa-dashboard"></i>
                                <span>我的控制台</span>
                            </a>
                        </li>
                        <li>
                            <a href="javascript:void(0)" className="has-sub" onClick={this.handleToggleSub}>
                                <i className="fa fa-sitemap"></i>
                                <span>站点维护</span>
                                <span className="pull-right">
                                    <i className="fa fa-plus"></i>
                                </span>
                            </a>
                            <ul style={{display: 'none'}}>
                                <li>
                                    <a href="javascript:void(0)">站点信息</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)">会员管理</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)">站长管理</a>
                                </li>
                            </ul>
                        </li>
                        <li className="has-sub">
                            <a href="javascript:void(0)" className="has-sub" onClick={this.handleToggleSub}>
                                <i className="fa fa-th-list"></i>
                                <span>栏目管理</span>
                                <span className="pull-right">
                                    <i className="fa fa-plus"></i>
                                </span>
                            </a>
                            <ul id="channelTree" style={{display: 'none'}}>
                                <li>首页</li>
                                <li>产品一览</li>
                            </ul>
                        </li>
                        <li className="has-sub">
                            <a href="javascript:void(0)">内容管理</a>
                            <ul id="channelTree" style={{display: 'none'}}>
                                <li>首页</li>
                                <li>产品一览</li>
                            </ul>
                        </li>
                        <li className="has-sub">
                            <a href="javascript:void(0)">系统管理</a>
                            <ul id="channelTree" style={{display: 'none'}}>
                                <li>用户一览</li>
                                <li>产品一览</li>
                            </ul>
                        </li>
                        <li className="has-sub">
                            <a href="javascript:void(0)">个人账户</a>
                            <ul id="channelTree" style={{display: 'none'}}>
                                <li>首页</li>
                                <li>产品一览</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
});