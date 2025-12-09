const healthCheck = (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime_seconds: process.uptime()
    });
};


module.exports = {
    healthCheck
};