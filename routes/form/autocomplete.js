const axios = require("axios").default;

const autocomplete = async (req, res, next) => {
  try {
    const results = (
      await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${req.params.input}&types[]=establishment&types[]=geocode&language=en&key=${process.env.GOOGLE_API_KEY}`
      )
    ).data;

    return res.status(200).json({
      message: "Success!",
      results,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error!",
    });
  }
};

module.exports = autocomplete;
