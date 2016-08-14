var SitesActions = Reflux.createActions(['getRelatedSiteList']);

var SitesStore = Reflux.createStore({
    listenables: [SitesActions],
    onGetRelatedSiteList: function (data) {

        var url = SiteProperties.serverURL + API.getRelatedSiteList;
        data.appID = SecurityClient.appID;
        data.secret = SecurityClient.secret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.operatorID = sessionStorage.getItem(SessionKey.operatorID);

        // 检查token是否过期
        if (data.accessToken == null || data.accessToken == "") {
            location.href = SiteProperties.clientURL + Page.login;
            return false;
        }

        var self = this;

        var callback = function (result) {
            if (result.status == 200) {

                // 把站点用户信息建立一个Map存入Session，Sidebar显示用户站点角色时会用到
                var siteMap = {};
                var siteOwnerMap = {};
                $.each(result.data, function (siteIndex, site) {
                    siteMap[site.siteID] = site;
                    $.each(site.ownerList, function(ownerIndex, owner){
                        if(owner.userID == data.operatorID){
                            siteOwnerMap[site.siteID] = owner;
                        }
                    });
                });
                sessionStorage.setItem(SessionKey.siteMap, JSON.stringify(siteMap));
                sessionStorage.setItem(SessionKey.siteOwnerMap, JSON.stringify(siteOwnerMap));

                self.trigger(result.data);
            } else {
                console.log(result);
            }
        };

        ajaxPost(url, data, callback);
    },
});

var Sites = React.createClass({
    mixins: [Reflux.connect(SitesStore, 'sites')],
    getInitialState: function () {
        return {
            sites: []
        };
    },
    componentWillMount: function () {
        SitesActions.getRelatedSiteList(this.state);
    },
    handleCreateSite : function(){
        alert("还未开放该功能！");
    },
    render: function () {
        return (
            <div>
                <Header/>

                <div id="main" className="container-fluid margin-top-60">
                    <h2 className="height-30">
                        <div className="pull-left">
                            我的站点
                        </div>
                        <div className="pull-right">
                            <a href="javascript:void(0)" onClick={this.handleCreateSite} className="btn btn-primary">
                                <i className="fa fa-plus"></i>&nbsp;&nbsp;
                                <span>增加一个新站点</span>
                            </a>
                        </div>
                    </h2>
                    <div className="spacer10"></div>
                    <SitesTable sites={this.state.sites}/>

                    <Footer/>
                </div>
            </div>
        );
    }
});

var SitesTable = React.createClass({
    render: function () {
        return (
            <table className="table table-hover margin-bottom-60">
                <thead>
                <tr>
                    <th className="col-sm-2">站点Code</th>
                    <th className="col-sm-2">站点名称</th>
                    <th className="col-sm-4">站点URL</th>
                    <th className="col-sm-2">站长</th>
                    <th className="col-sm-2">创建时间</th>
                </tr>
                </thead>
                <tbody>
                {this.props.sites.map(function (item) {
                    return <SitesTableRow key={item.siteID} site={item}/>
                })}
                </tbody>
            </table>
        );
    }
});

var SitesTableRow = React.createClass({
    handleLink: function (siteID) {
        sessionStorage.setItem(SessionKey.siteID, siteID);
        location.href = SiteProperties.clientURL + Page.dashboard;
    },
    render: function () {
        return (
            <tr>
                <td><a href="javascript:void(0)" onClick={this.handleLink.bind(null, this.props.site.siteID)}>{this.props.site.siteCode}</a></td>
                <td>{this.props.site.siteName}</td>
                <td><a href={this.props.site.siteURL} target="_blank">{this.props.site.siteURL}</a></td>
                <td>{this.props.site.createUser.userName}</td>
                <td>{new Date(this.props.site.createTime).format('yyyy-MM-dd hh:mm:ss')}</td>
            </tr>
        );
    }
});

ReactDOM.render(
    <Sites/>,
    document.getElementById('page')
);