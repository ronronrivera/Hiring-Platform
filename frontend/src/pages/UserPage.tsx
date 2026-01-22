import { useStore } from "@/store/useAuthStore"
import { ApplicantPage } from "./applicant pages/ApplicantPage";
import { EmployeePage } from "./employee pages/EmployeePage";
import { motion } from "framer-motion";
const UserPage = () => {
    
    const {user} = useStore();
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}

        >
            {user.profile?.role === "applicant" && (<ApplicantPage/>)}
            {user.profile?.role === "employee" && (<EmployeePage/>)}
        </motion.div>
    )
}

export default UserPage
