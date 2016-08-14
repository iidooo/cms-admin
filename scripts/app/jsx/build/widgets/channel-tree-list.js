var ChannelTreeListActions = Reflux.createActions(['getChannelTree']);

var ChannelTreeListStore = Reflux.createStore({
    listenables: [ChannelTreeListActions],
    onGetChannelTree: function (data) {

        var url = SiteProperties.serverURL + API.getChannelTree;
        data.appID = SecurityClient.appID;
        data.secret = SecurityClient.secret;
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
                self.trigger(result.data);
            } else {
                console.log(result);
            }
        };

        ajaxPost(url, data, callback);
    },
});

var ChannelTreeList = React.createClass({displayName: "ChannelTreeList",
    mixins: [Reflux.connect(ChannelTreeListStore, 'channelList')],
    getInitialState: function () {
        return {
            channelList: []
        };
    },
    componentDidMount: function () {
        ChannelTreeListActions.getChannelTree(this.state);
    },
    componentDidUpdate: function () {
        var $channelTree = $("#inputChannelTree");
        $channelTree.children().remove();
        $.each(this.state.channelList, function (index, item) {
            var level = 0;
            createOption($channelTree, item, level);
        });
        $channelTree.val(this.props.channelID);
    },

    render: function () {
        return (
            React.createElement("select", {id: "inputChannelTree", className: "form-control"}
            )
        );
    }
});

function createOption($channelTree, item, level) {

    var $option = $("<option></option>");
    $option.attr("value", item.data.channelID);

    var text = "";
    for (var i = 0; i < level; i++) {
        text += "&nbsp;&nbsp;&nbsp;&nbsp;";
    }
    text = text + item.text;
    $option.html(text);
    $channelTree.append($option);

    if (item.nodes.length > 0) {
        level = level + 1;
        $.each(item.nodes, function (index, item) {
            createOption($channelTree, item, level);
        });
    }
}