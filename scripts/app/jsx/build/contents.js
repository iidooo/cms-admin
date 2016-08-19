var ContentsActions = Reflux.createActions(['search']);

var ContentsStore = Reflux.createStore({
    listenables: [ContentsActions],
    onSearch: function (data) {
        var url = SiteProperties.serverURL + API.searchContentList;
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

var Contents = React.createClass({displayName: "Contents",
    mixins: [Reflux.connect(ContentsStore, 'contentsData')],
    getInitialState: function () {
        return {
            searchCondition:{
                channelID: 0
            },
            contentsData: {
                page: {},
                contentList: []
            }
        };
    },
    componentDidMount: function () {
        ContentsActions.search(this.state.searchCondition);
    },
    onChildChanged: function (childState) {
        if (childState.currentPage != null) {
            this.state.searchCondition.currentPage = childState.currentPage;

            ContentsActions.search(this.state.searchCondition);
        }
    },
    handleSearch: function () {
        this.state.searchCondition.channelID = $("#inputChannelTree").val();
        this.state.searchCondition.contentTitle = this.refs.inputContentTitle.value;
        this.state.searchCondition.contentType = $("#inputContentType").val();
        this.state.searchCondition.startDateTime = this.refs.inputStartDate.value;
        this.state.searchCondition.endDateTime = this.refs.inputEndDate.value;
        this.state.searchCondition.contentStatus = $("#inputContentStatus").val();
        ContentsActions.search(this.state.searchCondition);
    },
    handleCreate: function (contentType) {
        sessionStorage.setItem(SessionKey.contentType, contentType);
        sessionStorage.removeItem(SessionKey.contentID);
        location.href = SiteProperties.clientURL + Page.content;
    },
    render: function () {
        return (
            React.createElement("div", null, 
                React.createElement(Header, null), 

                React.createElement("div", {id: "main", className: "container-fluid margin-top-60"}, 
                    React.createElement(SideBar, {activeMenuID: "menuContentManage"}), 
                    React.createElement("div", {className: "content-page"}, 
                        React.createElement(Breadcrumb, {page: Page.contents}), 
                        React.createElement("div", {className: "panel panel-default"}, 
                            React.createElement("div", {className: "panel-heading"}, "查询条件"), 
                            React.createElement("div", {className: "panel-body"}, 
                                React.createElement("div", {className: "row form-group form-horizontal"}, 
                                    React.createElement("div", {className: "col-xs-4"}, 
                                        React.createElement("div", {className: "col-xs-4 control-label"}, 
                                            React.createElement("label", null, "所属栏目")
                                        ), 
                                        React.createElement("div", {className: "col-xs-8"}, 
                                            React.createElement(ChannelTreeList, {channelID: this.state.searchCondition.channelID, isContainBlank: "true"})
                                        )
                                    ), 
                                    React.createElement("div", {className: "col-xs-4"}, 
                                        React.createElement("div", {className: "col-xs-4 control-label"}, 
                                            React.createElement("label", null, "内容标题")
                                        ), 
                                        React.createElement("div", {className: "col-xs-8"}, 
                                            React.createElement("input", {type: "text", className: "form-control", ref: "inputContentTitle"})
                                        )
                                    ), 
                                    React.createElement("div", {className: "col-xs-4"}, 
                                        React.createElement("div", {className: "col-xs-4 control-label"}, 
                                            React.createElement("label", null, "内容类型")
                                        ), 
                                        React.createElement("div", {className: "col-xs-8"}, 
                                            React.createElement(ContentTypeList, {contentType: this.state.searchCondition.contentType, isContainAll: "true"})
                                        )
                                    )
                                ), 
                                React.createElement("div", {className: "row form-group form-horizontal"}, 
                                    React.createElement("div", {className: "col-xs-4"}, 
                                        React.createElement("div", {className: "col-xs-4 control-label"}, 
                                            React.createElement("label", null, "发布开始日")
                                        ), 
                                        React.createElement("div", {className: "col-xs-8"}, 
                                            React.createElement("div", {className: "input-group date form_date", "data-date": "", 
                                                 "data-date-format": "yyyy-mm-dd", 
                                                 "data-link-field": "startDate", "data-link-format": "yyyy-mm-dd"}, 
                                                React.createElement("input", {id: "startDate", className: "form-control", type: "text", 
                                                       ref: "inputStartDate", 
                                                       readonly: true}), 
                                                React.createElement("span", {className: "input-group-addon"}, 
                                                    React.createElement("span", {className: "glyphicon glyphicon-calendar"})
                                                )
                                            )
                                        )
                                    ), 
                                    React.createElement("div", {className: "col-xs-4"}, 
                                        React.createElement("div", {className: "col-xs-4 control-label"}, 
                                            React.createElement("label", null, "发布结束日")
                                        ), 
                                        React.createElement("div", {className: "col-xs-8"}, 
                                            React.createElement("div", {className: "input-group date form_date", "data-date": "", 
                                                 "data-date-format": "yyyy-mm-dd", 
                                                 "data-link-field": "endDate", "data-link-format": "yyyy-mm-dd"}, 
                                                React.createElement("input", {id: "endDate", className: "form-control", type: "text", ref: "inputEndDate", 
                                                       readonly: true}), 
                                                React.createElement("span", {className: "input-group-addon"}, 
                                                    React.createElement("span", {className: "glyphicon glyphicon-calendar"})
                                                )
                                            )
                                        )
                                    ), 
                                    React.createElement("div", {className: "col-xs-4"}, 
                                        React.createElement("div", {className: "col-xs-4 control-label"}, 
                                            React.createElement("label", null, "内容状态")
                                        ), 
                                        React.createElement("div", {className: "col-xs-8"}, 
                                            React.createElement(ContentStatusList, {contentStatus: this.state.searchCondition.contentStatus, isContainAll: "true"})
                                        )
                                    )
                                ), 

                                React.createElement("div", {className: "text-right"}, 
                                    React.createElement("button", {type: "button", className: "btn btn-primary", onClick: this.handleSearch}, "查 询"), 
                                    "  ", 
                                    React.createElement("div", {className: "btn-group"}, 
                                        React.createElement("a", {className: "btn btn-success dropdown-toggle", "data-toggle": "dropdown"}, 
                                            React.createElement("span", null, "创建内容"), "  ", 
                                            React.createElement("i", {className: "fa fa-caret-down"})
                                        ), 
                                        React.createElement("ul", {className: "dropdown-menu"}, 
                                            React.createElement("li", null, React.createElement("a", {href: "javascript:void(0)", onClick: this.handleCreate.bind(null, ContentType.ARTICLE)}, React.createElement("i", {
                                                className: "fa fa-file-o"}), "  文章")), 
                                            React.createElement("li", null, React.createElement("a", {href: "javascript:void(0)", onClick: this.handleCreate.bind(null, ContentType.NEWS)}, React.createElement("i", {className: "fa fa-newspaper-o"}), " " + ' ' +
                                                "新闻")
                                            ), 
                                            React.createElement("li", null, React.createElement("a", {href: "javascript:void(0)", onClick: this.handleCreate.bind(null, ContentType.FILE)}, React.createElement("i", {className: "fa fa-download"}), "  文件")
                                            )
                                        )
                                    )
                                )
                            )
                        ), 
                        React.createElement(ContentsTable, {contentList: this.state.contentsData.contentList}), 

                        React.createElement(Pager, {callbackParent: this.onChildChanged, 
                               recordSum: this.state.contentsData.page.recordSum, 
                               currentPage: this.state.contentsData.page.currentPage, 
                               pageSum: this.state.contentsData.page.pageSum}), 

                        React.createElement(Footer, null)
                    )
                )

            )
        );
    }
});

var ContentsTable = React.createClass({displayName: "ContentsTable",
    render: function () {
        return (
            React.createElement("table", {className: "table table-hover"}, 
                React.createElement("thead", null, 
                React.createElement("tr", null, 
                    React.createElement("th", null, "栏目"), 
                    React.createElement("th", {className: "width-400"}, "标题"), 
                    React.createElement("th", null, "类型"), 
                    React.createElement("th", null, "状态"), 
                    React.createElement("th", null, "发布者"), 
                    React.createElement("th", null, "发布时间"), 
                    React.createElement("th", null, "更新时间")
                )
                ), 
                React.createElement("tbody", null, 
                this.props.contentList.map(function (item) {
                    return React.createElement(ContentsTableRow, {key: item.contentID, content: item})
                })
                )
            )
        );
    }
});

var ContentsTableRow = React.createClass({displayName: "ContentsTableRow",
    handleLink: function (contentID) {
        sessionStorage.setItem(SessionKey.contentID, contentID);
        location.href = SiteProperties.clientURL + Page.content;
    },
    render: function () {
        return (
            React.createElement("tr", {onClick: this.handleLink.bind(null, this.props.content.contentID)}, 
                React.createElement("td", null, this.props.content.channel.channelName), 
                React.createElement("td", null, React.createElement("a", {href: "javascript:void(0)", onClick: this.handleLink.bind(null, this.props.content.contentID)}, this.props.content.contentTitle)), 
                React.createElement("td", null, ContentTypeMap[this.props.content.contentType]), 
                React.createElement("td", null, ContentStatusMap[this.props.content.status]), 
                React.createElement("td", null, this.props.content.createUser.userName), 
                React.createElement("td", null, new Date(this.props.content.createTime).format('yyyy-MM-dd hh:mm:ss')), 
                React.createElement("td", null, new Date(this.props.content.updateTime).format('yyyy-MM-dd hh:mm:ss'))
            )
        );
    }
});

ReactDOM.render(
    React.createElement(Contents, null),
    document.getElementById('page')
);


$(function () {
    $('.form_date').datetimepicker({
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0,
        format: 'yyyy-mm-dd'
    });
});