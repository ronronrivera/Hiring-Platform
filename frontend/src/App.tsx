import {Button} from "@/components/ui/button"
import { Toaster } from "sonner"
import { toast } from "sonner"

const App = () => {

    const handleClick = () =>{
        toast.success("Test Sucess");
    } 

    return (
        <div>
            <Toaster/>
            <Button onClick={handleClick}>Click me!</Button>
        </div>
    )
}

export default App
