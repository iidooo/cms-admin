/**
 * Created by Ethan on 16/5/27.
 */
var MessageBox = React.createClass({displayName: "MessageBox",
    render: function () {
        return (
            React.createElement("div", {id: "messageBox", className: "alert alert-danger", style: {display:"none"}, role: "alert"})
        );
    }
});