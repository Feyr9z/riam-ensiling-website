import prisma from "@/lib/prisma";
import GazeboManager from "./GazeboManager";

export default async function AdminGazeboPage() {
  const gazebos = await prisma.gazebo.findMany({
    orderBy: { code: "asc" },
  });

  return <GazeboManager initialItems={gazebos} />;
}
