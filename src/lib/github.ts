import { Octokit } from '@octokit/rest';

interface CommitFileParams {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  path: string;
  contentBase64: string;
  commitMessage: string;
}

export async function commitFile({
  token,
  owner,
  repo,
  branch,
  path,
  contentBase64,
  commitMessage,
}: CommitFileParams): Promise<{ commitUrl: string }> {
  const octokit = new Octokit({ auth: token });

  const response = await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    branch,
    message: commitMessage,
    content: contentBase64,
  });

  return { commitUrl: response.data.commit.html_url ?? '' };
}

interface PublishPostParams {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  path: string;
  content: string;
  commitMessage: string;
}

export async function publishPostFile({ content, ...rest }: PublishPostParams): Promise<{ commitUrl: string }> {
  return commitFile({ ...rest, contentBase64: Buffer.from(content, 'utf-8').toString('base64') });
}
