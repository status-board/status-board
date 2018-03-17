/**
 * Returns true if job matches a particular regex filter
 *
 * @param  {string} jobName job name
 * @param  {string} filter regex
 * @return {boolean}
 */
export function matchJobFilter(jobName: string, filter: string) {
  return jobName.match(filter);
}
