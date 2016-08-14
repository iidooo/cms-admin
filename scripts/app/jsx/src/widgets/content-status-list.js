
var ContentStatusList = React.createClass({
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
            <select id="inputContentStatus" className="form-control" defaultValue={this.props.contentStatus} disabled={this.props.disabled}>
                {this.checkIsContainAll()}
                <option value="1">{ContentStatusMap["1"]}</option>
                <option value="2">{ContentStatusMap["2"]}</option>
                <option value="3">{ContentStatusMap["3"]}</option>
                <option value="4">{ContentStatusMap["4"]}</option>
                <option value="5">{ContentStatusMap["5"]}</option>
            </select>
        );
    }
});