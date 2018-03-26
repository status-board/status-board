/**
 * Returns true if job matches a particular regex filter
 *
 * @param  {string} jobName job name
 * @param  {string | RegExp} filter regex
 * @return {RegExpMatchArray | null}
 */
export function matchJobFilter(
  jobName: string,
  filter: string | RegExp,
): RegExpMatchArray | null {
  return jobName.match(filter);
}
