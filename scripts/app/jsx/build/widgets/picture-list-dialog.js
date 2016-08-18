var PictureListDialogActions = Reflux.createActions(['getPictureList', 'deletePicture']);

var PictureListDialogStore = Reflux.createStore({
    listenables: [PictureListDialogActions],
    onGetPictureList: function (data) {
        var url = SiteProperties.serverURL + API.getPictureList;
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
                self.trigger(result.data);
            } else {
                console.log(result);
            }
        };

        ajaxPost(url, data, callback);
    },
    onDeletePicture: function (data) {
        var url = SiteProperties.serverURL + API.deletePicture;
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
                PictureListDialogActions.getPictureList(data);
            } else {
                console.log(result);
            }
        };

        ajaxPost(url, data, callback);
    },
});

var PictureListDialog = React.createClass({displayName: "PictureListDialog",
    mixins: [Reflux.connect(PictureListDialogStore, 'pictureList')],
    getInitialState: function () {
        return {
            pictureList: []
        };
    },
    componentDidMount: function () {
        $('#pictureListDialog').on('show.bs.modal', function (e) {
            var data = {};
            PictureListDialogActions.getPictureList(data);
        });
    },
    openPictureDialog: function () {
        $('#pictureDialog').modal('show');
    },
    onPictureDialogConfirm: function () {
        PictureListDialogActions.getPictures(this.state);
    },
    handleClose: function () {
        $('#pictureListDialog').modal('toggle');
    },
    render: function () {
        return (
            React.createElement("div", {className: "modal fade", id: "pictureListDialog", tabindex: "-1", role: "dialog", 
                 "aria-labelledby": "dialogTitle"}, 
                React.createElement(PictureDialog, {callbackParent: this.onPictureDialogConfirm}), 

                React.createElement("div", {className: "modal-dialog", role: "document"}, 
                    React.createElement("div", {className: "modal-content"}, 
                        React.createElement("div", {className: "modal-header"}, 
                            React.createElement("button", {type: "button", className: "close", onClick: this.handleClose}, React.createElement("span", {
                                "aria-hidden": "true"}, "×")), 
                            React.createElement("h4", {className: "modal-title"}, "展示图一览")
                        ), 
                        React.createElement("div", {className: "modal-body"}, 
                            React.createElement("table", {className: "table"}, 
                                React.createElement("thead", null, 
                                React.createElement("tr", null, 
                                    React.createElement("th", {className: "width-50"}, "预览"), 
                                    React.createElement("th", {className: "width-500"}, "URL"), 
                                    React.createElement("th", {className: "width-50"}, "操作")
                                )
                                ), 
                                React.createElement("tbody", null, 
                                this.state.pictureList.map(function (item) {
                                    return React.createElement(PictureListRow, {key: item.pictureID, picture: item})
                                }), 
                                React.createElement("tr", null, 
                                    React.createElement("td", null, 
                                        React.createElement("img", {id: "imgContentImage", className: "width-50", src: "../img/upload.png"})
                                    ), 
                                    React.createElement("td", null, 
                                        React.createElement("input", {type: "text", className: "form-control", disabled: "disabled"})
                                    ), 
                                    React.createElement("td", null, 
                                        React.createElement("button", {type: "button", className: "btn btn-small btn-success", 
                                                onClick: this.openPictureDialog}, 
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


var PictureListRow = React.createClass({displayName: "PictureListRow",
    getInitialState: function () {
        return {};
    },
    handleDeletePicture: function (pictureID) {
        console.log(pictureID);
        this.state.pictureID = pictureID;
        PictureListDialogActions.deletePicture(this.state);
    },
    openPictureDialog: function (pictureID) {
        sessionStorage.setItem(SessionKey.pictureID, pictureID);
        $('#pictureDialog').modal('show');
    },
    render: function () {
        return (
            React.createElement("tr", null, 
                React.createElement("td", {className: "width-50"}, React.createElement("img", {className: "width-50", src: this.props.picture.pictureURL})), 
                React.createElement("td", {className: "break-word inline-block width-400"}, this.props.picture.pictureURL), 
                React.createElement("td", {className: "width-50"}, 
                    React.createElement("button", {type: "button", className: "btn btn-small btn-danger", 
                            onClick: this.handleDeletePicture.bind(null, this.props.picture.pictureID)}, 
                        React.createElement("i", {className: "fa fa-remove"})
                    )
                )
            )
        );
    }
});