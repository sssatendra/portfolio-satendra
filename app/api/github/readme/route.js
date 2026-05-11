import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const repo = searchParams.get('repo');
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return NextResponse.json({ error: 'GitHub token not found' }, { status: 500 });
  }

  if (!repo) {
    return NextResponse.json({ error: 'Repo name is required' }, { status: 400 });
  }

  // First, get the viewer's login to construct the owner/repo path
  const userQuery = `query { viewer { login } }`;
  
  try {
    const userRes = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ query: userQuery }),
    });
    const userData = await userRes.json();
    const login = userData.data.viewer.login;

    const query = `
      query {
        repository(owner: "${login}", name: "${repo}") {
          defaultBranchRef {
            name
          }
          object(expression: "HEAD:README.md") {
            ... on Blob {
              text
            }
          }
        }
      }
    `;

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();

    if (data.errors) {
      return NextResponse.json({ error: data.errors[0].message }, { status: 500 });
    }

    const repository = data.data.repository;
    const readme = repository.object ? repository.object.text : 'No README found for this repository.';
    const branch = repository.defaultBranchRef ? repository.defaultBranchRef.name : 'main';

    return NextResponse.json({ 
      readme, 
      owner: login, 
      repo, 
      branch 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch README' }, { status: 500 });
  }
}
