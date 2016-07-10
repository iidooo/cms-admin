/**
 * Created by Ethan on 16/5/18.
 */

var ContentTypeList = React.createClass({displayName: "ContentTypeList",
    getInitialState: function () {
        return {
            contentType: this.props.contentType,
            contentTypeList: []
        };
    },
    componentDidUpdate: function () {
        this.state.contentType = this.refs.inputContentType.value;
        this.props.callbackParent(this.state);
    },
    componentWillReceiveProps: function(nextProps) {
        this.refs.inputContentType.value = nextProps.contentType;
    },
    handleChange: function () {
        this.state.contentType = this.refs.inputContentType.value;
        // 这里要注意：setState 是一个异步方法，所以需要操作缓存的当前值
        this.props.callbackParent(this.state);
    },
    checkIsContainAll: function(){
        if(this.props.isContainAll == 'true') {
            return (
                React.createElement("option", {value: "0"}, "全部")
            );
        }
    },
    render: function () {
        return (
            React.createElement("select", {className: "form-control", ref: "inputContentType", onChange: this.handleChange}, 
                this.checkIsContainAll(), 
                this.props.contentTypeList.map(function (item) {
                    return React.createElement("option", {key: item.dictItemCode, value: item.dictItemCode}, item.dictItemName)
                })
            )
        );
    }
});