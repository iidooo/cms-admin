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

var Access = React.createClass({displayName: "Access",
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
            React.createElement("div", null, 
                React.createElement(Header, null), 

                React.createElement("div", {id: "main", className: "container-fluid margin-top-60"}, 
                    React.createElement(SideBar, {activeMenuID: "menuAccessManage"}), 

                    React.createElement("div", {className: "content-page"}, 
                        React.createElement(Breadcrumb, {page: Page.access}), 

                        React.createElement("div", {className: "panel panel-default"}, 
                            React.createElement("div", {className: "panel-heading"}, "API Access Key 维护"), 
                            React.createElement("div", {className: "panel-body"}, 
                                React.createElement("div", {className: "form-group"}, 
                                    React.createElement("div", {className: "control-label"}, 
                                        React.createElement("label", null, "accessKey")
                                    ), 
                                    React.createElement("input", {id: "inputaccessKey", ref: "inputaccessKey", type: "text", className: "form-control", disabled: "disabled"})
                                ), 
                                React.createElement("div", {className: "form-group"}, 
                                    React.createElement("div", {className: "control-label"}, 
                                        React.createElement("label", null, "accessSecret")
                                    ), 
                                    React.createElement("input", {id: "inputaccessSecret", ref: "inputaccessSecret", type: "text", className: "form-control", disabled: "disabled"})
                                )
                            )
                        ), 

                        React.createElement(Footer, null)

                    )
                )

            )
        );
    }
});

ReactDOM.render(
    React.createElement(Access, null),
    document.getElementById('page')
);