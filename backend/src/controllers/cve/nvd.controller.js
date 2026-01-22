import axios from "axios";
import { Cve } from "../../models/cve.model.js";


const NVD_BASE = "https://services.nvd.nist.gov/rest/json/cves/2.0";

export const fetchAndStoreNvdCVEs = async () => {
  console.log("🕒 NVD Cron Job started");

  try {
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 1); // last 24h

    const response = await axios.get(NVD_BASE, {
      params: {
        resultsPerPage: 200,
        startIndex: 0,
        pubStartDate: startDate.toISOString(),
        pubEndDate: endDate.toISOString()
      },
      headers: {
        "User-Agent": "VulNews-Cron/1.0"
      }
    });

    const vulns = response.data.vulnerabilities || [];
    let inserted = 0;
    let updated = 0;
    const processedIds = [];

    for (const v of vulns) {
      const cve = v.cve;

      const cvss =
        cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore ??
        cve.metrics?.cvssMetricV30?.[0]?.cvssData?.baseScore ??
        null;

      const doc = {
        id: cve.id,
        summary: cve.descriptions?.[0]?.value || "No description",
        published: new Date(cve.published),
        lastModified: new Date(cve.lastModified),
        cvss,
        new: true
      };

      const result = await Cve.updateOne(
        { id: doc.id },
        { $set: doc },
        { upsert: true }
      );

      if (result.upsertedCount) {
        inserted++;
      } else if (result.modifiedCount) {
        updated++;
      }

      processedIds.push(cve.id);
    }

    // Set new: false for all documents that were NOT inserted or updated
    await Cve.updateMany(
      { id: { $nin: processedIds } },
      { $set: { new: false } }
    );

    console.log(`✅ NVD Cron done | Inserted: ${inserted} | Updated: ${updated} | Marked as old: ${processedIds.length}`);
  } catch (error) {
    console.error("❌ NVD Cron failed:", error.message);
  }
};

export const getLatestNvd = async (req,res) => {
  
  try{

    const limit = parseInt(req.query.limit) || 10;
    const page = req.query.page;

    let nvds = {};

    if(page){
     nvds = await Cve.find({source:"NVD"}).sort({published: -1}).skip((page-1)*limit).limit(limit);
    }
    else{
      nvds = await Cve.find({source:"NVD"}).sort({published: -1}).limit(limit);
    }

    res.status(200).json({
      data:nvds
    });

  }catch(error){
    return res.status(500).json({
      success:false,
      message:"Internal Server error",
      error:error.message
    })
  }
}