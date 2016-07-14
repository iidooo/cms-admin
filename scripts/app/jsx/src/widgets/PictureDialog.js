var PictureDialogActions = Reflux.createActions(['upload']);

var PictureDialogStore = Reflux.createStore({
    listenables: [PictureDialogActions],
    onUpload: function (data) {
        var pageMode = sessionStorage.getItem(SessionKey.pageMode);
        var url = SiteProperties.serverURL + API.createContent;

        if (pageMode == PageMode.UPDATE) {
            url = SiteProperties.serverURL + API.updateContent;
        }

        data.appID = SecurityClient.appID;
        data.secret = SecurityClient.secret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.userID = sessionStorage.getItem(SessionKey.userID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);
        // 检查token是否过期
        if (data.accessToken == null || data.accessToken == "" || data.userID == null || data.userID == "") {
            location.href = Page.login;
            return false;
        }

        var self = this;
        var callback = function (result) {
            if (result.status == 200) {
                alert("保存成功!");
                location.href = SiteProperties.clientURL + Page.contents;
            } else {
                console.log(result);
            }
        };

        ajaxPost(url, data, callback);
    },
});

var PictureDialog = React.createClass({
    getInitialState: function () {
        return {
            pictureName: "",
            pictureURL: ""
        };
    },

    componentDidUpdate: function () {
        //文件上传前触发事件
        $('#inputPictureUpload').bind('fileuploadsubmit', function (e, data) {
            data.formData = {
                'appID': SecurityClient.appID,
                'secret': SecurityClient.secret,
                'accessToken': sessionStorage.getItem(SessionKey.accessToken),
                'userID': sessionStorage.getItem(SessionKey.userID),
                'siteID': sessionStorage.getItem(SessionKey.siteID),
                'width': $("#inputUploadWidth").val(),
                'height': $("#inputUploadHeight").val(),
                'isCompress': $("#checkboxCompress").prop("checked")
            };  //如果需要额外添加参数可以在这里添加
        });

        // 上传内容图片列表
        $("#inputPictureUpload").fileupload({
            url: SiteProperties.serverURL + API.uploadFile,
            dataType: 'json',
            autoUpload: true,
            acceptFileTypes: /(\.|\/)(jpe?g|png|gif|bmp)$/i,
            maxNumberOfFiles: 1,
            maxFileSize: 10000000,
            done: function (e, result) {
                var data = result.result;
                if (data.status == "200") {
                    $("#inputUploadPictureURL").val(data.data.url);
                    $("#uploadPicturePreview").attr("src", data.data.url);
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
        $('#pictureDialog').on('hidden.bs.modal', function (e) {
            // 初始化
            this.refs.inputOnlinePictureName.value = "";
            this.refs.inputOnlinePictureURL.value = "";
            this.refs.inputUploadPictureName.value = "";
            this.refs.inputUploadPictureURL.value = "";
            this.refs.inputUploadWidth.value = "";
            this.refs.inputUploadHeight.value = "";
            this.refs.checkboxCompress.checked = false;
            $("#divSizeArea").addClass("hidden");
            $("#uploadPicturePreview").attr("src", "../img/upload.png");
        })
    },

    handleConfirm: function () {
        var $activeTab = $(".tab-content .active");
        var activeTabID = $activeTab.attr("id");

        if (activeTabID == "online") {
            this.state.pictureName = this.refs.inputOnlinePictureName.value;
            this.state.pictureURL = this.refs.inputOnlinePictureURL.value;
        } else {
            this.state.pictureName = this.refs.inputUploadPictureName.value;
            this.state.pictureURL = this.refs.inputUploadPictureURL.value;
        }

        $('#pictureDialog').modal('toggle');
        this.props.callbackParent(this.state);
    },
    handleCheckboxCompress: function () {
        if (this.refs.checkboxCompress.checked == true) {
            $("#divSizeArea").removeClass("hidden");
        } else {
            $("#divSizeArea").addClass("hidden");
        }
    },
    handleUploadFile: function () {
        openFileBrowse("inputPictureUpload");
    },
    render: function () {
        return (
            <div className="modal fade" id="pictureDialog" tabindex="-1" role="dialog" aria-labelledby="dialogTitle">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span
                                aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id="dialogTitle">插入图片</h4>
                        </div>
                        <div className="modal-body">
                            <ul className="nav nav-tabs" role="tablist">
                                <li role="presentation" className="active"><a href="#online" data-toggle="tab"
                                                                              aria-expanded="true">在线图片</a></li>
                                <li role="presentation"><a href="#upload" data-toggle="tab"
                                                           aria-expanded="true">上传图片</a></li>
                            </ul>
                            <div className="tab-content">
                                <div role="tabpanel" className="tab-pane active" id="online">
                                    <p className="text-muted">图片标题会作为图片提示，有助于搜索引擎准确抓取</p>

                                    <div className="input-group">
                                        <span className="input-group-addon" id="basic-addon1">
                                            <i className="fa fa-font"></i>
                                        </span>
                                        <input type="text" className="form-control" ref="inputOnlinePictureName"
                                               placeholder="请输入图片标题" aria-describedby="basic-addon1"/>
                                    </div>
                                    <br/>

                                    <div className="input-group">
                                        <span className="input-group-addon" id="basic-addon2">
                                            <i className="fa fa-link"></i>
                                        </span>
                                        <input type="text" className="form-control" ref="inputOnlinePictureURL"
                                               placeholder="请输入图片路径" aria-describedby="basic-addon2"/>
                                    </div>
                                </div>
                                <div role="tabpanel" className="tab-pane" id="upload">
                                    <p className="text-muted">图片标题会作为图片提示，有助于搜索引擎准确抓取</p>

                                    <div className="input-group">
                                        <span className="input-group-addon" id="basic-addon1">
                                            <i className="fa fa-font"></i>
                                        </span>
                                        <input type="text" className="form-control" ref="inputUploadPictureName"
                                               placeholder="请输入图片标题" aria-describedby="basic-addon1"/>
                                    </div>
                                    <br/>

                                    <div className="input-group">
                                        <span className="input-group-addon" id="basic-addon3">
                                            <i className="fa fa-photo"></i>
                                        </span>
                                        <input type="text" id="inputUploadPictureURL" className="form-control"
                                               ref="inputUploadPictureURL"
                                               aria-describedby="basic-addon3" readonly/>
                                        <span className="input-group-addon btn" id="basic-addon3"
                                              onClick={this.handleUploadFile}>
                                            上传
                                        </span>
                                        <input id="inputPictureUpload" type="file" name="file" className="hidden"
                                               accept="image/gif,image/jpeg,image/x-ms-bmp,image/x-png,image/png"/>
                                    </div>
                                    <div className="form-group">
                                        <div className="checkbox">
                                            <label>
                                                <input type="checkbox" id="checkboxCompress" ref="checkboxCompress"
                                                       onClick={this.handleCheckboxCompress}/>
                                                压缩尺寸
                                            </label>
                                        </div>
                                    </div>
                                    <div id="divSizeArea" className="form-group form-inline hidden">
                                        <div className="input-group">
                                                <span className="input-group-addon" id="basic-addon-width">
                                                    <i className="fa fa-text-width"></i>
                                                </span>
                                            <input type="number" id="inputUploadWidth" className="form-control"
                                                   ref="inputUploadWidth"
                                                   aria-describedby="basic-addon-width"/>
                                        </div>
                                        &nbsp;&nbsp;<i className="fa fa-times"></i>&nbsp;&nbsp;
                                        <div className="input-group">
                                                <span className="input-group-addon" id="basic-addon-height">
                                                    <i className="fa fa-text-height"></i>
                                                </span>
                                            <input type="number" id="inputUploadHeight" className="form-control"
                                                   ref="inputUploadHeight"
                                                   aria-describedby="basic-addon-height"/>
                                        </div>
                                    </div>

                                    <p className="text-muted">1、图片大小不能超过2M</p>

                                    <p className="text-muted">2、支持格式：.jpg .gif .png .bmp</p>

                                    <div className="text-center">
                                        <img id="uploadPicturePreview" className="width-200" src="../img/upload.png"/>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                            <button type="button" className="btn btn-primary" onClick={this.handleConfirm}>确定</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
