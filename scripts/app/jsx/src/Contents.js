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

var Contents = React.createClass({
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
            <div>
                <Header/>

                <div id="main" className="container-fluid margin-top-60">
                    <SideBar activeMenuID="menuContentManage"/>
                    <div className="content-page">
                        <Breadcrumb page={Page.contents}/>
                        <div className="panel panel-default">
                            <div className="panel-heading">查询条件</div>
                            <div className="panel-body">
                                <div className="row form-group form-horizontal">
                                    <div className="col-xs-4">
                                        <div className="col-xs-4 control-label">
                                            <label>所属栏目</label>
                                        </div>
                                        <div className="col-xs-8">
                                            <ChannelTreeList channelID={this.state.searchCondition.channelID}/>
                                        </div>
                                    </div>
                                    <div className="col-xs-4">
                                        <div className="col-xs-4 control-label">
                                            <label>内容标题</label>
                                        </div>
                                        <div className="col-xs-8">
                                            <input type="text" className="form-control" ref="inputContentTitle"/>
                                        </div>
                                    </div>
                                    <div className="col-xs-4">
                                        <div className="col-xs-4 control-label">
                                            <label>内容类型</label>
                                        </div>
                                        <div className="col-xs-8">
                                            <ContentTypeList contentType={this.state.searchCondition.contentType} isContainAll="true"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row form-group form-horizontal">
                                    <div className="col-xs-4">
                                        <div className="col-xs-4 control-label">
                                            <label>发布开始日</label>
                                        </div>
                                        <div className="col-xs-8">
                                            <div className="input-group date form_date" data-date=""
                                                 data-date-format="yyyy-mm-dd"
                                                 data-link-field="startDate" data-link-format="yyyy-mm-dd">
                                                <input id="startDate" className="form-control" type="text"
                                                       ref="inputStartDate"
                                                       readonly/>
                                                <span className="input-group-addon">
                                                    <span className="glyphicon glyphicon-calendar"></span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-4">
                                        <div className="col-xs-4 control-label">
                                            <label>发布结束日</label>
                                        </div>
                                        <div className="col-xs-8">
                                            <div className="input-group date form_date" data-date=""
                                                 data-date-format="yyyy-mm-dd"
                                                 data-link-field="endDate" data-link-format="yyyy-mm-dd">
                                                <input id="endDate" className="form-control" type="text" ref="inputEndDate"
                                                       readonly/>
                                                <span className="input-group-addon">
                                                    <span className="glyphicon glyphicon-calendar"></span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-4">
                                        <div className="col-xs-4 control-label">
                                            <label>内容状态</label>
                                        </div>
                                        <div className="col-xs-8">
                                            <ContentStatusList  contentStatus={this.state.searchCondition.contentStatus} isContainAll="true"/>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <button type="button" className="btn btn-primary" onClick={this.handleSearch}>查&nbsp;询</button>
                                    &nbsp;&nbsp;
                                    <div className="btn-group">
                                        <a className="btn btn-success dropdown-toggle" data-toggle="dropdown">
                                            <span>创建内容</span>&nbsp;&nbsp;
                                            <i className="fa fa-caret-down"></i>
                                        </a>
                                        <ul className="dropdown-menu">
                                            <li><a href="javascript:void(0)" onClick={this.handleCreate.bind(null, ContentType.ARTICLE)}><i
                                                className="fa fa-file-o"></i>&nbsp;&nbsp;文章</a></li>
                                            <li><a href="javascript:void(0)" onClick={this.handleCreate.bind(null, ContentType.NEWS)}><i className="fa fa-newspaper-o"></i>&nbsp;
                                                新闻</a>
                                            </li>
                                            <li><a href="javascript:void(0)" onClick={this.handleCreate.bind(null, ContentType.FILE)}><i className="fa fa-download"></i>&nbsp;&nbsp;文件</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ContentsTable contentList={this.state.contentsData.contentList}/>

                        <Pager callbackParent={this.onChildChanged}
                               recordSum={this.state.contentsData.page.recordSum}
                               currentPage={this.state.contentsData.page.currentPage}
                               pageSum={this.state.contentsData.page.pageSum}/>

                        <Footer/>
                    </div>
                </div>

            </div>
        );
    }
});

var ContentsTable = React.createClass({
    render: function () {
        return (
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>栏目</th>
                    <th className="width-400">标题</th>
                    <th>类型</th>
                    <th>状态</th>
                    <th>发布者</th>
                    <th>发布时间</th>
                    <th>更新时间</th>
                </tr>
                </thead>
                <tbody>
                {this.props.contentList.map(function (item) {
                    return <ContentsTableRow key={item.contentID} content={item}/>
                })}
                </tbody>
            </table>
        );
    }
});

var ContentsTableRow = React.createClass({
    handleLink: function (contentID) {
        sessionStorage.setItem(SessionKey.contentID, contentID);
        location.href = SiteProperties.clientURL + Page.content;
    },
    render: function () {
        return (
            <tr onClick={this.handleLink.bind(null, this.props.content.contentID)}>
                <td>{this.props.content.channel.channelName}</td>
                <td><a href="javascript:void(0)" onClick={this.handleLink.bind(null, this.props.content.contentID)}>{this.props.content.contentTitle}</a></td>
                <td>{ContentTypeMap[this.props.content.contentType]}</td>
                <td>{ContentStatusMap[this.props.content.status]}</td>
                <td>{this.props.content.createUser.userName}</td>
                <td>{new Date(this.props.content.createTime).format('yyyy-MM-dd hh:mm:ss')}</td>
                <td>{new Date(this.props.content.updateTime).format('yyyy-MM-dd hh:mm:ss')}</td>
            </tr>
        );
    }
});

ReactDOM.render(
    <Contents />,
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