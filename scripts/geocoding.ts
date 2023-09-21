import { reverseGeoCodingResponseSchema } from "#src/utils/geocoding/schema";
import "dotenv/config";

//put `"type": "module"` in package.json for this to work...

type GoogleReverseGeocidingParams = {
  lng: number;
  lat: number;
};

console.log("GOOGLE_GEOCODING_API_KEY", process.env.GOOGLE_GEOCODING_API_KEY);

async function getGoogleReverseGeocoding(p: GoogleReverseGeocidingParams) {
  const key = process.env.GOOGLE_GEOCODING_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${p.lat},${p.lng}&key=${key}`;
  console.log("geocoding url:", url);
  const json = await fetch(url).then((res) => res.json());
  console.log("json:", json);
  const data = reverseGeoCodingResponseSchema.parse(json);
  const firstResult = data.results[0];
  console.log(data);
  return firstResult;
}

async function debug() {
  const input = { lng: 16.32287663898514, lat: 59.91217879464036 };
  const place = await getGoogleReverseGeocoding({ lng: input.lng, lat: input.lat });
  console.log("place:", place);
}

debug();

const exampleresponse1 = {
  plus_code: {
    compound_code: "W86F+V5C Norrsalbo, Sweden",
    global_code: "9FFRW86F+V5C",
  },
  results: [
    {
      address_components: [
        {
          long_name: "Norrsalbo",
          short_name: "Norrsalbo",
          types: ["establishment", "point_of_interest", "transit_station"],
        },
        {
          long_name: "Västerfärnebo",
          short_name: "Västerfärnebo",
          types: ["postal_town"],
        },
        {
          long_name: "Västmanlands län",
          short_name: "Västmanlands län",
          types: ["administrative_area_level_1", "political"],
        },
        {
          long_name: "Sweden",
          short_name: "SE",
          types: ["country", "political"],
        },
        { long_name: "733 63", short_name: "733 63", types: ["postal_code"] },
      ],
      formatted_address: "Norrsalbo, 733 63 Västerfärnebo, Sweden",
      geometry: {
        location: { lat: 59.91210899999999, lng: 16.322832 },
        location_type: "GEOMETRIC_CENTER",
        viewport: {
          northeast: { lat: 59.9134579802915, lng: 16.3241809802915 },
          southwest: { lat: 59.91076001970849, lng: 16.3214830197085 },
        },
      },
      place_id: "ChIJRanWxO50XkYRcAxMeJZ8A1Q",
      plus_code: {
        compound_code: "W86F+R4 Norrsalbo, Sweden",
        global_code: "9FFRW86F+R4",
      },
      types: ["establishment", "point_of_interest", "transit_station"],
    },
    {
      address_components: [
        { long_name: "121", short_name: "121", types: ["premise"] },
        {
          long_name: "Norrsalbo",
          short_name: "Norrsalbo",
          types: ["locality", "political"],
        },
        {
          long_name: "Salbohed",
          short_name: "Salbohed",
          types: ["postal_town"],
        },
        {
          long_name: "Västmanlands län",
          short_name: "Västmanlands län",
          types: ["administrative_area_level_1", "political"],
        },
        {
          long_name: "Sweden",
          short_name: "SE",
          types: ["country", "political"],
        },
        { long_name: "733 63", short_name: "733 63", types: ["postal_code"] },
      ],
      formatted_address: "Norrsalbo 121, 733 63 Salbohed, Sweden",
      geometry: {
        bounds: {
          northeast: { lat: 59.91258849999999, lng: 16.3229581 },
          southwest: { lat: 59.912409, lng: 16.3225524 },
        },
        location: { lat: 59.91250280000001, lng: 16.3227223 },
        location_type: "ROOFTOP",
        viewport: {
          northeast: { lat: 59.91384773029151, lng: 16.3241042302915 },
          southwest: { lat: 59.91114976970849, lng: 16.3214062697085 },
        },
      },
      place_id: "ChIJjQeu0e50XkYRLSuEx7hICE8",
      types: ["premise"],
    },
    {
      address_components: [
        { long_name: "Salbovägen", short_name: "256", types: ["route"] },
        {
          long_name: "Västerfärnebo",
          short_name: "Västerfärnebo",
          types: ["postal_town"],
        },
        {
          long_name: "Västmanlands län",
          short_name: "Västmanlands län",
          types: ["administrative_area_level_1", "political"],
        },
        {
          long_name: "Sweden",
          short_name: "SE",
          types: ["country", "political"],
        },
        { long_name: "730 70", short_name: "730 70", types: ["postal_code"] },
      ],
      formatted_address: "Salbovägen, 730 70 Västerfärnebo, Sweden",
      geometry: {
        bounds: {
          northeast: { lat: 59.9121738, lng: 16.3238379 },
          southwest: { lat: 59.91092690000001, lng: 16.3227363 },
        },
        location: { lat: 59.9115602, lng: 16.3233278 },
        location_type: "GEOMETRIC_CENTER",
        viewport: {
          northeast: { lat: 59.91289933029151, lng: 16.3246360802915 },
          southwest: { lat: 59.9102013697085, lng: 16.3219381197085 },
        },
      },
      place_id: "ChIJh_TLwe50XkYR6tDRA4UtpGM",
      types: ["route"],
    },
    {
      address_components: [
        { long_name: "W86F+V5", short_name: "W86F+V5", types: ["plus_code"] },
        {
          long_name: "Västerfärnebo",
          short_name: "Västerfärnebo",
          types: ["postal_town"],
        },
        {
          long_name: "Västmanland County",
          short_name: "Västmanland County",
          types: ["administrative_area_level_1", "political"],
        },
        {
          long_name: "Sweden",
          short_name: "SE",
          types: ["country", "political"],
        },
        { long_name: "733 63", short_name: "733 63", types: ["postal_code"] },
      ],
      formatted_address: "W86F+V5 Norrsalbo, Sweden",
      geometry: {
        bounds: {
          northeast: { lat: 59.91225000000001, lng: 16.323 },
          southwest: { lat: 59.912125, lng: 16.322875 },
        },
        location: { lat: 59.91217879999999, lng: 16.3228766 },
        location_type: "GEOMETRIC_CENTER",
        viewport: {
          northeast: { lat: 59.9135364802915, lng: 16.32428648029151 },
          southwest: { lat: 59.91083851970849, lng: 16.3215885197085 },
        },
      },
      place_id: "GhIJYA1hRsL0TUARyKR1CqhSMEA",
      plus_code: {
        compound_code: "W86F+V5 Norrsalbo, Sweden",
        global_code: "9FFRW86F+V5",
      },
      types: ["plus_code"],
    },
    {
      address_components: [
        { long_name: "733 63", short_name: "733 63", types: ["postal_code"] },
        {
          long_name: "Salbohed",
          short_name: "Salbohed",
          types: ["postal_town"],
        },
        {
          long_name: "Västmanlands län",
          short_name: "Västmanlands län",
          types: ["administrative_area_level_1", "political"],
        },
        {
          long_name: "Sweden",
          short_name: "SE",
          types: ["country", "political"],
        },
      ],
      formatted_address: "733 63 Salbohed, Sweden",
      geometry: {
        bounds: {
          northeast: { lat: 59.950119, lng: 16.4301889 },
          southwest: { lat: 59.8148311, lng: 16.2963661 },
        },
        location: { lat: 59.9101166, lng: 16.3456915 },
        location_type: "APPROXIMATE",
        viewport: {
          northeast: { lat: 59.950119, lng: 16.4301889 },
          southwest: { lat: 59.8148311, lng: 16.2963661 },
        },
      },
      place_id: "ChIJuTQt1oNzXkYRIwfGF_P-AAs",
      types: ["postal_code"],
    },
    {
      address_components: [
        {
          long_name: "Västerfärnebo",
          short_name: "Västerfärnebo",
          types: ["postal_town"],
        },
        {
          long_name: "Västmanlands län",
          short_name: "Västmanlands län",
          types: ["administrative_area_level_1", "political"],
        },
        {
          long_name: "Sweden",
          short_name: "SE",
          types: ["country", "political"],
        },
        { long_name: "730 70", short_name: "730 70", types: ["postal_code"] },
      ],
      formatted_address: "730 70 Västerfärnebo, Sweden",
      geometry: {
        bounds: {
          northeast: { lat: 60.0776049, lng: 16.423429 },
          southwest: { lat: 59.826804, lng: 16.047707 },
        },
        location: { lat: 59.97015339999999, lng: 16.294079 },
        location_type: "APPROXIMATE",
        viewport: {
          northeast: { lat: 60.0776049, lng: 16.423429 },
          southwest: { lat: 59.826804, lng: 16.047707 },
        },
      },
      place_id: "ChIJiR0idxjeXUYRnfXGMJpThcY",
      types: ["postal_town"],
    },
    {
      address_components: [
        {
          long_name: "Sala Municipality",
          short_name: "Sala Municipality",
          types: ["administrative_area_level_2", "political"],
        },
        {
          long_name: "Västmanland County",
          short_name: "Västmanland County",
          types: ["administrative_area_level_1", "political"],
        },
        {
          long_name: "Sweden",
          short_name: "SE",
          types: ["country", "political"],
        },
      ],
      formatted_address: "Sala Municipality, Sweden",
      geometry: {
        bounds: {
          northeast: { lat: 60.19572109999999, lng: 16.8367722 },
          southwest: { lat: 59.75590899999999, lng: 16.0933757 },
        },
        location: { lat: 59.96796129999999, lng: 16.4978217 },
        location_type: "APPROXIMATE",
        viewport: {
          northeast: { lat: 60.19572109999999, lng: 16.8367722 },
          southwest: { lat: 59.75590899999999, lng: 16.0933757 },
        },
      },
      place_id: "ChIJzTkanPYMXkYRCCzkgfzqm1o",
      types: ["administrative_area_level_2", "political"],
    },
    {
      address_components: [
        {
          long_name: "Västmanland County",
          short_name: "Västmanland County",
          types: ["administrative_area_level_1", "political"],
        },
        {
          long_name: "Sweden",
          short_name: "SE",
          types: ["country", "political"],
        },
      ],
      formatted_address: "Västmanland County, Sweden",
      geometry: {
        bounds: {
          northeast: { lat: 60.19572109999999, lng: 16.9649021 },
          southwest: { lat: 59.19794940000001, lng: 15.4220849 },
        },
        location: { lat: 59.6713879, lng: 16.2158953 },
        location_type: "APPROXIMATE",
        viewport: {
          northeast: { lat: 60.19572109999999, lng: 16.9649021 },
          southwest: { lat: 59.19794940000001, lng: 15.4220849 },
        },
      },
      place_id: "ChIJzRXH8jBhXkYRl-My_cp5cHk",
      types: ["administrative_area_level_1", "political"],
    },
    {
      address_components: [
        {
          long_name: "Sweden",
          short_name: "SE",
          types: ["country", "political"],
        },
      ],
      formatted_address: "Sweden",
      geometry: {
        bounds: {
          northeast: { lat: 69.0599735, lng: 24.1776852 },
          southwest: { lat: 55.0059799, lng: 10.5798 },
        },
        location: { lat: 60.12816100000001, lng: 18.643501 },
        location_type: "APPROXIMATE",
        viewport: {
          northeast: { lat: 69.0599735, lng: 24.1776852 },
          southwest: { lat: 55.0059799, lng: 10.5798 },
        },
      },
      place_id: "ChIJ8fA1bTmyXEYRYm-tjaLruCI",
      types: ["country", "political"],
    },
  ],
  status: "OK",
};

const exampleResponse = {
  plus_code: {
    compound_code: "P27Q+MCM New York, NY, USA",
    global_code: "87G8P27Q+MCM",
  },
  results: [
    {
      address_components: [
        {
          long_name: "277",
          short_name: "277",
          types: ["street_number"],
        },
        {
          long_name: "Bedford Avenue",
          short_name: "Bedford Ave",
          types: ["route"],
        },
        {
          long_name: "Williamsburg",
          short_name: "Williamsburg",
          types: ["neighborhood", "political"],
        },
        {
          long_name: "Brooklyn",
          short_name: "Brooklyn",
          types: ["political", "sublocality", "sublocality_level_1"],
        },
        {
          long_name: "Kings County",
          short_name: "Kings County",
          types: ["administrative_area_level_2", "political"],
        },
        {
          long_name: "New York",
          short_name: "NY",
          types: ["administrative_area_level_1", "political"],
        },
        {
          long_name: "United States",
          short_name: "US",
          types: ["country", "political"],
        },
        {
          long_name: "11211",
          short_name: "11211",
          types: ["postal_code"],
        },
      ],
      formatted_address: "277 Bedford Ave, Brooklyn, NY 11211, USA",
      geometry: {
        location: {
          lat: 40.7142205,
          lng: -73.9612903,
        },
        location_type: "ROOFTOP",
        viewport: {
          northeast: {
            lat: 40.71556948029149,
            lng: -73.95994131970849,
          },
          southwest: {
            lat: 40.7128715197085,
            lng: -73.9626392802915,
          },
        },
      },
      place_id: "ChIJd8BlQ2BZwokRAFUEcm_qrcA",
      plus_code: {
        compound_code: "P27Q+MF New York, NY, USA",
        global_code: "87G8P27Q+MF",
      },
      types: ["street_address"],
    },
    {
      address_components: [
        {
          long_name: "279",
          short_name: "279",
          types: ["street_number"],
        },
        {
          long_name: "Bedford Avenue",
          short_name: "Bedford Ave",
          types: ["route"],
        },
        {
          long_name: "Williamsburg",
          short_name: "Williamsburg",
          types: ["neighborhood", "political"],
        },
        {
          long_name: "Brooklyn",
          short_name: "Brooklyn",
          types: ["political", "sublocality", "sublocality_level_1"],
        },
        {
          long_name: "Kings County",
          short_name: "Kings County",
          types: ["administrative_area_level_2", "political"],
        },
        {
          long_name: "New York",
          short_name: "NY",
          types: ["administrative_area_level_1", "political"],
        },
        {
          long_name: "United States",
          short_name: "US",
          types: ["country", "political"],
        },
        {
          long_name: "11211",
          short_name: "11211",
          types: ["postal_code"],
        },
        {
          long_name: "4203",
          short_name: "4203",
          types: ["postal_code_suffix"],
        },
      ],
      formatted_address: "279 Bedford Ave, Brooklyn, NY 11211, USA",
      geometry: {
        bounds: {
          northeast: {
            lat: 40.7142628,
            lng: -73.9612131,
          },
          southwest: {
            lat: 40.7141534,
            lng: -73.9613792,
          },
        },
        location: {
          lat: 40.7142015,
          lng: -73.96130769999999,
        },
        location_type: "ROOFTOP",
        viewport: {
          northeast: {
            lat: 40.7155570802915,
            lng: -73.95994716970849,
          },
          southwest: {
            lat: 40.7128591197085,
            lng: -73.96264513029149,
          },
        },
      },
      place_id: "ChIJRYYERGBZwokRAM4n1GlcYX4",
      types: ["premise"],
    },
    {
      address_components: [
        {
          long_name: "277",
          short_name: "277",
          types: ["street_number"],
        },
        {
          long_name: "Bedford Avenue",
          short_name: "Bedford Ave",
          types: ["route"],
        },
        {
          long_name: "Williamsburg",
          short_name: "Williamsburg",
          types: ["neighborhood", "political"],
        },
        {
          long_name: "Brooklyn",
          short_name: "Brooklyn",
          types: ["political", "sublocality", "sublocality_level_1"],
        },
        {
          long_name: "Kings County",
          short_name: "Kings County",
          types: ["administrative_area_level_2", "political"],
        },
        {
          long_name: "New York",
          short_name: "NY",
          types: ["administrative_area_level_1", "political"],
        },
        {
          long_name: "United States",
          short_name: "US",
          types: ["country", "political"],
        },
        {
          long_name: "11211",
          short_name: "11211",
          types: ["postal_code"],
        },
      ],
      formatted_address: "277 Bedford Ave, Brooklyn, NY 11211, USA",
      geometry: {
        location: {
          lat: 40.7142205,
          lng: -73.9612903,
        },
        location_type: "ROOFTOP",
        viewport: {
          northeast: {
            lat: 40.71556948029149,
            lng: -73.95994131970849,
          },
          southwest: {
            lat: 40.7128715197085,
            lng: -73.9626392802915,
          },
        },
      },
      place_id: "ChIJF0hlQ2BZwokRsrY2RAlFbAE",
      plus_code: {
        compound_code: "P27Q+MF Brooklyn, NY, USA",
        global_code: "87G8P27Q+MF",
      },
      types: ["establishment", "point_of_interest"],
    },
    {
      address_components: [
        {
          long_name: "291-275",
          short_name: "291-275",
          types: ["street_number"],
        },
        {
          long_name: "Bedford Avenue",
          short_name: "Bedford Ave",
          types: ["route"],
        },
        {
          long_name: "Williamsburg",
          short_name: "Williamsburg",
          types: ["neighborhood", "political"],
        },
        {
          long_name: "Brooklyn",
          short_name: "Brooklyn",
          types: ["political", "sublocality", "sublocality_level_1"],
        },
        {
          long_name: "Kings County",
          short_name: "Kings County",
          types: ["administrative_area_level_2", "political"],
        },
        {
          long_name: "New York",
          short_name: "NY",
          types: ["administrative_area_level_1", "political"],
        },
        {
          long_name: "United States",
          short_name: "US",
          types: ["country", "political"],
        },
        {
          long_name: "11211",
          short_name: "11211",
          types: ["postal_code"],
        },
      ],
      formatted_address: "291-275 Bedford Ave, Brooklyn, NY 11211, USA",
      geometry: {
        bounds: {
          northeast: {
            lat: 40.7145065,
            lng: -73.9612923,
          },
          southwest: {
            lat: 40.7139055,
            lng: -73.96168349999999,
          },
        },
        location: {
          lat: 40.7142045,
          lng: -73.9614845,
        },
        location_type: "GEOMETRIC_CENTER",
        viewport: {
          northeast: {
            lat: 40.7155549802915,
            lng: -73.96013891970848,
          },
          southwest: {
            lat: 40.7128570197085,
            lng: -73.96283688029149,
          },
        },
      },
      place_id: "ChIJ8ThWRGBZwokR3E1zUisk3LU",
      types: ["route"],
    },
    {
      address_components: [
        {
          long_name: "P27Q+MC",
          short_name: "P27Q+MC",
          types: ["plus_code"],
        },
        {
          long_name: "New York",
          short_name: "New York",
          types: ["locality", "political"],
        },
        {
          long_name: "New York",
          short_name: "NY",
          types: ["administrative_area_level_1", "political"],
        },
        {
          long_name: "United States",
          short_name: "US",
          types: ["country", "political"],
        },
      ],
      formatted_address: "P27Q+MC New York, NY, USA",
      geometry: {
        bounds: {
          northeast: {
            lat: 40.71425,
            lng: -73.96137499999999,
          },
          southwest: {
            lat: 40.714125,
            lng: -73.9615,
          },
        },
        location: {
          lat: 40.714224,
          lng: -73.961452,
        },
        location_type: "GEOMETRIC_CENTER",
        viewport: {
          northeast: {
            lat: 40.71553648029149,
            lng: -73.96008851970849,
          },
          southwest: {
            lat: 40.71283851970849,
            lng: -73.96278648029151,
          },
        },
      },
      place_id: "GhIJWAIpsWtbREARHyv4bYh9UsA",
      plus_code: {
        compound_code: "P27Q+MC New York, NY, USA",
        global_code: "87G8P27Q+MC",
      },
      types: ["plus_code"],
    },
    {
      address_components: [
        {
          long_name: "South Williamsburg",
          short_name: "South Williamsburg",
          types: ["neighborhood", "political"],
        },
        {
          long_name: "Brooklyn",
          short_name: "Brooklyn",
          types: ["political", "sublocality", "sublocality_level_1"],
        },
        {
          long_name: "Kings County",
          short_name: "Kings County",
          types: ["administrative_area_level_2", "political"],
        },
        {
          long_name: "New York",
          short_name: "NY",
          types: ["administrative_area_level_1", "political"],
        },
        {
          long_name: "United States",
          short_name: "US",
          types: ["country", "political"],
        },
      ],
      formatted_address: "South Williamsburg, Brooklyn, NY, USA",
      geometry: {
        bounds: {
          northeast: {
            lat: 40.7167119,
            lng: -73.9420904,
          },
          southwest: {
            lat: 40.6984866,
            lng: -73.9699432,
          },
        },
        location: {
          lat: 40.7043921,
          lng: -73.9565551,
        },
        location_type: "APPROXIMATE",
        viewport: {
          northeast: {
            lat: 40.7167119,
            lng: -73.9420904,
          },
          southwest: {
            lat: 40.6984866,
            lng: -73.9699432,
          },
        },
      },
      place_id: "ChIJR3_ODdlbwokRYtN19kNtcuk",
      types: ["neighborhood", "political"],
    },
    {
      address_components: [
        {
          long_name: "11211",
          short_name: "11211",
          types: ["postal_code"],
        },
        {
          long_name: "Brooklyn",
          short_name: "Brooklyn",
          types: ["political", "sublocality", "sublocality_level_1"],
        },
        {
          long_name: "New York",
          short_name: "New York",
          types: ["locality", "political"],
        },
        {
          long_name: "New York",
          short_name: "NY",
          types: ["administrative_area_level_1", "political"],
        },
        {
          long_name: "United States",
          short_name: "US",
          types: ["country", "political"],
        },
      ],
      formatted_address: "Brooklyn, NY 11211, USA",
      geometry: {
        bounds: {
          northeast: {
            lat: 40.7280089,
            lng: -73.9207299,
          },
          southwest: {
            lat: 40.7008331,
            lng: -73.9644697,
          },
        },
        location: {
          lat: 40.7093358,
          lng: -73.9565551,
        },
        location_type: "APPROXIMATE",
        viewport: {
          northeast: {
            lat: 40.7280089,
            lng: -73.9207299,
          },
          southwest: {
            lat: 40.7008331,
            lng: -73.9644697,
          },
        },
      },
      place_id: "ChIJvbEjlVdZwokR4KapM3WCFRw",
      types: ["postal_code"],
    },
    {
      address_components: [
        {
          long_name: "Williamsburg",
          short_name: "Williamsburg",
          types: ["neighborhood", "political"],
        },
        {
          long_name: "Brooklyn",
          short_name: "Brooklyn",
          types: ["political", "sublocality", "sublocality_level_1"],
        },
        {
          long_name: "Kings County",
          short_name: "Kings County",
          types: ["administrative_area_level_2", "political"],
        },
        {
          long_name: "New York",
          short_name: "NY",
          types: ["administrative_area_level_1", "political"],
        },
        {
          long_name: "United States",
          short_name: "US",
          types: ["country", "political"],
        },
      ],
      formatted_address: "Williamsburg, Brooklyn, NY, USA",
      geometry: {
        bounds: {
          northeast: {
            lat: 40.7251773,
            lng: -73.936498,
          },
          southwest: {
            lat: 40.6979329,
            lng: -73.96984499999999,
          },
        },
        location: {
          lat: 40.7081156,
          lng: -73.9570696,
        },
        location_type: "APPROXIMATE",
        viewport: {
          northeast: {
            lat: 40.7251773,
            lng: -73.936498,
          },
          southwest: {
            lat: 40.6979329,
            lng: -73.96984499999999,
          },
        },
      },
      place_id: "ChIJQSrBBv1bwokRbNfFHCnyeYI",
      types: ["neighborhood", "political"],
    },
    {
      address_components: [
        {
          long_name: "Kings County",
          short_name: "Kings County",
          types: ["administrative_area_level_2", "political"],
        },
        {
          long_name: "Brooklyn",
          short_name: "Brooklyn",
          types: ["political", "sublocality", "sublocality_level_1"],
        },
        {
          long_name: "New York",
          short_name: "NY",
          types: ["administrative_area_level_1", "political"],
        },
        {
          long_name: "United States",
          short_name: "US",
          types: ["country", "political"],
        },
      ],
      formatted_address: "Kings County, Brooklyn, NY, USA",
      geometry: {
        bounds: {
          northeast: {
            lat: 40.7394209,
            lng: -73.8330411,
          },
          southwest: {
            lat: 40.551042,
            lng: -74.05663,
          },
        },
        location: {
          lat: 40.6528762,
          lng: -73.95949399999999,
        },
        location_type: "APPROXIMATE",
        viewport: {
          northeast: {
            lat: 40.7394209,
            lng: -73.8330411,
          },
          southwest: {
            lat: 40.551042,
            lng: -74.05663,
          },
        },
      },
      place_id: "ChIJOwE7_GTtwokRs75rhW4_I6M",
      types: ["administrative_area_level_2", "political"],
    },
    {
      address_components: [
        {
          long_name: "Brooklyn",
          short_name: "Brooklyn",
          types: ["political", "sublocality", "sublocality_level_1"],
        },
        {
          long_name: "Kings County",
          short_name: "Kings County",
          types: ["administrative_area_level_2", "political"],
        },
        {
          long_name: "New York",
          short_name: "NY",
          types: ["administrative_area_level_1", "political"],
        },
        {
          long_name: "United States",
          short_name: "US",
          types: ["country", "political"],
        },
      ],
      formatted_address: "Brooklyn, NY, USA",
      geometry: {
        bounds: {
          northeast: {
            lat: 40.739446,
            lng: -73.8333651,
          },
          southwest: {
            lat: 40.551042,
            lng: -74.05663,
          },
        },
        location: {
          lat: 40.6781784,
          lng: -73.9441579,
        },
        location_type: "APPROXIMATE",
        viewport: {
          northeast: {
            lat: 40.739446,
            lng: -73.8333651,
          },
          southwest: {
            lat: 40.551042,
            lng: -74.05663,
          },
        },
      },
      place_id: "ChIJCSF8lBZEwokRhngABHRcdoI",
      types: ["political", "sublocality", "sublocality_level_1"],
    },
    {
      address_components: [
        {
          long_name: "New York",
          short_name: "New York",
          types: ["locality", "political"],
        },
        {
          long_name: "New York",
          short_name: "NY",
          types: ["administrative_area_level_1", "political"],
        },
        {
          long_name: "United States",
          short_name: "US",
          types: ["country", "political"],
        },
      ],
      formatted_address: "New York, NY, USA",
      geometry: {
        bounds: {
          northeast: {
            lat: 40.9175771,
            lng: -73.70027209999999,
          },
          southwest: {
            lat: 40.4773991,
            lng: -74.25908989999999,
          },
        },
        location: {
          lat: 40.7127753,
          lng: -74.0059728,
        },
        location_type: "APPROXIMATE",
        viewport: {
          northeast: {
            lat: 40.9175771,
            lng: -73.70027209999999,
          },
          southwest: {
            lat: 40.4773991,
            lng: -74.25908989999999,
          },
        },
      },
      place_id: "ChIJOwg_06VPwokRYv534QaPC8g",
      types: ["locality", "political"],
    },
    {
      address_components: [
        {
          long_name: "New York",
          short_name: "NY",
          types: ["administrative_area_level_1", "political"],
        },
        {
          long_name: "United States",
          short_name: "US",
          types: ["country", "political"],
        },
      ],
      formatted_address: "New York, USA",
      geometry: {
        bounds: {
          northeast: {
            lat: 45.015861,
            lng: -71.777491,
          },
          southwest: {
            lat: 40.476578,
            lng: -79.7625901,
          },
        },
        location: {
          lat: 43.2994285,
          lng: -74.21793260000001,
        },
        location_type: "APPROXIMATE",
        viewport: {
          northeast: {
            lat: 45.015861,
            lng: -71.777491,
          },
          southwest: {
            lat: 40.476578,
            lng: -79.7625901,
          },
        },
      },
      place_id: "ChIJqaUj8fBLzEwRZ5UY3sHGz90",
      types: ["administrative_area_level_1", "political"],
    },
    {
      address_components: [
        {
          long_name: "United States",
          short_name: "US",
          types: ["country", "political"],
        },
      ],
      formatted_address: "United States",
      geometry: {
        bounds: {
          northeast: {
            lat: 74.071038,
            lng: -66.885417,
          },
          southwest: {
            lat: 18.7763,
            lng: 166.9999999,
          },
        },
        location: {
          lat: 37.09024,
          lng: -95.712891,
        },
        location_type: "APPROXIMATE",
        viewport: {
          northeast: {
            lat: 74.071038,
            lng: -66.885417,
          },
          southwest: {
            lat: 18.7763,
            lng: 166.9999999,
          },
        },
      },
      place_id: "ChIJCzYy5IS16lQRQrfeQ5K5Oxw",
      types: ["country", "political"],
    },
  ],
  status: "OK",
};
