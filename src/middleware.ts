import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!api/|_next/|_static/|examples/|[\\w-]+\\.\\w+).*)'],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || 'tryspark.io';
  const path = url.pathname;

  const currentHost =
    process.env.NODE_ENV === 'production' && process.env.VERCEL === '1'
      ? hostname.replace(`.tryspark.io`, '')
      : hostname.replace(`.localhost:3000`, '');

  if (currentHost == 'app') {
    url.pathname = `/app${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // rewrite root application to `/home` folder
  if (hostname === 'tryspark.io' || hostname === 'localhost:3000') {
    return NextResponse.rewrite(new URL(`/home${path}`, req.url));
  }

  // rewrite everything else to `/_sites/[site] dynamic route
  return NextResponse.rewrite(
    new URL(`/_sites/${currentHost}${path}`, req.url)
  );
}
