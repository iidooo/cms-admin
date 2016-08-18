var ProfileActions = Reflux.createActions(['getUser','updateUserInfo']);

var ProfileStore = Reflux.createStore({
    listenables: [ProfileActions],
    onGetUser: function (data) {
        var url = SiteProperties.serverURL + API.getUser;

        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.operatorID = sessionStorage.getItem(SessionKey.operatorID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);
        data.userID = sessionStorage.getItem(SessionKey.operatorID);

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
        data.userID = sessionStorage.getItem(SessionKey.operatorID);

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

var Profile = React.createClass({displayName: "Profile",
    mixins: [Reflux.connect(ProfileStore, 'user')],
    getInitialState: function () {
        return {
            user: {}
        };
    },
    componentDidMount: function(){

        $('.form_date').datetimepicker({
            weekStart: 1,
            todayBtn: 1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            minView: 2,
            forceParse: 0,
            format: 'yyyy-mm-dd'
        });

        //文件上传前触发事件
        $('#uploadPhoto').bind('fileuploadsubmit', function (e, data) {
            data.formData = {
                'accessKey': SecurityClient.accessKey,
                'accessSecret': SecurityClient.accessSecret,
                'accessToken': sessionStorage.getItem(SessionKey.accessToken),
                'operatorID': sessionStorage.getItem(SessionKey.operatorID),
                'siteID': sessionStorage.getItem(SessionKey.siteID),
                'width': '200',
                'height': '200',
                'isCompress': 'true'
            };  //如果需要额外添加参数可以在这里添加
        });

        // 上传内容图片列表
        $("#uploadPhoto").fileupload({
            url: SiteProperties.serverURL + API.uploadFile,
            dataType: 'json',
            autoUpload: true,
            acceptFileTypes: /(\.|\/)(jpe?g|png|gif|bmp)$/i,
            maxNumberOfFiles: 1,
            maxFileSize: 10000000,
            done: function (e, result) {
                var data = result.result;
                if (data.status == "200") {
                    $("#imgPhoto").attr("src", data.data.url);
                    $("#inputPhoto").val(data.data.url);
                } else {
                    console.log(data);
                }
            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10) + "%";

                console.log(progress);
            },
            error: function (e, data) {
                console.log(data);
            },
            fail: function (e, data) {
                console.log(data);
            }
        });

        ProfileActions.getUser(this.state);
    },
    componentDidUpdate: function () {
        this.refs.inputPhoto.value = this.state.user.photoURL;
        $("#imgPhoto").attr("src", this.state.user.photoURL);
        this.refs.inputLoginID.value = this.state.user.loginID;
        this.refs.inputUserName.value = this.state.user.userName;
        this.refs.inputMobile.value = this.state.user.mobile;
        this.refs.inputEmail.value = this.state.user.email;
        this.refs.inputWeixinID.value = this.state.user.weixinID;
        this.refs.inputBirthday.value = new Date(this.state.user.birthday).format('yyyy-MM-dd');
        this.refs.inputSex.value = this.state.user.sex;
        this.refs.inputCreateTime.value = new Date(this.state.user.createTime).format('yyyy-MM-dd hh:mm:ss');
        this.refs.inputLastLoginTime.value = new Date(this.state.user.lastLoginTime).format('yyyy-MM-dd hh:mm:ss');
    },
    handleSave:function(){
        this.state.user.photoURL = this.refs.inputPhoto.value;
        this.state.user.userName = this.refs.inputUserName.value;
        this.state.user.mobile = this.refs.inputMobile.value;
        this.state.user.email = this.refs.inputEmail.value;
        this.state.user.weixinID = this.refs.inputWeixinID.value;
        this.state.user.birthday = this.refs.inputBirthday.value;
        this.state.user.sex = this.refs.inputSex.value;
        if(this.state.user.userName == "" || this.state.user.email == ""){
            $("#inputUserName").addClass("input-error");
            $("#inputEmail").addClass("input-error");
            $("#messageBox").show().text(Message.INPUT_REQUIRED);
            return;
        }

        ProfileActions.updateUserInfo(this.state.user);
    },
    uploadPhoto: function () {
        openFileBrowse("uploadPhoto");
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
                                React.createElement("div", {className: "row form-group form-horizontal"}, 
                                    React.createElement("div", {className: "col-xs-2 control-label"}, 
                                        React.createElement("label", null, "头像")
                                    ), 
                                    React.createElement("div", {id: "divPhoto", className: "col-xs-10"}, 
                                        React.createElement("input", {id: "inputPhoto", ref: "inputPhoto", type: "hidden"}), 
                                        React.createElement("a", {href: "javascript:void(0)", onClick: this.uploadPhoto}, React.createElement("img", {id: "imgPhoto", className: "width-100", src: "../img/upload.png"})), 
                                        React.createElement("input", {id: "uploadPhoto", type: "file", name: "file", className: "hidden", 
                                               accept: "image/gif,image/jpeg,image/x-ms-bmp,image/x-png,image/png"})
                                    )
                                ), 
                                React.createElement("div", {className: "row form-group form-horizontal"}, 
                                    React.createElement("div", {className: "col-xs-2 control-label"}, 
                                        React.createElement("label", {className: "required"}, "用户ID")
                                    ), 
                                    React.createElement("div", {className: "col-xs-10"}, 
                                        React.createElement("input", {id: "inputLoginID", ref: "inputLoginID", type: "text", className: "form-control", 
                                               disabled: "disabled"})
                                    )
                                ), 
                                React.createElement("div", {className: "row form-group form-horizontal"}, 
                                    React.createElement("div", {className: "col-xs-2 control-label"}, 
                                        React.createElement("label", {className: "required"}, "用户名")
                                    ), 
                                    React.createElement("div", {className: "col-xs-10"}, 
                                        React.createElement("input", {id: "inputUserName", ref: "inputUserName", type: "text", className: "form-control"})
                                    )
                                ), 
                                React.createElement("div", {className: "row form-group form-horizontal"}, 
                                    React.createElement("div", {className: "col-xs-2 control-label"}, 
                                        React.createElement("label", null, "电话")
                                    ), 
                                    React.createElement("div", {className: "col-xs-10"}, 
                                        React.createElement("input", {id: "inputMobile", ref: "inputMobile", type: "text", className: "form-control"})
                                    )
                                ), 
                                React.createElement("div", {className: "row form-group form-horizontal"}, 
                                    React.createElement("div", {className: "col-xs-2 control-label"}, 
                                        React.createElement("label", {className: "required"}, "邮箱")
                                    ), 
                                    React.createElement("div", {className: "col-xs-10"}, 
                                        React.createElement("input", {id: "inputEmail", ref: "inputEmail", type: "text", className: "form-control"})
                                    )
                                ), 
                                React.createElement("div", {className: "row form-group form-horizontal"}, 
                                    React.createElement("div", {className: "col-xs-2 control-label"}, 
                                        React.createElement("label", null, "微信号")
                                    ), 
                                    React.createElement("div", {className: "col-xs-10"}, 
                                        React.createElement("input", {id: "inputWeixinID", ref: "inputWeixinID", type: "text", className: "form-control"})
                                    )
                                ), 
                                React.createElement("div", {className: "row form-group form-horizontal"}, 
                                    React.createElement("div", {className: "col-xs-2 control-label"}, 
                                        React.createElement("label", null, "生日")
                                    ), 
                                    React.createElement("div", {className: "col-xs-10"}, 
                                        React.createElement("div", {className: "input-group date form_date", "data-date": "", 
                                             "data-date-format": "yyyy-mm-dd", 
                                             "data-link-field": "inputBirthday", "data-link-format": "yyyy-mm-dd"}, 
                                            React.createElement("input", {id: "inputBirthday", className: "form-control", type: "text", 
                                                   ref: "inputBirthday", readonly: true}), 
                                                    React.createElement("span", {className: "input-group-addon"}, 
                                                        React.createElement("span", {className: "glyphicon glyphicon-calendar"})
                                                    )
                                        )
                                    )
                                ), 
                                React.createElement("div", {className: "row form-group form-horizontal"}, 
                                    React.createElement("div", {className: "col-xs-2 control-label"}, 
                                        React.createElement("label", null, "性别")
                                    ), 
                                    React.createElement("div", {className: "col-xs-10"}, 
                                        React.createElement("select", {ref: "inputSex", className: "form-control"}, 
                                            React.createElement("option", {value: "1"}, "男"), 
                                            React.createElement("option", {value: "2"}, "女")
                                        )
                                    )
                                ), 
                                React.createElement("div", {className: "row form-group form-horizontal"}, 
                                    React.createElement("div", {className: "col-xs-2 control-label"}, 
                                        React.createElement("label", null, "注册日期")
                                    ), 
                                    React.createElement("div", {className: "col-xs-10"}, 
                                        React.createElement("input", {id: "inputCreateTime", ref: "inputCreateTime", type: "text", 
                                               className: "form-control", disabled: "disabled"})
                                    )
                                ), 
                                React.createElement("div", {className: "row form-group form-horizontal"}, 
                                    React.createElement("div", {className: "col-xs-2 control-label"}, 
                                        React.createElement("label", null, "最后登录日期")
                                    ), 
                                    React.createElement("div", {className: "col-xs-10"}, 
                                        React.createElement("input", {id: "inputLastLoginTime", ref: "inputLastLoginTime", type: "text", 
                                               className: "form-control", disabled: "disabled"})
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
    React.createElement(Profile, null),
    document.getElementById('page')
);
