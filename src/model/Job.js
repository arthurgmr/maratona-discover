const Database = require("../db/config");

module.exports = {
  async get() {
    const db = await Database();

    const data = await db.all(`SELECT * FROM jobs`);

    await db.close();

    return data.map((job) => {
      return {
        ...job,
        "daily-hours": job.daily_hours,
        "total-hours": job.total_hours,
      };
    });
  },
  async getOne(jobId) {
    const db = await Database();

    const data = await db.get(`SELECT * FROM jobs WHERE id = ${jobId}`);

    await db.close();

    return {
      ...data,
      "daily-hours": data.daily_hours,
      "total-hours": data.total_hours,
    };
  },
  async create(newJob) {
    const db = await Database();

    db.run(`INSERT INTO jobs(
      name,
      daily_hours,
      total_hours,
      created_at
    ) VALUES (
      "${newJob.name}",
      ${newJob.daily_hours},
      ${newJob.total_hours},
      ${newJob.created_at}
    );`);

    await db.close();
  },
  async update(jobId, newJob) {
    const db = await Database();

    db.run(`UPDATE jobs SET
      name = "${newJob.name}",
      daily_hours = ${newJob.daily_hours},
      total_hours = ${newJob.total_hours}
    WHERE id = ${jobId}`);

    await db.close();
  },
  async delete(jobId) {
    const db = await Database();

    db.run(`DELETE FROM jobs WHERE id = ${jobId}`);

    await db.close();
  },
};
