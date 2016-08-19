var ChannelsActions = Reflux.createActions(['getChannel', 'updateChannel', 'createChannel', 'deleteChannel']);

var ChannelsStore = Reflux.createStore({
    listenables: [ChannelsActions],
    onGetChannel: function (data) {
        var url = SiteProperties.serverURL + API.getChannel;
        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.operatorID = sessionStorage.getItem(SessionKey.operatorID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);

        // 检查token是否过期
        if (data.accessToken == null || data.accessToken == "") {
            location.href = SiteProperties.clientURL + Page.login;
            return false;
        }

        var self = this;
        var callback = function (result) {
            if (result.status == 200) {
                result.data.nodeID = data.nodeID;
                self.trigger(result.data);
            } else {
                console.log(result);
            }
        };

        ajaxPost(url, data, callback);
    },
    onUpdateChannel: function (data) {
        var url = SiteProperties.serverURL + API.updateChannel;
        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.operatorID = sessionStorage.getItem(SessionKey.operatorID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);

        // 检查token是否过期
        if (data.accessToken == null || data.accessToken == "") {
            location.href = SiteProperties.clientURL + Page.login;
            return false;
        }

        var self = this;
        var callback = function (result) {
            if (result.status == 200) {
                alert(Message.SAVE_SUCCESS);
                ChannelTreeActions.getChannelTree(data);
                ChannelTreeListActions.getChannelTree(data);
                self.trigger(result.data);
            } else if (result.status == 404) {
                $("#messageBox").show().text(Message.CHANNEL_PATH_REPEAT);
            }
            else {
                console.log(result);
            }
        };

        ajaxPost(url, data, callback);
    },
    onCreateChannel: function (data) {
        var url = SiteProperties.serverURL + API.createChannel;
        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.operatorID = sessionStorage.getItem(SessionKey.operatorID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);

        // 检查token是否过期
        if (data.accessToken == null || data.accessToken == "") {
            location.href = SiteProperties.clientURL + Page.login;
            return false;
        }

        var self = this;
        var callback = function (result) {

            if (result.status == 200) {
                alert(Message.SAVE_SUCCESS);
                ChannelTreeActions.getChannelTree(data);
                ChannelTreeListActions.getChannelTree(data);
                self.trigger(result.data);
            } else if (result.status == 404) {
                $("#messageBox").show().text(Message.CHANNEL_PATH_REPEAT);
            }
            else {
                console.log(result);
            }
        };

        ajaxPost(url, data, callback);
    },
    onDeleteChannel: function (data) {
        var url = SiteProperties.serverURL + API.deleteChannel;
        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.operatorID = sessionStorage.getItem(SessionKey.operatorID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);

        // 检查token是否过期
        if (data.accessToken == null || data.accessToken == "") {
            location.href = SiteProperties.clientURL + Page.login;
            return false;
        }

        var self = this;
        var callback = function (result) {
            if (result.status == 200) {
                ChannelTreeActions.getChannelTree(data);
                ChannelTreeListActions.getChannelTree(data);
            } else {
                console.log(result);
            }
        };

        ajaxPost(url, data, callback);
    }
});

var Channels = React.createClass({displayName: "Channels",
    mixins: [Reflux.connect(ChannelsStore, 'channel')],
    getInitialState: function () {
        return {
            channel: {}
        };
    },
    componentDidMount: function () {
    },
    componentDidUpdate: function () {
        $("#messageBox").hide();
        this.refs.inputNodeID.value = this.state.channel.nodeID;
        this.refs.inputChannelID.value = this.state.channel.channelID;
        this.refs.inputChannelName.value = this.state.channel.channelName;
        this.refs.inputChannelPath.value = this.state.channel.channelPath;
        this.refs.inputRemarks.value = this.state.channel.remarks;
        this.refs.inputMetaTitle.value = this.state.channel.metaTitle;
        this.refs.inputMetaKeywords.value = this.state.channel.metaKeywords;
        this.refs.inputMetaDescription.value = this.state.channel.metaDescription;
    },
    handleUpdate: function () {

        this.state.channel.nodeID = this.refs.inputNodeID.value;
        this.state.channel.channelID = this.refs.inputChannelID.value;
        this.state.channel.parentID = $("#inputChannelTree").val();
        this.state.channel.channelName = this.refs.inputChannelName.value;
        this.state.channel.channelPath = this.refs.inputChannelPath.value;
        this.state.channel.remarks = this.refs.inputRemarks.value;
        this.state.channel.metaTitle = this.refs.inputMetaTitle.value;
        this.state.channel.metaKeywords = this.refs.inputMetaKeywords.value;
        this.state.channel.metaDescription = this.refs.inputMetaDescription.value;


        if (this.state.channel.channelName == "" || this.state.channel.channelPath == "") {
            $("#messageBox").show().text(Message.INPUT_REQUIRED);
            return
        }

        ChannelsActions.updateChannel(this.state.channel);
    },
    handleCreate: function (contentType) {

        this.state.channel.nodeID = this.refs.inputNodeID.value;
        this.state.channel.parentID = $("#inputChannelTree").val();
        this.state.channel.channelName = this.refs.inputChannelName.value;
        this.state.channel.channelPath = this.refs.inputChannelPath.value;
        this.state.channel.remarks = this.refs.inputRemarks.value;
        this.state.channel.metaTitle = this.refs.inputMetaTitle.value;
        this.state.channel.metaKeywords = this.refs.inputMetaKeywords.value;
        this.state.channel.metaDescription = this.refs.inputMetaDescription.value;

        if (this.state.channel.channelName == "" || this.state.channel.channelPath == "") {
            $("#messageBox").show().text(Message.INPUT_REQUIRED);
            return
        }

        ChannelsActions.createChannel(this.state.channel);
    },
    handleDelete: function (contentType) {
        this.state.channel.channelID = this.refs.inputChannelID.value;
        this.state.channel.nodeID = 0;
        ChannelsActions.deleteChannel(this.state.channel);
    },
    render: function () {
        return (
            React.createElement("div", null, 
                React.createElement(Header, null), 

                React.createElement("div", {id: "main", className: "container-fluid margin-top-60"}, 
                    React.createElement(SideBar, {activeMenuID: "menuChannelManage"}), 

                    React.createElement("div", {className: "content-page"}, 
                        React.createElement(Breadcrumb, {page: Page.channels}), 

                        React.createElement("div", {className: "row"}, 
                            React.createElement("div", {className: "col-sm-3"}, 
                                React.createElement(ChannelTree, null)
                            ), 
                            React.createElement("div", {className: "col-sm-9"}, 
                                React.createElement("div", {className: "panel panel-default"}, 
                                    React.createElement("div", {className: "panel-heading"}, "栏目信息"), 
                                    React.createElement("div", {className: "panel-body"}, 
                                        React.createElement(MessageBox, null), 
                                        React.createElement("input", {id: "inputChannelID", ref: "inputChannelID", type: "hidden"}), 
                                        React.createElement("input", {id: "inputNodeID", ref: "inputNodeID", type: "hidden"}), 

                                        React.createElement("div", {className: "row form-group form-horizontal"}, 
                                            React.createElement("div", {className: "col-sm-2 control-label"}, 
                                                React.createElement("label", null, "所属父栏目")
                                            ), 
                                            React.createElement("div", {className: "col-sm-10"}, 
                                                React.createElement(ChannelTreeList, {channelID: this.state.channel.parentID, isContainBlank: "true"})
                                            )
                                        ), 
                                        React.createElement("div", {className: "row form-group form-horizontal"}, 
                                            React.createElement("div", {className: "col-sm-2 control-label required"}, 
                                                React.createElement("label", null, "栏目名称")
                                            ), 
                                            React.createElement("div", {className: "col-sm-10"}, 
                                                React.createElement("input", {id: "inputChannelName", ref: "inputChannelName", type: "text", 
                                                       className: "form-control"})
                                            )
                                        ), 
                                        React.createElement("div", {className: "row form-group form-horizontal"}, 
                                            React.createElement("div", {className: "col-sm-2 control-label required"}, 
                                                React.createElement("label", null, "栏目路径")
                                            ), 
                                            React.createElement("div", {className: "col-sm-10"}, 
                                                React.createElement("input", {id: "inputChannelPath", ref: "inputChannelPath", type: "text", 
                                                       className: "form-control"})
                                            )
                                        ), 
                                        React.createElement("div", {className: "row form-group form-horizontal"}, 
                                            React.createElement("div", {className: "col-sm-2 control-label"}, 
                                                React.createElement("label", null, "备注")
                                            ), 
                                            React.createElement("div", {className: "col-sm-10"}, 
                                                React.createElement("textarea", {id: "inputRemarks", ref: "inputRemarks", rows: "3", 
                                                          className: "form-control"})
                                            )
                                        ), 
                                        React.createElement("div", {className: "row form-group form-horizontal"}, 
                                            React.createElement("div", {className: "col-sm-2 control-label"}, 
                                                React.createElement("label", null, "MetaTitle")
                                            ), 
                                            React.createElement("div", {className: "col-sm-10"}, 
                                                React.createElement("input", {id: "inputMetaTitle", ref: "inputMetaTitle", type: "text", 
                                                       className: "form-control"})
                                            )
                                        ), 
                                        React.createElement("div", {className: "row form-group form-horizontal"}, 
                                            React.createElement("div", {className: "col-sm-2 control-label"}, 
                                                React.createElement("label", null, "MetaKeywords")
                                            ), 
                                            React.createElement("div", {className: "col-sm-10"}, 
                                                React.createElement("input", {id: "inputMetaKeywords", ref: "inputMetaKeywords", type: "text", 
                                                       className: "form-control"})
                                            )
                                        ), 
                                        React.createElement("div", {className: "row form-group form-horizontal"}, 
                                            React.createElement("div", {className: "col-sm-2 control-label"}, 
                                                React.createElement("label", null, "MetaDescription")
                                            ), 
                                            React.createElement("div", {className: "col-sm-10"}, 
                                                React.createElement("textarea", {id: "inputMetaDescription", ref: "inputMetaDescription", rows: "3", 
                                                          className: "form-control"})
                                            )
                                        )
                                    )
                                ), 

                                React.createElement("div", {className: "text-right"}, 
                                    React.createElement("button", {className: "btn btn-primary", type: "button", onClick: this.handleUpdate}, 
                                        "更 新"
                                    ), 
                                    " ", 
                                    React.createElement("button", {className: "btn btn-success", type: "button", onClick: this.handleCreate}, 
                                        "新栏目创建"
                                    ), 
                                    " ", 
                                    React.createElement("button", {className: "btn btn-danger", type: "button", onClick: this.handleDelete}, 
                                        "删 除"
                                    )
                                )
                            )
                        ), 

                        React.createElement(Footer, null)
                    )
                )

            )
        );
    }
});

// 栏目树
var ChannelTreeActions = Reflux.createActions(['getChannelTree']);
var ChannelTreeStore = Reflux.createStore({
    listenables: [ChannelTreeActions],
    onGetChannelTree: function (data) {

        var url = SiteProperties.serverURL + API.getChannelTree;
        data.accessKey = SecurityClient.accessKey;
        data.accessSecret = SecurityClient.accessSecret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.operatorID = sessionStorage.getItem(SessionKey.operatorID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);

        // 检查token是否过期
        if (data.accessToken == null || data.accessToken == "") {
            location.href = SiteProperties.clientURL + Page.login;
            return false;
        }

        var self = this;

        var callback = function (result) {

            if (result.status == 200) {
                var options = {
                    selectedBackColor: '#00afd7',
                    expandIcon: 'fa fa-folder-o',
                    collapseIcon: 'fa fa-folder-open-o',
                    nodeIcon: '',
                    data: result.data,
                    onNodeSelected: function (event, node) {
                        var data = {};
                        data.channelID = node.data.channelID;
                        data.nodeID = node.nodeId;
                        ChannelsActions.getChannel(data);
                    },
                };

                var $tree = $('#channelTreeView').treeview(options);
                $tree.treeview('expandAll');
                if (data.nodeID != undefined && data.nodeID != "") {
                    $tree.treeview('selectNode', parseInt(data.nodeID));
                } else {
                    $tree.treeview('selectNode', 1);
                }
            } else {
                console.log(result);
            }
        };

        ajaxPost(url, data, callback);
    },
});
var ChannelTree = React.createClass({displayName: "ChannelTree",
    mixins: [Reflux.connect(ChannelTreeStore, 'channelList')],
    getInitialState: function () {
        return {
            channelList: []
        };
    },
    componentDidMount: function () {
        ChannelTreeActions.getChannelTree(this.state);
    },
    componentDidUpdate: function () {
        //$tree.treeview('selectNode', 0 );
    },
    render: function () {
        return (
            React.createElement("div", {id: "channelTreeView"}

            )
        );
    }
});

ReactDOM.render(
    React.createElement(Channels, null),
    document.getElementById('page')
);