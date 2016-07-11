/**
 * Created by Ethan on 16/5/13.
 */
var Footer = React.createClass({displayName: "Footer",
    render: function () {
        return (
            React.createElement("footer", {className: "footer bg-222 navbar-fixed-bottom"}, 
                React.createElement("div", {className: "container"}, 
                    React.createElement("p", {className: "text-muted text-center"}, "Powered by 上海轶度网络科技有限公司"), 
                    React.createElement("p", {className: "text-muted text-center"}, SiteProperties.version)
                )
            )
        );
    }
});