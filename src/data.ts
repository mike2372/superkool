import { Job, ServiceOption, UnitProfile } from './types';

export const INITIAL_UNIT_PROFILES: UnitProfile[] = [
  { id: 'unit-1', name: 'Living Room - Daikin 2HP (Inverter)' },
  { id: 'unit-2', name: 'Master Bedroom - Panasonic 1.5HP' },
  { id: 'unit-3', name: 'Study Room - Samsung 1.0HP' },
];

export const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: 'service-1',
    name: 'Chemical Overhaul',
    description: 'Deep cleaning for units older than 1 year.',
    price: 150.0,
    tag: 'Popular',
    icon: 'cleaning_services', // we can map to beautiful Lucide icons
  },
  {
    id: 'service-2',
    name: 'Standard Servicing',
    description: 'Routine filter & coil wash for maintenance.',
    price: 80.0,
    icon: 'water_drop',
  },
  {
    id: 'service-3',
    name: 'Gas Refill (R32/R410)',
    description: 'Top-up coolant for improved cooling performance.',
    price: 60.0,
    icon: 'build',
  },
  {
    id: 'service-4',
    name: 'General Repair',
    description: 'On-site diagnosis for leaking or noise issues.',
    price: 50.0,
    icon: 'troubleshoot',
  },
];

export const INITIAL_JOBS: Job[] = [
  {
    id: 'SK-9021',
    title: 'Chemical Service & Gas Refill',
    type: 'Chemical Wash',
    clientName: 'Tan Ah Kow',
    address: 'Lot 12, Jalan Tenggiri, Bandar Seberang Jaya, 13700 Perai, Pulau Pinang',
    timeRange: '10:00 AM - 11:30 AM',
    etaStr: 'ETA: 15 mins',
    dateStr: 'Today',
    amount: 180.0,
    siteImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCknIP5Au2iTKmqcEV_fsen32Kfs6KHnFPl3U83bTaumJ7uYaz7UX9XPgyew2qlG9xUSITYaQt0m5unhUrb-aRPmCA2QOuTmi-uvMLW3J9E-4yE3TuWO2fZj8IeRNtsKiuwoiX1fZZi-uGO0ghzILvvn463TNEIEbpztQopoWsU6QQ8D48rcCRUDvk9CSKWqZF8ap8T7FiRP1py81WxqEaikuPM8XWV8cHn1wIv7S6OfbgB72L8MRH4tV5lI7Ssu6UWH2vLtbWSjwM',
    status: 'pending_start',
    beforePhotos: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA-_C5LKy6EHHxHVOa0IL-XvULHlDJFH1KIH1GDEmkeZDOtMON-VWEtn3lR5-kGPlphukYbpsND21_UaSwijR_X0mVZZ7GTEBAX3pCguZhSYaQafTaubA5h6FQUHyJNviYphnOjPDGYwXR_yurIdnvxodjDxfz-BE1OJuR9sSzQP0OVkdE2-9WrFarbCL2mJURCzZFj-gHs-lMBN7V1JVwgmyKUc455NEWJMgiTHk-kiiXCsw5kPjnkMzf7sxvd1vtrBg4UUSUlXc8'
    ],
    afterPhotos: [],
    parts: [
      { id: 'p1', name: 'R32 Refrigerant (0.5kg)', description: 'Standard Top-up', price: 45.0, checked: true },
      { id: 'p2', name: 'Capacitor 35uF', description: 'Replacement Part', price: 65.0, checked: false },
      { id: 'p3', name: 'Anti-Bacterial Spray', description: 'Coil Treatment', price: 20.0, checked: true }
    ]
  },
  {
    id: 'SK-9022',
    title: 'Standard Maintenance Service',
    type: 'Standard Service',
    clientName: 'Sarah Lim',
    address: 'Tanjung Bungah Park, No. 45, Penang',
    timeRange: '01:00 PM - 02:00 PM',
    dateStr: 'Today',
    amount: 80.0,
    siteImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcN3OTnIvI-GeowOX4NP7EXKWyUTFtybHZSRrsJVj8m07RQen68jS2YDyeqZr4IdL7WfHIOGc4pCBxtGhzivXYoyc1oYxYw-qW_ONI2v834AW0UIEs4u-wZ1dYl66zpeTVxN83UEFY92nSvY1dSW_2_D8qyeyF_cx6RfwAiRyijk486N7dHZKGmy5R3z8Yx7RLyBupe0UTn_YkGI26_vqxAarcHy4qcJjyygRRtaHDfOWJX42wf02tdr6KFgWxkx-NIbk66Q1nqyQ',
    status: 'pending_start',
    beforePhotos: [],
    afterPhotos: [],
    parts: [
      { id: 'p3', name: 'Anti-Bacterial Spray', description: 'Coil Treatment', price: 20.0, checked: false }
    ]
  },
  {
    id: 'SK-9023',
    title: 'Compressor Motor Refit',
    type: 'Urgent Repair',
    clientName: 'InnoTech Hub',
    address: 'Bayan Lepas Industrial Park, Phase 4, Penang',
    timeRange: '03:30 PM - 05:00 PM',
    dateStr: 'Today',
    amount: 450.0,
    siteImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-I2KdmXNi65cVi_Z6Gzi_x9ZQWlevJPPA4KSJ6k3cZQBNSJFZ_F81bWDdHzXdxMz_WcJDcwRWcf9y8SYFVazvft5d5erezc8lbMQfxZicA6e_HTG9rSnTxeL8AyeEernrOh44vO4oiPuuPn9BlQBMKghCCE-NSdgbHLmmlAeNCsupFvKEZKVz34az3y1EI0y8xedclIoiPOh1QlLHdFw6fzjz7Pgk0C5mZmk5PWKPIMhIsGp3Gunlbu8QjUn6qlSL66N_ktpiXYM',
    status: 'pending_start',
    beforePhotos: [],
    afterPhotos: [],
    parts: [
      { id: 'p4', name: 'Full Compressor Unit', description: 'Inverter Grade Motor', price: 320.0, checked: true },
      { id: 'p5', name: 'R410a Gas Charge', description: 'Premium Top-up', price: 80.0, checked: true }
    ]
  },
  {
    id: 'SK-9921',
    title: 'Chemical Wash - 2HP',
    type: 'Chemical Wash',
    clientName: 'Chong Kok Leong',
    address: 'Apartment Desa Universiti, Jalan Sungai Dua, 11700 Gelugor, Penang',
    timeRange: 'Today, 2:30 PM',
    dateStr: 'Today',
    amount: 180.0,
    siteImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcN3OTnIvI-GeowOX4NP7EXKWyUTFtybHZSRrsJVj8m07RQen68jS2YDyeqZr4IdL7WfHIOGc4pCBxtGhzivXYoyc1oYxYw-qW_ONI2v834AW0UIEs4u-wZ1dYl66zpeTVxN83UEFY92nSvY1dSW_2_D8qyeyF_cx6RfwAiRyijk486N7dHZKGmy5R3z8Yx7RLyBupe0UTn_YkGI26_vqxAarcHy4qcJjyygRRtaHDfOWJX42wf02tdr6KFgWxkx-NIbk66Q1nqyQ',
    status: 'completed',
    beforePhotos: [],
    afterPhotos: [],
    parts: [],
    isPaid: false // 'Processing' in table
  },
  {
    id: 'SK-9850',
    title: 'Compressor Repair',
    type: 'Urgent Repair',
    clientName: 'InnoTech Hub',
    address: 'Bayan Lepas phase 4',
    timeRange: 'Yesterday',
    dateStr: 'Yesterday',
    amount: 450.0,
    siteImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-I2KdmXNi65cVi_Z6Gzi_x9ZQWlevJPPA4KSJ6k3cZQBNSJFZ_F81bWDdHzXdxMz_WcJDcwRWcf9y8SYFVazvft5d5erezc8lbMQfxZicA6e_HTG9rSnTxeL8AyeEernrOh44vO4oiPuuPn9BlQBMKghCCE-NSdgbHLmmlAeNCsupFvKEZKVz34az3y1EI0y8xedclIoiPOh1QlLHdFw6fzjz7Pgk0C5mZmk5PWKPIMhIsGp3Gunlbu8QjUn6qlSL66N_ktpiXYM',
    status: 'completed',
    beforePhotos: [],
    afterPhotos: [],
    parts: [],
    isPaid: true // 'Paid' in table
  },
  {
    id: 'SK-9812',
    title: 'Standard Servicing',
    type: 'Standard Service',
    clientName: 'Fatimah Ahmad',
    address: '15, Lorong Bertam Indah, Kepala Batas, Penang',
    timeRange: '15 Oct 2023',
    dateStr: '15 Oct 2023',
    amount: 120.0,
    siteImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcN3OTnIvI-GeowOX4NP7EXKWyUTFtybHZSRrsJVj8m07RQen68jS2YDyeqZr4IdL7WfHIOGc4pCBxtGhzivXYoyc1oYxYw-qW_ONI2v834AW0UIEs4u-wZ1dYl66zpeTVxN83UEFY92nSvY1dSW_2_D8qyeyF_cx6RfwAiRyijk486N7dHZKGmy5R3z8Yx7RLyBupe0UTn_YkGI26_vqxAarcHy4qcJjyygRRtaHDfOWJX42wf02tdr6KFgWxkx-NIbk66Q1nqyQ',
    status: 'completed',
    beforePhotos: [],
    afterPhotos: [],
    parts: [],
    isPaid: true
  }
];

export const MAP_IMAGE_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZ-c7rQeJFhiE1RVQ2knpGCQCZncfrs8HAYd2GOnuUf4rIqyXsUKVOZNDmKB-yAzVXTOsPx2cO3GpLW5XcmMfUvkwAsc8eYZpMREFowVxAEC3DpHOvZeBFcSLjFviovPa3MceibDRA6ASSJ5aIl9O8VX0C1gJcWMyjakmUJYndVrGo8THY4WmuiRMhgB2wHIHx-NMuafahQLN0xkRgPjgPvDxYeW3tVNW6O_8uxNSdEwZLlHPGwwOq3uDf2-s8uG1tkwU8WPLkGus';
