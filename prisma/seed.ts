import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Riam Ensiling database seed...");

  // Clear existing demo data in order of foreign key dependency
  await prisma.payment.deleteMany();
  await prisma.bookingItem.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.attraction.deleteMany();
  await prisma.facility.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.gazebo.deleteMany();

  // ---- 1. Seed Admin ----
  const adminEmail = "admin@riamensiling.id";
  const passwordHash = await bcrypt.hash("admin123", 10);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
    },
  });
  console.log(`✅ Admin account created/updated: ${admin.email}`);

  // ---- 2. Seed Attractions ----
  const attractions = [
    {
      name: "Air Terjun Riam Ensiling",
      description:
        "Keindahan gemuruh air terjun alami berpadu dengan udara sejuk pegunungan. Tempat terbaik untuk berenang, bersantai, dan menikmati keasrian alam Desa Lumut, Kabupaten Sanggau.",
      imageUrl: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80",
      isPublished: true,
      sortOrder: 1,
    },
    {
      name: "Spot Swafoto Tebing & River View",
      description:
        "Spot foto instagramable berlatar aliran riam yang jernih dan pepohonan hijau rindang. Sangat cocok untuk mengabadikan momen bersama keluarga dan kerabat.",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      isPublished: true,
      sortOrder: 2,
    },
    {
      name: "Area Camping & Santai Tepi Riam",
      description:
        "Kawasan pemukiman tenda di pinggir aliran sungai untuk menikmati suasana malam alam Kalimantan yang tenang, berhias bintang dan suara alir air.",
      imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
      isPublished: true,
      sortOrder: 3,
    },
  ];

  const createdAttractions = [];
  for (const attr of attractions) {
    const item = await prisma.attraction.create({ data: attr });
    createdAttractions.push(item);
  }
  console.log(`✅ ${createdAttractions.length} attractions seeded.`);

  // ---- 3. Seed Facilities ----
  const facilities = [
    {
      name: "Area Parkir Kendaraan",
      description: "Lahan parkir luas dan aman yang dapat menampung roda dua dan roda empat dengan pengawasan petugas.",
      imageUrl: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80",
      isPublished: true,
      sortOrder: 1,
    },
    {
      name: "Toilet & Ruang Ganti",
      description: "Fasilitas sanitasi yang bersih dan memadai untuk membilas serta berganti pakaian setelah berenang.",
      imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
      isPublished: true,
      sortOrder: 2,
    },
    {
      name: "Mushola Usaha Wisata",
      description: "Tempat ibadah yang tenang dan bersih lengkap dengan sarana wudhu untuk kenyamanan pengunjung muslim.",
      imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      isPublished: true,
      sortOrder: 3,
    },
    {
      name: "Kantin & Warung Konsumsi",
      description: "Menyediakan makanan khas lokal, jajanan, kopi hangat, dan minuman segar untuk melepas dahaga.",
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      isPublished: true,
      sortOrder: 4,
    },
  ];

  for (const fac of facilities) {
    await prisma.facility.create({ data: fac });
  }
  console.log(`✅ ${facilities.length} facilities seeded.`);

  // ---- 4. Seed Gallery ----
  const galleryItems = [
    { imageUrl: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80", sortOrder: 1 },
    { imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", sortOrder: 2 },
    { imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80", sortOrder: 3 },
    { imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80", sortOrder: 4 },
    { imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80", sortOrder: 5 },
    { imageUrl: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80", sortOrder: 6 },
  ];

  for (const item of galleryItems) {
    await prisma.galleryItem.create({ data: item });
  }
  console.log(`✅ ${galleryItems.length} gallery items seeded.`);

  // ---- 5. Seed Tickets ----
  const ticketsData = [
    {
      name: "Tiket Masuk Dewasa",
      price: 15000,
      description: "Tiket masuk area wisata Riam Ensiling untuk pengunjung usia 12 tahun ke atas.",
      isActive: true,
    },
    {
      name: "Tiket Masuk Anak-anak",
      price: 10000,
      description: "Tiket masuk area wisata Riam Ensiling untuk anak-anak usia 3 - 11 tahun.",
      isActive: true,
    },
  ];

  const tickets = [];
  for (const ticket of ticketsData) {
    const item = await prisma.ticket.create({ data: ticket });
    tickets.push(item);
  }
  console.log(`✅ ${tickets.length} tickets seeded.`);

  // ---- 6. Seed Gazebos ----
  const gazebosData = [
    {
      code: "GZB-A1",
      name: "Gazebo Utama A1 (Pinggir Riam)",
      price: 75000,
      capacity: 8,
      description: "Gazebo posisi paling dekat dengan alur air riam, memberikan pemandangan terbaik dan akses mudah ke air.",
      isActive: true,
    },
    {
      code: "GZB-B1",
      name: "Gazebo B1 (Area Rindang)",
      price: 50000,
      capacity: 6,
      description: "Gazebo di bawah naungan pohon rindang yang sejuk, nyaman untuk bersantai dan makan bersama keluarga.",
      isActive: true,
    },
    {
      code: "GZB-B2",
      name: "Gazebo B2 (Area Rindang)",
      price: 50000,
      capacity: 6,
      description: "Gazebo sejuk dengan pemandangan terbuka menuju taman dan aliran sungai kecil.",
      isActive: true,
    },
  ];

  const gazebos = [];
  for (const gzb of gazebosData) {
    const item = await prisma.gazebo.create({ data: gzb });
    gazebos.push(item);
  }
  console.log(`✅ ${gazebos.length} gazebos seeded.`);

  // ---- 7. Seed Sample Booking for Admin Testing ----
  const sampleVisitDate = new Date();
  sampleVisitDate.setDate(sampleVisitDate.getDate() + 2);

  const sampleBooking = await prisma.booking.create({
    data: {
      referenceCode: "RE-20260822-DEMO",
      customerName: "Budi Santoso",
      whatsappNumber: "081234567890",
      visitDate: sampleVisitDate,
      status: "PAID",
      totalPrice: 105000,
      expiresAt: new Date(Date.now() + 3600000 * 24),
      items: {
        create: [
          {
            itemType: "TICKET",
            itemId: tickets[0].id,
            itemName: "Tiket Masuk Dewasa",
            quantity: 2,
            unitPrice: 15000,
            subtotal: 30000,
          },
          {
            itemType: "GAZEBO",
            itemId: gazebos[0].id,
            itemName: "Gazebo Utama A1 (Pinggir Riam)",
            quantity: 1,
            unitPrice: 75000,
            subtotal: 75000,
            gazeboId: gazebos[0].id,
          },
        ],
      },
      payments: {
        create: {
          provider: "midtrans",
          providerOrderId: "RE-20260822-DEMO-1",
          providerTransactionId: "trx-demo-123456",
          status: "settlement",
        },
      },
    },
  });
  console.log(`✅ Sample booking created: ${sampleBooking.referenceCode}`);

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
