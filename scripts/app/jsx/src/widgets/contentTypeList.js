
var ContentTypeList = React.createClass({
    getInitialState: function () {
        return {
        };
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
            <select id="inputContentType" className="form-control" defaultValue={this.props.contentType} disabled={this.props.disabled}>
                {this.checkIsContainAll()}
                <option value="1">{ContentTypeMap["1"]}</option>
                <option value="2">{ContentTypeMap["2"]}</option>
                <option value="3">{ContentTypeMap["3"]}</option>
            </select>
        );
    }
});