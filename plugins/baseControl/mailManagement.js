const nodemailer  = require("nodemailer");

// 参数：发件人，收件人，主题，正文（支持html格式）
function sendMail(from, aliasName, tos, subject, msg)
{
    const smtpTransport = nodemailer.createTransport({
    host: "smtp.qq.com",
    secureConnection: true, // use SSL
    secure: true,
    port: 465,
    auth: {
        user: from,
        pass: 'fwxnjchgsrnvdiac',
    }
    });

    smtpTransport.sendMail({
        //from    : '标题别名 <foobar@latelee.org>',
        from    : aliasName + ' ' + '<' + from + '>',
        //'li@latelee.org, latelee@163.com',//收件人邮箱，多个邮箱地址间用英文逗号隔开
        to      : tos,
        subject : subject,//邮件主题
        //text    : msg,
        html    : msg
    }, function(err, res) {
        if (err)
        {
            console.log('error: ', err);
        }
    });
}

function nl2br(str, isXhtml) {
    var breakTag = (isXhtml || typeof isXhtml === 'undefined') ? '<br />' : '<br>';
    var str = (str + '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
};

function sendRegisterInfo(registerInfo){
  sendMail('2648485598@qq.com',"何文忠",registerInfo.email,
            '注册验证',
            '<h2> 测试系统！</h2>欢迎注册本系统，您本次的验证码为：'+registerInfo.code+"</br>请不要泄露给他人！！如不是您本人操作请及时联系邮箱2648485598@qq.com")
}

function sendLoginInfo(email){
  sendMail('2648485598@qq.com',"何文忠",email,
            '登录提醒',
            "<h2> 测试系统！</h2>欢迎登录本系统</br>，如不是您本人操作请及时联系邮箱2648485598@qq.com")
}
exports.sendRegisterInfo = sendRegisterInfo;
exports.sendLoginInfo = sendLoginInfo;

