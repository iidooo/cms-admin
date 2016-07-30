/**
 * Created by Ethan on 16/5/18.
 */

var UsersActions = Reflux.createActions(['search']);

var UsersStore = Reflux.createStore({
    listenables: [UsersActions],
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

var Users = React.createClass({
    mixins: [Reflux.connect(UsersStore, 'usersData')],
    getInitialState: function () {
        return {
            usersData: {
                page: {},
                userList: []
            }
        };
    },
    componentWillMount: function () {

    },
    onChildChanged: function (childState) {
        if (childState.currentPage != null) {
            this.state.currentPage = childState.currentPage;

            UsersActions.search(this.state);
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
                <Header activeMenuID="menuSystemManage"/>

                <div id="main" className="container-fluid margin-top-70">
                    <div className="col-sm-2 sidebar margin-top-20">
                        <div className="list-group">
                            <a href={SiteProperties.clientURL + Page.account} className="list-group-item active">
                                用户管理
                            </a>
                            <a href={SiteProperties.clientURL + Page.password} className="list-group-item">密码重设</a>
                        </div>
                    </div>
                    <div className="col-sm-offset-2">
                        <div>
                            <div className="title pull-left">
                                <h4>用户管理</h4>
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
                        <UsersTable userList={this.state.usersData.userList}/>

                        <Pager callbackParent={this.onChildChanged}
                               recordSum={this.state.usersData.page.recordSum}
                               currentPage={this.state.usersData.page.currentPage}
                               pageSum={this.state.usersData.page.pageSum}/>
                    </div>
                </div>

            </div>
        );
    }
});

var UsersTable = React.createClass({
    render: function () {
        return (
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>用户ID</th>
                    <th>用户名</th>
                    <th>手机号</th>
                    <th>邮箱</th>
                    <th>微信号</th>
                    <th>角色</th>
                    <th>更新时间</th>
                </tr>
                </thead>
                <tbody>
                {this.props.userList.map(function (item) {
                    return <UsersTableRow key={item.userID} user={item}/>
                })}
                </tbody>
            </table>
        );
    }
});

var UsersTableRow = React.createClass({
    handleLink: function (contentID) {
        sessionStorage.setItem(SessionKey.contentID, contentID);
        location.href = SiteProperties.clientURL + Page.content;
    },
    render: function () {
        return (
            <tr onClick={this.handleLink.bind(null, this.props.user.userID)}>
                <td>{this.props.user.userName}</td>
                <td><a href="javascript:void(0)" onClick={this.handleLink.bind(null, this.props.user.userID)}>{this.props.user.userName}</a></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{new Date(this.props.user.updateTime).format('yyyy-MM-dd hh:mm:ss')}</td>
            </tr>
        );
    }
});

ReactDOM.render(
    <Users />,
    document.getElementById('page')
);