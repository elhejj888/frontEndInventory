'use client';
import Sidebar from "./layout/sidebar";
import Footer from "./layout/footer";
import SubHeader from "./layout/header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Card from "./component/kpi";
import { useState, useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState({});
  const router = useRouter();

  // Define KPI groups as arrays of objects
  const userStats = [
    { title: 'Technicians Material', value: stats.techniciansMaterial || 0 },
    { title: 'Technicians Software', value: stats.techniciansSoftware || 0 },
    { title: 'Service Chiefs', value: stats.serviceChief || 0 },
    { title: 'Responsible for Hardware', value: stats.responsibleHardware || 0 },
    { title: 'Responsible for Software', value: stats.responsibleSoftware || 0 },
  ];

  const commandStats = [
    { title: 'Draft Orders', value: stats.draftOrders || 0 },
    { title: 'Confirmed Orders', value: stats.confirmedOrders || 0 },
    { title: 'Delivered Orders', value: stats.deliveredOrders || 0 },
    { title: 'Verified Orders', value: stats.verifiedOrders || 0 },
  ];

  const breakdownStats = [
    { title: 'Total Breakdowns', value: stats.totalBreakdowns || 0 },
    { title: 'Breakdowns Fixed', value: stats.breakdownsFixed || 0 },
    { title: 'Breakdowns Declined', value: stats.breakdownsDeclined || 0 },
  ];

  const itemStats = stats.itemsQuantity
    ? Object.keys(stats.itemsQuantity).map((item) => ({
        title: `${item} Quantity`,
        value: stats.itemsQuantity[item] || 0,
      }))
    : [];

  useEffect(() => {
    const getStats = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/stats', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    if (session) {
      getStats();
    }
  }, [session]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session || !session.user) {
    router.push("/Login");
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Users Statistics Card */}
      <div className="mb-8">
        <Card title="User Statistics" stats={userStats} />
      </div>

      {/* Commands Statistics Card */}
      <div className="mb-8">
        <Card title="Command Statistics" stats={commandStats} />
      </div>

      {/* Breakdowns Statistics Card */}
      <div className="mb-8">
        <Card title="Breakdown Statistics" stats={breakdownStats} />
      </div>

      {/* Items Statistics Card */}
      <div className="mb-8">
        <Card title="Item Statistics" stats={itemStats} />
      </div>

      {/* Embedded Power BI Report */}
      <div
        className="relative mt-4"
        style={{ paddingBottom: "56.25%", height: 0, overflow: "hidden", maxWidth: "100%" }}
      >
        <iframe
          title="Sample Report Demo"
          src="https://playground.powerbi.com/sampleReportEmbed"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          style={{ border: "none" }}
          aria-label="Embedded Power BI Report"
        />
      </div>
    </div>
  );
}
