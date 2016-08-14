
var ContentTypeList = React.createClass({displayName: "ContentTypeList",
    getInitialState: function () {
        return {
        };
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
            React.createElement("select", {id: "inputContentType", className: "form-control", defaultValue: this.props.contentType, disabled: this.props.disabled}, 
                this.checkIsContainAll(), 
                React.createElement("option", {value: "1"}, ContentTypeMap["1"]), 
                React.createElement("option", {value: "2"}, ContentTypeMap["2"]), 
                React.createElement("option", {value: "3"}, ContentTypeMap["3"])
            )
        );
    }
});