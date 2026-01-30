const axios = require("axios");

exports.getWeatherData = async (req, res) => {
  try {
    const city = req.params.city;
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    const response = await axios.get(url);

    res.json({
      temp: response.data.main.temp,
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      city: response.data.name,
    });
  } catch (error) {
    res.status(500).json({
      message: "Weather data unavailable",
    });
  }
};

exports.getCropRecommendation = async (req, res) => {
  const { soilType, season } = req.body;

  const recommendations = {
    Alluvial: { Summer: "Rice, Sugarcane", Winter: "Wheat, Pulses" },
    Black: { Summer: "Cotton, Groundnut", Winter: "Jowar, Linseed" },
  };

  const crop =
    recommendations[soilType]?.[season] ||
    "Consult local expert for this combination";

  res.json({
    recommendedCrop: crop,
  });
};
