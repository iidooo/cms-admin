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
                React.createElement(Header, null), 

                React.createElement("div", {id: "main", className: "container-fluid margin-top-60"}, 
                    React.createElement(SideBar, {activeMenuID: "menuProfile"}), 
                    React.createElement("div", {className: "content-page"}, 
                        React.createElement(Breadcrumb, {page: Page.profile}), 
                        React.createElement("div", {className: "panel panel-default"}, 
                            React.createElement("div", {className: "panel-heading"}, "用户信息"), 
                            React.createElement("div", {className: "panel-body"}, 
                                React.createElement(MessageBox, null), 
                                React.createElement("div", {className: "row form-horizontal form-group"}, 
                                    React.createElement("div", {className: "col-sm-6"}, 
                                        React.createElement("div", {className: "col-sm-3 control-label"}, 
                                            React.createElement("label", {className: "required"}, "用户ID")
                                        ), 
                                        React.createElement("div", {className: "col-sm-9"}, 
                                            React.createElement("input", {id: "inputLoginID", ref: "inputLoginID", type: "text", className: "form-control"})
                                        )
                                    ), 
                                    React.createElement("div", {className: "col-sm-6"}, 
                                        React.createElement("div", {className: "col-sm-3 control-label"}, 
                                            React.createElement("label", {className: "required"}, "用户名")
                                        ), 
                                        React.createElement("div", {className: "col-sm-9"}, 
                                            React.createElement("input", {id: "inputUserName", ref: "inputUserName", type: "text", className: "form-control"})
                                        )
                                    )
                                ), 
                                React.createElement("div", {className: "row form-horizontal form-group"}, 
                                    React.createElement("div", {className: "col-sm-6"}, 
                                        React.createElement("div", {className: "col-sm-3 control-label"}, 
                                            React.createElement("label", null, "电话")
                                        ), 
                                        React.createElement("div", {className: "col-sm-9"}, 
                                            React.createElement("input", {id: "inputMobile", ref: "inputMobile", type: "text", className: "form-control"})
                                        )
                                    ), 
                                    React.createElement("div", {className: "col-sm-6"}, 
                                        React.createElement("div", {className: "col-sm-3 control-label"}, 
                                            React.createElement("label", {className: "required"}, "邮箱")
                                        ), 
                                        React.createElement("div", {className: "col-sm-9"}, 
                                            React.createElement("input", {id: "inputEmail", ref: "inputEmail", type: "text", className: "form-control"})
                                        )
                                    )
                                ), 
                                React.createElement("div", {className: "row form-horizontal form-group"}, 
                                    React.createElement("div", {className: "col-sm-6"}, 
                                        React.createElement("div", {className: "col-sm-3 control-label"}, 
                                            React.createElement("label", null, "微信号")
                                        ), 
                                        React.createElement("div", {className: "col-sm-9"}, 
                                            React.createElement("input", {id: "inputWeixinID", ref: "inputWeixinID", type: "text", className: "form-control"})
                                        )
                                    ), 
                                    React.createElement("div", {className: "col-sm-6"}, 
                                        React.createElement("div", {className: "col-sm-3 control-label"}, 
                                            React.createElement("label", null, "生日")
                                        ), 
                                        React.createElement("div", {className: "col-sm-9"}, 
                                            React.createElement("div", {className: "input-group date form_date", "data-date": "", 
                                                 "data-date-format": "yyyy-mm-dd", 
                                                 "data-link-field": "inputBirthday", "data-link-format": "yyyy-mm-dd"}, 
                                                React.createElement("input", {id: "inputBirthday", className: "form-control", type: "text", ref: "inputBirthday", readonly: true}), 
                                                React.createElement("span", {className: "input-group-addon"}, 
                                                    React.createElement("span", {className: "glyphicon glyphicon-calendar"})
                                                )
                                            )
                                        )
                                    )
                                ), 
                                React.createElement("div", {className: "row form-horizontal form-group"}, 
                                    React.createElement("div", {className: "col-sm-6"}, 
                                        React.createElement("div", {className: "col-sm-3 control-label"}, 
                                            React.createElement("label", null, "性别")
                                        ), 
                                        React.createElement("div", {className: "col-sm-9"}, 
                                            React.createElement("select", {ref: "inputSex", className: "form-control"}, 
                                                React.createElement("option", {value: "1"}, "男"), 
                                                React.createElement("option", {value: "2"}, "女")
                                            )
                                        )
                                    ), 
                                    React.createElement("div", {className: "col-sm-6"}, 
                                        React.createElement("div", {className: "col-sm-3 control-label"}, 
                                            React.createElement("label", null, "状态")
                                        ), 
                                        React.createElement("div", {className: "col-sm-5 checkbox"}, 
                                            React.createElement("label", null, 
                                                React.createElement("input", {type: "checkbox", id: "checkboxIsSilent", ref: "checkboxIsSilent"}), 
                                                "禁止评论"
                                            )
                                        ), 
                                        React.createElement("div", {className: "col-sm-4 checkbox"}, 
                                            React.createElement("label", null, 
                                                React.createElement("input", {type: "checkbox", id: "checkboxIsDisable", ref: "checkboxIsDisable"}), 
                                                "有效性"
                                            )
                                        )
                                    )
                                ), 
                                React.createElement("div", {className: "row form-horizontal form-group"}, 
                                    React.createElement("div", {className: "col-sm-6"}, 
                                        React.createElement("div", {className: "col-sm-3 control-label"}, 
                                            React.createElement("label", null, "注册日期")
                                        ), 
                                        React.createElement("div", {className: "col-sm-9"}, 
                                            React.createElement("input", {id: "inputCreateTime", ref: "inputCreateTime", type: "text", className: "form-control", disabled: "disabled"})
                                        )
                                    ), 
                                    React.createElement("div", {className: "col-sm-6"}, 
                                        React.createElement("div", {className: "col-sm-3 control-label"}, 
                                            React.createElement("label", null, "最后登录日期")
                                        ), 
                                        React.createElement("div", {className: "col-sm-9"}, 
                                            React.createElement("input", {id: "inputLastLoginTime", ref: "inputLastLoginTime", type: "text", className: "form-control", disabled: "disabled"})
                                        )
                                    )
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
    React.createElement(Account, null),
    document.getElementById('page')
);
