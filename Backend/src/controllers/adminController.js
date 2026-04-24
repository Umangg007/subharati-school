const Admission = require("../models/Admission");
const Enquiry = require("../models/Enquiry");
const Gallery = require("../models/GalleryItem");
const Notice = require("../models/Notice");
const Event = require("../models/Event");

/**
 * GET /api/admin/stats
 * Aggregates counts + last-6-month chart data in a single round-trip.
 */
const getStats = async (req, res, next) => {
  try {
    const now = new Date();

    // 7-day window for "recent" badge
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Start of the month 5 months ago (so we cover 6 months total)
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [
      totalAdmissions,
      totalEnquiries,
      totalGallery,
      totalNotices,
      totalEvents,
      recentAdmissions,
      recentEnquiries,
      admissionsByMonth,
      enquiriesByMonth,
      latestAdmissions,
      latestEnquiries
    ] = await Promise.all([
      Admission.countDocuments(),
      Enquiry.countDocuments(),
      Gallery.countDocuments(),
      Notice.countDocuments(),
      Event.countDocuments(),
      Admission.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Enquiry.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      // Monthly aggregations for chart
      Admission.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]),
      Enquiry.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]),
      Admission.find().sort({ createdAt: -1 }).limit(5).select("name email course createdAt"),
      Enquiry.find().sort({ createdAt: -1 }).limit(5).select("name email message createdAt")
    ]);

    // Build labelled 6-month series
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const monthNum = d.getMonth() + 1;
      const year = d.getFullYear();
      const label = d.toLocaleString("en-IN", { month: "short" }) + " " + String(year).slice(2);
      const adm = admissionsByMonth.find(a => a._id.month === monthNum && a._id.year === year);
      const enq = enquiriesByMonth.find(e => e._id.month === monthNum && e._id.year === year);
      return { name: label, admissions: adm?.count ?? 0, enquiries: enq?.count ?? 0 };
    });

    return res.json({
      success: true,
      data: {
        totals: { totalAdmissions, totalEnquiries, totalGallery, totalNotices, totalEvents },
        recent: { recentAdmissions, recentEnquiries },
        monthlyData,
        latestAdmissions,
        latestEnquiries
      }
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { getStats };
