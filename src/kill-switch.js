const axios = require('axios');
class GlobalKillSwitch {
    constructor(url) { this.statusUrl = url; this.isSystemHalted = false; }
    async checkNetworkStatus() {
        try {
            const res = await axios.get(this.statusUrl);
            if (res.data.network === "HALTED") { this.isSystemHalted = true; return "HALTED"; }
            return "ACTIVE";
        } catch (e) { return "OFFLINE"; }
    }
}
module.exports = GlobalKillSwitch;