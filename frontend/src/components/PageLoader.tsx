import {LoaderCircleIcon, LoaderIcon} from "lucide-react";

const PageLoader = () => {
  return (
    <div className="bg-black flex items-center justify-center h-screen" >
      <LoaderCircleIcon className="size-10 animate-spin text-white"/> 
    </div>
  )
}

export default PageLoader 
