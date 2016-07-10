/**
 * Created by Ethan on 16/5/18.
 */

var ContentStatusList = React.createClass({
    getInitialState: function () {
        return {
            contentStatus: this.props.contentStatus
        };
    },
    componentDidUpdate: function () {
        this.state.contentStatus = this.refs.inputContentStatus.value;
        this.props.callbackParent(this.state);
    },
    componentWillReceiveProps: function(nextProps) {
        this.refs.inputContentStatus.value = nextProps.contentStatus;
    },
    handleChange: function () {
        this.state.contentStatus = this.refs.inputContentStatus.value;
        // 这里要注意：setState 是一个异步方法，所以需要操作缓存的当前值
        this.props.callbackParent(this.state);
    },
    checkIsContainAll: function(){
        if(this.props.isContainAll == 'true') {
            return (
                <option value="">全部</option>
            );
        }
    },
    render: function () {
        return (
            <select className="form-control" defaultValue={this.props.contentStatus} ref="inputContentStatus" onChange={this.handleChange}>
                {this.checkIsContainAll()}
                {this.props.contentStatusList.map(function (item) {
                    return <option key={item.dictItemCode} value={item.dictItemCode}>{item.dictItemName}</option>
                })}
            </select>
        );
    }
});