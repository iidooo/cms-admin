
var ContentStatusList = React.createClass({displayName: "ContentStatusList",
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
            React.createElement("select", {id: "inputContentStatus", className: "form-control", defaultValue: this.props.contentStatus, disabled: this.props.disabled}, 
                this.checkIsContainAll(), 
                React.createElement("option", {value: "1"}, ContentStatusMap["1"]), 
                React.createElement("option", {value: "2"}, ContentStatusMap["2"]), 
                React.createElement("option", {value: "3"}, ContentStatusMap["3"]), 
                React.createElement("option", {value: "4"}, ContentStatusMap["4"]), 
                React.createElement("option", {value: "5"}, ContentStatusMap["5"])
            )
        );
    }
});