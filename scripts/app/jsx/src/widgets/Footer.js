/**
 * Created by Ethan on 16/5/13.
 */
var Footer = React.createClass({
    render: function () {
        return (
            <footer className="footer bg-222 navbar-fixed-bottom">
                <div className="container">
                    <p className="text-muted text-center">Powered by 上海轶度网络科技有限公司</p>
                    <p className="text-muted text-center">{SiteProperties.version}</p>
                </div>
            </footer>
        );
    }
});