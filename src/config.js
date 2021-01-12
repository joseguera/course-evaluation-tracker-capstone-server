module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_TOKEN: process.env.API_TOKEN || 'dummy-api-token',
    DATABASE_URL: process.env.DATABASE_URL || 'postgres://ykvnlhztliqbic:9c2472d69ff490ba950d2b280e6b17a0b2977c5cf0407b753ca0fec2d120e237@ec2-107-23-191-123.compute-1.amazonaws.com:5432/d72nrbq06uf747',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgres://ykvnlhztliqbic:9c2472d69ff490ba950d2b280e6b17a0b2977c5cf0407b753ca0fec2d120e237@ec2-107-23-191-123.compute-1.amazonaws.com:5432/d72nrbq06uf747',
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
}