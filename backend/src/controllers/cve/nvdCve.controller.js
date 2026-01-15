import axios from "axios";

const NVD_BASE = "https://services.nvd.nist.gov/rest/json/cves/2.0";


export const getLatestNvdCVEs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    
    const response = await axios.get(
      `${NVD_BASE}?resultsPerPage=${limit}&startIndex=0`
    );

    const vulns = response.data.vulnerabilities || [];

    const formatted = vulns.map(v => {
      const cve = v.cve;

      const cvss =
        cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore ||
        cve.metrics?.cvssMetricV30?.[0]?.cvssData?.baseScore ||
        null;

      return {
        id: cve.id,
        summary: cve.descriptions[0]?.value || "No description",
        published: cve.published,
        lastModified: cve.lastModified,
        cvss: cvss
      };
    });

    res.json({
      success: true,
      source: "NVD",
      count: formatted.length,
      data: formatted
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch latest NVD CVEs",
      error: error.message
    });
  }
};
