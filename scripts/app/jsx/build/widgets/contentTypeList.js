
var ContentTypeList = React.createClass({displayName: "ContentTypeList",
    getInitialState: function () {
        return {
        };
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
            React.createElement("select", {id: "inputContentType", className: "form-control", defaultValue: this.props.contentType, disabled: this.props.disabled}, 
                this.checkIsContainAll(), 
                React.createElement("option", {value: "1"}, "默认"), 
                React.createElement("option", {value: "2"}, "新闻"), 
                React.createElement("option", {value: "3"}, "下载")
            )
        );
    }
});