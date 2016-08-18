var PasswordActions = Reflux.createActions(['updateUserPassword']);

var PasswordStore = Reflux.createStore({
    listenables: [PasswordActions],
    onUpdateUserPassword:function(data){
        var url = SiteProperties.serverURL + API.updateUserPassword;

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
            } else if(result.status == 203){
                $("#messageBox").show().text(Message.OLD_PASSWORD_WRONG);
            }
        };

        ajaxPost(url, data, callback);
    },
});

var Password = React.createClass({displayName: "Password",
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
            React.createElement("div", null, 
                React.createElement(Header, null), 

                React.createElement("div", {id: "main", className: "container-fluid margin-top-60 margin-bottom-60"}, 
                    React.createElement(SideBar, {activeMenuID: "menuPassword"}), 
                    React.createElement("div", {className: "content-page"}, 
                        React.createElement(Breadcrumb, {page: Page.password}), 
                        React.createElement("div", {className: "panel panel-default"}, 
                            React.createElement("div", {className: "panel-heading"}, "密码重设"), 
                            React.createElement("div", {className: "panel-body"}, 
                                React.createElement("div", {className: "form-group"}, 
                                    React.createElement("div", {className: "control-label"}, 
                                    React.createElement("label", null, "旧密码")
                                    ), 
                                    React.createElement("input", {id: "inputOldPassword", ref: "inputOldPassword", type: "password", className: "form-control"})
                                ), 
                                React.createElement("div", {className: "form-group"}, 
                                    React.createElement("div", {className: "control-label"}, 
                                        React.createElement("label", null, "新密码")
                                    ), 
                                    React.createElement("input", {id: "inputNewPassword", ref: "inputNewPassword", type: "password", className: "form-control"})
                                ), 
                                React.createElement("div", {className: "form-group"}, 
                                    React.createElement("div", {className: "control-label"}, 
                                        React.createElement("label", null, "新密码确认")
                                    ), 
                                    React.createElement("input", {id: "inputNewPasswordConfirm", ref: "inputNewPasswordConfirm", type: "password", className: "form-control"})
                                )
                            )
                        ), 

                        React.createElement("div", {className: "text-right"}, 
                            React.createElement("button", {className: "btn btn-primary", type: "button", onClick: this.handleSave}, "保 存"
                            )
                        ), 

                        React.createElement(Footer, null)
                    )
                )

            )
        );
    }
});

ReactDOM.render(
    React.createElement(Password, null),
    document.getElementById('page')
);
