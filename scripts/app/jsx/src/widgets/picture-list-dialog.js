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

var PictureListDialog = React.createClass({
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
            <div className="modal fade" id="pictureListDialog" tabindex="-1" role="dialog"
                 aria-labelledby="dialogTitle">
                <PictureDialog callbackParent={this.onPictureDialogConfirm}/>

                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={this.handleClose}><span
                                aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">展示图一览</h4>
                        </div>
                        <div className="modal-body">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th className="width-50">预览</th>
                                    <th className="width-500">URL</th>
                                    <th className="width-50">操作</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.pictureList.map(function (item) {
                                    return <PictureListRow key={item.pictureID} picture={item}/>
                                })}
                                <tr>
                                    <td>
                                        <img id="imgContentImage" className="width-50" src="../img/upload.png"/>
                                    </td>
                                    <td>
                                        <input type="text" className="form-control" disabled="disabled"/>
                                    </td>
                                    <td>
                                        <button type="button" className="btn btn-small btn-success"
                                                onClick={this.openPictureDialog}>
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


var PictureListRow = React.createClass({
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
            <tr>
                <td className="width-50"><img className="width-50" src={this.props.picture.pictureURL}/></td>
                <td className="break-word inline-block width-400">{this.props.picture.pictureURL}</td>
                <td className="width-50">
                    <button type="button" className="btn btn-small btn-danger"
                            onClick={this.handleDeletePicture.bind(null, this.props.picture.pictureID)}>
                        <i className="fa fa-remove"></i>
                    </button>
                </td>
            </tr>
        );
    }
});