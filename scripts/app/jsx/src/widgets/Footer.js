var Footer = React.createClass({
    render: function () {
        return (
            <footer className="footer">
                    <p className="text-muted text-center">Powered by 上海轶度网络科技有限公司</p>
                    <p className="text-muted text-center">{SiteProperties.version}</p>
            </footer>
        );
    }
});