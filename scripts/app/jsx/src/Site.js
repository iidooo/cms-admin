var SiteActions = Reflux.createActions(['getSite', 'updateSite']);

var SiteStore = Reflux.createStore({
    listenables: [SiteActions],
    onGetSite:function(data){
        var url = SiteProperties.serverURL + API.getSite;

        data.appID = SecurityClient.appID;
        data.secret = SecurityClient.secret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.operatorID = sessionStorage.getItem(SessionKey.operatorID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);
        // 检查token是否过期
        if (data.accessToken == null || data.accessToken == "") {
            location.href = SiteProperties.clientURL + Page.login;
            return false;
        }

        var self = this;
        var callback = function (result) {
            if (result.status == 200) {
                self.trigger(result.data);
            }
        };

        ajaxPost(url, data, callback);
    },
    onUpdateSite:function(data){
        var url = SiteProperties.serverURL + API.updateSite;

        data.appID = SecurityClient.appID;
        data.secret = SecurityClient.secret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.operatorID = sessionStorage.getItem(SessionKey.operatorID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);
        // 检查token是否过期
        if (data.accessToken == null || data.accessToken == "") {
            location.href = SiteProperties.clientURL + Page.login;
            return false;
        }

        var self = this;
        var callback = function (result) {
            if (result.status == 200) {
                alert(Message.SAVE_SUCCESS);
                self.trigger(result.data);
            }
        };

        ajaxPost(url, data, callback);
    },
});

var Site = React.createClass({
    mixins: [Reflux.connect(SiteStore, 'site')],
    getInitialState: function () {
        return {
            site: {}
        };
    },
    componentDidMount: function(){
        SiteActions.getSite(this.state);
    },
    componentDidUpdate: function () {
        this.refs.inputSiteCode.value = this.state.site.siteCode;
        this.refs.inputSiteName.value = this.state.site.siteName;
        this.refs.inputSiteURL.value = this.state.site.siteURL;
        this.refs.inputRemarks.value = this.state.site.remarks;
    },
    handleSave : function(){
        this.state.site.siteName = this.refs.inputSiteName.value;
        this.state.site.siteURL = this.refs.inputSiteURL.value;
        this.state.site.remarks = this.refs.inputRemarks.value;

        SiteActions.updateSite(this.state.site);
    },
    render: function () {
        return (
            <div>
                <Header/>

                <div id="main" className="container-fluid margin-top-60">
                    <SideBar activeMenuID="menuLinkSite"/>

                    <div className="content-page">
                        <Breadcrumb page={Page.site}/>

                        <div className="panel panel-default">
                            <div className="panel-heading">站点信息维护</div>
                            <div className="panel-body">
                                <div className="form-group">
                                    <div className="control-label">
                                        <label>站点Code</label>
                                    </div>
                                    <input id="inputSiteCode" ref="inputSiteCode" type="text" className="form-control" disabled="disabled"/>
                                </div>
                                <div className="form-group">
                                    <div className="control-label">
                                        <label>站点名称</label>
                                    </div>
                                    <input id="inputSiteName" ref="inputSiteName" type="text" className="form-control"/>
                                </div>
                                <div className="form-group">
                                    <div className="control-label">
                                        <label>站点URL</label>
                                    </div>
                                    <input id="inputSiteURL" ref="inputSiteURL" type="text" className="form-control"/>
                                </div>
                                <div className="form-group">
                                    <div className="control-label">
                                        <label>备注</label>
                                    </div>
                                    <textarea id="inputRemarks" ref="inputRemarks" rows="5" type="text" className="form-control"></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <button className="btn btn-primary" type="button" onClick={this.handleSave}>保&nbsp;存
                            </button>
                        </div>

                        <Footer/>

                    </div>
                </div>

            </div>
        );
    }
});

ReactDOM.render(
    <Site />,
    document.getElementById('page')
);