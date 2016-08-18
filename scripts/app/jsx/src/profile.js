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

var Profile = React.createClass({
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
                                <div className="row form-group form-horizontal">
                                    <div className="col-xs-2 control-label">
                                        <label>头像</label>
                                    </div>
                                    <div id="divPhoto" className="col-xs-10">
                                        <input id="inputPhoto" ref="inputPhoto" type="hidden"/>
                                        <a href="javascript:void(0)" onClick={this.uploadPhoto}><img id="imgPhoto" className="width-100" src="../img/upload.png"/></a>
                                        <input id="uploadPhoto" type="file" name="file" className="hidden"
                                               accept="image/gif,image/jpeg,image/x-ms-bmp,image/x-png,image/png"/>
                                    </div>
                                </div>
                                <div className="row form-group form-horizontal">
                                    <div className="col-xs-2 control-label">
                                        <label className="required">用户ID</label>
                                    </div>
                                    <div className="col-xs-10">
                                        <input id="inputLoginID" ref="inputLoginID" type="text" className="form-control"
                                               disabled="disabled"/>
                                    </div>
                                </div>
                                <div className="row form-group form-horizontal">
                                    <div className="col-xs-2 control-label">
                                        <label className="required">用户名</label>
                                    </div>
                                    <div className="col-xs-10">
                                        <input id="inputUserName" ref="inputUserName" type="text" className="form-control"/>
                                    </div>
                                </div>
                                <div className="row form-group form-horizontal">
                                    <div className="col-xs-2 control-label">
                                        <label>电话</label>
                                    </div>
                                    <div className="col-xs-10">
                                        <input id="inputMobile" ref="inputMobile" type="text" className="form-control"/>
                                    </div>
                                </div>
                                <div className="row form-group form-horizontal">
                                    <div className="col-xs-2 control-label">
                                        <label className="required">邮箱</label>
                                    </div>
                                    <div className="col-xs-10">
                                        <input id="inputEmail" ref="inputEmail" type="text" className="form-control"/>
                                    </div>
                                </div>
                                <div className="row form-group form-horizontal">
                                    <div className="col-xs-2 control-label">
                                        <label>微信号</label>
                                    </div>
                                    <div className="col-xs-10">
                                        <input id="inputWeixinID" ref="inputWeixinID" type="text" className="form-control"/>
                                    </div>
                                </div>
                                <div className="row form-group form-horizontal">
                                    <div className="col-xs-2 control-label">
                                        <label>生日</label>
                                    </div>
                                    <div className="col-xs-10">
                                        <div className="input-group date form_date" data-date=""
                                             data-date-format="yyyy-mm-dd"
                                             data-link-field="inputBirthday" data-link-format="yyyy-mm-dd">
                                            <input id="inputBirthday" className="form-control" type="text"
                                                   ref="inputBirthday" readonly/>
                                                    <span className="input-group-addon">
                                                        <span className="glyphicon glyphicon-calendar"></span>
                                                    </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="row form-group form-horizontal">
                                    <div className="col-xs-2 control-label">
                                        <label>性别</label>
                                    </div>
                                    <div className="col-xs-10">
                                        <select ref="inputSex" className="form-control">
                                            <option value="1">男</option>
                                            <option value="2">女</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row form-group form-horizontal">
                                    <div className="col-xs-2 control-label">
                                        <label>注册日期</label>
                                    </div>
                                    <div className="col-xs-10">
                                        <input id="inputCreateTime" ref="inputCreateTime" type="text"
                                               className="form-control" disabled="disabled"/>
                                    </div>
                                </div>
                                <div className="row form-group form-horizontal">
                                    <div className="col-xs-2 control-label">
                                        <label>最后登录日期</label>
                                    </div>
                                    <div className="col-xs-10">
                                        <input id="inputLastLoginTime" ref="inputLastLoginTime" type="text"
                                               className="form-control" disabled="disabled"/>
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
    <Profile/>,
    document.getElementById('page')
);
