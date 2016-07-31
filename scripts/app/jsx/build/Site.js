var SiteActions = Reflux.createActions(['getSite', 'updateSite']);

var SiteStore = Reflux.createStore({
    listenables: [SiteActions],
    onGetSite:function(data){
        var url = SiteProperties.serverURL + API.getSite;

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
            }
        };

        ajaxPost(url, data, callback);
    },
    onUpdateSite:function(data){
        var url = SiteProperties.serverURL + API.updateSite;

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
                alert(Message.SAVE_SUCCESS);
                self.trigger(result.data);
            }
        };

        ajaxPost(url, data, callback);
    },
});

var Site = React.createClass({displayName: "Site",
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
            React.createElement("div", null, 
                React.createElement(Header, null), 

                React.createElement("div", {id: "main", className: "container-fluid margin-top-70"}, 
                    React.createElement(SideBarMenu, {activeMenuID: "menuSiteMaintenance", activeMenuLinkID: "menuLinkSite"}), 

                    React.createElement("div", {className: "content-page"}, 
                        React.createElement(Breadcrumb, {page: Page.site}), 

                        React.createElement("div", {className: "panel panel-default"}, 
                            React.createElement("div", {className: "panel-heading"}, "站点信息维护"), 
                            React.createElement("div", {className: "panel-body"}, 
                                React.createElement("div", {className: "form-group"}, 
                                    React.createElement("div", {className: "control-label"}, 
                                        React.createElement("label", null, "站点Code")
                                    ), 
                                    React.createElement("input", {id: "inputSiteCode", ref: "inputSiteCode", type: "text", className: "form-control", disabled: "disabled"})
                                ), 
                                React.createElement("div", {className: "form-group"}, 
                                    React.createElement("div", {className: "control-label"}, 
                                        React.createElement("label", null, "站点名称")
                                    ), 
                                    React.createElement("input", {id: "inputSiteName", ref: "inputSiteName", type: "text", className: "form-control"})
                                ), 
                                React.createElement("div", {className: "form-group"}, 
                                    React.createElement("div", {className: "control-label"}, 
                                        React.createElement("label", null, "站点URL")
                                    ), 
                                    React.createElement("input", {id: "inputSiteURL", ref: "inputSiteURL", type: "text", className: "form-control"})
                                ), 
                                React.createElement("div", {className: "form-group"}, 
                                    React.createElement("div", {className: "control-label"}, 
                                        React.createElement("label", null, "备注")
                                    ), 
                                    React.createElement("textarea", {id: "inputRemarks", ref: "inputRemarks", rows: "5", type: "text", className: "form-control"})
                                )
                            )
                        ), 

                        React.createElement("div", {className: "text-right"}, 
                            React.createElement("button", {className: "btn btn-primary", type: "button", onClick: this.handleSave}, "保 存"
                            )
                        )

                    )
                )

            )
        );
    }
});

ReactDOM.render(
    React.createElement(Site, null),
    document.getElementById('page')
);