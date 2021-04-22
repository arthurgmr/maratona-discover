const Job = require("../model/Job");
const Profile = require("../model/Profile");

const jobUtils = require("../utils/jobUtils");

module.exports = {
  create(req, res) {
    return res.render("job");
  },
  async save(req, res) {
    const newJob = {
      name: req.body.name,
      daily_hours: req.body["daily-hours"],
      total_hours: req.body["total-hours"],
      created_at: Date.now(),
    };

    await Job.create(newJob);

    return res.redirect("/");
  },
  async show(req, res) {
    const jobId = req.params.id;
    const job = await Job.getOne(jobId);

    // const job = jobs.find((job) => Number(job.id) === Number(jobId));

    if (!job) {
      return res.send("Job not found!");
    }

    const profile = await Profile.get();

    job.budget = jobUtils.calculateBudget(job, profile["value-hour"]);

    return res.render("job-edit", { job });
  },
  async update(req, res) {
    const jobId = req.params.id;

    const newJob = {
      name: req.body.name,
      daily_hours: req.body["daily-hours"],
      total_hours: req.body["total-hours"],
    };

    await Job.update(jobId, newJob);

    res.redirect("/job/" + jobId);
  },
  async delete(req, res) {
    const jobId = req.params.id;

    await Job.delete(jobId);

    return res.redirect("/");
  },
};
