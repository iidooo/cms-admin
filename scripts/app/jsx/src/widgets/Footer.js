var Footer = React.createClass({
    render: function () {
        return (
            <footer className="footer margin-top-70">
                    <p className="text-muted text-center">Powered by 上海轶度网络科技有限公司</p>
                    <p className="text-muted text-center">{SiteProperties.siteVersion}</p>
            </footer>
        );
    }
});