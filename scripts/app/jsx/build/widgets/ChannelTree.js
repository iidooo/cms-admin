var ChannelTreeActions = Reflux.createActions(['getChannelTree']);

var ChannelTreeStore = Reflux.createStore({
    listenables: [ChannelTreeActions],
    onGetChannelTree: function (data) {

        var url = SiteProperties.serverURL + API.getChannelTree;
        data.appID = SecurityClient.appID;
        data.secret = SecurityClient.secret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.userID = sessionStorage.getItem(SessionKey.userID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);

        // 检查token是否过期
        if (data.accessToken == null || data.accessToken == "" || data.userID == null || data.userID == "") {
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

var ChannelTree = React.createClass({displayName: "ChannelTree",
    mixins: [Reflux.connect(ChannelTreeStore, 'channelList')],
    getInitialState: function () {
        return {
            channelList: []
        };
    },
    componentWillMount: function () {
        ChannelTreeActions.getChannelTree(this.state);
    },
    componentDidUpdate: function () {
        var options = {
            color: "#428bca",
            showBorder: false,
            expandIcon: 'fa fa-folder-o',
            collapseIcon: 'fa fa-folder-open-o',
            nodeIcon: '',
            data: this.state.channelList,
            onNodeSelected: function(event, node) {
                sessionStorage.setItem(SessionKey.channelID, node.data.channelID);
                var data = {};
                ContentsActions.search(data);
            },
        };

        var $tree = $('#channelTree').treeview(options);
        //$tree.treeview('selectNode', 0 );
    },
    render: function () {
        return (
            React.createElement("div", {id: "channelTree"}

            )
        );
    }
});