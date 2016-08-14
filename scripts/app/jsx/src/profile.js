var AccountActions = Reflux.createActions(['getUser','updateUserInfo']);

var AccountStore = Reflux.createStore({
    listenables: [AccountActions],
    onGetUser: function (data) {
        var url = SiteProperties.serverURL + API.getUser;

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
                sessionStorage.setItem(SessionKey.user, JSON.stringify(result.data));
                self.trigger(result.data);
            } else {
                console.log(result);
            }
        };

        ajaxPost(url, data, callback);
    },
    onUpdateUserInfo:function(data){
        var url = SiteProperties.serverURL + API.updateUserInfo;

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
                sessionStorage.setItem(SessionKey.user, JSON.stringify(result.data));
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

var Account = React.createClass({
    mixins: [Reflux.connect(AccountStore, 'user')],
    getInitialState: function () {
        return {
            user: {}
        };
    },
    componentDidMount: function(){
        AccountActions.getUser(this.state);
    },
    componentDidUpdate: function () {
        this.refs.inputUserName.value = this.state.user.userName;
        this.refs.inputEmail.value = this.state.user.email;
    },
    handleSave:function(){
        this.state.user.userName = this.refs.inputUserName.value;
        this.state.user.email = this.refs.inputEmail.value;
        if(this.state.user.userName == "" || this.state.user.email == ""){
            $("#inputUserName").addClass("input-error");
            $("#inputEmail").addClass("input-error");
            $("#messageBox").show().text(Message.INPUT_REQUIRED);
            return;
        }

        AccountActions.updateUserInfo(this.state.user);
    },
    render: function () {
        return (
            <div>
                <Header/>

                <div id="main" className="container-fluid margin-top-60">
                    <SideBar activeMenuID="menuProfile"/>
                    <div className="content-page">
                        <Breadcrumb page={Page.profile}/>
                        <div className="panel panel-default">
                            <div className="panel-heading">用户信息</div>
                            <div className="panel-body">
                                <MessageBox/>
                                <div className="row form-horizontal form-group">
                                    <div className="col-sm-6">
                                        <div className="col-sm-3 control-label">
                                            <label className="required">用户ID</label>
                                        </div>
                                        <div className="col-sm-9">
                                            <input id="inputLoginID" ref="inputLoginID" type="text" className="form-control"/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="col-sm-3 control-label">
                                            <label className="required">用户名</label>
                                        </div>
                                        <div className="col-sm-9">
                                            <input id="inputUserName" ref="inputUserName" type="text" className="form-control"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row form-horizontal form-group">
                                    <div className="col-sm-6">
                                        <div className="col-sm-3 control-label">
                                            <label>电话</label>
                                        </div>
                                        <div className="col-sm-9">
                                            <input id="inputMobile" ref="inputMobile" type="text" className="form-control"/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="col-sm-3 control-label">
                                            <label className="required">邮箱</label>
                                        </div>
                                        <div className="col-sm-9">
                                            <input id="inputEmail" ref="inputEmail" type="text" className="form-control"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row form-horizontal form-group">
                                    <div className="col-sm-6">
                                        <div className="col-sm-3 control-label">
                                            <label>微信号</label>
                                        </div>
                                        <div className="col-sm-9">
                                            <input id="inputWeixinID" ref="inputWeixinID" type="text" className="form-control"/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="col-sm-3 control-label">
                                            <label>生日</label>
                                        </div>
                                        <div className="col-sm-9">
                                            <div className="input-group date form_date" data-date=""
                                                 data-date-format="yyyy-mm-dd"
                                                 data-link-field="inputBirthday" data-link-format="yyyy-mm-dd">
                                                <input id="inputBirthday" className="form-control" type="text" ref="inputBirthday" readonly/>
                                                <span className="input-group-addon">
                                                    <span className="glyphicon glyphicon-calendar"></span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row form-horizontal form-group">
                                    <div className="col-sm-6">
                                        <div className="col-sm-3 control-label">
                                            <label>性别</label>
                                        </div>
                                        <div className="col-sm-9">
                                            <select ref="inputSex" className="form-control">
                                                <option value="1">男</option>
                                                <option value="2">女</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="col-sm-3 control-label">
                                            <label>状态</label>
                                        </div>
                                        <div className="col-sm-5 checkbox">
                                            <label>
                                                <input type="checkbox" id="checkboxIsSilent" ref="checkboxIsSilent"/>
                                                禁止评论
                                            </label>
                                        </div>
                                        <div className="col-sm-4 checkbox">
                                            <label>
                                                <input type="checkbox" id="checkboxIsDisable" ref="checkboxIsDisable"/>
                                                有效性
                                            </label>
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
    <Account/>,
    document.getElementById('page')
);