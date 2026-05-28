import Layout from "@/Components/Layout";
import { usePage, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Badge } from "@/Components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { toast } from "sonner";

interface UserAdmin {
    id: number;
    nama: string;
    email: string;
    role: string;
    no_hp: string;
    aktif: boolean;
    terakhir_login: string;
}

export default function UserAdminIndex() {
    const { users, roles } = usePage().props as {
        users: UserAdmin[];
        roles: Array<{ value: string; label: string }>;
    };
    const { data, setData, post, processing, reset } = useForm({
        nama: "",
        email: "",
        role: "",
        no_hp: "",
        password: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("user-admin.store"), {
            onSuccess: () => {
                reset();
                toast.success("User admin berhasil ditambahkan");
            },
        });
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Manajemen User Admin
                        </h2>
                        <p className="text-muted-foreground">
                            Kelola akses guru, bendahara, dan operator.
                        </p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Tambah User</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Tambah Admin Baru</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Nama Lengkap</Label>
                                    <Input
                                        value={data.nama}
                                        onChange={(e) =>
                                            setData("nama", e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>No. HP</Label>
                                    <Input
                                        value={data.no_hp}
                                        onChange={(e) =>
                                            setData("no_hp", e.target.value)
                                        }
                                        placeholder="081234567890"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Role</Label>
                                    <Select
                                        onValueChange={(v) =>
                                            setData("role", v)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((r) => (
                                                <SelectItem
                                                    key={r.value}
                                                    value={r.value}
                                                >
                                                    {r.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Password</Label>
                                    <Input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing}
                                >
                                    Simpan
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card className="border-border">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">
                            Daftar User Admin
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>No. HP</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Terakhir Login</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((u) => (
                                    <TableRow key={u.id}>
                                        <TableCell className="font-medium">
                                            {u.nama}
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {u.email}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {u.role.replace("_", " ")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {u.no_hp}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    u.aktif
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {u.aktif ? "Aktif" : "Nonaktif"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {u.terakhir_login}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <div className="mt-4">
                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">
                                Daftar User Non-Admin / Siswa dan Wali Murid
                            </CardTitle>
                            <CardDescription className="text-xs text-muted-foreground">
                                Daftar user non-admin yang terdaftar di sistem.
                            </CardDescription>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nama</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>No. HP</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Terakhir Login</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((u) => (
                                            <TableRow key={u.id}>
                                                <TableCell className="font-medium">
                                                    {u.nama}
                                                </TableCell>
                                                <TableCell className="text-xs">
                                                    {u.email}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {u.role.replace("_", " ")}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-xs">
                                                    {u.no_hp}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            u.aktif
                                                                ? "default"
                                                                : "secondary"
                                                        }
                                                    >
                                                        {u.aktif
                                                            ? "Aktif"
                                                            : "Nonaktif"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground">
                                                    {u.terakhir_login}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
