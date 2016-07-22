/**
 * Created by Ethan on 16/5/18.
 */

var ContentsActions = Reflux.createActions(['search']);

var ContentsStore = Reflux.createStore({
    listenables: [ContentsActions],
    onSearch: function (data) {
        var url = SiteProperties.serverURL + API.searchContentList;
        data.appID = SecurityClient.appID;
        data.secret = SecurityClient.secret;
        data.accessToken = sessionStorage.getItem(SessionKey.accessToken);
        data.userID = sessionStorage.getItem(SessionKey.userID);
        data.siteID = sessionStorage.getItem(SessionKey.siteID);
        data.channelID = sessionStorage.getItem(SessionKey.channelID);

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
            contentsData: {
                page: {},
                contentList: []
            }
        };
    },
    componentWillMount: function () {
        sessionStorage.removeItem(SessionKey.channelID);
        ContentsActions.search(this.state);
    },
    onChildChanged: function (childState) {
        if (childState.currentPage != null) {
            this.state.currentPage = childState.currentPage;

            ContentsActions.search(this.state);
        }
    },
    handleCreate: function (contentType) {
        sessionStorage.setItem(SessionKey.contentType, contentType);
        sessionStorage.removeItem(SessionKey.contentID);
        location.href = SiteProperties.clientURL + Page.content;
    },
    render: function () {
        return (
            <div>
                <Header activeMenuID="menuContentManage"/>

                <div id="main" className="container-fluid margin-top-70">
                    <div className="col-sm-2 sidebar margin-top-20">
                        <div className="title">
                            <h4>栏目管理</h4>
                        </div>
                        <ChannelTree/>
                    </div>
                    <div className="col-sm-offset-2">
                        <div>
                            <div className="title pull-left">
                                <h4>内容管理</h4>
                            </div>
                            <div className="pull-right form-inline">
                                <div className="btn-group">
                                    <a className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                        <span>创建内容</span>&nbsp;&nbsp;
                                        <i className="fa fa-caret-down"></i>
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li><a href="javascript:void(0)" onClick={this.handleCreate.bind(null, ContentType.DEFAULT)}><i
                                            className="fa fa-file-o"></i>&nbsp;&nbsp;默认</a></li>
                                        <li><a href="javascript:void(0)" onClick={this.handleCreate.bind(null, ContentType.NEWS)}><i className="fa fa-newspaper-o"></i>&nbsp;
                                            新闻</a>
                                        </li>
                                        <li><a href="javascript:void(0)" onClick={this.handleCreate.bind(null, ContentType.FILE)}><i className="fa fa-download"></i>&nbsp;&nbsp;文件</a>
                                        </li>
                                    </ul>
                                </div>
                                <div id="searchForm" className="input-group margin-left-5">
                                    <input type="text" className="form-control" placeholder="请输入内容关键字"/>
                                    <span className="input-group-btn">
                                        <a className="btn btn-default">
                                            <i className="fa fa-search"></i>搜索
                                        </a>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="clearfix"></div>
                        <div className="spacer10"></div>
                        <ContentsTable contentList={this.state.contentsData.contentList}/>

                        <Pager callbackParent={this.onChildChanged}
                               recordSum={this.state.contentsData.page.recordSum}
                               currentPage={this.state.contentsData.page.currentPage}
                               pageSum={this.state.contentsData.page.pageSum}/>
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