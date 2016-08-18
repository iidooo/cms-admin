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
                self.trigger(result.data);
            } else {
                console.log(result);
            }
        };

        ajaxPost(url, data, callback);
    },
});

var ChannelTree = React.createClass({
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
        console.log(this.state.channelList);
        var options = {
            selectedBackColor: '#00afd7',
            expandIcon: 'fa fa-folder-o',
            collapseIcon: 'fa fa-folder-open-o',
            nodeIcon: '',
            data: this.state.channelList,
            onNodeSelected: function(event, node) {
                sessionStorage.setItem(SessionKey.channelID, node.data.channelID);
                var data = {};
                //ContentsActions.search(data);
            },
        };

        var $tree = $('#channelTreeView').treeview(options);
        $tree.treeview('selectNode', 0 );
    },
    render: function () {
        return (
            <div id="channelTreeView">

            </div>
        );
    }
});