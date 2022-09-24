// This function groups together line segments with similar
// properties and runs regressions on them to turn
// many similar lines into one common big line.
const computeSegments = async (req, res, next) => {
  try {
    // Get settings
    const settings = (
      await res.locals.conn.query("SELECT * FROM settings WHERE id = 1")
    )[0];

    // First, get all lines that were inserted since the cron job was last run.
    // For - each through these lines.
    const lines = await res.locals.conn.query(
      `
      SELECT 
        d.id,
        r.lat AS start_lat,
        r.lng AS start_lng,
        d.lat AS end_lat,
        d.lng AS end_lng,
        (r.lat - d.lat) / (r.lng - d.lng) AS slope,
        sqrt((r.lat - d.lat)*(r.lat - d.lat) + (r.lng - d.lng)*(r.lng - d.lng)) AS distance
      FROM destinations d
      LEFT JOIN residences AS r ON r.id = d.residence_id
      LEFT JOIN regressions AS reg ON reg.destination_id = d.id
      WHERE reg.id IS NULL;
      `
    );

    // Next, get all lines within settings.distance_tolerance of this line
    // that have a slope of slope_tolerance.

    // Aggregate together the start and end points of these lines and run a linear regression,
    // storing whether each point marked the "opening" or the "closing" of a line.

    // Re - run the regression on the lines that are near this one.
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error!",
    });
  }
};
