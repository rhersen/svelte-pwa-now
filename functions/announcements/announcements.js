const fetch = require("node-fetch")
exports.handler = async function({ queryStringParameters }) {
  try {
    const response = await fetch(
      "http://api.trafikinfo.trafikverket.se/v1.2/data.json",
      {
        method: "POST",
        body: getBody(queryStringParameters),
        headers: {
          "Content-Type": "application/xml",
          Accept: "application/json"
        }
      }
    )
    if (!response.ok)
      return {
        statusCode: response.status,
        body: JSON.stringify({ msg: response.statusText })
      }
    const data = await response.json()
    const [body] = data.RESPONSE.RESULT

    return {
      statusCode: 200,
      body: JSON.stringify(body)
    }
  } catch (err) {
    console.log(err) // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }) // Could be a custom message or object i.e. JSON.stringify(err)
    }
  }
}

function getBody({ direction }) {
  return `
<REQUEST>
  <LOGIN authenticationkey='${process.env.TRAFIKVERKET_API_KEY}' />
     <QUERY objecttype='TrainAnnouncement' lastmodified='true' orderby='AdvertisedTimeAtLocation'>
      <FILTER>
       <AND>
         <IN name='LocationSignature' value='Äs,Åbe,Sst,Sci,Sod,Tmö,So,Kmy,Udl,Hel,Sol,Hgv,Nvk,R,Upv,Skby,Rs,Bra,Mr,Rön,Gau,Södy,Tu,Uts,Tul,Flb,Hu,Sta,Hfa,Ts,Kda,Vhe,Jbo,Hnd,Vga,Skg,Tåd,Fas,Hön,Huv,Sub,Duo,Spå,Bkb,Jkb' />
         <LIKE name='AdvertisedTrainIdent' value='/[${
    direction === "n" ? "02468" : "13579"
  }]$/' />
         <OR>
           <AND>
            <GT name='AdvertisedTimeAtLocation' value='$dateadd(-0:10:00)' />
            <LT name='AdvertisedTimeAtLocation' value='$dateadd(0:10:00)' />
           </AND>
           <AND>
            <GT name='EstimatedTimeAtLocation' value='$dateadd(-0:10:00)' />
            <LT name='EstimatedTimeAtLocation' value='$dateadd(0:10:00)' />
           </AND>
           <AND>
            <GT name='TimeAtLocation' value='$dateadd(-0:10:00)' />
            <LT name='TimeAtLocation' value='$dateadd(0:10:00)' />
           </AND>
         </OR>
       </AND>
      </FILTER>
      <INCLUDE>ActivityType</INCLUDE>
      <INCLUDE>AdvertisedLocationName</INCLUDE>
      <INCLUDE>AdvertisedShortLocationName</INCLUDE>
      <INCLUDE>AdvertisedTrainIdent</INCLUDE>
      <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
      <INCLUDE>Geometry</INCLUDE>
      <INCLUDE>LocationSignature</INCLUDE>
      <INCLUDE>ProductInformation</INCLUDE>
      <INCLUDE>TimeAtLocation</INCLUDE>
      <INCLUDE>ToLocation</INCLUDE>
     </QUERY>
</REQUEST>`
}
