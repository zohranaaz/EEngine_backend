import dotenv from 'dotenv';
dotenv.config();

const config = {
    port:process.env.PORT,
    jwtsecretkey:process.env.jwtSecretKey,
    database:process.env.DATABASE,
    username:process.env.USERNAME,
    host:process.env.HOST
}

export default config; 