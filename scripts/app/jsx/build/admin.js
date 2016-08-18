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

var Admin = React.createClass({displayName: "Admin",
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
            React.createElement("div", null, 
                React.createElement(Header, null), 

                React.createElement("div", {id: "main", className: "container-fluid margin-top-60"}, 
                    React.createElement(SideBar, {activeMenuID: "menuAdminsManage"}), 
                    React.createElement("div", {className: "content-page"}, 
                        React.createElement(Breadcrumb, {page: Page.admin}), 
                        React.createElement("div", {className: "panel panel-default"}, 
                            React.createElement("div", {className: "panel-heading"}, "站长信息"), 
                            React.createElement("div", {className: "panel-body"}, 
                                React.createElement(MessageBox, null), 
                                React.createElement("div", {className: "row form-horizontal form-group"}, 
                                    React.createElement("div", {className: "col-sm-6"}, 
                                        React.createElement("div", {className: "col-sm-3 control-label"}, 
                                            React.createElement("label", null, "角色")
                                        ), 
                                        React.createElement("div", {className: "col-sm-9"}, 
                                            React.createElement("select", {ref: "inputRole", className: "form-control"}, 
                                                React.createElement("option", {value: "1"}, "管理员"), 
                                                React.createElement("option", {value: "2"}, "编辑"), 
                                                React.createElement("option", {value: "3"}, "普通会员")
                                            )
                                        )
                                    ), 
                                    React.createElement("div", {className: "col-sm-6"}, 
                                        React.createElement("div", {className: "col-sm-3 control-label"}, 
                                            React.createElement("label", null, "用户ID")
                                        ), 
                                        React.createElement("div", {className: "col-sm-9"}, 
                                            React.createElement("input", {id: "inputLoginID", ref: "inputLoginID", type: "text", className: "form-control", disabled: "disabled"})
                                        )
                                    )
                                ), 
                                React.createElement("div", {className: "row form-horizontal form-group"}, 
                                    React.createElement("div", {className: "col-sm-6"}, 
                                        React.createElement("div", {className: "col-sm-3 control-label"}, 
                                            React.createElement("label", null, "用户名")
                                        ), 
                                        React.createElement("div", {className: "col-sm-9"}, 
                                            React.createElement("input", {id: "inputUserName", ref: "inputUserName", type: "text", className: "form-control", disabled: "disabled"})
                                        )
                                    ), 
                                    React.createElement("div", {className: "col-sm-6"}, 
                                        React.createElement("div", {className: "col-sm-3 control-label"}, 
                                            React.createElement("label", null, "邮箱")
                                        ), 
                                        React.createElement("div", {className: "col-sm-9"}, 
                                            React.createElement("input", {id: "inputEmail", ref: "inputEmail", type: "text", className: "form-control", disabled: "disabled"})
                                        )
                                    )
                                ), 
                                React.createElement("div", {className: "row form-horizontal form-group"}, 
                                    React.createElement("div", {className: "col-sm-6"}, 
                                        React.createElement("div", {className: "col-sm-3 control-label"}, 
                                            React.createElement("label", null, "电话")
                                        ), 
                                        React.createElement("div", {className: "col-sm-9"}, 
                                            React.createElement("input", {id: "inputMobile", ref: "inputMobile", type: "text", className: "form-control", disabled: "disabled"})
                                        )
                                    ), 
                                    React.createElement("div", {className: "col-sm-6"}, 
                                        React.createElement("div", {className: "col-sm-3 control-label"}, 
                                            React.createElement("label", null, "微信号")
                                        ), 
                                        React.createElement("div", {className: "col-sm-9"}, 
                                            React.createElement("input", {id: "inputWeixinID", ref: "inputWeixinID", type: "text", className: "form-control", disabled: "disabled"})
                                        )
                                    )
                                ), 
                                React.createElement("div", {className: "row form-horizontal form-group"}, 
                                    React.createElement("div", {className: "col-sm-6"}, 
                                        React.createElement("div", {className: "col-sm-3 control-label"}, 
                                            React.createElement("label", null, "性别")
                                        ), 
                                        React.createElement("div", {className: "col-sm-9"}, 
                                            React.createElement("select", {ref: "inputSex", className: "form-control", disabled: "disabled"}, 
                                                React.createElement("option", {value: "1"}, "男"), 
                                                React.createElement("option", {value: "2"}, "女")
                                            )
                                        )
                                    ), 
                                    React.createElement("div", {className: "col-sm-6"}, 
                                        React.createElement("div", {className: "col-sm-3 control-label"}, 
                                            React.createElement("label", null, "生日")
                                        ), 
                                        React.createElement("div", {className: "col-sm-9"}, 
                                            React.createElement("input", {id: "inputBirthday", className: "form-control", type: "text", ref: "inputBirthday", disabled: "disabled"})
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
    React.createElement(Admin, null),
    document.getElementById('page')
);
