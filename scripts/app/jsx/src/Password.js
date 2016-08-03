var PasswordActions = Reflux.createActions(['updateUserPassword']);

var PasswordStore = Reflux.createStore({
    listenables: [PasswordActions],
    onUpdateUserPassword:function(data){
        var url = SiteProperties.serverURL + API.updateUserPassword;

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
            } else if(result.status == 203){
                $("#messageBox").show().text(Message.OLD_PASSWORD_WRONG);
            }
        };

        ajaxPost(url, data, callback);
    },
});

var Password = React.createClass({
    getInitialState: function () {
        return {
            oldPassword: "",
            newPassword: "",
            newPasswordConfirm: "",
        };
    },
    handleSave:function(){
        $("#messageBox").hide();
        this.state.oldPassword = this.refs.inputOldPassword.value;
        this.state.newPassword = this.refs.inputNewPassword.value;
        this.state.newPasswordConfirm = this.refs.inputNewPasswordConfirm.value;
        if(this.state.oldPassword == "" || this.state.newPassword == "" || this.state.newPasswordConfirm == ""){
            $("#inputOldPassword").addClass("input-error");
            $("#inputNewPassword").addClass("input-error");
            $("#inputNewPasswordConfirm").addClass("input-error");
            $("#messageBox").show().text(Message.INPUT_REQUIRED);
            return;
        }

        if(this.state.newPassword != this.state.newPasswordConfirm){
            $("#inputNewPassword").addClass("input-error");
            $("#inputNewPasswordConfirm").addClass("input-error");
            $("#messageBox").show().text(Message.TWICE_PASSWORD_NOT_EQUAL);
            return;
        }

        PasswordActions.updateUserPassword(this.state);
    },
    render: function () {
        return (
            <div>
                <Header activeMenuID="menuAccountManage"/>

                <div id="main" className="container margin-top-70 margin-bottom-70">
                    <MessageBox/>
                    <div className="col-sm-3">
                        <div className="list-group">
                            <a href={SiteProperties.clientURL + Page.account} className="list-group-item">
                                账户设定
                            </a>
                            <a href={SiteProperties.clientURL + Page.password} className="list-group-item active">密码重设</a>
                        </div>
                    </div>
                    <div className="col-sm-9">
                        <div className="panel panel-default">
                            <div className="panel-heading">密码重设</div>
                            <div className="panel-body">
                                <div className="form-group">
                                    <div className="control-label">
                                    <label>旧密码</label>
                                    </div>
                                    <input id="inputOldPassword" ref="inputOldPassword" type="password" className="form-control"/>
                                </div>
                                <div className="form-group">
                                    <div className="control-label">
                                        <label>新密码</label>
                                    </div>
                                    <input id="inputNewPassword" ref="inputNewPassword" type="password" className="form-control"/>
                                </div>
                                <div className="form-group">
                                    <div className="control-label">
                                        <label>新密码确认</label>
                                    </div>
                                    <input id="inputNewPasswordConfirm" ref="inputNewPasswordConfirm" type="password" className="form-control"/>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <button className="btn btn-primary" type="button" onClick={this.handleSave}>保&nbsp;存
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
});

ReactDOM.render(
    <Password/>,
    document.getElementById('page')
);
