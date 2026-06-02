import { Truck, Warehouse, Globe, Boxes, Package, type LucideProps } from "lucide-react";
import type { ComponentType } from "react";

const MAP: Record<string, ComponentType<LucideProps>> = {
  truck: Truck,
  "truck-moving": Truck,
  warehouse: Warehouse,
  globe: Globe,
  "boxes-packing": Boxes,
  boxes: Boxes,
  package: Package,
};

export function ServiceIcon({
  name,
  className,
}: {
  name: string | null;
  className?: string;
}) {
  const Icon = MAP[name ?? ""] ?? Truck;
  return <Icon className={className} />;
}
