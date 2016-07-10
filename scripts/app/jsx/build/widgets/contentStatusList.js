/**
 * Created by Ethan on 16/5/18.
 */

var ContentStatusList = React.createClass({displayName: "ContentStatusList",
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
                React.createElement("option", {value: ""}, "全部")
            );
        }
    },
    render: function () {
        return (
            React.createElement("select", {className: "form-control", defaultValue: this.props.contentStatus, ref: "inputContentStatus", onChange: this.handleChange}, 
                this.checkIsContainAll(), 
                this.props.contentStatusList.map(function (item) {
                    return React.createElement("option", {key: item.dictItemCode, value: item.dictItemCode}, item.dictItemName)
                })
            )
        );
    }
});