import { proxyHandler } from "@/app/hooks/proxyHandler";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const endpoint = url.searchParams.get('endpoint') || '';
  return proxyHandler(req, endpoint, 'GET');
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const endpoint = url.searchParams.get('endpoint') || '';
  return proxyHandler(req, endpoint, 'POST');
}
export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const endpoint = url.searchParams.get('endpoint') || '';
  return proxyHandler(req, endpoint, 'PUT');
}
export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const endpoint = url.searchParams.get('endpoint') || '';
  return proxyHandler(req, endpoint, 'DELETE');
}