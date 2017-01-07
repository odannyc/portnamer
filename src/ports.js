var PortsDB = require('../assets/ports.json');

class Ports
{
    static random(onlyOfficial) {
        do {
            var result = PortsDB[Math.floor(Math.random()*PortsDB.length)];
        } while (result.Status != 'Official');

        return result;
    }

    /**
     * Filters out the ports array to find a specified record.
     *
     * @var string type The type of port to find, can be either port or name
     * @var string|int filter The filter keyword, such as '22' or 'SSH'
     */
    static find(type, filter) {
        if (type == 'name') {
            return PortsDB.filter(function (el) {
                if (el.Port == filter) {
                    return true;
                }

                return false;
            });
        }

        if (type == 'port') {
            var regex = new RegExp('\\b' + filter + '\\b');
            return PortsDB.filter(function (el) {
                if (regex.test((el.Description).toLowerCase())) {
                    return true;
                }

                return false;
            });
        }
    }
}

module.exports = Ports;
