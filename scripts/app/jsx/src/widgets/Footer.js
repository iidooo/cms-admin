var Footer = React.createClass({
    render: function () {
        return (
            <footer className="footer">
                    <p className="text-muted text-center"><i className="fa fa-copyright"></i>&nbsp;&nbsp;上海轶度网络科技有限公司</p>
                    <p className="text-muted text-center">{SiteProperties.siteVersion}</p>
            </footer>
        );
    }
});