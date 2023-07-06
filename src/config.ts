import dotenv from 'dotenv';
dotenv.config();

const config = {
    port:Number.parseInt(process.env.PORT) || 4040,
    smtpport:Number.parseInt(process.env.SMTPPORT) || 465,
    jwtsecretkey:process.env.jwtSecretKey,
    database:process.env.DATABASE,
    dbuser:process.env.DBUSER,
    dbpassword:process.env.DBPASSWORD,
    senderuser:process.env.SENDERUSER,
    host:process.env.HOST,
    password:process.env.PASSWORD,
    basePath:process.env.BASEPATH
}

export default config; 