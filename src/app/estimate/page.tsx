import type { Metadata } from "next";
import { Estimator } from "@/components/estimator";
export const metadata:Metadata={title:"Get a Free Car Damage Repair Estimate",description:"Upload vehicle damage photos and receive an AI-assisted, itemized U.S. car body repair cost range from Carspect.",alternates:{canonical:"/estimate"}};
export default function EstimatePage(){return <div className="estimate-page"><div className="shell"><Estimator/></div></div>}
