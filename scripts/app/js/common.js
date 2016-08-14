SiteProperties = {
    // 开发环境
    clientURL: "http://localhost:63342/cms-admin",
    serverURL: "http://localhost:8080/cms-server",
    // 测试环境
    //clientURL: "http://www.iidooo.com/gauge-web",
    //serverURL : "http://zgvemc.iidooo.com/gauge-server"


    // 正式环境
    //clientURL : "http://www.iidooo.com/cms-admin",
    //serverURL : "http://www.iidooo.com/cms-server",

    siteVersion: "0.1.1.0 B20160711",
    cmsAPIVersion: "0.1.1.0 B20160711",
};

// 存储在SessionStorage中的key
SessionKey = {
    accessToken: "ACCESS_TOKEN",
    operatorID: "OPERATOR_ID",// Login 的User ID
    userID: "USER_ID", // 编辑中的User ID
    user: "SECURITY_USER",
    siteID: "SITE_ID",
    siteMap: "SITE_MAP",
    siteOwnerMap: "SITE_OWNER_MAP",
    channelID: "CHANNEL_ID",
    contentID: "CONTENT_ID",
    contentType: "CONTENT_TYPE",
    pictureID: "PICTURE_ID"
};

SecurityClient = {
    appID: "cmsadmin",
    secret: "e96b669ba65848bcb20f5de53dcc370e"
};

Message = {
    LOGIN_INFO_REQUIRED: "登陆信息不能为空",
    LOGIN_FAILED: "身份验证失败，请确认登陆信息",
    INPUT_REQUIRED: "红色区域为必填项！",
    SAVE_FIRST: "请先保存当前编辑内容",
    SAVE_SUCCESS: "保存成功",
    DELETE_SUCCESS: "删除成功",
    DELETE_CONFIRM: "确定要删除吗？",
    UPLOAD_UMCOMPRESS_CONFIRM: "上传图片不进行压缩，确认吗？",
    UPLOAD_COMPRESS_CONFIRM: "上传图片将进行压缩，确认吗？",
    USER_NAME_REPEAT: "用户名重复",
    EMAIL_REPEAT: "邮箱重复",
    CHANNEL_PATH_REPEAT: "栏目路径重复",
    OLD_PASSWORD_WRONG: "旧密码不正确",
    TWICE_PASSWORD_NOT_EQUAL: "两次密码输入不想等",

    EMAIL_REQUIRED: "请输入正确的Email地址!",
    VERIFY_CODE_REQUIRED: "请输入正确的验证码",
    NO_PERMISSION: "你所在的用户组无权限执行该操作！",
    NO_PERMISSION_BY_READONLY_USER: "只读角色用户，无法进行编辑操作！",
    NO_PERMISSION_BY_CREATE_USER: "非此内容创建者，无法进行编辑操作！",
    NO_PERMISSION_BY_CONTENT_STATUS: "审核权限不够，无法进行编辑操作！"
};

ContentStatus = {
    PUBLISHED: "1",
    APPROVED: "3",
    REFUSE: "4"
};

ContentStatusMap = {
    "1": "已发布",
    "2": "未审核",
    "3": "审核通过",
    "4": "审核驳回",
    "5": "已修正"
};

ContentType = {
    DEFAULT: "1",
    NEWS: "2",
    FILE: "3"
};

ContentTypeMap = {
    "1": "默认",
    "2": "新闻",
    "3": "文件",
};

SexMap = {
    "1": "男",
    "2": "女"
};

ContentTypeList = [];

API = {
    loginByEmail: "/core/loginByEmail",
    registerByEmail: "/core/registerByEmail",
    sendMailVerifyCode: "/core/sendMailVerifyCode",
    getSite: "/admin/getSite",
    updateSite: "/admin/updateSite",
    getRelatedSiteList: "/admin/getRelatedSiteList",
    getChannel: "/admin/getChannel",
    createChannel: "/admin/createChannel",
    updateChannel: "/admin/updateChannel",
    deleteChannel: "/admin/deleteChannel",
    getChannelTree: "/admin/getChannelTree",
    searchContentList: "/admin/searchContentList",
    getContentCount: "/admin/getContentCount",
    createContent: "/admin/createContent",
    updateContent: "/admin/updateContent",
    getContent: "/admin/getContent",
    deleteContent: "/admin/deleteContent",
    uploadFile: "/admin/uploadFile",
    getPicture: "/admin/getPicture",
    getPictureList: "/admin/getPictureList",
    createPicture: "/admin/createPicture",
    updatePicture: "/admin/updatePicture",
    deletePicture: "/admin/deletePicture",
    getFile: "/admin/getFile",
    getFileList: "/admin/getFileList",
    createFile: "/admin/createFile",
    updateFile: "/admin/updateFile",
    deleteFile: "/admin/deleteFile",
    getUser: "/core/getUser",
    getSiteUser: "/admin/getSiteUser",
    updateSiteUser: "/admin/updateSiteUser",
    getSiteUserCount: "/admin/getSiteUserCount",
    searchSiteUserList: "/admin/searchSiteUserList",
    updateUserInfo: "/core/updateUserInfo",
    updateUserPassword: "/core/updateUserPassword",

    getAccessTokenByMail: "/core/getAccessTokenByMail",
    getDictItemList: "/core/getDictItemList",
    content: "/content"
};

SiteRole = {
    "1": "管理员",
    "2": "编辑",
    "3": "普通会员"
};

role = {
    admin: "admin",
    editorship: "editorship",
    editor: "editor",
    readonly: "readonly"
};

Page = {
    index: "/pages/index.html",
    login: "/pages/login.html",
    register: "/pages/register.html",
    site: "/pages/site.html",
    sites: "/pages/sites.html",
    dashboard: "/pages/dashboard.html",
    channels: "/pages/channels.html",
    contents: "/pages/contents.html",
    content: "/pages/content.html",
    profile: "/pages/profile.html",
    password: "/pages/password.html",
    users: "/pages/users.html",
    user: "/pages/user.html",
    admin: "/pages/admin.html",
    admins: "/pages/admins.html",
};

var CmsPicture = {
    contentID: 0,
    createTime: 0,
    createUserID: 0,
    isDelete: 0,
    pictureID: 0,
    pictureName: "",
    pictureURL: "",
    remarks: "",
    sequence: 0,
    updateTime: 0,
    updateUserID: 0,
    version: 0,
};

// 日期格式化
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),   //day
        "h+": this.getHours(),  //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

// 得到地址栏中的路径指定参数值
function getQueryStr(key) {
    var url = window.document.location.href;
    if (url.indexOf("?") != -1) {
        var queryStr = url.substr(url.indexOf("?") + 1);
        var params = queryStr.split("&");
        for (var i = 0; i < params.length; i++) {
            var param = params[i].split("=");
            if (param != null && param.length == 2 && param[0] == key) {
                return param[1];
            }
        }
    }
    return "";
}


function ajaxPost(url, data, callback) {
    $.ajax({
        type: "POST",
        timeout: 10000, //超时时间设置，单位毫秒
        url: url,
        dataType: "json",
        data: data,
        success: function (result) {
            callback(result);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //ajaxpost(url, data, callback);
        }
    });
}

function ajaxFileUpload(id, url, data, callback) {
    $("#" + id).fileupload({
        url: url,
        dataType: 'json',
        autoUpload: true,
        acceptFileTypes: /(\.|\/)(jpe?g|png|gif)$/i,
        maxNumberOfFiles: 1,
        formData: data,
        maxFileSize: 10000000,
        done: function (e, result) {
            console.log(result);
            var data = result.result;
            if (result && null != result.status && ((result.status + "").indexOf("20") == 0)) {
                callback(result);
            } else {
                alert("服务器端处理失败，出现异常，详细请看控制台！错误编号：" + result.status);
                console.log(data);
            }
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10) + "%";

            console.log(progress);
        },
        error: function (e, data) {

            console.log('Error!');
        },
        fail: function (e, data) {

            console.log('Fail!');
        }
    });
}

function openFileBrowse(fileID) {
    var ie = navigator.appName == "Microsoft Internet Explorer" ? true : false;
    if (ie) {
        document.getElementById(fileID).click();
        document.getElementById("filename").value = document.getElementById("file").value;
    } else {
        var a = document.createEvent("MouseEvents");//FF的处理
        a.initEvent("click", true, true);
        document.getElementById(fileID).dispatchEvent(a);
    }
}

// 提供showdown格式的预览
function showdownPreview(content, containerID) {
    showdown.setOption('strikethrough', 'true');
    var converter = new showdown.Converter();
    var rawMarkup = converter.makeHtml(content);
    $("#" + containerID).html(rawMarkup);
}

function dataPermission(messageBoxID, content) {
    var isRefuse = false;
    var text = "";
    // 权限控制
    if (securityUser.roleCode == role.readonly) {
        isRefuse = true;
        text = Message.NO_PERMISSION_BY_READONLY_USER;
    } else if (securityUser.roleCode == role.editor) {
        if (content.createUserID != securityUser.userID) {
            isRefuse = true;
            text = Message.NO_PERMISSION_BY_CREATE_USER;
        } else if (content.status == ContentStatus.PUBLISHED ||
            content.status == ContentStatus.APPROVED) {
            isRefuse = true;
            text = Message.NO_PERMISSION_BY_CONTENT_STATUS;
        }
    }

    if (isRefuse && messageBoxID != null) {
        var $messageBox = $("#" + messageBoxID);
        $messageBox.text(text);
        $messageBox.removeClass("hidden");
        $messageBox.addClass("show");
        $("input,select,textarea").attr('readonly', true);
        $("input[type='checkbox']").attr('disabled', true);
        $("input[type='file']").attr('disabled', true);
    }

    return isRefuse;
}

function validateEmail(email) {
    var regex = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (!regex.test(email)) {
        return false;
    }

    return true;
}