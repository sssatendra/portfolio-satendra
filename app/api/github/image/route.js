import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');
  const path = searchParams.get('path');
  const branch = searchParams.get('branch') || 'main';
  
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return new Response('GitHub token not found', { status: 500 });
  }

  if (!owner || !repo || !path) {
    return new Response('Missing required parameters', { status: 400 });
  }

  const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;

  try {
    const response = await fetch(rawUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return new Response('Failed to fetch image from GitHub', { status: response.status });
    }

    const contentType = response.headers.get('content-type');
    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    return new Response('Error proxying image', { status: 500 });
  }
}
