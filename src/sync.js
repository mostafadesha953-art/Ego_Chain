const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: "YOUR_GITHUB_PERSONAL_ACCESS_TOKEN" 
});

async function syncToGithub(blockchainData) {
    const content = Buffer.from(JSON.stringify(blockchainData)).toString('base64');
    
    try {
        const { data } = await octokit.repos.getContent({
            owner: "YOUR_USERNAME",
            repo: "YOUR_REPO_NAME",
            path: "database/chain.json"
        });

        await octokit.repos.createOrUpdateFileContents({
            owner: "YOUR_USERNAME",
            repo: "YOUR_REPO_NAME",
            path: "database/chain.json",
            message: "Blockchain Update: New Block Mined",
            content: content,
            sha: data.sha
        });
        console.log("Blockchain synced to GitHub successfully.");
    } catch (error) {
        console.error("Sync failed:", error);
    }
}