import axios, { AxiosInstance } from 'axios';

export interface GitHubConfig {
  token: string;
  repo: string; // format: 'owner/repo'
}

export interface CommitResult {
  success: boolean;
  sha?: string;
  url?: string;
  error?: string;
}

/**
 * GitHub API client for automated commits to drip-dex-launches repository
 */
export class GitHubIntegration {
  private client: AxiosInstance;
  private owner: string;
  private repo: string;

  constructor(config: GitHubConfig) {
    const [owner, repo] = config.repo.split('/');
    if (!owner || !repo) {
      throw new Error('Invalid repo format. Expected: owner/repo');
    }

    this.owner = owner;
    this.repo = repo;

    this.client = axios.create({
      baseURL: 'https://api.github.com',
      timeout: 30000,
      headers: {
        'Authorization': `token ${config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get the SHA of a file in the repository
   */
  private async getFileSHA(path: string, branch: string = 'main'): Promise<string | null> {
    try {
      const response = await this.client.get(
        `/repos/${this.owner}/${this.repo}/contents/${path}`,
        { params: { ref: branch } }
      );
      return response.data.sha;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null; // File doesn't exist
      }
      throw error;
    }
  }

  /**
   * Commit a file to the repository
   */
  async commitFile(
    path: string,
    content: string,
    message: string,
    branch: string = 'main'
  ): Promise<CommitResult> {
    try {
      // Get existing file SHA if it exists
      const existingSHA = await this.getFileSHA(path, branch);

      const payload: Record<string, any> = {
        message,
        content: Buffer.from(content).toString('base64'),
        branch,
      };

      if (existingSHA) {
        payload.sha = existingSHA;
      }

      const response = await this.client.put(
        `/repos/${this.owner}/${this.repo}/contents/${path}`,
        payload
      );

      return {
        success: true,
        sha: response.data.commit.sha,
        url: response.data.content.html_url,
      };
    } catch (error) {
      console.error('Error committing file to GitHub:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Create or update multiple files in a single commit
   */
  async commitMultipleFiles(
    files: Array<{ path: string; content: string }>,
    message: string,
    branch: string = 'main'
  ): Promise<CommitResult> {
    try {
      // Get the latest commit SHA for the branch
      const refResponse = await this.client.get(
        `/repos/${this.owner}/${this.repo}/git/ref/heads/${branch}`
      );
      const latestCommitSHA = refResponse.data.object.sha;

      // Get the tree SHA from the latest commit
      const commitResponse = await this.client.get(
        `/repos/${this.owner}/${this.repo}/git/commits/${latestCommitSHA}`
      );
      const baseTreeSHA = commitResponse.data.tree.sha;

      // Create blobs for each file
      const tree = await Promise.all(
        files.map(async (file) => {
          const blobResponse = await this.client.post(
            `/repos/${this.owner}/${this.repo}/git/blobs`,
            {
              content: Buffer.from(file.content).toString('base64'),
              encoding: 'base64',
            }
          );
          return {
            path: file.path,
            mode: '100644',
            type: 'blob',
            sha: blobResponse.data.sha,
          };
        })
      );

      // Create a new tree
      const treeResponse = await this.client.post(
        `/repos/${this.owner}/${this.repo}/git/trees`,
        {
          base_tree: baseTreeSHA,
          tree,
        }
      );

      // Create a new commit
      const newCommitResponse = await this.client.post(
        `/repos/${this.owner}/${this.repo}/git/commits`,
        {
          message,
          tree: treeResponse.data.sha,
          parents: [latestCommitSHA],
        }
      );

      // Update the reference
      await this.client.patch(
        `/repos/${this.owner}/${this.repo}/git/refs/heads/${branch}`,
        {
          sha: newCommitResponse.data.sha,
        }
      );

      return {
        success: true,
        sha: newCommitResponse.data.sha,
        url: newCommitResponse.data.html_url,
      };
    } catch (error) {
      console.error('Error committing multiple files to GitHub:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Check if repository is accessible
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.client.get(`/repos/${this.owner}/${this.repo}`);
      return true;
    } catch (error) {
      console.error('GitHub connection test failed:', error);
      return false;
    }
  }
}
