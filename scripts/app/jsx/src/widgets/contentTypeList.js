
var ContentTypeList = React.createClass({
    getInitialState: function () {
        return {
        };
    },
    checkIsContainAll: function(){
        if(this.props.isContainAll == 'true') {
            return (
                <option value="0">全部</option>
            );
        }
    },
    render: function () {
        return (
            <select id="inputContentType" className="form-control" defaultValue={this.props.contentType} disabled={this.props.disabled}>
                {this.checkIsContainAll()}
                <option value="1">默认</option>
                <option value="2">新闻</option>
                <option value="3">下载</option>
            </select>
        );
    }
});