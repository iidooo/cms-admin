var AdminsActions = Reflux.createActions(['searchSiteUserList']);

var AdminsStore = Reflux.createStore({
    listenables: [AdminsActions],
    onSearchSiteUserList: function (data) {
        var url = SiteProperties.serverURL + API.searchSiteUserList;
        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.operatorID = sessionStorage.getItem(SessionKey.operatorID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);
        data.roles = "[1,2]";

        // 检查token是否过期
        if (data.accessToken == null || data.accessToken == "") {
            location.href = SiteProperties.clientURL + Page.login;
            return false;
        }

        var self = this;
        var callback = function (result) {

            //console.log(result.data);
            if (result.status == 200) {
                self.trigger(result.data);
            } else {
                console.log(result);
            }
        };

        ajaxPost(url, data, callback);
    }
});

var Admins = React.createClass({
    mixins: [Reflux.connect(AdminsStore, 'usersData')],
    getInitialState: function () {
        return {
            usersData: {
                page: {},
                userList: []
            }
        };
    },
    componentDidMount: function () {
        AdminsActions.searchSiteUserList(this.state);
    },
    onChildChanged: function (childState) {
        if (childState.currentPage != null) {
            this.state.currentPage = childState.currentPage;

            AdminsActions.searchSiteUserList(this.state);
        }
    },
    handleSearch: function(){
        this.state.loginID = this.refs.inputLoginID.value;
        this.state.userName = this.refs.inputUserName.value;
        this.state.sex = this.refs.inputSex.value;
        this.state.mobile = this.refs.inputMobile.value;
        this.state.email = this.refs.inputEmail.value;
        this.state.weixinID = this.refs.inputWeixinID.value;
        AdminsActions.searchSiteUserList(this.state);
    },
    render: function () {
        return (
            <div>
                <Header/>

                <div id="main" className="container-fluid margin-top-60">
                    <SideBar activeMenuID="menuAdminsManage"/>
                    <div className="content-page">
                        <Breadcrumb page={Page.admins}/>
                        <div className="panel panel-default">
                            <div className="panel-heading">查询条件</div>
                            <div className="panel-body">
                                <div className="row form-group form-horizontal">
                                    <div className="col-xs-4">
                                        <div className="col-xs-4 control-label">
                                            <label>用户ID</label>
                                        </div>
                                        <div className="col-xs-8">
                                            <input type="text" className="form-control" ref="inputLoginID"/>
                                        </div>
                                    </div>
                                    <div className="col-xs-4">
                                        <div className="col-xs-4 control-label">
                                            <label>用户名</label>
                                        </div>
                                        <div className="col-xs-8">
                                            <input type="text" className="form-control" ref="inputUserName"/>
                                        </div>
                                    </div>
                                    <div className="col-xs-4">
                                        <div className="col-xs-4 control-label">
                                            <label>用户性别</label>
                                        </div>
                                        <div className="col-xs-8">
                                            <select ref="inputSex" className="form-control">
                                                <option value="">全部</option>
                                                <option value="1">男</option>
                                                <option value="2">女</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row form-group form-horizontal">
                                    <div className="col-xs-4">
                                        <div className="col-xs-4 control-label">
                                            <label>手机号</label>
                                        </div>
                                        <div className="col-xs-8">
                                            <input type="text" className="form-control" ref="inputMobile"/>
                                        </div>
                                    </div>
                                    <div className="col-xs-4">
                                        <div className="col-xs-4 control-label">
                                            <label>Email</label>
                                        </div>
                                        <div className="col-xs-8">
                                            <input type="text" className="form-control" ref="inputEmail"/>
                                        </div>
                                    </div>
                                    <div className="col-xs-4">
                                        <div className="col-xs-4 control-label">
                                            <label>微信号</label>
                                        </div>
                                        <div className="col-xs-8">
                                            <input type="text" className="form-control" ref="inputWeixinID"/>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <button type="button" className="btn btn-primary" onClick={this.handleSearch}>查&nbsp;询</button>
                                </div>
                            </div>
                        </div>
                        <UsersTable userList={this.state.usersData.userList}/>

                        <Pager callbackParent={this.onChildChanged}
                               recordSum={this.state.usersData.page.recordSum}
                               currentPage={this.state.usersData.page.currentPage}
                               pageSum={this.state.usersData.page.pageSum}/>

                        <Footer/>
                    </div>
                </div>

            </div>
        );
    }
});

var UsersTable = React.createClass({
    render: function () {
        return (
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>角色</th>
                    <th>用户ID</th>
                    <th>用户名</th>
                    <th>性别</th>
                    <th>手机号</th>
                    <th>邮箱</th>
                    <th>微信号</th>
                    <th>创建时间</th>
                </tr>
                </thead>
                <tbody>
                {this.props.userList.map(function (item) {
                    return <UsersTableRow key={item.userID} siteUser={item}/>
                })}
                </tbody>
            </table>
        );
    }
});

var UsersTableRow = React.createClass({
    handleLink: function (userID) {
        sessionStorage.setItem(SessionKey.userID, userID);
        location.href = SiteProperties.clientURL + Page.admin;
    },
    render: function () {
        return (
            <tr>
                <td>{SiteRole[this.props.siteUser.role]}</td>
                <td>{this.props.siteUser.user.loginID}</td>
                <td><a href="javascript:void(0)" onClick={this.handleLink.bind(null, this.props.siteUser.userID)}>{this.props.siteUser.user.userName}</a></td>
                <td>{SexMap[this.props.siteUser.user.sex]}</td>
                <td>{this.props.siteUser.user.mobile}</td>
                <td>{this.props.siteUser.user.email}</td>
                <td>{this.props.siteUser.user.weixinID}</td>
                <td>{new Date(this.props.siteUser.user.createTime).format('yyyy-MM-dd hh:mm:ss')}</td>
            </tr>
        );
    }
});

ReactDOM.render(
    <Admins />,
    document.getElementById('page')
);