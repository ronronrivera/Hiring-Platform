import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { useStore } from "@/store/useAuthStore";
import { UserIcon, MailIcon, PhoneIcon } from "lucide-react";
import { toast } from "sonner";

// Mock employee data; replace with API call
const mockEmployees = [
  { id: 1, name: "Alice Reyes", position: "Frontend Developer", email: "alice@example.com", phone: "09171234567" },
  { id: 2, name: "Brian Santos", position: "Backend Developer", email: "brian@example.com", phone: "09179876543" },
  { id: 3, name: "Carla Mendoza", position: "UI/UX Designer", email: "carla@example.com", phone: "09175678901" },
  // Add more employees...
];

export function EmployeePage() {
  const { user } = useStore();
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState(mockEmployees);
  const [filteredEmployees, setFilteredEmployees] = useState(mockEmployees);

  useEffect(() => {
    // Filter employees based on search query
    setFilteredEmployees(
      employees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(search.toLowerCase()) ||
          emp.position.toLowerCase().includes(search.toLowerCase()) ||
          emp.email.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, employees]);

  const handleContact = (employeeId: number) => {
    const emp = employees.find(e => e.id === employeeId);
    toast.success(`Contacting ${emp?.name}...`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Navbar */}
      <Navbar />

      {/* Welcome Section */}
      <div className="max-w-3xl mx-auto mt-12 text-center px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Employee Directory, {user.profile?.name.split(" ")[0]}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Search and connect with employees across the company.
        </p>

        {/* Search Bar */}
        <div className="flex justify-center gap-2">
          <Input
            placeholder="Search employees by name, position, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-lg"
          />
          <Button onClick={() => setFilteredEmployees(filteredEmployees)}>Search</Button>
        </div>
      </div>

      {/* Employees List */}
      <div className="max-w-6xl mx-auto mt-12 px-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEmployees.length === 0 ? (
          <p className="text-center col-span-full text-gray-600 dark:text-gray-300">
            No employees found.
          </p>
        ) : (
          filteredEmployees.map((emp) => (
            <Card key={emp.id} className="hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg">{emp.name}</CardTitle>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{emp.position}</span>
                </div>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <div className="flex items-center gap-2">
                    <MailIcon className="w-4 h-4" />
                    {emp.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="w-4 h-4" />
                    {emp.phone}
                  </div>
                </CardDescription>
                <Button onClick={() => handleContact(emp.id)} className="w-full">
                  Contact
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
