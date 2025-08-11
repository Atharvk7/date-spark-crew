import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { customers } from "@/data/customers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const ageFromDob = (dob: string) => {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const Dashboard = () => {
  const rows = useMemo(() => customers.map(c => ({
    id: c.id,
    name: `${c.firstName} ${c.lastName}`,
    age: ageFromDob(c.dateOfBirth),
    city: c.city,
    maritalStatus: c.maritalStatus,
    status: c.status,
  })), []);

  const title = "Dashboard - Customer List | DateCrew";
  const description = "View all customers assigned to you with quick access to detailed matchmaking profiles.";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <main className="container mx-auto px-4 py-10">
        <h1 className="sr-only">Customer List</h1>
        <Card>
          <CardHeader>
            <CardTitle>Customer List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Marital Status</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <Link to={`/customers/${r.id}`} className="underline underline-offset-2">
                          {r.name}
                        </Link>
                      </TableCell>
                      <TableCell>{r.age}</TableCell>
                      <TableCell>{r.city}</TableCell>
                      <TableCell>{r.maritalStatus}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{r.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default Dashboard;
