import axios from "axios";

const EPSS_BASE = "https://api.first.org/data/v1/epss";


export const getLatestEpssCVEs = async (req, res) => {
    
  try {
    const limit = parseInt(req.query.limit) || 10;

    const response = await axios.get(EPSS_BASE);

    const epssList = response.data.data || [];

   
    epssList.sort((a, b) => parseFloat(b.epss) - parseFloat(a.epss));

    const formatted = epssList.slice(0, limit).map(e => ({
      id: e.cve,
      epss: parseFloat(e.epss),
      percentile: parseFloat(e.percentile)
    }));

    res.json({
      success: true,
      source: "EPSS",
      count: formatted.length,
      data: formatted
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch latest EPSS data",
      error: error.message
    });
  }
};

