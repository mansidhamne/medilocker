import { FaUserDoctor, FaUser } from "react-icons/fa6";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-row m-0 p-0 overflow-y-hidden bg-white">
      {/* Left side for image */}
      <div className="relative w-1/2 h-screen">
        <img src="../landing_bg.png" alt="landing-page-bg" className="min-h-screen "></img>
      </div>
      
      {/* Right side for login box */}
      <div className="flex flex-col gap-4 items-center justify-center w-1/2">
        <img src="../logo.png" className="w-[250px] mb-6"></img>
        <div className="bg-white border-[1px] rounded-md border-slate-500 py-10 px-0 w-1/2">
          <Link href="/login/doctor">
            <div className="flex flex-col gap-1 mb-8 justify-center items-center">
              <FaUserDoctor className="text-2xl text-slate-500" />
              <h1 className="text-lg font-normal text-slate-400">I am a doctor</h1>
            </div>
          </Link>
          <div className="flex flex-col gap-1 justify-center items-center border-t-[1px] pt-10">
            <FaUser className="text-2xl text-slate-500" />
            <h1 className="text-lg font-normal text-slate-400">I am a patient</h1>
          </div>
        </div>
        
      </div>
    </div>
  );
}

