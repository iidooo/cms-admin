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
    handleCreateSite: function () {
        $('#siteDialog').modal('show');
    },
    render: function () {
        return (
            <div>
                <Header/>
                <SiteDialog/>

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
    handleLink: function (site) {
        sessionStorage.setItem(SessionKey.siteID, site.siteID);
        sessionStorage.setItem(SessionKey.siteCode, site.siteCode);
        location.href = SiteProperties.clientURL + Page.dashboard;
    },
    render: function () {
        return (
            <tr>
                <td><a href="javascript:void(0)"
                       onClick={this.handleLink.bind(null, this.props.site)}>{this.props.site.siteCode}</a></td>
                <td>{this.props.site.siteName}</td>
                <td><a href={this.props.site.siteURL} target="_blank">{this.props.site.siteURL}</a></td>
                <td>{this.props.site.createUser.userName}</td>
                <td>{new Date(this.props.site.createTime).format('yyyy-MM-dd hh:mm:ss')}</td>
            </tr>
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

var SiteDialog = React.createClass({
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
            <div className="modal fade" id="siteDialog" tabindex="-1" role="dialog" aria-labelledby="dialogTitle">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={this.handleClose}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title" id="dialogTitle">站点添加</h4>
                        </div>
                        <div className="modal-body">
                            <MessageBox/>

                            <div className="form-group">
                                <div className="control-label">
                                    <label>站点Code</label>
                                </div>
                                <input id="inputSiteCode" ref="inputSiteCode" type="text" className="form-control"/>
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
                                <textarea id="inputRemarks" ref="inputRemarks" rows="5" type="text"
                                          className="form-control"></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" onClick={this.handleClose}>取消</button>
                            <button type="button" className="btn btn-primary" onClick={this.handleConfirm}>确定</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <Sites/>,
    document.getElementById('page')
);