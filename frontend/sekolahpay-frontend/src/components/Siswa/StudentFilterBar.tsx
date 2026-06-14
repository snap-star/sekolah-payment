import { Search } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';

interface StudentFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  genderFilter: string;
  onGenderChange: (gender: string) => void;
  onResetFilters: () => void;
}

export function StudentFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  genderFilter,
  onGenderChange,
  onResetFilters,
}: StudentFilterBarProps) {
  return (
    <Card className="border-border">
      <CardContent>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-50">
            <Label htmlFor="search" className="mb-2 block">Cari Siswa</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Cari berdasarkan NIS, NISN, atau nama..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-40">
            <Label htmlFor="filter-status" className="mb-2 block">Status</Label>
            <Select value={statusFilter} onValueChange={onStatusChange}>
              <SelectTrigger id="filter-status">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Nonaktif</SelectItem>
                <SelectItem value="graduated">Lulus</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-40">
            <Label htmlFor="filter-gender" className="mb-2 block">Jenis Kelamin</Label>
            <Select value={genderFilter} onValueChange={onGenderChange}>
              <SelectTrigger id="filter-gender">
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="L">Laki-laki</SelectItem>
                <SelectItem value="P">Perempuan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={onResetFilters}>
            Reset Filter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}