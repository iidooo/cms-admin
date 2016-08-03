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
                <Header activeMenuID="menuAccountManage"/>

                <div id="main" className="container margin-top-70 margin-bottom-70">
                    <MessageBox/>
                    <div className="col-sm-3">
                        <div className="list-group">
                            <a href={SiteProperties.clientURL + Page.account} className="list-group-item active">
                                账户设定
                            </a>
                            <a href={SiteProperties.clientURL + Page.password} className="list-group-item">密码重设</a>
                        </div>
                    </div>
                    <div className="col-sm-9">
                        <div className="panel panel-default">
                            <div className="panel-heading">账户设定</div>
                            <div className="panel-body">
                                <div className="form-group">
                                    <div className="control-label">
                                    <label>用户名</label>
                                    </div>
                                    <input id="inputUserName" ref="inputUserName" type="text" className="form-control"/>
                                </div>
                                <div className="form-group">
                                    <div className="control-label">
                                        <label>邮箱</label>
                                    </div>
                                    <input id="inputEmail" ref="inputEmail" type="email" className="form-control"/>
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
    <Account/>,
    document.getElementById('page')
);
