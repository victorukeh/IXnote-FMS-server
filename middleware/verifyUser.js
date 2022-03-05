const arp = require('node-arp')
exports.verify = async(req, res, next) => {
    // Get Ip address
    const IP = req.socket.remoteAddress || req.ip
    const ipAddress = JSON.stringify(IP)
    // Get MAC address
    arp.getMAC(ipAddress, function(err, mac){
        if(err){
            console.log(err)
            res.status(404).json({
                err: err
            })       
        }
        else{
            console.log(mac)
            next()
        }  
    })
}