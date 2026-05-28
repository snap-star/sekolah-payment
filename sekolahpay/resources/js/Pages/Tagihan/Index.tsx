import Layout from "@/Components/Layout";
import { usePage, useForm, router } from "@inertiajs/react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { toast } from "sonner";
import { useState } from "react";
import type { Tagihan, FlashMessage } from "@/types";

function formatRupiah(n: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(n);
}

export default function TagihanIndex() {
    const { tagihan, jenis_tagihan, flash } = usePage().props as {
        tagihan: Tagihan[];
        jenis_tagihan: Array<{
            id: number;
            nama: string;
            nominal_default: number;
            periode: string;
        }>;
        flash?: FlashMessage;
    };
    const [editingId, setEditingId] = useState<number | null>(null);
    const [newNominal, setNewNominal] = useState("");

    const { data, setData, post, processing, reset } = useForm({
        siswa_nama: "",
        siswa_nis: "",
        siswa_kelas: "",
        jenis_tagihan_id: "",
        periode: "",
        nominal: "",
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("tagihan.store"), {
            onSuccess: () => {
                reset();
                toast.success("Tagihan berhasil dibuat");
            },
        });
    };

    const handleUpdateNominal = (id: number) => {
        router.put(
            route("tagihan.update", id),
            { nominal_disesuaikan: Number(newNominal) },
            {
                onSuccess: () => {
                    setEditingId(null);
                    setNewNominal("");
                    toast.success("Nominal diperbarui & QRIS diregenerasi");
                },
            },
        );
    };

    const handleGenerateQris = (id: number) => {
        router.post(
            route("tagihan.qris", id),
            {},
            {
                onSuccess: () => toast.success("QRIS berhasil diregenerasi"),
            },
        );
    };

    if (flash?.message) {
        toast[flash.type](flash.message);
    }

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Manajemen Tagihan
                        </h2>
                        <p className="text-muted-foreground">
                            Kelola tagihan siswa, nominal dinamis, dan QRIS.
                        </p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Buat Tagihan Baru</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Buat Tagihan Siswa</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Nama Siswa</Label>
                                        <Input
                                            value={data.siswa_nama}
                                            onChange={(e) =>
                                                setData(
                                                    "siswa_nama",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Ahmad Fauzi"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>NIS</Label>
                                        <Input
                                            value={data.siswa_nis}
                                            onChange={(e) =>
                                                setData(
                                                    "siswa_nis",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="202501001"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Kelas</Label>
                                    <Input
                                        value={data.siswa_kelas}
                                        onChange={(e) =>
                                            setData(
                                                "siswa_kelas",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="X IPA 1"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Jenis Tagihan</Label>
                                    <Select
                                        onValueChange={(v) =>
                                            setData("jenis_tagihan_id", v)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih jenis tagihan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {jenis_tagihan.map((j) => (
                                                <SelectItem
                                                    key={j.id}
                                                    value={String(j.id)}
                                                >
                                                    {j.nama} (
                                                    {formatRupiah(
                                                        j.nominal_default,
                                                    )}
                                                    )
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Periode</Label>
                                        <Input
                                            value={data.periode}
                                            onChange={(e) =>
                                                setData(
                                                    "periode",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Mei 2026"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>
                                            Nominal (bisa disesuaikan)
                                        </Label>
                                        <Input
                                            type="number"
                                            value={data.nominal}
                                            onChange={(e) =>
                                                setData(
                                                    "nominal",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="1500000"
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing}
                                >
                                    Simpan Tagihan
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card className="border-border">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">
                            Daftar Tagihan Aktif
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Siswa</TableHead>
                                    <TableHead>Jenis</TableHead>
                                    <TableHead>Periode</TableHead>
                                    <TableHead>Nominal Asli</TableHead>
                                    <TableHead>Nominal Aktif</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>QRIS</TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tagihan.map((t) => (
                                    <TableRow key={t.id}>
                                        <TableCell>
                                            <div className="font-medium">
                                                {t.siswa.nama}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {t.siswa.nis} • {t.siswa.kelas}
                                            </div>
                                        </TableCell>
                                        <TableCell>{t.jenis}</TableCell>
                                        <TableCell>{t.periode}</TableCell>
                                        <TableCell className="text-muted-foreground line-through text-xs">
                                            {formatRupiah(t.nominal_asli)}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {editingId === t.id ? (
                                                <div className="flex gap-2">
                                                    <Input
                                                        type="number"
                                                        className="w-32 h-8"
                                                        value={newNominal}
                                                        onChange={(e) =>
                                                            setNewNominal(
                                                                e.target.value,
                                                            )
                                                        }
                                                        autoFocus
                                                    />
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            handleUpdateNominal(
                                                                t.id,
                                                            )
                                                        }
                                                    >
                                                        Simpan
                                                    </Button>
                                                </div>
                                            ) : (
                                                formatRupiah(
                                                    t.nominal_disesuaikan,
                                                )
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    t.status === "lunas"
                                                        ? "default"
                                                        : "destructive"
                                                }
                                            >
                                                {t.status === "lunas"
                                                    ? "Lunas"
                                                    : "Menunggak"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {t.qris_string ? (
                                                <div className="space-y-1">
                                                    <p className="text-xs font-mono truncate max-w-[140px]">
                                                        {t.qris_string.substring(
                                                            0,
                                                            20,
                                                        )}
                                                        ...
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground">
                                                        Exp: {t.qris_expiry}
                                                    </p>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">
                                                    -
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {t.status !== "lunas" && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                setEditingId(
                                                                    t.id,
                                                                );
                                                                setNewNominal(
                                                                    String(
                                                                        t.nominal_disesuaikan,
                                                                    ),
                                                                );
                                                            }}
                                                        >
                                                            Ubah Nominal
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            onClick={() =>
                                                                handleGenerateQris(
                                                                    t.id,
                                                                )
                                                            }
                                                        >
                                                            Regenerate QRIS
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
