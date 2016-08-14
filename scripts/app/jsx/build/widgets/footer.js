var Footer = React.createClass({displayName: "Footer",
    render: function () {
        return (
            React.createElement("footer", {className: "footer"}, 
                    React.createElement("p", {className: "text-muted text-center"}, React.createElement("i", {className: "fa fa-copyright"}), "  上海轶度网络科技有限公司"), 
                    React.createElement("p", {className: "text-muted text-center"}, SiteProperties.siteVersion)
            )
        );
    }
});