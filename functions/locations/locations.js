const array = require("./locations.json")

exports.handler = async () => {
  try {
    const locations = {}
    array.forEach(obj => {
      const match = /POINT \(([.\d]+) ([.\d]+)\)/.exec(obj.Geometry.WGS84)
      if (match) {
        const [, east, north] = match
        locations[obj.LocationSignature] = {
          east,
          north,
          AdvertisedShortLocationName: obj.AdvertisedShortLocationName
        }
      }
    })

    return {
      statusCode: 200,
      body: JSON.stringify(locations)
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
