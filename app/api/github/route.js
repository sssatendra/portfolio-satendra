import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  const hiddenRepos = process.env.HIDDEN_REPOS ? process.env.HIDDEN_REPOS.split(',').map(name => name.trim()) : [];

  if (!token) {
    return NextResponse.json({ error: 'GitHub token not found' }, { status: 500 });
  }

  const query = `
    query {
      viewer {
        login
        name
        bio
        avatarUrl
        repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: UPDATED_AT, direction: DESC}) {
          totalCount
          nodes {
            name
            description
            isPrivate
            stargazerCount
            forkCount
            url
            pushedAt
            diskUsage
            repositoryTopics(first: 5) {
              nodes {
                topic {
                  name
                }
              }
            }
            primaryLanguage {
              name
              color
            }
            readme: object(expression: "HEAD:README.md") {
              ... on Blob {
                text
              }
            }
          }
        }
        contributionsCollection {
          contributionCalendar {
            totalContributions
          }
        }
        followers {
          totalCount
        }
        following {
          totalCount
        }
      }
    }
  `;

  try {
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
      console.error('GitHub API Errors:', data.errors);
      return NextResponse.json({ error: data.errors[0].message }, { status: 500 });
    }

    const viewer = data.data.viewer;
    const sortedRepos = [...viewer.repositories.nodes].sort((a, b) => b.stargazerCount - a.stargazerCount);

    const stats = {
      user: {
        login: viewer.login,
        name: viewer.name,
        bio: viewer.bio,
        avatar: viewer.avatarUrl,
      },
      repos: {
        total: viewer.repositories.totalCount,
        public: viewer.repositories.nodes.filter(r => !r.isPrivate).length,
        private: viewer.repositories.nodes.filter(r => r.isPrivate).length,
        stars: viewer.repositories.nodes.reduce((acc, r) => acc + r.stargazerCount, 0),
        list: sortedRepos
          .filter(r => !hiddenRepos.includes(r.name))
          .map(r => ({
            name: r.name,
            description: r.description || (r.readme ? r.readme.text.slice(0, 150).replace(/[#*`]/g, '').trim() + '...' : null),
            isPrivate: r.isPrivate,
            stars: r.stargazerCount,
            forks: r.forkCount,
            url: r.url,
            language: r.primaryLanguage ? r.primaryLanguage.name : null,
            langColor: r.primaryLanguage ? r.primaryLanguage.color : null,
            updatedAt: r.pushedAt,
            size: r.diskUsage,
            topics: r.repositoryTopics.nodes.map(n => n.topic.name),
          })),
      },
      contributions: viewer.contributionsCollection.contributionCalendar.totalContributions,
      followers: viewer.followers.totalCount,
      following: viewer.following.totalCount,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch GitHub data' }, { status: 500 });
  }
}
