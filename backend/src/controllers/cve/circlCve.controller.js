import axios from "axios";

const CIRCL_BASE = "https://cve.circl.lu/api";


export const getCirclCVE = async (req, res) => {
  try {
    const { cveId } = req.params;

    const response = await axios.get(`${CIRCL_BASE}/cve/${cveId}`);

    if (!response.data || response.data.error) {
      return res.status(404).json({
        success: false,
        message: "CVE not found in CIRCL"
      });
    }

    res.json({
      success: true,
      source: "CIRCL",
      data: {
        id: response.data.id,
        summary: response.data.summary,
        published: response.data.Published,
        cvss: response.data.cvss,
        references: response.data.references || []
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch CIRCL data",
      error: error.message
    });
  }
};


export const getLatestCirclCVEs = async (req, res) => {
  try {
    const limit = req.query.limit || 10;

    const response = await axios.get(`${CIRCL_BASE}/last/${limit}`);

    res.json({
      success: true,
      source: "CIRCL",
      count: response.data.length,
      data: response.data.map(cve => ({
        id: cve.id,
        summary: cve.summary,
        published: cve.Published,
        cvss: cve.cvss
      }))
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch latest CIRCL CVEs",
      error: error.message
    });
  }
};


