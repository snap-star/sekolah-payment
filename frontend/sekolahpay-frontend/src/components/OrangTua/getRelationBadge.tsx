import { Badge } from "@/components/ui/badge";
import type { StudentGuardian } from "@/types/server/api";
/**
 * Helper function to get the appropriate badge for guardian relationship
 * Supports both 'relation' and 'relationship' fields from API responses
*/
export const getRelationBadge = (guardian: StudentGuardian) => {
    // Get relation from either field (supports both API response formats)
    const relation = guardian.relation || null;
    
    if (!relation) return <Badge variant="outline">-</Badge>;
    
    switch (relation) {
      case 'Ayah':
        return <Badge variant="default">Ayah</Badge>;
      case 'Ibu':
        return <Badge variant="default">Ibu</Badge>;
      case 'Wali':
        return <Badge variant="secondary">Wali</Badge>;
      default:
        return <Badge variant="outline">{relation}</Badge>;
    }
  };