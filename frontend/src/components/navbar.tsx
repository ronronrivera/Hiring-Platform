import { UsersRoundIcon } from "lucide-react"
import { Link } from "react-router"


const navbar = () => {
  return (
    <nav className="backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
            {/*LOGO*/}
            <Link to={"/"} className="group flex items-center gap-3 hover:scale-110 transition-transform duration-150">
                    <div className="size-10 rounded-xl bg-linear-to-r from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
                        <UsersRoundIcon className="size-6"/>
                    </div>
                    <div className="flex flex-col">
                        <span className='font-black text-xl bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider'>
                            Job Matrix
                        </span>
                    </div>
                </Link>
            </div> 
        </nav>
    )
}

export default navbar
