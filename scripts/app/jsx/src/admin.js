var AdminActions = Reflux.createActions(['getUser','updateUserInfo']);

var AdminStore = Reflux.createStore({
    listenables: [AdminActions],
    onGetUser: function (data) {
        var url = SiteProperties.serverURL + API.getSiteUser;

        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.operatorID = sessionStorage.getItem(SessionKey.operatorID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);
        data.userID = sessionStorage.getItem(SessionKey.userID);
        // 检查token是否过期
        if (data.accessToken == null || data.accessToken == "") {
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
    onUpdateUserInfo:function(data){
        var url = SiteProperties.serverURL + API.updateSiteUser;

        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.operatorID = sessionStorage.getItem(SessionKey.operatorID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);
        data.userID = sessionStorage.getItem(SessionKey.userID);
        // 检查token是否过期
        if (data.accessToken == null || data.accessToken == "") {
            location.href = SiteProperties.clientURL + Page.login;
            return false;
        }

        var self = this;
        var callback = function (result) {
            if (result.status == 200) {
                alert(Message.SAVE_SUCCESS);
            } else if(result.status == 202){
                var field = result.messages[0].field;
                if(field == "email"){
                    $("#messageBox").show().text(Message.EMAIL_REPEAT);
                } else if(field == "userName"){
                    $("#messageBox").show().text(Message.USER_NAME_REPEAT);
                }
            }
        };

        ajaxPost(url, data, callback);
    },
});

var Admin = React.createClass({
    mixins: [Reflux.connect(AdminStore, 'siteUser')],
    getInitialState: function () {
        return {
            siteUser: {}
        };
    },
    componentDidMount: function(){

        AdminActions.getUser(this.state);
    },
    componentDidUpdate: function () {
        this.refs.inputLoginID.value = this.state.siteUser.user.loginID;
        this.refs.inputUserName.value = this.state.siteUser.user.userName;
        this.refs.inputMobile.value = this.state.siteUser.user.mobile;
        this.refs.inputEmail.value = this.state.siteUser.user.email;
        this.refs.inputWeixinID.value = this.state.siteUser.user.weixinID;
        this.refs.inputBirthday.value = new Date(this.state.siteUser.user.birthday).format('yyyy-MM-dd');
        this.refs.inputSex.value = this.state.siteUser.user.sex;
        this.refs.inputRole.value = this.state.siteUser.role;
        this.refs.inputCreateTime.value = new Date(this.state.siteUser.user.createTime).format('yyyy-MM-dd hh:mm:ss');
        this.refs.inputLastLoginTime.value = new Date(this.state.siteUser.user.lastLoginTime).format('yyyy-MM-dd hh:mm:ss');
    },
    handleSave:function(){
        this.state.siteUser.role = this.refs.inputRole.value;

        AdminActions.updateUserInfo(this.state.siteUser);
    },
    render: function () {
        return (
            <div>
                <Header/>

                <div id="main" className="container-fluid margin-top-60">
                    <SideBar activeMenuID="menuAdminsManage"/>
                    <div className="content-page">
                        <Breadcrumb page={Page.admin}/>
                        <div className="panel panel-default">
                            <div className="panel-heading">站长信息</div>
                            <div className="panel-body">
                                <MessageBox/>
                                <div className="row form-horizontal form-group">
                                    <div className="col-sm-6">
                                        <div className="col-sm-3 control-label">
                                            <label>角色</label>
                                        </div>
                                        <div className="col-sm-9">
                                            <select ref="inputRole" className="form-control">
                                                <option value="1">管理员</option>
                                                <option value="2">编辑</option>
                                                <option value="3">普通会员</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="col-sm-3 control-label">
                                            <label>用户ID</label>
                                        </div>
                                        <div className="col-sm-9">
                                            <input id="inputLoginID" ref="inputLoginID" type="text" className="form-control" disabled="disabled"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row form-horizontal form-group">
                                    <div className="col-sm-6">
                                        <div className="col-sm-3 control-label">
                                            <label>用户名</label>
                                        </div>
                                        <div className="col-sm-9">
                                            <input id="inputUserName" ref="inputUserName" type="text" className="form-control" disabled="disabled"/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="col-sm-3 control-label">
                                            <label>邮箱</label>
                                        </div>
                                        <div className="col-sm-9">
                                            <input id="inputEmail" ref="inputEmail" type="text" className="form-control" disabled="disabled"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row form-horizontal form-group">
                                    <div className="col-sm-6">
                                        <div className="col-sm-3 control-label">
                                            <label>电话</label>
                                        </div>
                                        <div className="col-sm-9">
                                            <input id="inputMobile" ref="inputMobile" type="text" className="form-control" disabled="disabled"/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="col-sm-3 control-label">
                                            <label>微信号</label>
                                        </div>
                                        <div className="col-sm-9">
                                            <input id="inputWeixinID" ref="inputWeixinID" type="text" className="form-control" disabled="disabled"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row form-horizontal form-group">
                                    <div className="col-sm-6">
                                        <div className="col-sm-3 control-label">
                                            <label>性别</label>
                                        </div>
                                        <div className="col-sm-9">
                                            <select ref="inputSex" className="form-control" disabled="disabled">
                                                <option value="1">男</option>
                                                <option value="2">女</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="col-sm-3 control-label">
                                            <label>生日</label>
                                        </div>
                                        <div className="col-sm-9">
                                            <input id="inputBirthday" className="form-control" type="text" ref="inputBirthday"  disabled="disabled"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row form-horizontal form-group">
                                    <div className="col-sm-6">
                                        <div className="col-sm-3 control-label">
                                            <label>注册日期</label>
                                        </div>
                                        <div className="col-sm-9">
                                            <input id="inputCreateTime" ref="inputCreateTime" type="text" className="form-control" disabled="disabled"/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="col-sm-3 control-label">
                                            <label>最后登录日期</label>
                                        </div>
                                        <div className="col-sm-9">
                                            <input id="inputLastLoginTime" ref="inputLastLoginTime" type="text" className="form-control" disabled="disabled"/>
                                        </div>
                                    </div>
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
    <Admin/>,
    document.getElementById('page')
);
