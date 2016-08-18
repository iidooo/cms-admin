var AccountActions = Reflux.createActions(['getUser','updateUserInfo']);

var AccountStore = Reflux.createStore({
    listenables: [AccountActions],
    onGetUser: function (data) {
        var url = SiteProperties.serverURL + API.getUser;

        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;
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

        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;
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

var Account = React.createClass({displayName: "Account",
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
            React.createElement("div", null, 
                React.createElement(Header, {activeMenuID: "menuAccountManage"}), 

                React.createElement("div", {id: "main", className: "container margin-top-70 margin-bottom-70"}, 
                    React.createElement(MessageBox, null), 
                    React.createElement("div", {className: "col-sm-3"}, 
                        React.createElement("div", {className: "list-group"}, 
                            React.createElement("a", {href: SiteProperties.clientURL + Page.account, className: "list-group-item active"}, 
                                "账户设定"
                            ), 
                            React.createElement("a", {href: SiteProperties.clientURL + Page.password, className: "list-group-item"}, "密码重设")
                        )
                    ), 
                    React.createElement("div", {className: "col-sm-9"}, 
                        React.createElement("div", {className: "panel panel-default"}, 
                            React.createElement("div", {className: "panel-heading"}, "账户设定"), 
                            React.createElement("div", {className: "panel-body"}, 
                                React.createElement("div", {className: "form-group"}, 
                                    React.createElement("div", {className: "control-label"}, 
                                    React.createElement("label", null, "用户名")
                                    ), 
                                    React.createElement("input", {id: "inputUserName", ref: "inputUserName", type: "text", className: "form-control"})
                                ), 
                                React.createElement("div", {className: "form-group"}, 
                                    React.createElement("div", {className: "control-label"}, 
                                        React.createElement("label", null, "邮箱")
                                    ), 
                                    React.createElement("input", {id: "inputEmail", ref: "inputEmail", type: "email", className: "form-control"})
                                )
                            )
                        ), 

                        React.createElement("div", {className: "text-right"}, 
                            React.createElement("button", {className: "btn btn-primary", type: "button", onClick: this.handleSave}, "保 存"
                            )
                        )
                    )
                )

            )
        );
    }
});

ReactDOM.render(
    React.createElement(Account, null),
    document.getElementById('page')
);
