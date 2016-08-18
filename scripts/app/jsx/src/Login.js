var LoginActions = Reflux.createActions(['login']);

var LoginStore = Reflux.createStore({

    listenables: [LoginActions],

    onLogin: function (data) {
        var url = SiteProperties.serverURL + API.loginByEmail;
        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;

        var callback = function (result) {
            if (result.status == 200) {
                sessionStorage.setItem(SessionKey.accessToken, result.data.token);
                sessionStorage.setItem(SessionKey.operatorID, result.data.userID);
                // 用户信息用的地方比较多，以json格式存储进sessionStorage
                sessionStorage.setItem(SessionKey.user, JSON.stringify(result.data.user));
                location.href = location.href = SiteProperties.clientURL + Page.sites;
            } else {
                var message = Message.LOGIN_FAILED;
                $("#messageBox").show().text(message);
            }
        };

        ajaxPost(url, data, callback);
    }
});

var Login = React.createClass({
    render: function () {
        return (
            <div className="container">
                <LoginForm/>
            </div>
        );
    }
});


var LoginForm = React.createClass({
    getInitialState: function () {
        return {
            email: "",
            password: ""
        }
    },
    handleLogin: function () {
        this.state.email = this.refs.inputEmail.value;
        this.state.password = this.refs.inputPassword.value;
        if(this.state.email == "" || this.state.password == ""){
            alert(Message.LOGIN_INFO_REQUIRED);
            return;
        }
        LoginActions.login(this.state);
    },
    render: function () {
        return (
            <div id="loginForm">
                <MessageBox/>

                <h3 className="text-center">
                    <stong>EDO CMS System</stong>
                </h3>
                <div className="loginFrame">
                    <div className="form-group">
                        <label>邮箱</label>
                        <input ref="inputEmail" type="email" placeholder="请输入邮箱地址" className="form-control input-lg"/>
                    </div>
                    <div className="form-group">
                        <label>密码</label>

                        <div className="pull-right">
                            <a href="#">忘记密码？</a>
                        </div>
                        <input ref="inputPassword" type="password" placeholder="请输入密码"
                               className="form-control input-lg"/>
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-primary btn-lg btn-block" onClick={this.handleLogin}>
                            登录
                        </button>
                    </div>
                    {
                        //<div>
                        //    <div className="text-right">
                        //        <label>还没有账号？</label><a href={SiteProperties.clientURL + Page.register}>免费注册</a>
                        //    </div>
                        //</div>
                    }
                </div>
                <Footer/>
            </div>
        );
    }
});

ReactDOM.render(
    <Login/>,
    document.getElementById('page')
);

