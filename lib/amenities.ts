import type { Amenity } from "./types"
import { Wifi, Coffee, Waves, Sparkles, Plane, Dumbbell, Car, Cigarette, Eye } from "lucide-react"

export const amenityIcons = {
  wifi: Wifi,
  breakfast: Coffee,
  pool: Waves,
  spa: Sparkles,
  airport_pickup: Plane,
  gym: Dumbbell,
  parking: Car,
  non_smoking: Cigarette,
  view: Eye,
}

export const amenityLabels: Record<Amenity, string> = {
  wifi: "Wi-Fi miễn phí",
  breakfast: "Bữa sáng",
  pool: "Hồ bơi",
  spa: "Spa",
  airport_pickup: "Đưa đón sân bay",
  gym: "Phòng gym",
  parking: "Bãi đỗ xe",
  non_smoking: "Không hút thuốc",
  view: "Tầm nhìn đẹp",
}
