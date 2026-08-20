export type MockVideo = {
  id: string;
  titleKey: "v1" | "v2" | "v3" | "v4" | "v5" | "v6" | "v7" | "v8";
  youtubeId: string;
  accent: string;
};

export const MOCK_VIDEOS: MockVideo[] = [
  { id: "dotonbori-night", titleKey: "v1", youtubeId: "aqz-KE-bpKQ", accent: "from-[#FF2E93] via-[#A855F7] to-[#0A0A0F]" },
  { id: "namba-start", titleKey: "v2", youtubeId: "aqz-KE-bpKQ", accent: "from-[#22D3EE] via-[#A855F7] to-[#0A0A0F]" },
  { id: "convoy-lights", titleKey: "v3", youtubeId: "aqz-KE-bpKQ", accent: "from-[#A855F7] via-[#FF2E93] to-[#0A0A0F]" },
  { id: "shinsaibashi", titleKey: "v4", youtubeId: "aqz-KE-bpKQ", accent: "from-[#FF2E93] via-[#22D3EE] to-[#12121A]" },
  { id: "tsutenkaku-loop", titleKey: "v5", youtubeId: "aqz-KE-bpKQ", accent: "from-[#A855F7] via-[#22D3EE] to-[#0A0A0F]" },
  { id: "castle-run", titleKey: "v6", youtubeId: "aqz-KE-bpKQ", accent: "from-[#22D3EE] via-[#FF2E93] to-[#12121A]" },
  { id: "helmet-cam", titleKey: "v7", youtubeId: "aqz-KE-bpKQ", accent: "from-[#FF2E93] via-[#12121A] to-[#A855F7]" },
  { id: "team-photo", titleKey: "v8", youtubeId: "aqz-KE-bpKQ", accent: "from-[#A855F7] via-[#12121A] to-[#22D3EE]" },
];
