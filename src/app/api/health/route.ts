import { NextResponse } from "next/server";
export const dynamic="force-dynamic";
export function GET(){return NextResponse.json({status:"ok",service:"carspect",version:process.env.npm_package_version??"0.1.0",time:new Date().toISOString()},{headers:{"Cache-Control":"no-store"}})}
