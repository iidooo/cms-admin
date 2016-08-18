var SitesActions = Reflux.createActions(['getRelatedSiteList']);

var SitesStore = Reflux.createStore({
    listenables: [SitesActions],
    onGetRelatedSiteList: function (data) {

        var url = SiteProperties.serverURL + API.getRelatedSiteList;
        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;
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
                    $.each(site.ownerList, function (ownerIndex, owner) {
                        if (owner.userID == data.operatorID) {
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

var Sites = React.createClass({displayName: "Sites",
    mixins: [Reflux.connect(SitesStore, 'sites')],
    getInitialState: function () {
        return {
            sites: []
        };
    },
    componentWillMount: function () {
        SitesActions.getRelatedSiteList(this.state);
    },
    handleCreateSite: function () {
        $('#siteDialog').modal('show');
    },
    render: function () {
        return (
            React.createElement("div", null, 
                React.createElement(Header, null), 
                React.createElement(SiteDialog, null), 

                React.createElement("div", {id: "main", className: "container-fluid margin-top-60"}, 
                    React.createElement("h2", {className: "height-30"}, 
                        React.createElement("div", {className: "pull-left"}, 
                            "我的站点"
                        ), 
                        React.createElement("div", {className: "pull-right"}, 
                            React.createElement("a", {href: "javascript:void(0)", onClick: this.handleCreateSite, className: "btn btn-primary"}, 
                                React.createElement("i", {className: "fa fa-plus"}), "  ", 
                                React.createElement("span", null, "增加一个新站点")
                            )
                        )
                    ), 
                    React.createElement("div", {className: "spacer10"}), 
                    React.createElement(SitesTable, {sites: this.state.sites}), 

                    React.createElement(Footer, null)
                )
            )
        );
    }
});

var SitesTable = React.createClass({displayName: "SitesTable",
    render: function () {
        return (
            React.createElement("table", {className: "table table-hover margin-bottom-60"}, 
                React.createElement("thead", null, 
                React.createElement("tr", null, 
                    React.createElement("th", {className: "col-sm-2"}, "站点Code"), 
                    React.createElement("th", {className: "col-sm-2"}, "站点名称"), 
                    React.createElement("th", {className: "col-sm-4"}, "站点URL"), 
                    React.createElement("th", {className: "col-sm-2"}, "站长"), 
                    React.createElement("th", {className: "col-sm-2"}, "创建时间")
                )
                ), 
                React.createElement("tbody", null, 
                this.props.sites.map(function (item) {
                    return React.createElement(SitesTableRow, {key: item.siteID, site: item})
                })
                )
            )
        );
    }
});

var SitesTableRow = React.createClass({displayName: "SitesTableRow",
    handleLink: function (site) {
        sessionStorage.setItem(SessionKey.siteID, site.siteID);
        sessionStorage.setItem(SessionKey.siteCode, site.siteCode);
        location.href = SiteProperties.clientURL + Page.dashboard;
    },
    render: function () {
        return (
            React.createElement("tr", null, 
                React.createElement("td", null, React.createElement("a", {href: "javascript:void(0)", 
                       onClick: this.handleLink.bind(null, this.props.site)}, this.props.site.siteCode)), 
                React.createElement("td", null, this.props.site.siteName), 
                React.createElement("td", null, React.createElement("a", {href: this.props.site.siteURL, target: "_blank"}, this.props.site.siteURL)), 
                React.createElement("td", null, this.props.site.createUser.userName), 
                React.createElement("td", null, new Date(this.props.site.createTime).format('yyyy-MM-dd hh:mm:ss'))
            )
        );
    }
});


var SiteDialogActions = Reflux.createActions(['createSite']);
var SiteDialogStore = Reflux.createStore({
    listenables: [SiteDialogActions],
    onCreateSite: function (data) {

        var url = SiteProperties.serverURL + API.createSite;
        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;
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
                alert(Message.SAVE_SUCCESS);
                location.href = SiteProperties.clientURL + Page.sites;
            } else if (result.status == 404) {
                $("#messageBox").show().text(Message.SITE_CODE_REPEAT);
            } else {
                console.log(result);
            }
        };

        ajaxPost(url, data, callback);
    },
});

var SiteDialog = React.createClass({displayName: "SiteDialog",
    getInitialState: function () {
        return {
        };
    },
    handleConfirm: function () {

        this.state.siteCode = this.refs.inputSiteCode.value;
        this.state.siteName = this.refs.inputSiteName.value;
        this.state.siteURL = this.refs.inputSiteURL.value;
        this.state.remarks = this.refs.inputRemarks.value;

        if(this.state.siteCode == "" || this.state.siteName == ""){
            $("#inputSiteCode").addClass("input-error");
            $("#inputSiteName").addClass("input-error");
            $("#messageBox").show().text(Message.INPUT_REQUIRED);
            return;
        }

        if(!validateEnglish(this.state.siteCode)){
            $("#messageBox").show().text(Message.SITE_CODE_ENGLISH);
            return;
        }

        SiteDialogActions.createSite(this.state);
    },
    handleClose: function () {
        $('#siteDialog').modal('toggle');
    },
    render: function () {
        return (
            React.createElement("div", {className: "modal fade", id: "siteDialog", tabindex: "-1", role: "dialog", "aria-labelledby": "dialogTitle"}, 
                React.createElement("div", {className: "modal-dialog", role: "document"}, 
                    React.createElement("div", {className: "modal-content"}, 
                        React.createElement("div", {className: "modal-header"}, 
                            React.createElement("button", {type: "button", className: "close", onClick: this.handleClose}, 
                                React.createElement("span", {"aria-hidden": "true"}, "×")
                            ), 
                            React.createElement("h4", {className: "modal-title", id: "dialogTitle"}, "站点添加")
                        ), 
                        React.createElement("div", {className: "modal-body"}, 
                            React.createElement(MessageBox, null), 

                            React.createElement("div", {className: "form-group"}, 
                                React.createElement("div", {className: "control-label"}, 
                                    React.createElement("label", null, "站点Code")
                                ), 
                                React.createElement("input", {id: "inputSiteCode", ref: "inputSiteCode", type: "text", className: "form-control"})
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
                                React.createElement("textarea", {id: "inputRemarks", ref: "inputRemarks", rows: "5", type: "text", 
                                          className: "form-control"})
                            )
                        ), 
                        React.createElement("div", {className: "modal-footer"}, 
                            React.createElement("button", {type: "button", className: "btn btn-default", onClick: this.handleClose}, "取消"), 
                            React.createElement("button", {type: "button", className: "btn btn-primary", onClick: this.handleConfirm}, "确定")
                        )
                    )
                )
            )
        );
    }
});

ReactDOM.render(
    React.createElement(Sites, null),
    document.getElementById('page')
);