var FileDialogActions = Reflux.createActions(['save', 'getFile']);

var FileDialogStore = Reflux.createStore({
    listenables: [FileDialogActions],
    onSave: function (data) {
        var url = SiteProperties.serverURL + API.createFile;
        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.operatorID = sessionStorage.getItem(SessionKey.operatorID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);
        data.contentID = sessionStorage.getItem(SessionKey.contentID);

        data.fileID = sessionStorage.getItem(SessionKey.fileID);
        if(data.fileID != null){
            url = SiteProperties.serverURL + API.updateFile;
        }

        // 检查token是否过期
        if (data.accessToken == null || data.accessToken == "") {
            location.href = SiteProperties.clientURL + Page.login;
            return false;
        }

        var self = this;
        var callback = function (result) {

            if (result.status == 200) {
                $('#fileDialog').modal('toggle');
                sessionStorage.removeItem(SessionKey.fileID);
                FileListDialogActions.getFiles(data);
            } else {
                console.log(result);
            }
        };

        ajaxPost(url, data, callback);
    },
    onGetFile: function (data) {
        var url = SiteProperties.serverURL + API.getFile;
        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.operatorID = sessionStorage.getItem(SessionKey.operatorID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);
        data.contentID = sessionStorage.getItem(SessionKey.contentID);
        data.pictureID = sessionStorage.getItem(SessionKey.pictureID);

        // 检查token是否过期
        if (data.accessToken == null || data.accessToken == "") {
            location.href = SiteProperties.clientURL + Page.login;
            return false;
        }

        var self = this;
        var callback = function (result) {
            //console.log(result.data);
            if (result.status == 200) {
                self.trigger(result.data);
            } else {
                console.log(result);
            }
        };

        ajaxPost(url, data, callback);
    }
});

var FileDialog = React.createClass({
    getInitialState: function () {
        return {
            picture: {}
        };
    },

    componentDidUpdate: function () {
        //文件上传前触发事件
        $('#uploadFile').bind('fileuploadsubmit', function (e, data) {
            data.formData = {
                'accessKey': SecurityClient.accessKey,
                'accessSecret': SecurityClient.accessSecret,
                'accessToken': sessionStorage.getItem(SessionKey.accessToken),
                'operatorID': sessionStorage.getItem(SessionKey.operatorID),
                'siteID': sessionStorage.getItem(SessionKey.siteID),
            };  //如果需要额外添加参数可以在这里添加
        });

        // 上传内容图片列表
        $("#uploadFile").fileupload({
            url: SiteProperties.serverURL + API.uploadFile,
            dataType: 'json',
            autoUpload: true,
            acceptFileTypes: /(\.|\/)(doc?|xls?|ppt?|pdf|txt)$/i,
            maxNumberOfFiles: 1,
            maxFileSize: 10000000,
            done: function (e, result) {
                var data = result.result;
                if (data.status == "200") {
                    $("#inputFileURL").val(data.data.url);
                    $("#inputFileSize").val(data.data.size);
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

        $('#pictureDialog').on('hide.bs.modal', function (e) {
            // 初始化
            $("#inputFileName").val("");
            $("#inputFileURL").val("");
            $("#inputFileSize").val("");
        })
    },
    handleConfirm: function () {
        this.state.fileName = this.refs.inputFileName.value;
        this.state.fileURL = this.refs.inputFileURL.value;
        this.state.fileSize = this.refs.inputFileSize.value;
        FileDialogActions.save(this.state);
    },
    handleUploadFile: function () {
        openFileBrowse("uploadFile");
    },
    handleClose: function () {
        $('#fileDialog').modal('toggle');
    },
    render: function () {
        return (
            <div className="modal fade" id="fileDialog" tabindex="-1" role="dialog" aria-labelledby="dialogTitle">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={this.handleClose}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title" id="dialogTitle">内容附件</h4>
                        </div>
                        <div className="modal-body">
                            <div className="row form-group form-horizontal">
                                <div className="col-xs-2 control-label">
                                    <label>文件名称</label>
                                </div>
                                <div className="col-xs-10">
                                    <input id="inputFileName" type="text" className="form-control" ref="inputFileName"
                                           placeholder="请输入文件名称"/>
                                </div>
                            </div>
                            <div className="row form-group form-horizontal">
                                <div className="col-xs-2 control-label">
                                    <label>文件路径</label>
                                </div>
                                <div className="col-xs-10">
                                    <div className="input-group">
                                        <input type="text" id="inputFileURL" className="form-control"
                                               ref="inputFileURL"
                                               aria-describedby="basic-addon3" placeholder="输入或上传文件"/>
                                        <span className="input-group-addon btn" id="basic-addon3"
                                              onClick={this.handleUploadFile}>
                                            上传
                                        </span>
                                        <input id="uploadFile" type="file" name="file" className="hidden"
                                               accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.txt"/>
                                    </div>
                                </div>
                            </div>
                            <div className="row form-group form-horizontal">
                                <div className="col-xs-2 control-label">
                                    <label>文件大小</label>
                                </div>
                                <div className="col-xs-10">
                                    <input id="inputFileSize" type="number" className="form-control" ref="inputFileSize" placeholder="文件的字节大小"/>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" onClick={this.handleClose}>取消</button>
                            <button type="button" className="btn btn-primary" onClick={this.handleConfirm}>确定</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
