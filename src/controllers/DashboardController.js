const Job = require("../model/Job");
const Profile = require("../model/Profile");

const jobUtils = require("../utils/jobUtils");

module.exports = {
  async index(req, res) {
    let jobs = await Job.get();
    const profile = await Profile.get();

    let statusCount = {
      progress: 0,
      done: 0,
      total: jobs.length,
    };

    let jobTotalHours = 0;

    jobs = jobs.map((job) => {
      // ajustes no job
      const remaining = jobUtils.remainingDays(job);
      const status = remaining <= 0 ? "done" : "progress";

      statusCount[status] += 1;

      jobTotalHours =
        status == "progress"
          ? jobTotalHours + Number(job["daily-hours"])
          : jobTotalHours;

      return {
        ...job,
        remaining,
        status,
        budget: jobUtils.calculateBudget(job, profile["value-hour"]),
      };
    });

    const freeHours = profile["hours-per-day"] - jobTotalHours;

    return res.render("index", {
      jobs,
      profile,
      statusCount,
      freeHours,
    });
  },
};
