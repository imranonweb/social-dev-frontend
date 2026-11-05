import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

async function proxyRequest(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  const targetPath = (resolvedParams.path || []).join("/");
  const targetUrl = new URL(`${BACKEND_URL}/${targetPath}`);

  // Forward query string
  request.nextUrl.searchParams.forEach((val, key) => {
    targetUrl.searchParams.set(key, val);
  });

  // Prepare forwarded headers
  const forwardHeaders = new Headers();
  request.headers.forEach((value, key) => {
    if (!["host", "connection", "content-length"].includes(key.toLowerCase())) {
      forwardHeaders.set(key, value);
    }
  });

  const requestOptions: RequestInit = {
    method: request.method,
    headers: forwardHeaders,
  };

  if (!["GET", "HEAD"].includes(request.method)) {
    try {
      requestOptions.body = await request.text();
    } catch {
      // Body empty or unreadable
    }
  }

  try {
    const backendResponse = await fetch(targetUrl.toString(), requestOptions);
    const responseBody = await backendResponse.text();

    const responseHeaders = new Headers();
    backendResponse.headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });

    return new NextResponse(responseBody, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Proxy error connecting to backend service",
        error: error.message || "Connection refused",
      },
      { status: 502 }
    );
  }
}

export {
  proxyRequest as GET,
  proxyRequest as POST,
  proxyRequest as PUT,
  proxyRequest as DELETE,
  proxyRequest as PATCH,
};

