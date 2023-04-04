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

  // rewrite app pages to `/src/pages/app` folder
  if (currentHost == 'app') {
    url.pathname = `/src/pages/app${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // rewrite root application to `/src/pages/home` folder
  if (hostname === 'tryspark.io' || hostname === 'localhost:3000') {
    return NextResponse.rewrite(new URL(`/src/pages/home${path}`, req.url));
  }

  return NextResponse.rewrite(
    new URL(`/_sites/${currentHost}${path}`, req.url)
  );
}
