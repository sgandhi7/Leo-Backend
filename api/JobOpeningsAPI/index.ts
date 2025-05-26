import { AzureFunction, Context } from '@azure/functions';
import fetch from 'node-fetch';

interface Job {
  title: string;
  company: string;
}

const fetchJobData: AzureFunction = async function (
  context: Context,
): Promise<void> {
  const sasToken = process.env.AZURE_JOB_SAS_TOKEN;
  const url =
    'https://jorgestorageblob.blob.core.windows.net/job-backslash/openings.json?' +
    sasToken;

  try {
    console.log('Fetching job openings from blob...');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const data: unknown = await response.json();

    if (
      Array.isArray(data) &&
      data.every(
        (item) =>
          typeof item.title === 'string' &&
          typeof item.company === 'string',
      )
    ) {
      const jobs: Job[] = data as Job[];

      context.res = {
        body: {
          jobs,                                // full job objects
          titles: jobs.map((job) => job.title), // extracted titles
          companies: jobs.map((job) => job.company), // extracted companies
        },
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } else {
      throw new Error('Job data format is incorrect');
    }
  } catch (error) {
    const statusCode = error.response?.status || 500;
    context.res = {
      status: statusCode,
      body: `Failed to fetch job data: ${error.message}`,
    };
  }
};

export default fetchJobData;