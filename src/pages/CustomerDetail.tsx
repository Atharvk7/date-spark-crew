import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { getCustomerById } from "@/data/customers";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Row = ({ label, value }: { label: string; value?: string | number | string[] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2">
    <div className="text-muted-foreground">{label}</div>
    <div className="sm:col-span-2 break-words">{Array.isArray(value) ? value.join(", ") : value ?? "-"}</div>
  </div>
);

const CustomerDetail = () => {
  const { id } = useParams();
  const c = id ? getCustomerById(id) : undefined;

  if (!c) {
    return (
      <main className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Customer Not Found</CardTitle>
            <CardDescription>The requested customer profile does not exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/dashboard" className="underline">Back to Dashboard</Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const fullName = `${c.firstName} ${c.lastName}`;
  const title = `${fullName} - Customer Profile | DateCrew`;
  const description = `View the full matchmaking biodata for ${fullName} including demographics, education, career, and preferences.`;

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: fullName,
    email: c.email,
    telephone: c.phone,
    gender: c.gender,
    birthDate: c.dateOfBirth,
    height: c.heightCm ? `${c.heightCm} cm` : undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: c.city,
      addressCountry: c.country,
    },
    jobTitle: c.designation,
    worksFor: c.company ? { "@type": "Organization", name: c.company } : undefined,
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={window.location.href} />
        <script type="application/ld+json">{JSON.stringify(personJsonLd)}</script>
      </Helmet>
      <main className="container mx-auto px-4 py-10">
        <nav className="mb-4">
          <Link to="/dashboard" className="underline">← Back to Dashboard</Link>
        </nav>
        <Card>
          <CardHeader>
            <CardTitle>{fullName}</CardTitle>
            <CardDescription>Full biodata and matchmaking profile</CardDescription>
          </CardHeader>
          <CardContent>
            <section className="space-y-4">
              <Row label="First Name" value={c.firstName} />
              <Row label="Last Name" value={c.lastName} />
              <Row label="Gender" value={c.gender} />
              <Row label="Date of Birth" value={c.dateOfBirth} />
              <Row label="Country, City" value={`${c.country}, ${c.city}`} />
              <Row label="Height" value={c.heightCm ? `${c.heightCm} cm` : undefined} />
              <Row label="Email" value={c.email} />
              <Row label="Phone Number" value={c.phone} />
              <Row label="Undergraduate College" value={c.college} />
              <Row label="Degree" value={c.degree} />
              <Row label="Income" value={c.income} />
              <Row label="Current Company" value={c.company} />
              <Row label="Designation" value={c.designation} />
              <Row label="Marital Status" value={c.maritalStatus} />
              <Row label="Languages Known" value={c.languages} />
              <Row label="Siblings" value={c.siblings} />
              <Row label="Caste" value={c.caste} />
              <Row label="Religion" value={c.religion} />
              <Row label="Want Kids" value={c.wantKids} />
              <Row label="Open to Relocate" value={c.openToRelocate} />
              <Row label="Open to Pets" value={c.openToPets} />
            </section>
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default CustomerDetail;
