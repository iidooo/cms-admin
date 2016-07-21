var FileListDialogActions = Reflux.createActions(['getFiles', 'deleteFile']);

var FileListDialogStore = Reflux.createStore({
    listenables: [FileListDialogActions],
    onGetFiles: function (data) {
        var url = SiteProperties.serverURL + API.getFiles;
        data.appID = SecurityClient.appID;
        data.secret = SecurityClient.secret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.userID = sessionStorage.getItem(SessionKey.userID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);
        data.contentID = sessionStorage.getItem(SessionKey.contentID);

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
    },
    onDeleteFile: function (data) {
        var url = SiteProperties.serverURL + API.deleteFile;
        data.appID = SecurityClient.appID;
        data.secret = SecurityClient.secret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.userID = sessionStorage.getItem(SessionKey.userID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);
        data.contentID = sessionStorage.getItem(SessionKey.contentID);

        // 检查token是否过期
        if (data.accessToken == null || data.accessToken == "") {
            location.href = SiteProperties.clientURL + Page.login;
            return false;
        }

        var self = this;
        var callback = function (result) {
            if (result.status == 200) {
                FileListDialogActions.getFiles(data);
            } else {
                console.log(result);
            }
        };

        ajaxPost(url, data, callback);
    },
});

var FileListDialog = React.createClass({
    mixins: [Reflux.connect(FileListDialogStore, 'files')],
    getInitialState: function () {
        return {
            files: []
        };
    },
    componentDidMount: function () {
        $('#fileListDialog').on('show.bs.modal', function (e) {
            var data = {};
            FileListDialogActions.getFiles(data);
        });
    },
    openFileDialog: function () {
        $('#fileDialog').modal('show');
    },
    onFileDialogConfirm: function () {
        FileListDialogActions.getFiles(this.state);
    },
    handleClose: function () {
        $('#fileListDialog').modal('toggle');
    },
    render: function () {
        return (
            <div className="modal fade" id="fileListDialog" tabindex="-1" role="dialog" aria-labelledby="dialogTitle">
                <FileDialog callbackParent={this.onFileDialogConfirm}/>

                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={this.handleClose}><span
                                aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">附件一览</h4>
                        </div>
                        <div className="modal-body">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th className="width-50">文件名</th>
                                    <th className="width-400">URL</th>
                                    <th className="width-50">操作</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.files.map(function (item) {
                                    return <FileListRow key={item.fileID} file={item}/>
                                })}
                                <tr>
                                    <td>
                                        <input type="text" className="form-control" disabled="disabled"/>
                                    </td>
                                    <td>
                                        <input type="text" className="form-control" disabled="disabled"/>
                                    </td>
                                    <td>
                                        <button type="button" className="btn btn-small btn-success"
                                                onClick={this.openFileDialog}>
                                            <i className="fa fa-plus"></i>
                                        </button>
                                    </td>
                                </tr>
                                </tbody>
                            </table>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={this.handleClose}>关闭</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});


var FileListRow = React.createClass({
    getInitialState: function () {
        return {};
    },
    handleDeleteFile: function (fileID) {
        this.state.fileID = fileID;
        FileListDialogActions.deleteFile(this.state);
    },
    openFileDialog: function (fileID) {
        sessionStorage.setItem(SessionKey.fileID, fileID);
        $('#fileDialog').modal('show');
    },
    render: function () {
        return (
            <tr>
                <td className="width-50">{this.props.file.fileName}</td>
                <td className="break-word inline-block width-400">{this.props.file.fileURL}</td>
                <td className="width-50">
                    <button type="button" className="btn btn-small btn-danger"
                            onClick={this.handleDeleteFile.bind(null, this.props.file.fileID)}>
                        <i className="fa fa-remove"></i>
                    </button>
                </td>
            </tr>
        );
    }
});