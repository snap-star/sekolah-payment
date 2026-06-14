import { Badge } from "@/components/ui/badge";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge variant="default">Aktif</Badge>;
    case "inactive":
      return <Badge variant="secondary">Nonaktif</Badge>;
    case "graduated":
      return <Badge variant="outline">Lulus</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getGenderLabel = (gender: string) => {
  return gender === "L" ? "Laki-laki" : "Perempuan";
};

export { getStatusBadge, getGenderLabel };