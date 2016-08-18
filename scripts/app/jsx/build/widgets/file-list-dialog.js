var FileListDialogActions = Reflux.createActions(['getFileList', 'deleteFile']);

var FileListDialogStore = Reflux.createStore({
    listenables: [FileListDialogActions],
    onGetFileList: function (data) {
        var url = SiteProperties.serverURL + API.getFileList;
        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.operatorID = sessionStorage.getItem(SessionKey.operatorID);
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
        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.operatorID = sessionStorage.getItem(SessionKey.operatorID);
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
                FileListDialogActions.getFileList(data);
            } else {
                console.log(result);
            }
        };

        ajaxPost(url, data, callback);
    },
});

var FileListDialog = React.createClass({displayName: "FileListDialog",
    mixins: [Reflux.connect(FileListDialogStore, 'fileList')],
    getInitialState: function () {
        return {
            fileList: []
        };
    },
    componentDidMount: function () {
        $('#fileListDialog').on('show.bs.modal', function (e) {
            var data = {};
            FileListDialogActions.getFileList(data);
        });
    },
    openFileDialog: function () {
        $('#fileDialog').modal('show');
    },
    onFileDialogConfirm: function () {
        FileListDialogActions.getFileList(this.state);
    },
    handleClose: function () {
        $('#fileListDialog').modal('toggle');
    },
    render: function () {
        return (
            React.createElement("div", {className: "modal fade", id: "fileListDialog", tabindex: "-1", role: "dialog", "aria-labelledby": "dialogTitle"}, 
                React.createElement(FileDialog, {callbackParent: this.onFileDialogConfirm}), 

                React.createElement("div", {className: "modal-dialog", role: "document"}, 
                    React.createElement("div", {className: "modal-content"}, 
                        React.createElement("div", {className: "modal-header"}, 
                            React.createElement("button", {type: "button", className: "close", onClick: this.handleClose}, React.createElement("span", {
                                "aria-hidden": "true"}, "×")), 
                            React.createElement("h4", {className: "modal-title"}, "附件一览")
                        ), 
                        React.createElement("div", {className: "modal-body"}, 
                            React.createElement("table", {className: "table"}, 
                                React.createElement("thead", null, 
                                React.createElement("tr", null, 
                                    React.createElement("th", {className: "width-50"}, "文件名"), 
                                    React.createElement("th", {className: "width-400"}, "URL"), 
                                    React.createElement("th", {className: "width-50"}, "操作")
                                )
                                ), 
                                React.createElement("tbody", null, 
                                this.state.fileList.map(function (item) {
                                    return React.createElement(FileListRow, {key: item.fileID, file: item})
                                }), 
                                React.createElement("tr", null, 
                                    React.createElement("td", null, 
                                        React.createElement("input", {type: "text", className: "form-control", disabled: "disabled"})
                                    ), 
                                    React.createElement("td", null, 
                                        React.createElement("input", {type: "text", className: "form-control", disabled: "disabled"})
                                    ), 
                                    React.createElement("td", null, 
                                        React.createElement("button", {type: "button", className: "btn btn-small btn-success", 
                                                onClick: this.openFileDialog}, 
                                            React.createElement("i", {className: "fa fa-plus"})
                                        )
                                    )
                                )
                                )
                            )

                        ), 
                        React.createElement("div", {className: "modal-footer"}, 
                            React.createElement("button", {type: "button", className: "btn btn-primary", onClick: this.handleClose}, "关闭")
                        )
                    )
                )
            )
        );
    }
});


var FileListRow = React.createClass({displayName: "FileListRow",
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
            React.createElement("tr", null, 
                React.createElement("td", {className: "width-50"}, this.props.file.fileName), 
                React.createElement("td", {className: "break-word inline-block width-400"}, this.props.file.fileURL), 
                React.createElement("td", {className: "width-50"}, 
                    React.createElement("button", {type: "button", className: "btn btn-small btn-danger", 
                            onClick: this.handleDeleteFile.bind(null, this.props.file.fileID)}, 
                        React.createElement("i", {className: "fa fa-remove"})
                    )
                )
            )
        );
    }
});