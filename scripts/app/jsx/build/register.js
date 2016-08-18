var RegisterActions = Reflux.createActions(['register', 'sendMailVerifyCode']);

var RegisterStore = Reflux.createStore({

    listenables: [RegisterActions],

    onRegister: function (data) {
        var url = SiteProperties.serverURL + API.registerByEmail;
        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;

        var callback = function (result) {
            console.log(result);
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
    },
    onSendMailVerifyCode: function(data){
        var url = SiteProperties.serverURL + API.sendMailVerifyCode;
        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;

        var callback = function (result) {
            console.log(result);
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

var Register = React.createClass({displayName: "Register",
    render: function () {
        return (
            React.createElement("div", {className: "container"}, 
                React.createElement(RegisterForm, null)
            )
        );
    }
});


var RegisterForm = React.createClass({displayName: "RegisterForm",
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
    handleSendVerifyCode : function(){
        this.timer = null;
        // 倒计时
        var second = 30;
        var $btnSendVerifyCode = $("#btnSendVerifyCode");
        var btnSendVerifyCodeText = $btnSendVerifyCode.text();
        $btnSendVerifyCode.attr("disabled", true);
        this.timer = setInterval(function () {
            if (second > 0) {
                second--;
                $btnSendVerifyCode.text(btnSendVerifyCodeText + "(" + second + "S)");
            } else {
                clearInterval(this.timer);
                $btnSendVerifyCode.text(btnSendVerifyCodeText);
                $btnSendVerifyCode.attr("disabled", false);
            }
        }.bind(this), 1000);
    },
    render: function () {
        return (
            React.createElement("div", {id: "registerForm"}, 
                React.createElement(MessageBox, null), 

                React.createElement("h3", {className: "text-center"}, 
                    React.createElement("stong", null, "EDO CMS System Register")
                ), 
                React.createElement("div", {className: "registerFrame"}, 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("label", null, "用户名"), 
                        React.createElement("input", {ref: "inputUserName", type: "text", placeholder: "请输入用户名", className: "form-control input-lg"})
                    ), 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("label", null, "邮箱"), 
                        React.createElement("input", {ref: "inputEmail", type: "email", placeholder: "请输入邮箱地址", className: "form-control input-lg"})
                    ), 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("label", null, "新密码"), 
                        React.createElement("input", {ref: "inputPassword", type: "password", placeholder: "请输入密码", 
                               className: "form-control input-lg"})
                    ), 
                    React.createElement("div", {id: "divSendVerifyCode", className: "form-group"}, 
                        React.createElement("label", null, "验证码"), 
                        React.createElement("div", {className: "form-inline"}, 
                            React.createElement("input", {ref: "inputVerifyCode", type: "text", placeholder: "请输入验证码", className: "form-control input-lg"}), 
                            React.createElement("button", {id: "btnSendVerifyCode", type: "button", className: "btn btn-warning btn-lg width-per-40", onClick: this.handleSendVerifyCode}, 
                                "发送验证码"
                            )
                        )
                    ), 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("button", {type: "button", className: "btn btn-primary btn-lg btn-block", onClick: this.handleLogin}, 
                            "确认"
                        )
                    ), 

                    React.createElement("div", null, 
                        React.createElement("div", {className: "text-right"}, 
                            React.createElement("label", null, "已有账号？"), React.createElement("a", {href: SiteProperties.clientURL + Page.login}, "登陆")
                        )
                    )
                ), 
                React.createElement(Footer, null)
            )
        );
    }
});

ReactDOM.render(
    React.createElement(Register, null),
    document.getElementById('page')
);

