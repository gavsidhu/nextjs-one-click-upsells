import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!api/|_next/|_static/|examples/|[\\w-]+\\.\\w+).*)'],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = req.headers.get('host') || 'demo.tryspark.io';

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname;

  // Only for demo purposes - remove this if you want to use your root domain as the landing page
  if (hostname === 'tryspark.io') {
    return NextResponse.redirect('https://demo.tryspark.io');
  }

  const currentHost =
    process.env.NODE_ENV === 'production' && process.env.VERCEL === '1'
      ? hostname.replace(`.tryspark.io`, '')
      : hostname.replace(`.localhost:3000`, '');

  // rewrites for app pages
  if (currentHost == 'app') {
    if (url.pathname === '/login' && req.cookies.get('supabase-auth-token')) {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    url.pathname = `/app${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // rewrite root application to `/home` folder
  if (hostname === 'localhost:3000' || hostname === 'tryspark.io') {
    return NextResponse.rewrite(new URL(`/home${path}`, req.url));
  }

  // rewrite everything else to `/_sites/[site] dynamic route
  return NextResponse.rewrite(
    new URL(`/_sites/${currentHost}${path}`, req.url)
  );
}
