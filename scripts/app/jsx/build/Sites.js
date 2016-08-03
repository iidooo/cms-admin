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
    handleCreateSite : function(){
        alert("还未开放该功能！");
    },
    render: function () {
        return (
            React.createElement("div", null, 
                React.createElement(Header, null), 

                React.createElement("div", {id: "main", className: "container-fluid margin-top-70"}, 
                    React.createElement("h2", {className: "h-30"}, 
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
                    React.createElement(SitesTable, {sites: this.state.sites})

                )
            )
        );
    }
});

var SitesTable = React.createClass({displayName: "SitesTable",
    render: function () {
        return (
            React.createElement("table", {className: "table table-hover"}, 
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
    handleLink: function (siteID) {
        sessionStorage.setItem(SessionKey.siteID, siteID);
        location.href = SiteProperties.clientURL + Page.dashboard;
    },
    render: function () {
        return (
            React.createElement("tr", null, 
                React.createElement("td", null, React.createElement("a", {href: "javascript:void(0)", onClick: this.handleLink.bind(null, this.props.site.siteID)}, this.props.site.siteCode)), 
                React.createElement("td", null, this.props.site.siteName), 
                React.createElement("td", null, React.createElement("a", {href: this.props.site.siteURL, target: "_blank"}, this.props.site.siteURL)), 
                React.createElement("td", null, this.props.site.createUser.userName), 
                React.createElement("td", null, new Date(this.props.site.createTime).format('yyyy-MM-dd hh:mm:ss'))
            )
        );
    }
});

ReactDOM.render(
    React.createElement(Sites, null),
    document.getElementById('page')
);