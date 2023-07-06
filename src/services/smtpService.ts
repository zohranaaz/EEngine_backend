const nodemailer = require('nodemailer');
import config from "../config";

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: config.senderuser,
        pass: config.password
    }
});

export const passwordSendMail = async (userData) => {
    const html =
        `<!DOCTYPE html>` +
        `</head>
        <body><div>
        <h2>Hi `+ userData.name +
        `<p>Your email was successfully register with EEngine.</p>` +
        `<p>For Create password please <a href="/home/amantya/Desktop/Project/backend/src/password.html"> Click here. </p>` +
        `</div></h2></body>
    </html>`;

    const data = {
        receiver_email: userData.email,
        subject: 'Welcome : EEngine',
        html: html
    };
    let info = await mailSentFunc(data);
    return info;
}


export const sendmail = async (mailDetails, fileName) => {
    let info;
    const html =
        `<!DOCTYPE html>` +
        `</head><body><div>` +
        `<p>` + mailDetails.email_body + `</p>` +
        `</div></body>
         </html>`;

    const data = {
        receiver_email: mailDetails.receiver_email,
        subject: mailDetails.email_subject,
        html: html
    };
    if (fileName == "") {
        info = await mailSentFunc(data);
    }
    else {
        info = await transporter.sendMail({
            from: 'demo42115@gmail.com',
            to: mailDetails.receiver_email,
            subject: mailDetails.email_subject,
            html: html,
            attachments: [
                {
                    filename: fileName,
                    path: config.basePath + fileName
                }
            ]
        });
    }
    return info;
}

export const sendStatistics = async (statistics, userData) => {
    const html =
        `<!DOCTYPE html>` +
        `</head> 
        <body><div><h2>`+
        `<p>Hello `+ userData.data.name +`<br>You have been given a ` + statistics.total_quota + ` mail sending quota overall.</p>` +
        `<p>Out of which you have already used ` + statistics.total_mail_sent + ` of the emails.</p>` +
        `<p>Now you have only ` + (statistics.total_quota - statistics.total_mail_sent) + ` mail-sending quota left.</p>` +
        `</h2></div></body>
        </html>`;

    const data = {
        receiver_email: userData.data.email,
        subject: 'Statistics',
        html: html
    };
    let info = await mailSentFunc(data);
    return info;
}


export const sendExhaustsMail = async (user) => {
    const html =
        `<!DOCTYPE html>` +
        `</head> 
        <body><div>`+
        `<p>Hello ` + user.data.name + `<br>Your total quota of sending mail has been exhausted now.</p>` +
        `<p>You cannot send mail now to any receiver.</p>` +
        `<p>Kindly contact to Admin.</p>` +
        `</div></body>
        </html>`;

    const data = {
        receiver_email: user.data.email,
        subject: 'Quota Exhaust',
        html: html
    };
    let info = await mailSentFunc(data);
    return info;
}

export const mailSentFunc = async (details) => {

    const info = await transporter.sendMail({
        from: 'demo42115@gmail.com',
        to: details.receiver_email,
        subject: details.subject,
        html: details.html
    });
    return info;
    
}