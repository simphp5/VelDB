const { Queue, Worker } = require("bullmq");

const connection = {
  host: "127.0.0.1",
  port: 6380   // your Redis port
};

const queryQueue = new Queue("queryQueue", { connection });

// Add job
const addQueryJob = async (query) => {
  return await queryQueue.add("runQuery", { query });
};

// Get job status
const getJobStatus = async (id) => {
  const job = await queryQueue.getJob(id);
  if (!job) return null;

  return {
    state: await job.getState(),
    result: job.returnvalue,
  };
};

// Worker
new Worker(
  "queryQueue",
  async (job) => {
    console.log("Executing:", job.data.query);

    // Simulated execution
    return { result: `Executed: ${job.data.query}` };
  },
  { connection }
);

module.exports = { addQueryJob, getJobStatus };