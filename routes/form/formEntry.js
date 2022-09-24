const axios = require("axios").default;

const formEntry = async (req, res, next) => {
  try {
    /**
     * Validate user input.
     * Should be in the following format:
     * {
     *    residence: string
     *    destinations: string[]
     * }
     */
    const maxNumPlaces = 5;

    const body = req.body;
    if (!body.destinations || !Array.isArray(body.destinations)) {
      return res.status(400).json({
        message:
          "Destination is a required field, must be an array string addresses",
      });
    }

    if (body.destinations.length > maxNumPlaces) {
      return res.status(400).json({
        message: "Too many destinations!",
      });
    }

    if (!body.residence || typeof body.residence !== "string") {
      return res.status(400).json({
        message:
          "Residence is a required field, must be an address as a string.",
      });
    }

    // Run geocoding on the residence.

    const geocodedResidence = (
      await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${body.residence}&key=${process.env.GOOGLE_API_KEY}`
      )
    ).data.results[0];

    if (!geocodedResidence) {
      return res.status(400).json({
        message: "Residence not found",
      });
    }

    const { lat: residenceLat, lng: residenceLng } =
      geocodedResidence.geometry.location;

    let geocodedDestinations;
    try {
      // Run geocoding on the other places.
      geocodedDestinations = await Promise.all(
        body.destinations.map(async (destinationAddress) => {
          // geocode them
          const result = (
            await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json?address=${destinationAddress}&key=${process.env.GOOGLE_API_KEY}`
            )
          ).data.results[0];

          // destination not found.
          if (!result) {
            throw new Error("Failed to find destination");
          }

          return {
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng,
            address: destinationAddress,
          };
        })
      );
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        message: "At least one address was not found.",
      });
    }

    // Geocoding went on without failure, insert into database.

    // Insert residence into the database.
    const { insertId: residenceId } = await res.locals.conn.query(
      "INSERT INTO residences (address, lat, lng) VALUES (?, ?, ?)",
      [body.residence, residenceLat, residenceLng]
    );

    await Promise.all(
      geocodedDestinations.map(async (destination) => {
        const { address, lat, lng } = destination;
        return res.locals.conn.query(
          `INSERT INTO destinations (residence_id, address, lat, lng) VALUES (?, ?, ?, ?)`,
          [residenceId, address, lat, lng]
        );
      })
    );

    return res.status(200).json({
      message: "Success!",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error!",
    });
  }
};

module.exports = formEntry;
