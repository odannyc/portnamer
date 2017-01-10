const PortsDB = require('../assets/ports.json');

/**
 * Helper HOF returns a suitable filter function
 * @param  {String} type    Filtering by name or port?
 * @param  {String} filter  Name or port to filter by
 * @return {Function}        A suitable filter function for use in Ports.find
 */
const filterFunctionFromType = (type = 'name', filter = '22') => {
  console.log({type, filter})
  if (type == 'port') {
    return (el) => el.Port == filter;
  }

  if (type == 'name') {
    return (el) => (new RegExp(`\\b${filter}\\b`)).test((el.Description).toLowerCase());
  }
}

class Ports
{
  static random(onlyOfficial) {
    let result;
    do {
      result = PortsDB[Math.floor(Math.random() * PortsDB.length)];
    } while (result.Status != 'Official');

    return result;
  }

  /**
   * Filters out the ports array to find a specified record.
   *
   * @param {string} type The type of port to find, can be either port or name
   * @param {string|int} filter The filter keyword, such as '22' or 'SSH'
   */
  static find(type, filter) {
    return PortsDB.filter(filterFunctionFromType(type, filter));
  }
}

module.exports = Ports;
