var Footer = React.createClass({displayName: "Footer",
    render: function () {
        return (
            React.createElement("footer", {className: "footer margin-top-70"}, 
                    React.createElement("p", {className: "text-muted text-center"}, "Powered by 上海轶度网络科技有限公司"), 
                    React.createElement("p", {className: "text-muted text-center"}, SiteProperties.siteVersion)
            )
        );
    }
});