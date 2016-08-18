var MarkdownEditor = React.createClass({
    componentDidUpdate: function () {
        $('[data-toggle="tooltip"]').tooltip();
        this.refs.markdownContent.value = this.props.text;
        showdownPreview(this.refs.markdownContent.value, "markdownPreview");
    },
    handleEdit: function () {
        showdownPreview(this.refs.markdownContent.value, "markdownPreview");
    },
    handleScroll: function(event){
        $("#markdownPreview").scrollTop($("#markdownContent").scrollTop());
    },
    insertFontSize: function(){
        var markdownContent = $("#markdownContent").val();
        $("#markdownContent").val(markdownContent + "#1号标题#\r\n##2号标题##\r\n###3号标题###\r\n");
        showdownPreview(this.refs.markdownContent.value, "markdownPreview");
    },
    insertFontStrong: function(){
        var markdownContent = $("#markdownContent").val();
        $("#markdownContent").val(markdownContent + "**重点内容**\r\n");
        showdownPreview(this.refs.markdownContent.value, "markdownPreview");
    },
    insertFontItalic: function(){
        var markdownContent = $("#markdownContent").val();
        $("#markdownContent").val(markdownContent + "*强调内容*\r\n");
        showdownPreview(this.refs.markdownContent.value, "markdownPreview");
    },
    insertStrikeThrough : function(){
        var markdownContent = $("#markdownContent").val();
        $("#markdownContent").val(markdownContent + "~~删除内容~~\r\n");
        showdownPreview(this.refs.markdownContent.value, "markdownPreview");
    },
    insertBlokeQuote : function(){
        var markdownContent = $("#markdownContent").val();
        $("#markdownContent").val(markdownContent + ">引用内容\r\n");
        showdownPreview(this.refs.markdownContent.value, "markdownPreview");
    },
    insertPreCode : function(){
        var markdownContent = $("#markdownContent").val();
        $("#markdownContent").val(markdownContent + "```\r\n这里写代码片段\r\n```\r\n");
        showdownPreview(this.refs.markdownContent.value, "markdownPreview");
    },
    insertLink: function(){
        var markdownContent = $("#markdownContent").val();
        $("#markdownContent").val(markdownContent + "[显示内容](http://www.edo-network.com '标题')\r\n");
        showdownPreview(this.refs.markdownContent.value, "markdownPreview");
    },
    insertPicture: function(){
        $('#markdownPictureDialog').modal('show');
    },
    insertOLList: function(){
        var markdownContent = $("#markdownContent").val();
        $("#markdownContent").val(markdownContent + "1. 列表内容\r\n2. 列表内容\r\n");
        showdownPreview(this.refs.markdownContent.value, "markdownPreview");
    },
    insertULList: function(){
        var markdownContent = $("#markdownContent").val();
        $("#markdownContent").val(markdownContent + "- 列表内容\r\n- 列表内容\r\n");
        showdownPreview(this.refs.markdownContent.value, "markdownPreview");
    },
    insertHRLine: function(){
        var markdownContent = $("#markdownContent").val();
        $("#markdownContent").val(markdownContent + "---\r\n");
        showdownPreview(this.refs.markdownContent.value, "markdownPreview");
    },
    render: function () {
        return (
            <div id="markdownEditor">
                <MarkdownPictureDialog/>
                <div className="row">
                    <nav className="navbar navbar-default margin-bottom-0">
                        <div className="navbar-collapse collapse">
                            <ul className="nav navbar-nav">
                                <li><a href="javascript:void(0)" title="标题" data-toggle="tooltip" data-placement="top" onClick={this.insertFontSize}><i className="fa fa-header fa-lg"></i></a></li>
                                <li><a href="javascript:void(0)" title="粗体" data-toggle="tooltip" data-placement="top" onClick={this.insertFontStrong}><i className="fa fa-bold fa-lg"></i></a></li>
                                <li><a href="javascript:void(0)" title="斜体" data-toggle="tooltip" data-placement="top" onClick={this.insertFontItalic}><i className="fa fa-italic fa-lg"></i></a></li>
                                <li><a href="javascript:void(0)" title="删除" data-toggle="tooltip" data-placement="top" onClick={this.insertStrikeThrough}><i className="fa fa-strikethrough fa-lg"></i></a></li>
                                <li><a href="javascript:void(0)" title="引用区块" data-toggle="tooltip" data-placement="top" onClick={this.insertBlokeQuote}><i className="fa fa-indent fa-lg"></i></a></li>
                                <li><a href="javascript:void(0)" title="代码片段" data-toggle="tooltip" data-placement="top" onClick={this.insertPreCode}><i className="fa fa-code fa-lg"></i></a></li>
                                <li><a href="javascript:void(0)" title="链接" data-toggle="tooltip" data-placement="top" onClick={this.insertLink}><i className="fa fa-link fa-lg"></i></a></li>
                                <li><a href="javascript:void(0)" title="图片" data-toggle="tooltip" data-placement="top" onClick={this.insertPicture}><i className="fa fa-image fa-lg"></i></a></li>
                                <li><a href="javascript:void(0)" title="有序列表" data-toggle="tooltip" data-placement="top" onClick={this.insertOLList}><i className="fa fa-list-ol fa-lg"></i></a></li>
                                <li><a href="javascript:void(0)" title="无序列表" data-toggle="tooltip" data-placement="top" onClick={this.insertULList}><i className="fa fa-list-ul fa-lg"></i></a></li>
                                <li><a href="javascript:void(0)" title="分割横线" data-toggle="tooltip" data-placement="top" onClick={this.insertHRLine}><i className="fa fa-ellipsis-h fa-lg"></i></a></li>
                            </ul>
                        </div>
                    </nav>
                </div>
                <div className="row">
                    <div className="col-sm-6 padding-left-0 padding-right-0">
                         <textarea id="markdownContent" ref="markdownContent"
                                          className="form-control"
                                          onChange={this.handleEdit} onScroll={this.handleScroll}></textarea>
                    </div>
                    <div id="markdownPreview" className="col-sm-6 markdownPreview" >

                    </div>
                </div>
            </div>
        );
    }
});


var MarkdownPictureDialog = React.createClass({
    componentDidUpdate: function () {
        //文件上传前触发事件
        $('#uploadMarkdownPicture').bind('fileuploadsubmit', function (e, data) {
            data.formData = {
                'accessKey': SecurityClient.accessKey,
                'accessSecret': SecurityClient.accessSecret,
                'accessToken': sessionStorage.getItem(SessionKey.accessToken),
                'operatorID': sessionStorage.getItem(SessionKey.operatorID),
                'siteID': sessionStorage.getItem(SessionKey.siteID),
                'width': $("#inputMarkdownPictureWidth").val(),
                'height': $("#inputMarkdownPictureHeight").val(),
                'isCompress': $("#checkboxMarkdownPictureCompress").prop("checked")
            };  //如果需要额外添加参数可以在这里添加
        });

        // 上传内容图片列表
        $("#uploadMarkdownPicture").fileupload({
            url: SiteProperties.serverURL + API.uploadFile,
            dataType: 'json',
            autoUpload: true,
            acceptFileTypes: /(\.|\/)(jpe?g|png|gif|bmp)$/i,
            maxNumberOfFiles: 1,
            maxFileSize: 10000000,
            done: function (e, result) {
                var data = result.result;
                if (data.status == "200") {
                    $("#inputMarkdownPictureURL").val(data.data.url);
                } else {
                    console.log(data);
                }
            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10) + "%";

                console.log(progress);
            },
            error: function (e, data) {
                console.log(data);
            },
            fail: function (e, data) {
                console.log(data);
            }
        });

        $('#markdownPictureDialog').on('hide.bs.modal', function (e) {
            // 初始化
            $("#inputMarkdownPictureURL").val("");
            $("#inputMarkdownPictureWidth").val("");
            $("#inputMarkdownPictureHeight").val("");
            $("#checkboxMarkdownPictureCompress").attr("checked",false);
        })
    },
    handleConfirm: function () {
        var markdownContent = $("#markdownContent").val();
        $("#markdownContent").val(markdownContent + "![这里写图片描述](" + this.refs.inputMarkdownPictureURL.value + ")\r\n");
        showdownPreview($("#markdownContent").val(), "markdownPreview");

        $('#markdownPictureDialog').modal('toggle');
    },
    handleUploadFile: function () {
        var isCompress = $("#checkboxMarkdownPictureCompress").prop("checked");
        var message = Message.UPLOAD_UMCOMPRESS_CONFIRM;
        if(isCompress == true){
            message = Message.UPLOAD_COMPRESS_CONFIRM;
        }

        if(window.confirm(message)){
            openFileBrowse("uploadMarkdownPicture");
        }
    },
    handleClose: function () {
        $('#markdownPictureDialog').modal('toggle');
    },
    render: function () {
        return (
            <div className="modal fade" id="markdownPictureDialog" tabindex="-1" role="dialog" aria-labelledby="dialogTitle">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={this.handleClose}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title" id="dialogTitle">插入图片</h4>
                        </div>
                        <div className="modal-body">
                            <div className="row form-group form-horizontal">
                                <div className="col-xs-2 control-label">
                                    <label>图片路径</label>
                                </div>
                                <div className="col-xs-10">
                                    <div className="input-group">
                                        <input type="text" id="inputMarkdownPictureURL" className="form-control"
                                               ref="inputMarkdownPictureURL"
                                               aria-describedby="basic-addon3" placeholder="输入或上传图片"/>
                                        <span className="input-group-addon btn" id="basic-addon3"
                                              onClick={this.handleUploadFile}>
                                            上传
                                        </span>
                                        <input id="uploadMarkdownPicture" type="file" name="file" className="hidden"
                                               accept="image/gif,image/jpeg,image/x-ms-bmp,image/x-png,image/png"/>
                                    </div>
                                </div>
                            </div>
                            <div className="row form-group">
                                <div className="col-xs-2 control-label checkbox">
                                    <label>
                                        <input type="checkbox" id="checkboxMarkdownPictureCompress" ref="checkboxMarkdownPictureCompress"/>
                                        压缩
                                    </label>
                                </div>
                                <div className="col-xs-10 form-inline">
                                    <div className="form-group">
                                        <input type="number" id="inputMarkdownPictureWidth" className="form-control"
                                               ref="inputMarkdownPictureWidth" placeholder="宽度"/>
                                    </div>
                                    <div className="form-group">
                                        &nbsp;&nbsp;<i className="fa fa-times form-group"></i>&nbsp;&nbsp;
                                        <input type="number" id="inputMarkdownPictureHeight" className="form-control"
                                               ref="inputMarkdownPictureHeight" placeholder="高度"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" onClick={this.handleClose}>取消</button>
                            <button type="button" className="btn btn-primary" onClick={this.handleConfirm}>确定</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});