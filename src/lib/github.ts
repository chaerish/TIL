import { Octokit } from '@octokit/rest';

interface PublishPostParams {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  path: string;
  content: string;
  commitMessage: string;
}

export async function publishPostFile({
  token,
  owner,
  repo,
  branch,
  path,
  content,
  commitMessage,
}: PublishPostParams): Promise<{ commitUrl: string }> {
  const octokit = new Octokit({ auth: token });

  const response = await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    branch,
    message: commitMessage,
    content: Buffer.from(content, 'utf-8').toString('base64'),
  });

  return { commitUrl: response.data.commit.html_url ?? '' };
}
