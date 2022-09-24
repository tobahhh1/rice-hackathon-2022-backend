const getLines = async (req, res, next) => {
  try {
    const results = await res.locals.conn.query(
      `SELECT 
        d.id,
        r.lat AS start_lat,
        r.lng AS start_lng,
        d.lat AS end_lat,
        d.lng AS end_lng,
        1 AS strength,
        (r.lat - d.lat) / (r.lng - d.lng) AS slope,
        sqrt((r.lat - d.lat)*(r.lat - d.lat) + (r.lng - d.lng)*(r.lng - d.lng)) AS distance
      FROM destinations d
      LEFT JOIN residences AS r ON r.id = d.residence_id
      `
    );
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

module.exports = getLines;
