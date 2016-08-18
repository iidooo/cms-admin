var AccessActions = Reflux.createActions(['getSecurityClient', 'updateSite']);

var AccessStore = Reflux.createStore({
    listenables: [AccessActions],
    onGetSecurityClient:function(data){
        var url = SiteProperties.serverURL + CoreAPI.getSecurityClient;
        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;
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

        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;
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

var Access = React.createClass({
    mixins: [Reflux.connect(AccessStore, 'securityClient')],
    getInitialState: function () {
        return {
            securityClient: {}
        };
    },
    componentDidMount: function(){
        this.state.appID = sessionStorage.getItem(SessionKey.siteCode);
        AccessActions.getSecurityClient(this.state);
    },
    componentDidUpdate: function () {
        this.refs.inputaccessKey.value = this.state.securityClient.appID;
        this.refs.inputaccessSecret.value = this.state.securityClient.secret;
    },
    render: function () {
        return (
            <div>
                <Header/>

                <div id="main" className="container-fluid margin-top-60">
                    <SideBar activeMenuID="menuAccessManage"/>

                    <div className="content-page">
                        <Breadcrumb page={Page.access}/>

                        <div className="panel panel-default">
                            <div className="panel-heading">API Access Key 维护</div>
                            <div className="panel-body">
                                <div className="form-group">
                                    <div className="control-label">
                                        <label>accessKey</label>
                                    </div>
                                    <input id="inputaccessKey" ref="inputaccessKey" type="text" className="form-control" disabled="disabled"/>
                                </div>
                                <div className="form-group">
                                    <div className="control-label">
                                        <label>accessSecret</label>
                                    </div>
                                    <input id="inputaccessSecret" ref="inputaccessSecret" type="text" className="form-control" disabled="disabled"/>
                                </div>
                            </div>
                        </div>

                        <Footer/>

                    </div>
                </div>

            </div>
        );
    }
});

ReactDOM.render(
    <Access />,
    document.getElementById('page')
);